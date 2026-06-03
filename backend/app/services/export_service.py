import csv
from io import StringIO
from app.models.trade_transaction import TradeTransaction


def export_transactions_csv(db):

    output = StringIO()
    writer = csv.writer(output)

    # header
    writer.writerow([
        "ID",
        "Buyer ID",
        "Seller ID",
        "Amount",
        "Currency",
        "Status",
        "Risk Score"
    ])

    transactions = db.query(TradeTransaction).all()

    for t in transactions:
        writer.writerow([
            t.id,
            t.buyer_id,
            t.seller_id,
            float(t.amount),
            t.currency,
            t.status,
            float(t.risk_score or 0)
        ])

    output.seek(0)
    return output