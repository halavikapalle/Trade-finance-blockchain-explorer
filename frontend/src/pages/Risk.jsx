import { useEffect, useState } from "react";
import axios from "axios";

import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

function Risk() {

  const [riskData, setRiskData] = useState([]);

  useEffect(() => {

    fetchRiskData();

  }, []);

  const fetchRiskData = async () => {

    try {

      const token = localStorage.getItem("token");

      const response = await axios.get(
        "https://trade-finance-backend-oi57.onrender.com/risk/",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("Risk Data:", response.data);

      setRiskData(response.data);

    } catch (error) {

      console.log("Risk Error:", error);

    }
  };

  return (
    <div className="flex">

      <Sidebar />

      <div className="flex-1 bg-gray-100 min-h-screen">

        <Navbar />

        <div className="p-8">

          <h1 className="text-3xl font-bold mb-6">
            Risk Analysis
          </h1>

          <div className="bg-white rounded-2xl shadow p-6">

            <table className="w-full">

              <thead>
                <tr className="border-b">

                  <th className="text-left p-3">
                    Document
                  </th>

                  <th className="text-left p-3">
                    Type
                  </th>

                  <th className="text-left p-3">
                    Risk Status
                  </th>

                </tr>
              </thead>

              <tbody>

                {riskData.map((doc) => (

                  <tr
                    key={doc.id}
                    className="border-b"
                  >

                    <td className="p-3">
                      {doc.title}
                    </td>

                    <td className="p-3">
                      {doc.document_type}
                    </td>

                    <td className="p-3">

                      {doc.risk_status === "HIGH_RISK" ? (

                        <span className="text-red-600 font-bold">
                          HIGH RISK
                        </span>

                      ) : (

                        <span className="text-green-600 font-bold">
                          SAFE
                        </span>

                      )}

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

export default Risk;