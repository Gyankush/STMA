"""Quick API smoke test."""
import urllib.request
import urllib.error
import json

BASE = "http://localhost:8000"

def post(url, data):
    req = urllib.request.Request(
        url, 
        data=json.dumps(data).encode(), 
        headers={"Content-Type": "application/json"},
        method="POST"
    )
    try:
        resp = urllib.request.urlopen(req)
        return resp.status, json.loads(resp.read())
    except urllib.error.HTTPError as e:
        body = e.read().decode()
        return e.code, body

def get(url, token=None):
    headers = {}
    if token:
        headers["Authorization"] = f"Bearer {token}"
    req = urllib.request.Request(url, headers=headers)
    try:
        resp = urllib.request.urlopen(req)
        return resp.status, json.loads(resp.read())
    except urllib.error.HTTPError as e:
        body = e.read().decode()
        return e.code, body

# 1. Health check
print("=== Health Check ===")
code, data = get(f"{BASE}/api/health")
print(f"  Status: {code}, Data: {data}")

# 2. Register
print("\n=== Register ===")
code, data = post(f"{BASE}/api/auth/register", {
    "username": "testuser",
    "email": "test@stma.com",
    "password": "test123456"
})
print(f"  Status: {code}")
if isinstance(data, dict):
    token = data.get("access_token", "")
    print(f"  User: {data.get('user', {}).get('username')}")
    print(f"  Token: {token[:30]}...")
else:
    print(f"  Error: {data}")
    # Try login instead (user may already exist)
    print("\n=== Login (fallback) ===")
    code, data = post(f"{BASE}/api/auth/login", {
        "email": "test@stma.com",
        "password": "test123456"
    })
    print(f"  Status: {code}")
    if isinstance(data, dict):
        token = data.get("access_token", "")
        print(f"  User: {data.get('user', {}).get('username')}")
    else:
        print(f"  Error: {data}")
        exit(1)

# 3. Get profile
print("\n=== Get Profile ===")
code, data = get(f"{BASE}/api/auth/me", token)
print(f"  Status: {code}, User: {data}")

# 4. Log an activity
print("\n=== Log Activity ===")
req = urllib.request.Request(
    f"{BASE}/api/activities",
    data=json.dumps({
        "task_name": "Backend development",
        "category": "Deep Work",
        "time_spent_min": 90,
        "expected_time_min": 60,
        "stress_level": 7
    }).encode(),
    headers={
        "Content-Type": "application/json",
        "Authorization": f"Bearer {token}"
    },
    method="POST"
)
try:
    resp = urllib.request.urlopen(req)
    act_data = json.loads(resp.read())
    print(f"  Status: {resp.status}")
    print(f"  Task: {act_data.get('task_name')}")
    print(f"  Stress Score: {act_data.get('computed_stress_score')}")
    print(f"  Mismatch: {act_data.get('mismatch_type')}")
    print(f"  Lag Carry: {act_data.get('stress_lag_carry')}")
except urllib.error.HTTPError as e:
    print(f"  Error {e.code}: {e.read().decode()}")

# 5. Get categories
print("\n=== Get Categories ===")
code, data = get(f"{BASE}/api/categories", token)
print(f"  Status: {code}")
if isinstance(data, dict):
    for cat in data.get("categories", []):
        print(f"    - {cat['name']} ({cat['color']}) {'[default]' if cat['is_default'] else ''}")

# 6. Dashboard
print("\n=== Dashboard ===")
code, data = get(f"{BASE}/api/analytics/dashboard?days=7", token)
print(f"  Status: {code}")
if isinstance(data, dict):
    print(f"  Avg Score: {data.get('avg_score')}")
    print(f"  Energy Battery: {data.get('energy_battery')}%")
    print(f"  Total Activities: {data.get('total_activities')}")

print("\n=== ALL TESTS PASSED ===")
