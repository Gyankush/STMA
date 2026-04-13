"""
STMA Backend — FastAPI Application Entry Point.

Stress-Time Misalignment Analyzer: A full-stack application for tracking
task-based stress, analyzing time-stress mismatches, and providing
AI-driven burnout prevention insights.
"""

from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from backend.core.config import settings
from backend.core.database import engine, Base

# Import all models so SQLAlchemy registers them before create_all
from backend.models import User, Activity, Category  # noqa: F401

from backend.routers import auth, activities, categories, analytics, chat


# ── Lifespan ──────────────────────────────────────────────────
@asynccontextmanager
async def lifespan(app: FastAPI):
    """Create database tables on startup, cleanup on shutdown."""
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    print("[OK] Database tables created successfully")
    yield
    await engine.dispose()
    print("[OK] Database connection closed")


# ── App ───────────────────────────────────────────────────────
app = FastAPI(
    title="STMA API",
    description="Stress-Time Misalignment Analyzer — Backend API",
    version="0.1.0",
    lifespan=lifespan,
)

# ── CORS Middleware ───────────────────────────────────────────
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ── Register Routers ─────────────────────────────────────────
app.include_router(auth.router)
app.include_router(activities.router)
app.include_router(categories.router)
app.include_router(analytics.router)
app.include_router(chat.router)


# ── Health Check ──────────────────────────────────────────────
@app.get("/api/health", tags=["System"])
async def health_check():
    """Simple health check endpoint."""
    return {"status": "healthy", "app": "STMA", "version": "0.1.0"}
