"""
Activity ORM model — stores individual task/activity logs.
"""

from datetime import datetime, timezone
from sqlalchemy import Integer, String, Float, DateTime, Text, ForeignKey, Index
from sqlalchemy.orm import Mapped, mapped_column, relationship

from backend.core.database import Base


class Activity(Base):
    __tablename__ = "activities"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    user_id: Mapped[int] = mapped_column(Integer, ForeignKey("users.id"), nullable=False)

    # ── Task Info ─────────────────────────────────────────────
    task_name: Mapped[str] = mapped_column(String(200), nullable=False)
    category: Mapped[str | None] = mapped_column(String(50), nullable=True)
    time_spent_min: Mapped[int] = mapped_column(Integer, nullable=False)
    expected_time_min: Mapped[int | None] = mapped_column(Integer, nullable=True)
    stress_level: Mapped[int] = mapped_column(Integer, nullable=False)  # 1-10 slider

    # ── Computed Fields (populated by stress engine) ──────────
    computed_stress_score: Mapped[float | None] = mapped_column(Float, nullable=True)  # 0-100
    mismatch_type: Mapped[str | None] = mapped_column(
        String(20), nullable=True
    )  # efficient | overinvested | aligned
    stress_lag_carry: Mapped[float] = mapped_column(Float, default=0.0)

    # ── Metadata ──────────────────────────────────────────────
    notes: Mapped[str | None] = mapped_column(Text, nullable=True)
    logged_at: Mapped[datetime] = mapped_column(DateTime, nullable=False)
    created_at: Mapped[datetime] = mapped_column(
        DateTime, default=lambda: datetime.now(timezone.utc)
    )

    # ── Relationships ─────────────────────────────────────────
    user = relationship("User", back_populates="activities")

    # ── Indexes for fast queries ──────────────────────────────
    __table_args__ = (
        Index("idx_activities_user_id", "user_id"),
        Index("idx_activities_logged_at", "logged_at"),
        Index("idx_activities_user_logged", "user_id", "logged_at"),
    )

    def __repr__(self) -> str:
        return f"<Activity(id={self.id}, task='{self.task_name}', stress={self.stress_level})>"
