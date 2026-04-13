"""
Categories Router — CRUD for user-customizable activity categories.
"""

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select, and_
from sqlalchemy.ext.asyncio import AsyncSession

from backend.core.database import get_db
from backend.core.security import get_current_user
from backend.models.user import User
from backend.models.category import Category
from backend.schemas.category import (
    CategoryCreate,
    CategoryUpdate,
    CategoryResponse,
    CategoryListResponse,
)

router = APIRouter(prefix="/api/categories", tags=["Categories"])


@router.get("", response_model=CategoryListResponse)
async def list_categories(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """List all categories for the current user."""
    result = await db.execute(
        select(Category)
        .where(Category.user_id == current_user.id)
        .order_by(Category.is_default.desc(), Category.name.asc())
    )
    categories = result.scalars().all()
    return CategoryListResponse(
        categories=[CategoryResponse.model_validate(c) for c in categories]
    )


@router.post("", response_model=CategoryResponse, status_code=status.HTTP_201_CREATED)
async def create_category(
    payload: CategoryCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Create a new custom category."""
    # Check for duplicate name
    existing = await db.execute(
        select(Category).where(
            and_(Category.user_id == current_user.id, Category.name == payload.name)
        )
    )
    if existing.scalar_one_or_none():
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=f"Category '{payload.name}' already exists",
        )

    category = Category(
        user_id=current_user.id,
        name=payload.name,
        color=payload.color,
        icon=payload.icon,
        is_default=False,
    )
    db.add(category)
    await db.flush()

    return CategoryResponse.model_validate(category)


@router.put("/{category_id}", response_model=CategoryResponse)
async def update_category(
    category_id: int,
    payload: CategoryUpdate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Update an existing category (name, color, icon)."""
    result = await db.execute(
        select(Category).where(
            and_(Category.id == category_id, Category.user_id == current_user.id)
        )
    )
    category = result.scalar_one_or_none()

    if not category:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Category not found")

    if payload.name is not None:
        category.name = payload.name
    if payload.color is not None:
        category.color = payload.color
    if payload.icon is not None:
        category.icon = payload.icon

    await db.flush()
    return CategoryResponse.model_validate(category)


@router.delete("/{category_id}", status_code=status.HTTP_200_OK)
async def delete_category(
    category_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Delete a custom category (prevents deleting default categories)."""
    result = await db.execute(
        select(Category).where(
            and_(Category.id == category_id, Category.user_id == current_user.id)
        )
    )
    category = result.scalar_one_or_none()

    if not category:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Category not found")

    if category.is_default:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Cannot delete default categories. You can rename or hide them instead.",
        )

    await db.delete(category)
    return {"success": True, "message": f"Category '{category.name}' deleted"}
