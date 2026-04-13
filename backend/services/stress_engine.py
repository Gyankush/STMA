"""
Stress Engine — computes composite stress scores, mismatch types,
and stress-lag carry-over for activities.

Scoring Weights:
  - Intensity (raw stress level):      40%
  - Time Pressure (rushed tasks):      25%
  - Duration Fatigue (long tasks):     20%
  - Context Switching Penalty:         15%
"""

from typing import Optional


def calculate_stress_score(
    stress_level: int,
    time_spent_min: int,
    expected_time_min: Optional[int] = None,
    previous_category: Optional[str] = None,
    current_category: Optional[str] = None,
) -> float:
    """
    Calculate a composite stress score (0–100) from raw inputs.

    Args:
        stress_level: User-reported stress (1–10).
        time_spent_min: Actual minutes spent on the task.
        expected_time_min: Expected/estimated minutes (optional).
        previous_category: Category of the immediately preceding activity.
        current_category: Category of the current activity.

    Returns:
        Composite stress score rounded to 1 decimal place.
    """
    # ── Component 1: Intensity (40%) ──────────────────────────
    intensity = (stress_level / 10) * 40

    # ── Component 2: Time Pressure (25%) ──────────────────────
    # High score when task finished much faster than expected (under pressure)
    time_pressure = 0.0
    if expected_time_min and expected_time_min > 0:
        ratio = (expected_time_min - time_spent_min) / expected_time_min
        time_pressure = max(0.0, min(ratio, 1.0)) * 25

    # ── Component 3: Duration Fatigue (20%) ───────────────────
    # Fatigue increases linearly, capping at 3 hours (180 min)
    duration_fatigue = min(time_spent_min / 180, 1.0) * 20

    # ── Component 4: Context Switching Penalty (15%) ──────────
    context_switch = 0.0
    if previous_category and current_category:
        if previous_category != current_category:
            context_switch = 15.0  # Full penalty for category switch
    # If no previous activity, no penalty (first activity of the day)

    score = intensity + time_pressure + duration_fatigue + context_switch
    return round(min(score, 100.0), 1)


def classify_mismatch(
    stress_level: int,
    time_spent_min: int,
    expected_time_min: Optional[int] = None,
) -> str:
    """
    Classify the time-stress relationship of an activity.

    Returns:
        'efficient' — High stress but completed faster than expected.
        'overinvested' — Low stress but took much longer than expected.
        'aligned' — Stress and time are proportional.
    """
    if expected_time_min is None or expected_time_min == 0:
        return "aligned"

    time_ratio = time_spent_min / expected_time_min
    stress_normalized = stress_level / 10  # 0.0–1.0

    # Efficient: high stress (≥0.6) + completed early (spent < 80% of expected)
    if stress_normalized >= 0.6 and time_ratio < 0.8:
        return "efficient"

    # Overinvested: low stress (<0.4) + took way longer (spent > 130% of expected)
    if stress_normalized < 0.4 and time_ratio > 1.3:
        return "overinvested"

    return "aligned"


def calculate_stress_lag(
    current_stress_score: float,
    previous_stress_score: Optional[float] = None,
    decay_factor: float = 0.35,
) -> float:
    """
    Calculate stress carry-over (lag) from the previous activity.

    The idea: residual stress from a demanding task bleeds into the next one.
    A decay factor controls how much of the previous stress carries over.

    Args:
        current_stress_score: The computed stress score of the current activity.
        previous_stress_score: The computed stress score of the previous activity.
        decay_factor: How much of the previous score carries over (0.0–1.0).

    Returns:
        The stress lag carry value (0–100 scale).
    """
    if previous_stress_score is None:
        return 0.0

    carry = previous_stress_score * decay_factor
    return round(carry, 1)
