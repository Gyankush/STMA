"""
Pydantic schemas for User-related request/response payloads.
"""

from datetime import datetime
from typing import Optional
from pydantic import BaseModel, EmailStr, Field


# ── Request Schemas ───────────────────────────────────────────

class UserCreate(BaseModel):
    """Schema for POST /auth/register."""
    username: str = Field(..., min_length=3, max_length=50, pattern=r"^[a-zA-Z0-9_]+$")
    email: EmailStr
    password: str = Field(..., min_length=6, max_length=128)
    display_name: Optional[str] = Field(None, max_length=100)


class UserLogin(BaseModel):
    """Schema for POST /auth/login."""
    email: EmailStr
    password: str


# ── Response Schemas ──────────────────────────────────────────

class UserResponse(BaseModel):
    """Public-facing user data (never exposes password_hash)."""
    id: int
    username: str
    email: str
    display_name: Optional[str] = None
    default_work_hours: float = 8.0
    created_at: datetime

    model_config = {"from_attributes": True}


class AuthResponse(BaseModel):
    """Response for register and login — includes token + user data."""
    user: UserResponse
    access_token: str
    token_type: str = "bearer"
