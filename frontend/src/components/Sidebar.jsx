import { Link } from "react-router-dom";

import {
  LayoutDashboard,
  FileText,
  Upload,
  ArrowLeftRight,
  ShieldCheck,
  Database,
  BarChart3
} from "lucide-react";

function Sidebar() {
  const role = localStorage.getItem("role");
  return (

    <div className="h-screen w-64 bg-gradient-to-b from-gray-900 to-black text-white p-6 shadow-2xl">

      <h1 className="text-2xl font-bold mb-8">
        Trade Finance Explorer
      </h1>

      <nav className="flex flex-col gap-4">

        <Link
          to="/dashboard"
          className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-blue-600 transition"
        >
          <LayoutDashboard size={20} />
          Dashboard
        </Link>

        <Link
          to="/documents"
          className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-blue-600 transition"
        >
          <FileText size={20} />
          Documents
        </Link>

        <Link
          to="/upload"
          className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-blue-600 transition"
        >
          <Upload size={20} />
          Upload Document
        </Link>

        <Link
          to="/transactions"
          className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-blue-600 transition"
        >
          <ArrowLeftRight size={20} />
          Transactions
        </Link>

        <Link
          to="/audit-logs"
          className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-blue-600 transition"
        >
          <ShieldCheck size={20} />
          Audit Logs
        </Link>

        <Link
          to="/ledger"
          className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-blue-600 transition"
        >
          <Database size={20} />
          Ledger Explorer
        </Link>

        <Link
          to="/analytics"
          className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-blue-600 transition"
        >
          <BarChart3 size={20} />
          Analytics
        </Link>

        <Link
          to="/risk"
          className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-blue-600 transition"
        >
          <BarChart3 size={20} />
          Risk
        </Link>

        <Link
          to="/profile"
          className="block p-3 hover:bg-gray-700 rounded"
        >
          Profile
        </Link>
        {role === "admin" && (
        <Link to="/users">
          Users
        </Link>
      )}
            </nav>

    </div>
  );
}

export default Sidebar;