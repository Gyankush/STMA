import json
import google.generativeai as genai
from typing import Dict, Any, List
from backend.core.config import settings

# Initialize Gemini if key is available
if settings.GEMINI_API_KEY:
    genai.configure(api_key=settings.GEMINI_API_KEY)

async def generate_stress_insights(activities: List[Dict[str, Any]]) -> Dict[str, Any]:
    """
    Analyzes the user's recent activities and provides actionable stress insights.
    Returns a dictionary with three main keys:
    - stress_triggers
    - reduction_strategies
    - optimal_flow
    """
    if not settings.GEMINI_API_KEY:
        return {
            "stress_triggers": "Gemini API key is missing. Please configure it in .env.",
            "reduction_strategies": "Cannot generate insights without an API connection.",
            "optimal_flow": "Configure the API key to activate AI insights."
        }

    # Prepare data for the prompt
    if not activities:
        return {
            "stress_triggers": "You haven't logged any activities yet.",
            "reduction_strategies": "Start logging your daily focus and admin tasks.",
            "optimal_flow": "Once you have data, check back here!"
        }

    # Filter down to the most relevant fields for the AI
    compact_activities = [
        {
            "task": a["task_name"],
            "category": a["category"],
            "stress": a["stress_level"], # 1-10
            "duration": a["time_spent_min"]
        }
        for a in activities
    ]
    
    data_str = json.dumps(compact_activities, indent=2)

    prompt = f"""
You are an expert performance psychologist and stress management coach analyzing a user's recent activity logs. The user categorizes their tasks and rates stress from 1 (lowest) to 10 (highest).

Here is their recent log data:
{data_str}

Analyze this data and provide 3 distinct, concise, action-oriented insights formatted as a raw JSON object (do not use markdown blocks like ```json).
The JSON object MUST match this exact schema:
{{
  "stress_triggers": "2-3 short sentences identifying the specific tasks or categories causing the most stress and why.",
  "reduction_strategies": "2-3 short, actionable tips on how to mitigate or approach these specific high-stress tasks differently to lower stress.",
  "optimal_flow": "2-3 short sentences identifying what tasks give them low stress but high focus, and what they should do more often to maintain energy."
}}
"""

    try:
        model = genai.GenerativeModel('gemini-2.5-flash')
        response = model.generate_content(prompt)
        text = response.text.strip()
        
        # Strip markdown if the AI includes it despite instructions
        if text.startswith('```json'):
            text = text[7:]
        if text.startswith('```'):
            text = text[3:]
        if text.endswith('```'):
            text = text[:-3]
            
        result = json.loads(text.strip())
        return result
    except Exception as e:
        print(f"Error generating AI insights: {e}")
        return {
            "stress_triggers": "We ran into an error connecting to the AI model.",
            "reduction_strategies": "Please try again later.",
            "optimal_flow": str(e)
        }
