import { useEffect, useState } from "react";
import axios from "axios";

import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

import jsPDF from "jspdf";
import "jspdf-autotable";
import * as XLSX from "xlsx";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

function Analytics() {
  const [analytics, setAnalytics] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [error, setError] = useState(null);

  const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff8042"];

  const fetchAnalytics = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await axios.get(
        "http://127.0.0.1:8000/analytics/",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("Analytics response:", response.data);
      
      
      setAnalytics(response.data);
      setLastUpdated(new Date().toLocaleTimeString());
      setError(null);
    } catch (error) {
      console.log("Analytics Error:", error);
      setError("Failed to load analytics");
    }
  };

  // Initial Load
useEffect(() => {
  fetchAnalytics();
  
}, []);
  // WebSocket Live Updates
  
useEffect(() => {
  const ws = new WebSocket(
    "ws://127.0.0.1:8000/ws/analytics"
  );

  ws.onopen = () => {
    console.log("WebSocket Connected");
  };

  ws.onmessage = (event) => {
    console.log("MESSAGE RECEIVED:", event.data);

    fetchAnalytics();
  };

  ws.onerror = (error) => {
    console.log("WebSocket Error:", error);
  };

  ws.onclose = () => {
    console.log("WebSocket Closed");
  };

  return () => {
    ws.close();
  };
}, []);
  const exportPDF = () => {
    if (!analytics) return;

    const doc = new jsPDF();

    doc.text("Analytics Report", 14, 10);

    const tableData = Object.entries(
      analytics?.document_types
    );

    doc.autoTable({
      head: [["Document Type", "Count"]],
      body: tableData,
    });

    doc.save("analytics-report.pdf");
  };

  const exportExcel = () => {
    if (!analytics) return;

    const ws = XLSX.utils.json_to_sheet(
      Object.entries(analytics.document_types).map(
        ([type, count]) => ({
          type,
          count,
        })
      )
    );

    const wb = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(
      wb,
      ws,
      "Analytics"
    );

    XLSX.writeFile(
      wb,
      "analytics-report.xlsx"
    );
  };
  console.log("Analytics object:", analytics);
  if (!analytics) {
    return (
      <div className="p-10 text-center">
        Loading Analytics...
      </div>
    );
  }

  const documentTypeData = Object.entries(
    analytics.document_types
  ).map(([type, count]) => ({
    type,
    count,
  }));

  const verificationData = [
    {
      name: "Verified",
      value: analytics.verified_documents,
    },
    {
      name: "Pending",
      value:
        analytics.total_documents -
        analytics.verified_documents,
    },
  ];

  return (
    <div className="flex">
      <Sidebar />

      <div className="flex-1 bg-gray-100 min-h-screen">
        <Navbar />

        <div className="p-8">
          <h1 className="text-3xl font-bold mb-2">
            Analytics Dashboard
          </h1>

          <p className="text-sm text-gray-500 mb-6">
            Last Updated: {lastUpdated}
          </p>

          {/* Stats Cards */}
          <div className="grid grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-2xl shadow">
              <h2 className="text-xl font-semibold">
                Total Documents
              </h2>

              <p className="text-4xl font-bold mt-4">
                {analytics.total_documents}
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow">
              <h2 className="text-xl font-semibold">
                Verified Documents
              </h2>

              <p className="text-4xl font-bold mt-4">
                {analytics.verified_documents}
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow">
              <h2 className="text-xl font-semibold">
                Audit Logs
              </h2>

              <p className="text-4xl font-bold mt-4">
                {analytics.total_audit_logs}
              </p>
            </div>
          </div>

          {/* Bar Chart */}
          <div className="bg-white mt-8 p-6 rounded-2xl shadow">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold">
                Documents by Type
              </h2>

              <div className="flex gap-3">
                <button
                  onClick={exportPDF}
                  className="bg-blue-500 text-white px-4 py-2 rounded"
                >
                  Download PDF
                </button>

                <button
                  onClick={exportExcel}
                  className="bg-green-500 text-white px-4 py-2 rounded"
                >
                  Download Excel
                </button>
              </div>
            </div>

            <ResponsiveContainer
              width="100%"
              height={300}
            >
              <BarChart data={documentTypeData}>
                <XAxis dataKey="type" />
                <YAxis />
                <Tooltip />
                <Bar
                  dataKey="count"
                  fill="#8884d8"
                />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Pie Chart */}
          <div className="bg-white mt-8 p-6 rounded-2xl shadow">
            <h2 className="text-2xl font-bold mb-4">
              Verification Status
            </h2>

            <ResponsiveContainer
              width="100%"
              height={300}
            >
              <PieChart>
                <Pie
                  data={verificationData}
                  dataKey="value"
                  nameKey="name"
                  outerRadius={100}
                  label
                >
                  {verificationData.map(
                    (entry, index) => (
                      <Cell
                        key={index}
                        fill={
                          COLORS[
                            index %
                              COLORS.length
                          ]
                        }
                      />
                    )
                  )}
                </Pie>

                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Table */}
          <div className="bg-white mt-8 p-6 rounded-2xl shadow">
            <h2 className="text-2xl font-bold mb-4">
              Document Type Table
            </h2>

            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-3">
                    Document Type
                  </th>

                  <th className="text-left p-3">
                    Count
                  </th>
                </tr>
              </thead>

              <tbody>
                {Object.entries(
                  analytics.document_types
                ).map(([type, count]) => (
                  <tr
                    key={type}
                    className="border-b"
                  >
                    <td className="p-3">
                      {type}
                    </td>

                    <td className="p-3">
                      {count}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Analytics;