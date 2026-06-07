from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routes.auth import router as auth_router
from app.routes.document import router as document_router
from app.routes.dashboard import router as dashboard_router
from app.routes.audit import router as audit_router

from app.database import Base, engine
from app.models.audit_log import AuditLog

from app.models.document import Document

from app.models.trade_transaction import TradeTransaction
from app.routes.trade_transaction import router as transaction_router
from app.routes.dashboard import router as dashboard_router

from app.routes.ledger import router as ledger_router
from app.routes.risk import router as risk_router
from app.routes.analytics import router as analytics_router
from app.routes.export import router as export_router
from fastapi import WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from app.routes.user import router as user
import asyncio

app = FastAPI(
    title="Trade Finance Blockchain API"
)
Base.metadata.create_all(bind=engine)





app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://trade-finance-blockchain-explorer-sable.vercel.app"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ROUTES
app.include_router(auth_router)
app.include_router(document_router)
app.include_router(dashboard_router)
app.include_router(audit_router)
app.include_router(transaction_router)
app.include_router(ledger_router)
app.include_router(risk_router)
app.include_router(analytics_router)
app.include_router(export_router)
app.include_router(user)

@app.get("/")
def root():
    return {
        "message": "Trade Finance Blockchain API Running"
    }
active_connections = []

# -----------------------------
# WEBSOCKET ANALYTICS ENDPOINT
# -----------------------------



active_connections = []

@app.websocket("/ws/analytics")
async def analytics_websocket(websocket: WebSocket):
    print("Connection request received")

    await websocket.accept()

    print("WebSocket accepted")

    try:
        while True:
            await asyncio.sleep(5)

            print("Sending refresh")

            await websocket.send_json({
                "message": "refresh"
            })

    except WebSocketDisconnect:
        print("WebSocket disconnected")

    except Exception as e:
        print("WebSocket error:", str(e))

    print("MAIN.PY LOADED")
    