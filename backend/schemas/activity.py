"""
Pydantic schemas for Activity-related request/response payloads.
"""

from datetime import datetime
from typing import Optional, List
from pydantic import BaseModel, Field


# ── Request Schemas ───────────────────────────────────────────

class ActivityCreate(BaseModel):
    """Schema for POST /activities — log a new activity."""
    task_name: str = Field(..., min_length=1, max_length=200)
    category: Optional[str] = Field(None, max_length=50)
    time_spent_min: int = Field(..., ge=1, le=1440)  # 1 min to 24 hrs
    expected_time_min: Optional[int] = Field(None, ge=1, le=1440)
    stress_level: int = Field(..., ge=1, le=10)
    notes: Optional[str] = Field(None, max_length=1000)
    logged_at: Optional[datetime] = None  # Defaults to now if not provided


# ── Response Schemas ──────────────────────────────────────────

class ActivityResponse(BaseModel):
    """Full activity record returned to the frontend."""
    id: int
    user_id: int
    task_name: str
    category: Optional[str] = None
    time_spent_min: int
    expected_time_min: Optional[int] = None
    stress_level: int
    computed_stress_score: Optional[float] = None
    mismatch_type: Optional[str] = None
    stress_lag_carry: float = 0.0
    notes: Optional[str] = None
    logged_at: datetime
    created_at: datetime

    model_config = {"from_attributes": True}


class PaginatedActivities(BaseModel):
    """Paginated list of activities."""
    activities: List[ActivityResponse]
    total: int
    page: int
    limit: int
    total_pages: int
