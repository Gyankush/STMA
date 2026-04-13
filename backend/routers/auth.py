"""
Auth Router — handles user registration, login, and profile retrieval.
"""

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from backend.core.database import get_db
from backend.core.security import hash_password, verify_password, create_access_token, get_current_user
from backend.core.config import settings
from backend.models.user import User
from backend.models.category import Category
from backend.schemas.user import UserCreate, UserLogin, UserResponse, AuthResponse

router = APIRouter(prefix="/api/auth", tags=["Authentication"])


@router.post("/register", response_model=AuthResponse, status_code=status.HTTP_201_CREATED)
async def register(payload: UserCreate, db: AsyncSession = Depends(get_db)):
    """
    Create a new user account.
    Seeds default categories for the user automatically.
    """
    # Check if username or email already exists
    existing = await db.execute(
        select(User).where((User.username == payload.username) | (User.email == payload.email))
    )
    if existing.scalar_one_or_none():
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Username or email already registered",
        )

    # Create user
    user = User(
        username=payload.username,
        email=payload.email,
        password_hash=hash_password(payload.password),
        display_name=payload.display_name,
    )
    db.add(user)
    await db.flush()  # Get user.id before creating categories

    # Seed default categories for this user
    default_colors = {
        "Deep Work": "#2563eb",
        "Meeting": "#f59e0b",
        "Admin": "#8b5cf6",
        "Creative": "#ec4899",
        "Exercise": "#22c55e",
        "Break": "#06b6d4",
    }
    for cat_name in settings.DEFAULT_CATEGORIES:
        category = Category(
            user_id=user.id,
            name=cat_name,
            color=default_colors.get(cat_name, "#60a5fa"),
            is_default=True,
        )
        db.add(category)

    await db.flush()

    # Generate JWT token
    token = create_access_token(data={"sub": str(user.id)})

    return AuthResponse(
        user=UserResponse.model_validate(user),
        access_token=token,
    )


@router.post("/login", response_model=AuthResponse)
async def login(payload: UserLogin, db: AsyncSession = Depends(get_db)):
    """Authenticate a user and return a JWT token."""
    result = await db.execute(select(User).where(User.email == payload.email))
    user = result.scalar_one_or_none()

    if not user or not verify_password(payload.password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password",
        )

    token = create_access_token(data={"sub": str(user.id)})

    return AuthResponse(
        user=UserResponse.model_validate(user),
        access_token=token,
    )


@router.get("/me", response_model=UserResponse)
async def get_me(current_user: User = Depends(get_current_user)):
    """Get the currently authenticated user's profile."""
    return UserResponse.model_validate(current_user)
