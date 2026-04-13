"""
Pydantic schemas for user-customizable categories.
"""

from datetime import datetime
from typing import Optional, List
from pydantic import BaseModel, Field


# ── Request Schemas ───────────────────────────────────────────

class CategoryCreate(BaseModel):
    """Schema for creating a new custom category."""
    name: str = Field(..., min_length=1, max_length=50)
    color: str = Field("#60a5fa", pattern=r"^#[0-9a-fA-F]{6}$")
    icon: Optional[str] = Field(None, max_length=30)


class CategoryUpdate(BaseModel):
    """Schema for updating an existing category."""
    name: Optional[str] = Field(None, min_length=1, max_length=50)
    color: Optional[str] = Field(None, pattern=r"^#[0-9a-fA-F]{6}$")
    icon: Optional[str] = Field(None, max_length=30)


# ── Response Schemas ──────────────────────────────────────────

class CategoryResponse(BaseModel):
    """Category data returned to the frontend."""
    id: int
    name: str
    color: str
    icon: Optional[str] = None
    is_default: bool = False
    created_at: datetime

    model_config = {"from_attributes": True}


class CategoryListResponse(BaseModel):
    """List of user categories."""
    categories: List[CategoryResponse]
