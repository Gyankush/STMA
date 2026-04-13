import sqlite3
from datetime import datetime, timedelta

def calculate_stress_score(stress_level, time_spent_min, expected_time_min, previous_category, current_category):
    intensity = (stress_level / 10) * 40
    time_pressure = 0.0
    if expected_time_min and expected_time_min > 0:
        ratio = (expected_time_min - time_spent_min) / expected_time_min
        time_pressure = max(0.0, min(ratio, 1.0)) * 25
    duration_fatigue = min(time_spent_min / 180.0, 1.0) * 20
    context_switch = 15.0 if previous_category and current_category and previous_category != current_category else 0.0
    score = intensity + time_pressure + duration_fatigue + context_switch
    return round(min(score, 100.0), 1)

def classify_mismatch(stress_level, time_spent_min, expected_time_min):
    if expected_time_min is None or expected_time_min == 0: return "aligned"
    time_ratio = time_spent_min / expected_time_min
    stress_normalized = stress_level / 10.0
    if stress_normalized >= 0.6 and time_ratio < 0.8: return "efficient"
    if stress_normalized < 0.4 and time_ratio > 1.3: return "overinvested"
    return "aligned"

def calculate_stress_lag(current_score, previous_score):
    if previous_score is None: return 0.0
    return round(previous_score * 0.35, 1)

base_time = datetime.now() - timedelta(days=2)

data = [
    # task_name, category, time_spent, expected_time, stress_level, hours_from_base
    ("Initial Planning", "work", 120, 120, 5, 0),
    ("Deep Focus Coding", "work", 120, 150, 8, 3), # efficient (time ratio 0.8, stress 8)
    ("Team Standup", "social", 45, 30, 7, 5.5), # context switch
    ("Design Review", "creative", 90, 60, 9, 7), # context switch + fatiguing
    ("Doomscrolling", "personal", 120, 30, 2, 9), # overinvested
    ("Debugging session", "work", 180, 60, 9, 24), # new day, context switch, high stress
    ("Quick Bugfix", "work", 20, 60, 8, 28), # efficient 
    ("Strategy meeting", "work", 60, 60, 4, 30), # aligned
    ("Late night research", "learning", 150, 45, 3, 33), # overinvested
    ("Morning Exercise", "health", 45, 60, 2, 40), # next day
    ("Client Presentation", "work", 60, 30, 9, 43), # aligned? time_ratio 2, stress 9
    ("Lunch Break", "personal", 30, 60, 2, 45), # aligned
]

conn = sqlite3.connect('stma.db')
cursor = conn.cursor()

user_id = 4
prev_cat = None
prev_score = None

# Clear previous test data to make it clean
cursor.execute("DELETE FROM activities WHERE user_id = ?", (user_id,))

for task, category, time_spent, exp_time, stress, hours_offset in data:
    log_time = base_time + timedelta(hours=hours_offset)
    
    score = calculate_stress_score(stress, time_spent, exp_time, prev_cat, category)
    mismatch = classify_mismatch(stress, time_spent, exp_time)
    lag = calculate_stress_lag(score, prev_score)
    
    logged_at_str = log_time.strftime('%Y-%m-%d %H:%M:%S.%f')
    
    cursor.execute('''
        INSERT INTO activities (
            user_id, task_name, category, time_spent_min, expected_time_min,
            stress_level, computed_stress_score, mismatch_type, stress_lag_carry,
            notes, logged_at, created_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ''', (user_id, task, category, time_spent, exp_time, stress, score, mismatch, lag, "Sample data", logged_at_str, logged_at_str))
    
    prev_cat = category
    prev_score = score

conn.commit()
conn.close()
print("Data seeded successfully!")
