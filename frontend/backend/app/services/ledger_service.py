from app.models.ledger_entry import LedgerEntry


def create_ledger_entry(
    db,
    document_id,
    actor_id,
    action,
    event_details
):
    entry = LedgerEntry(
        document_id=document_id,
        actor_id=actor_id,
        action=action,
        event_details=event_details
    )

    db.add(entry)
    db.commit()

    return entry