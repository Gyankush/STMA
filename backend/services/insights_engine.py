"""
Insights Engine — aggregates activities data for dashboard analytics,
mismatch reports, and stress-lag chain analysis.
"""

from datetime import datetime, timedelta, timezone
from typing import List, Dict, Any, Optional

from sqlalchemy import select, func, and_
from sqlalchemy.ext.asyncio import AsyncSession

from backend.models.activity import Activity


async def get_dashboard_summary(
    db: AsyncSession,
    user_id: int,
    days: int = 7,
) -> Dict[str, Any]:
    """
    Generate the main dashboard analytics for a user.

    Returns:
        - stress_trend: daily average stress scores
        - avg_score: overall average stress score
        - total_activities: count of activities in the period
        - top_category: most frequently logged category
        - energy_battery: estimated energy level (inverse of avg stress)
    """
    cutoff = datetime.now(timezone.utc) - timedelta(days=days)

    # Fetch activities in the date range
    result = await db.execute(
        select(Activity)
        .where(and_(Activity.user_id == user_id, Activity.logged_at >= cutoff))
        .order_by(Activity.logged_at.asc())
    )
    activities = result.scalars().all()

    if not activities:
        return {
            "stress_trend": [],
            "avg_score": 0.0,
            "total_activities": 0,
            "top_category": None,
            "energy_battery": 100.0,
            "total_time_min": 0,
            "period_days": days,
        }

    daily_scores: Dict[str, List[float]] = {}
    daily_time: Dict[str, int] = {}
    category_counts: Dict[str, int] = {}
    total_time = 0

    for act in activities:
        day_key = act.logged_at.strftime("%Y-%m-%d")
        score = act.computed_stress_score or 0.0
        daily_scores.setdefault(day_key, []).append(score)
        daily_time[day_key] = daily_time.get(day_key, 0) + act.time_spent_min

        if act.category:
            category_counts[act.category] = category_counts.get(act.category, 0) + 1

        total_time += act.time_spent_min

    stress_trend = [
        {
            "date": day, 
            "avg_stress": round(sum(scores) / len(scores), 1),
            "total_time": daily_time[day]
        }
        for day, scores in sorted(daily_scores.items())
    ]

    # ── Aggregates ────────────────────────────────────────────
    all_scores = [a.computed_stress_score or 0.0 for a in activities]
    avg_score = round(sum(all_scores) / len(all_scores), 1) if all_scores else 0.0
    top_category = max(category_counts, key=category_counts.get) if category_counts else None
    energy_battery = round(max(0, 100 - avg_score), 1)

    return {
        "stress_trend": stress_trend,
        "avg_score": avg_score,
        "total_activities": len(activities),
        "top_category": top_category,
        "energy_battery": energy_battery,
        "total_time_min": total_time,
        "period_days": days,
    }


async def get_mismatch_analysis(
    db: AsyncSession,
    user_id: int,
    days: int = 30,
) -> Dict[str, Any]:
    """
    Analyze time-stress mismatch patterns.

    Returns activities with their mismatch classifications and summary counts.
    """
    cutoff = datetime.now(timezone.utc) - timedelta(days=days)

    result = await db.execute(
        select(Activity)
        .where(and_(Activity.user_id == user_id, Activity.logged_at >= cutoff))
        .order_by(Activity.logged_at.desc())
    )
    activities = result.scalars().all()

    summary = {"efficient": 0, "overinvested": 0, "aligned": 0}
    mismatch_activities = []

    for act in activities:
        mtype = act.mismatch_type or "aligned"
        summary[mtype] = summary.get(mtype, 0) + 1
        mismatch_activities.append({
            "id": act.id,
            "task_name": act.task_name,
            "category": act.category,
            "time_spent_min": act.time_spent_min,
            "expected_time_min": act.expected_time_min,
            "stress_level": act.stress_level,
            "computed_stress_score": act.computed_stress_score,
            "mismatch_type": mtype,
            "logged_at": act.logged_at.isoformat(),
        })

    return {
        "activities": mismatch_activities,
        "summary": summary,
        "total": len(activities),
        "period_days": days,
    }


async def get_stress_lag_analysis(
    db: AsyncSession,
    user_id: int,
    days: int = 7,
) -> Dict[str, Any]:
    """
    Analyze stress carry-over chains — how stress from one task
    bleeds into subsequent tasks.

    Returns the chronological chain of activities with their lag values,
    and identifies the peak lag activity.
    """
    cutoff = datetime.now(timezone.utc) - timedelta(days=days)

    result = await db.execute(
        select(Activity)
        .where(and_(Activity.user_id == user_id, Activity.logged_at >= cutoff))
        .order_by(Activity.logged_at.asc())
    )
    activities = result.scalars().all()

    lag_chains = []
    current_chain = []
    peak_lag_activity = None
    peak_lag_value = 0.0

    for act in activities:
        entry = {
            "id": act.id,
            "task_name": act.task_name,
            "category": act.category,
            "time_spent_min": act.time_spent_min,
            "stress_level": act.stress_level,
            "computed_stress_score": act.computed_stress_score,
            "stress_lag_carry": act.stress_lag_carry or 0.0,
            "effective_stress": round(
                (act.computed_stress_score or 0) + (act.stress_lag_carry or 0.0), 1
            ),
            "logged_at": act.logged_at.isoformat(),
        }

        if (act.stress_lag_carry or 0.0) > peak_lag_value:
            peak_lag_value = act.stress_lag_carry
            peak_lag_activity = entry

        # Chain building logic
        if not current_chain:
            current_chain.append((act, entry))
        else:
            prev_act, _ = current_chain[-1]
            act_dt = act.logged_at.replace(tzinfo=None) if act.logged_at.tzinfo else act.logged_at
            prev_dt = prev_act.logged_at.replace(tzinfo=None) if prev_act.logged_at.tzinfo else prev_act.logged_at
            
            time_diff_hours = (act_dt - prev_dt).total_seconds() / 3600.0
            
            # Continue chain if within 8 hours and there's meaningful lag carry
            if time_diff_hours < 8.0 and (act.stress_lag_carry or 0.0) >= 5.0:
                current_chain.append((act, entry))
            else:
                # Save chain if it has at least 2 items and the first one was somewhat stressful
                if len(current_chain) > 1 and current_chain[0][0].stress_level >= 6:
                    lag_chains.append([e for _, e in current_chain])
                current_chain = [(act, entry)]

    if len(current_chain) > 1 and current_chain[0][0].stress_level >= 6:
        lag_chains.append([e for _, e in current_chain])

    return {
        "lag_chains": lag_chains,
        "peak_lag_activity": peak_lag_activity,
        "total_activities": len(activities),
        "period_days": days,
    }
