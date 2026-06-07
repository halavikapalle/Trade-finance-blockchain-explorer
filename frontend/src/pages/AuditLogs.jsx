import { useEffect, useState } from "react";
import axios from "axios";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

function AuditLogs() {
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
  try {
    const token = localStorage.getItem("token");

    const response = await axios.get(
      "https://trade-finance-backend-oi57.onrender.com/audit/logs",
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    console.log("Audit Logs Response:", response.data);

    setLogs(response.data);
  } catch (error) {
    console.error(
      "Audit Logs Error:",
      error.response?.data || error.message
    );
  }
};
  return (
  <div className="flex">

    <Sidebar />

    <div className="flex-1 bg-gray-100 min-h-screen">

      <Navbar />

      <div className="p-8">

        <h1 className="text-3xl font-bold mb-6">
          Audit Logs
        </h1>

        <div className="bg-white p-6 rounded-2xl shadow-xl">

          <p className="text-lg mb-4 font-semibold">
            Total Logs: {logs.length}
          </p>

          <div className="overflow-x-auto">

            <table className="w-full border-collapse">

              <thead>

                <tr className="bg-gray-200 text-gray-700">

                  <th className="p-3 text-left">ID</th>
                  <th className="p-3 text-left">User</th>
                  <th className="p-3 text-left">Action</th>
                  <th className="p-3 text-left">Details</th>
                  <th className="p-3 text-left">Timestamp</th>

                </tr>

              </thead>

              <tbody>

                {logs.map((log) => (

                  <tr
                    key={log.id}
                    className="border-b hover:bg-gray-50 transition"
                  >

                    <td className="p-3">{log.id}</td>

                    <td className="p-3">
                      {log.user_id}
                    </td>

                    <td className="p-3 font-semibold text-blue-600">
                      {log.action}
                    </td>

                    <td className="p-3">
                      {log.details}
                    </td>

                    <td className="p-3 text-gray-500">
                      {log.created_at}
                    </td>

                  </tr>

                ))}

              </tbody>

            </table>

          </div>

        </div>

      </div>

    </div>

  </div>
)
}

export default AuditLogs;