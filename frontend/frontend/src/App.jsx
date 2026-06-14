import { BrowserRouter, Routes, Route } from "react-router-dom"


import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard"
import AuditLogs from "./pages/AuditLogs"
import Login from "./pages/Login"
import Documents from "./pages/Documents"
import Analytics from "./pages/Analytics"
import Transactions from "./pages/Transactions";
import UploadDocument from "./pages/UploadDocument";
import LedgerExplorer from "./pages/LedgerExplorer";
import Profile from "./pages/Profile";
import Risk from "./pages/Risk"
import Users from "./pages/Users";
import ProtectedRoute from "./components/ProtectedRoute";




function App() {
  return (
    <BrowserRouter>
    
      <Routes> 

        <Route path="/" element={<Login />} />

        <Route path="/dashboard" element={<Dashboard />} />

        <Route path="/upload" element={<UploadDocument />} />

         <Route path="/transactions" element={<Transactions />} />

        <Route path="/register" element={<Register />} />
    
         <Route path="/login" element={<Login />} />

        <Route path="/audit-logs" element={<AuditLogs />} />

        <Route path="/documents" element={<Documents />} />

        <Route path="/analytics" element={<Analytics />} />

        <Route path="/ledger" element={<LedgerExplorer />}/>

        <Route path="/risk" element={<Risk/>}/>

        <Route path="/profile" element={<Profile />} />

        <Route
          path="/users"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <Users />
            </ProtectedRoute>
          }
        />

      </Routes>

    </BrowserRouter>
  );
} 

export default App;