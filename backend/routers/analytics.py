"""
Analytics Router — dashboard summary, mismatch analysis, stress-lag chain,
and AI-driven stress insights.
"""

from fastapi import APIRouter, Depends, Query
from sqlalchemy import select, desc
from sqlalchemy.ext.asyncio import AsyncSession

from backend.core.database import get_db
from backend.core.security import get_current_user
from backend.models.user import User
from backend.models.activity import Activity
from backend.services.insights_engine import (
    get_dashboard_summary,
    get_mismatch_analysis,
    get_stress_lag_analysis,
)
from backend.services.ai_service import generate_stress_insights

router = APIRouter(prefix="/api/analytics", tags=["Analytics"])


@router.get("/dashboard")
async def dashboard(
    days: int = Query(7, ge=1, le=365),
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """
    Get the main dashboard analytics summary.

    Returns stress trend, average score, energy battery level,
    top category, and total activity count for the given period.
    """
    return await get_dashboard_summary(db, current_user.id, days)


@router.get("/mismatch")
async def mismatch(
    days: int = Query(30, ge=1, le=365),
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """
    Get the time-stress mismatch analysis.

    Returns activities classified as efficient, overinvested, or aligned,
    along with summary counts.
    """
    return await get_mismatch_analysis(db, current_user.id, days)


@router.get("/stress-lag")
async def stress_lag(
    days: int = Query(7, ge=1, le=365),
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """
    Get the stress-lag carry-over chain analysis.

    Returns the chronological chain of activities with their stress lag values,
    and identifies the activity with the highest carry-over impact.
    """
    return await get_stress_lag_analysis(db, current_user.id, days)


@router.get("/ai-insights")
async def ai_insights(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """
    Generate AI-powered stress insights using Google Gemini.

    Fetches the user's most recent 20 activities, sends a compact
    representation to the LLM, and returns structured insights about
    stress triggers, reduction strategies, and optimal flow states.
    """
    # Fetch the user's most recent 20 activities
    stmt = (
        select(Activity)
        .where(Activity.user_id == current_user.id)
        .order_by(desc(Activity.logged_at))
        .limit(20)
    )
    result = await db.execute(stmt)
    activities = result.scalars().all()

    # Serialize ORM objects to plain dicts for the AI service
    activities_data = [
        {
            "task_name": a.task_name,
            "category": a.category or "Uncategorized",
            "stress_level": a.stress_level,
            "time_spent_min": a.time_spent_min,
        }
        for a in activities
    ]

    insights = await generate_stress_insights(activities_data)
    return insights
