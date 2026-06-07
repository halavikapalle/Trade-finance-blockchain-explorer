import { useEffect, useState } from "react";
import axios from "axios";

import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer
} from "recharts";

function Dashboard() {
  const [stats, setStats] = useState({
    total_documents: 0,
    verified_documents: 0,
    total_audit_logs: 0
  });

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await axios.get(
        "https://trade-finance-backend-oi57.onrender.com/dashboard/stats",
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      setStats(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const verificationRate = stats.total_documents
    ? Math.round((stats.verified_documents / stats.total_documents) * 100)
    : 0;

  return (
    <div className="flex">
      <Sidebar />

      <div className="flex-1 bg-gray-100 min-h-screen">
        <Navbar />

        <div className="p-8">

          {/* TITLE */}
          <h1 className="text-3xl font-bold mb-6">
            Analytics Dashboard
          </h1>

          {/* KPI CARDS */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

            <div className="bg-gradient-to-r from-blue-500 to-blue-700 text-white p-6 rounded-2xl shadow-xl hover:scale-105 transition">
              <h2 className="text-lg font-semibold">Total Documents</h2>
              <p className="text-4xl mt-3 font-bold">
                {stats.total_documents}
              </p>
            </div>

            <div className="bg-gradient-to-r from-green-500 to-green-700 text-white p-6 rounded-2xl shadow-xl hover:scale-105 transition">
              <h2 className="text-lg font-semibold">Verified Documents</h2>
              <p className="text-4xl mt-3 font-bold">
                {stats.verified_documents}
              </p>
            </div>

            <div className="bg-gradient-to-r from-purple-500 to-pink-600 text-white p-6 rounded-2xl shadow-xl hover:scale-105 transition">
              <h2 className="text-lg font-semibold">Audit Logs</h2>
              <p className="text-4xl mt-3 font-bold">
                {stats.total_audit_logs}
              </p>
            </div>

          </div>

          {/* CHART SECTION */}
          <div className="bg-white mt-10 p-6 rounded-2xl shadow-xl">

            <h2 className="text-2xl font-bold mb-6">
              Analytics Overview
            </h2>

            <ResponsiveContainer width="100%" height={300}>
              <BarChart
                data={[
                  {
                    name: "Documents",
                    value: stats.total_documents
                  },
                  {
                    name: "Verified",
                    value: stats.verified_documents
                  },
                  {
                    name: "Audit Logs",
                    value: stats.total_audit_logs
                  }
                ]}
              >
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar
                  dataKey="value"
                  fill="#2563eb"
                  radius={[10, 10, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>

          </div>

          {/* INSIGHTS PANEL */}
          <div className="mt-10 bg-white p-6 rounded-2xl shadow-xl">

            <h2 className="text-2xl font-bold mb-4">
              System Insights
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

              <div className="p-4 bg-gray-50 rounded-xl">
                <p className="text-gray-500">Verification Rate</p>
                <p className="text-2xl font-bold text-green-600">
                  {verificationRate}%
                </p>
              </div>

              <div className="p-4 bg-gray-50 rounded-xl">
                <p className="text-gray-500">System Status</p>
                <p className="text-2xl font-bold text-blue-600">
                  Active
                </p>
              </div>

            </div>

          </div>

        </div>
      </div>
    </div>
  );
}

export default Dashboard;