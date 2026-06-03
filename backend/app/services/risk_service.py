def calculate_risk(amount, status):
    risk = 0

    if amount > 10000:
        risk += 40
    elif amount > 5000:
        risk += 25
    else:
        risk += 10

    if status == "pending":
        risk += 30
    elif status == "failed":
        risk += 50
    elif status == "completed":
        risk += 5

    return min(risk, 100)