Trade Finance Blockchain Explorer
📌 Overview

A full-stack Trade Finance Management System designed to provide secure, transparent, and tamper-evident tracking of trade documents, transactions, and audit logs.

The system implements a blockchain-inspired immutable ledger architecture using cryptographic hashing and structured event logging to ensure data integrity, traceability, and auditability across financial operations.

🚀 Features
🔐 Authentication & Authorization
JWT-based secure login system
Role-based access control (Admin / User)
Protected frontend and backend routes
📄 Document Management
Upload and manage trade documents
File integrity verification using SHA-256 hashing
Secure backend storage system
📊 Ledger Explorer
Chronological event-based ledger system
Immutable audit trail of all trade activities
Actor-based tracking (Buyer / Seller / System)
Full transaction traceability
💰 Trade Transaction System
Create, update, and track trade transactions

Status flow:

Pending → Verified → Completed
⚠️ Risk Engine
Rule-based risk scoring system
Risk classification for transactions
Helps identify high-risk trade activities
📈 Analytics Dashboard
Interactive charts using Recharts
Document distribution analysis
Verification status metrics
Audit log insights
📤 Export System
Export reports to PDF (jsPDF)
Export data to Excel (XLSX)
Business reporting support
🏗️ System Architecture
Frontend (React + Vite)
        ↓
Backend (FastAPI)
        ↓
PostgreSQL Database
        ↓
Service Layer:
   ├── Authentication (JWT)
   ├── Ledger Service (Event Tracking)
   ├── Risk Engine (Rule-based scoring)
   ├── Hash Service (SHA-256 Integrity)
   ├── Export Service (PDF/Excel)
🛠️ Tech Stack
Frontend
React.js
Vite
Axios
Recharts
Tailwind CSS
Backend
FastAPI
SQLAlchemy ORM
JWT Authentication
Pydantic Validation
Database
PostgreSQL
Tools / Libraries
SHA-256 hashing (data integrity)
jsPDF (PDF export)
XLSX (Excel export)
Pandas (data processing)
📸 Screenshots
🏠 Dashboard

📊 Analytics

📜 Ledger Explorer

⚠️ Risk Analysis

📄 Documents Module

📤 Upload Module

👤 Users Management

📜 Audit Logs

🧠 Key Concept

This project implements a:

Blockchain-inspired ledger system using cryptographic hashing and immutable event logs to ensure tamper-evident tracking of trade finance operations.

👨‍💻 Core Modules

Authentication Module
Ledger / Audit Module
Transaction Management Module
Risk Scoring Engine
Analytics & Visualization Module
Export & Reporting Module

⚙️ Setup Instructions

Backend
pip install -r requirements.txt
uvicorn app.main:app --reload

Frontend
npm install
npm run dev
👨‍💻 Author

Halavika Palle
CSE Final Year Student
