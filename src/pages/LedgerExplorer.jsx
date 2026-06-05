import { useEffect, useState } from "react";
import axios from "axios";

import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

function LedgerExplorer() {

  const [entries, setEntries] = useState([]);

  useEffect(() => {
    fetchLedgerEntries();
  }, []);

  const fetchLedgerEntries = async () => {

    try {

      const token = localStorage.getItem("token");

      const response = await axios.get(
        "http://127.0.0.1:8000/ledger/",
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      setEntries(response.data);

    } catch (error) {

      console.log("Ledger fetch error:", error);
    }
  };

  return (

    <div className="flex">

      <Sidebar />

      <div className="flex-1 bg-gray-100 min-h-screen">

        <Navbar />

        <div className="p-8">

          <h1 className="text-3xl font-bold mb-6">
            Ledger Explorer
          </h1>

          <div className="space-y-6">

  {entries.map((entry) => (

    <div
      key={entry.id}
      className="relative bg-white rounded-2xl shadow-lg p-6 border-l-8 border-blue-500 hover:scale-[1.01] transition"
    >

      <div className="flex justify-between items-start">

        <div>

          <h2 className="text-xl font-bold text-blue-700">
            {entry.action}
          </h2>

          <p className="text-gray-700 mt-2">
            {entry.event_details}
          </p>

        </div>

        <div className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-semibold">
          #{entry.id}
        </div>

      </div>

      <div className="grid grid-cols-2 gap-4 mt-6 text-sm">

        <div className="bg-gray-100 p-3 rounded-lg">

          <p className="text-gray-500">
            Actor ID
          </p>

          <p className="font-semibold">
            {entry.actor_id}
          </p>

        </div>

        <div className="bg-gray-100 p-3 rounded-lg">

          <p className="text-gray-500">
            Document ID
          </p>

          <p className="font-semibold">
            {entry.document_id}
          </p>

        </div>

      </div>

      <div className="mt-5 text-right text-sm text-gray-400">
        {entry.created_at}
      </div>

    </div>

  ))}

</div>

             

        

        </div>

      </div>

    </div>
  );
}

export default LedgerExplorer;