"""
Category ORM model — user-customizable activity categories.
"""

from datetime import datetime, timezone
from sqlalchemy import Integer, String, DateTime, ForeignKey, Boolean
from sqlalchemy.orm import Mapped, mapped_column, relationship

from backend.core.database import Base


class Category(Base):
    __tablename__ = "categories"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    user_id: Mapped[int] = mapped_column(Integer, ForeignKey("users.id"), nullable=False)

    name: Mapped[str] = mapped_column(String(50), nullable=False)
    color: Mapped[str] = mapped_column(String(7), default="#60a5fa")  # Hex color
    icon: Mapped[str | None] = mapped_column(String(30), nullable=True)  # Lucide icon name
    is_default: Mapped[bool] = mapped_column(Boolean, default=False)  # Seeded from defaults

    created_at: Mapped[datetime] = mapped_column(
        DateTime, default=lambda: datetime.now(timezone.utc)
    )

    # ── Relationships ─────────────────────────────────────────
    user = relationship("User", back_populates="categories")

    def __repr__(self) -> str:
        return f"<Category(id={self.id}, name='{self.name}', user_id={self.user_id})>"
