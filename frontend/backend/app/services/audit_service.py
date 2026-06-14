from app.models.audit_log import AuditLog
from datetime import datetime
import hashlib
import json

def generate_hash(data: dict):
    encoded = json.dumps(data, sort_keys=True).encode()
    return hashlib.sha256(encoded).hexdigest()


def create_audit_log(db, user_id, action, details=""):

    
    last_log = db.query(AuditLog).order_by(
        AuditLog.id.desc()
    ).first()

    previous_hash = None

    if last_log:
        previous_hash = last_log.hash

    payload = {
        "user_id": user_id,
        "action": action,
        "details": details,
        "previous_hash": previous_hash,
        "timestamp": str(datetime.utcnow())
    }

    hash_value = generate_hash(payload)

    log = AuditLog(
        user_id=user_id,
        action=action,
        details=details,
        hash=hash_value,
        previous_hash=previous_hash
    )

    db.add(log)

    db.commit()

    db.refresh(log)

    return log