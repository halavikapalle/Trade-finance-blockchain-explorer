# Trade-finance-blockchain-explorer
📌 Overview
A full-stack Trade Finance Explorer that provides transparent, tamper-evident tracking of trade documents, transactions, and audit logs using a ledger-based architecture with risk analytics.

The system simulates blockchain-like traceability for financial trade operations.

🚀 Features
🔐 Authentication
JWT-based login system
Role-based access (Admin/User)
📄 Document Management
Upload trade documents
File hashing for integrity verification
Stored in secure backend storage
📊 Ledger Explorer
Chronological event tracking
Immutable audit trail of trade actions
Actor-based tracking (buyer/seller/system)
💰 Trade Transactions
Create and track trade transactions
Status lifecycle: pending → verified → completed
⚠️ Risk Engine
Automated risk scoring for transactions
Risk classification based on rules
📈 Analytics Dashboard
Document type distribution
Verification status metrics
Audit log insights
Interactive charts (Recharts)
📤 Export System
Export analytics to PDF
Export data to Excel
🏗️ Architecture
Frontend (React + Vite) ↓ Backend (FastAPI) ↓ PostgreSQL Database ↓ Services Layer:

Risk Engine
Hash Service
Export Service
🛠️ Tech Stack
Frontend:

React.js
Axios
Recharts
Tailwind CSS
Backend:

FastAPI
SQLAlchemy
PostgreSQL
JWT Authentication
Tools:

Pandas (export)
jsPDF
XLSX
📊 Key Modules
Auth Module
Ledger Module
Analytics Module
Risk Scoring Module
Export Module
📷 Screenshots
(Add dashboard, ledger, analytics screenshots here)

⚙️ Setup Instructions
Backend
pip install -r requirements.txt
uvicorn app.main:app --reload
