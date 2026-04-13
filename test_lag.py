import asyncio, json
from backend.core.database import AsyncSessionLocal
from backend.services.insights_engine import get_stress_lag_analysis

async def test():
    async with AsyncSessionLocal() as session:
        res = await get_stress_lag_analysis(session, 4)
        print(json.dumps(res["lag_chains"][0][0], indent=2))

if __name__ == "__main__":
    asyncio.run(test())
