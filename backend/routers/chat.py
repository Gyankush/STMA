"""
Chat Router — AI assistant endpoint (stub v1).
"""

from pydantic import BaseModel, Field
from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from backend.core.database import get_db
from backend.core.security import get_current_user
from backend.models.user import User
from backend.services.insights_engine import get_dashboard_summary
from backend.services.chat_service import generate_chat_response

router = APIRouter(prefix="/api/chat", tags=["Chat"])


class ChatRequest(BaseModel):
    message: str = Field(..., min_length=1, max_length=1000)


class ChatResponse(BaseModel):
    reply: str


@router.post("", response_model=ChatResponse)
async def chat(
    payload: ChatRequest,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """
    Send a message to the AI assistant.
    
    The assistant uses the user's recent activity stats to provide
    context-aware advice about stress management and burnout prevention.
    """
    # Fetch user stats for context
    stats = await get_dashboard_summary(db, current_user.id, days=7)

    reply = generate_chat_response(
        message=payload.message,
        user_stats=stats,
    )

    return ChatResponse(reply=reply)
