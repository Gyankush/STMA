"""
AI Chat Service — stub for the context-aware assistant.

This will be connected to an LLM API (OpenAI/Gemini) in a future phase.
For now, it provides rule-based responses based on the user's activity data.
"""

from typing import Dict, Any, List, Optional


def generate_chat_response(
    message: str,
    user_stats: Optional[Dict[str, Any]] = None,
) -> str:
    """
    Generate a response to the user's chat message.

    In v1, this uses simple keyword matching and the user's latest stats.
    In v2, this will call an LLM API with activity context.

    Args:
        message: The user's chat message.
        user_stats: Summary stats (avg_score, energy_battery, top_category, etc.)

    Returns:
        A helpful response string.
    """
    msg_lower = message.lower()
    stats = user_stats or {}

    energy = stats.get("energy_battery", 100.0)
    avg_stress = stats.get("avg_score", 0.0)
    total = stats.get("total_activities", 0)

    # ── Burnout / stress keywords ─────────────────────────────
    if any(word in msg_lower for word in ["burnout", "burned out", "exhausted", "overwhelmed"]):
        if avg_stress > 60:
            return (
                f"🔴 Your average stress score is {avg_stress}/100 — that's in the danger zone. "
                f"Your energy battery is at {energy}%. I recommend: "
                f"(1) Take a 20-minute break right now, (2) Avoid context-switching for the next hour, "
                f"(3) Consider ending your work day early if possible."
            )
        return (
            "Your stress levels look manageable right now. If you're feeling burned out, "
            "it might be emotional exhaustion rather than workload. Try a short walk or some deep breathing."
        )

    # ── Energy / battery keywords ─────────────────────────────
    if any(word in msg_lower for word in ["energy", "battery", "tired", "fatigue"]):
        return (
            f"⚡ Your energy battery is currently at {energy}%. "
            + (
                "That's healthy! Keep balancing your tasks well."
                if energy >= 70
                else "Consider taking a break or switching to a low-stress activity like admin tasks."
            )
        )

    # ── Stress keywords ──────────────────────────────────────
    if any(word in msg_lower for word in ["stress", "anxious", "pressure"]):
        return (
            f"📊 Based on your recent {total} activities, your average stress score is "
            f"{avg_stress}/100. "
            + (
                "Your stress is well-controlled. Keep it up!"
                if avg_stress < 40
                else "Your stress is elevated. Try to schedule some recovery breaks between intense tasks."
            )
        )

    # ── Advice / help keywords ───────────────────────────────
    if any(word in msg_lower for word in ["advice", "help", "suggest", "tip", "recommend"]):
        tips = [
            "🧘 Try the Pomodoro technique: 25 min work, 5 min rest.",
            "📋 Log your expected time before starting a task — it improves self-awareness.",
            "🔄 Avoid category-switching too often — it adds a 15% stress penalty.",
            "🌿 Schedule a 'Break' category activity after every 3 high-stress tasks.",
        ]
        return " | ".join(tips)

    # ── Default response ─────────────────────────────────────
    return (
        f"👋 I'm your STMA assistant! I can help with stress analysis, energy tracking, "
        f"and burnout prevention. Try asking me about your stress levels, energy battery, "
        f"or tips for better time management. You've logged {total} activities so far."
    )
