"""
Activities Router — CRUD operations for activity/task logs.
Automatically computes stress scores, mismatch types, and stress lag.
"""

from datetime import datetime, timezone
from typing import Optional

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy import select, func, and_
from sqlalchemy.ext.asyncio import AsyncSession

from backend.core.database import get_db
from backend.core.security import get_current_user
from backend.models.user import User
from backend.models.activity import Activity
from backend.schemas.activity import ActivityCreate, ActivityResponse, PaginatedActivities
from backend.services.stress_engine import calculate_stress_score, classify_mismatch, calculate_stress_lag

router = APIRouter(prefix="/api/activities", tags=["Activities"])


@router.post("", response_model=ActivityResponse, status_code=status.HTTP_201_CREATED)
async def create_activity(
    payload: ActivityCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """
    Log a new activity. The stress engine automatically computes:
    - computed_stress_score (0-100)
    - mismatch_type (efficient/overinvested/aligned)
    - stress_lag_carry (carry-over from previous activity)
    """
    logged_at = payload.logged_at or datetime.now(timezone.utc)

    # Fetch the most recent previous activity for context switching + stress lag
    prev_result = await db.execute(
        select(Activity)
        .where(and_(Activity.user_id == current_user.id, Activity.logged_at < logged_at))
        .order_by(Activity.logged_at.desc())
        .limit(1)
    )
    prev_activity = prev_result.scalar_one_or_none()

    # Compute stress score
    stress_score = calculate_stress_score(
        stress_level=payload.stress_level,
        time_spent_min=payload.time_spent_min,
        expected_time_min=payload.expected_time_min,
        previous_category=prev_activity.category if prev_activity else None,
        current_category=payload.category,
    )

    # Classify mismatch
    mismatch = classify_mismatch(
        stress_level=payload.stress_level,
        time_spent_min=payload.time_spent_min,
        expected_time_min=payload.expected_time_min,
    )

    # Calculate stress lag
    lag = calculate_stress_lag(
        current_stress_score=stress_score,
        previous_stress_score=prev_activity.computed_stress_score if prev_activity else None,
    )

    # Create activity record
    activity = Activity(
        user_id=current_user.id,
        task_name=payload.task_name,
        category=payload.category,
        time_spent_min=payload.time_spent_min,
        expected_time_min=payload.expected_time_min,
        stress_level=payload.stress_level,
        computed_stress_score=stress_score,
        mismatch_type=mismatch,
        stress_lag_carry=lag,
        notes=payload.notes,
        logged_at=logged_at,
    )
    db.add(activity)
    await db.flush()

    return ActivityResponse.model_validate(activity)


@router.get("", response_model=PaginatedActivities)
async def list_activities(
    page: int = Query(1, ge=1),
    limit: int = Query(20, ge=1, le=100),
    from_date: Optional[str] = Query(None, alias="from"),
    to_date: Optional[str] = Query(None, alias="to"),
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """List the user's activities with pagination and optional date filtering."""
    query = select(Activity).where(Activity.user_id == current_user.id)
    count_query = select(func.count(Activity.id)).where(Activity.user_id == current_user.id)

    # Date filters
    if from_date:
        from_dt = datetime.fromisoformat(from_date)
        query = query.where(Activity.logged_at >= from_dt)
        count_query = count_query.where(Activity.logged_at >= from_dt)
    if to_date:
        to_dt = datetime.fromisoformat(to_date)
        query = query.where(Activity.logged_at <= to_dt)
        count_query = count_query.where(Activity.logged_at <= to_dt)

    # Total count
    total_result = await db.execute(count_query)
    total = total_result.scalar() or 0

    # Paginated results
    offset = (page - 1) * limit
    query = query.order_by(Activity.logged_at.desc()).offset(offset).limit(limit)
    result = await db.execute(query)
    activities = result.scalars().all()

    total_pages = max(1, (total + limit - 1) // limit)

    return PaginatedActivities(
        activities=[ActivityResponse.model_validate(a) for a in activities],
        total=total,
        page=page,
        limit=limit,
        total_pages=total_pages,
    )


@router.get("/{activity_id}", response_model=ActivityResponse)
async def get_activity(
    activity_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Get a single activity by ID (must belong to the current user)."""
    result = await db.execute(
        select(Activity).where(
            and_(Activity.id == activity_id, Activity.user_id == current_user.id)
        )
    )
    activity = result.scalar_one_or_none()

    if not activity:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Activity not found")

    return ActivityResponse.model_validate(activity)


@router.delete("/{activity_id}", status_code=status.HTTP_200_OK)
async def delete_activity(
    activity_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Delete an activity by ID (must belong to the current user)."""
    result = await db.execute(
        select(Activity).where(
            and_(Activity.id == activity_id, Activity.user_id == current_user.id)
        )
    )
    activity = result.scalar_one_or_none()

    if not activity:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Activity not found")

    await db.delete(activity)
    return {"success": True, "message": f"Activity {activity_id} deleted"}
