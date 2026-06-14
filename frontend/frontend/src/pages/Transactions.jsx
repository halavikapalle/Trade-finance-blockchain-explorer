import { useEffect, useState } from "react";
import axios from "axios";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import { toast } from "react-toastify";
function Transactions() {
  const [transactions, setTransactions] = useState([]);

  const [buyerId, setBuyerId] = useState("");
  const [sellerId, setSellerId] = useState("");
  const [amount, setAmount] = useState("");
  const [currency, setCurrency] = useState("USD");

  const fetchTransactions = async () => {
    try {
      const response = await axios.get(
  "https://trade-finance-backend-oi57.onrender.com/transactions/"
);

      setTransactions(response.data);
    } catch (error) {
      console.log("Transaction fetch error:", error);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  const createTransaction = async () => {
    try {
      const token = localStorage.getItem("token");

      await axios.post(
  "https://trade-finance-backend-oi57.onrender.com/transactions/",
  {
    buyer_id: Number(buyerId),
    seller_id: Number(sellerId),
    amount: Number(amount),
    currency,
  },
  {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }
);

      toast.success("Transaction created successfully");

      setBuyerId("");
      setSellerId("");
      setAmount("");

      fetchTransactions();
    } catch (error) {
      console.log(error);
      toast.error("Failed to create transaction");
    }
  };

  const updateStatus = async (id, status) => {
    try {
      await axios.put(
        `https://trade-finance-backend-oi57.onrender.com/transactions/${id}/status`,
        {
          status,
        }
      );

      fetchTransactions();
    } catch (error) {
      console.log("Status update error:", error);
    }
  };

  const deleteTransaction = async (id) => {
    try {
      const token = localStorage.getItem("token");

      await axios.delete(
        `https://trade-finance-backend-oi57.onrender.com/transactions/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.error("Failed to Delete transaction");

      fetchTransactions();
    } catch (error) {
      console.log(error);
      alert("Delete Failed");
    }
  };

  return (
    <div className="flex">
      <Sidebar />

      <div className="flex-1 bg-gray-100 min-h-screen">
        <Navbar />

        <div className="p-8">
          <h1 className="text-3xl font-bold mb-6">
            Trade Transactions
          </h1>

          {/* Create Transaction */}
          <div className="bg-white p-6 rounded-xl shadow mb-6">
            <h2 className="text-xl font-bold mb-4">
              Create Transaction
            </h2>

            <div className="grid grid-cols-4 gap-4">
              <input
                type="number"
                placeholder="Buyer ID"
                value={buyerId}
                onChange={(e) =>
                  setBuyerId(e.target.value)
                }
                className="border p-3 rounded"
              />

              <input
                type="number"
                placeholder="Seller ID"
                value={sellerId}
                onChange={(e) =>
                  setSellerId(e.target.value)
                }
                className="border p-3 rounded"
              />

              <input
                type="number"
                placeholder="Amount"
                value={amount}
                onChange={(e) =>
                  setAmount(e.target.value)
                }
                className="border p-3 rounded"
              />

              <select
                value={currency}
                onChange={(e) =>
                  setCurrency(e.target.value)
                }
                className="border p-3 rounded"
              >
                <option value="USD">USD</option>
                <option value="INR">INR</option>
                <option value="EUR">EUR</option>
              </select>
            </div>

            <button
              onClick={createTransaction}
              className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg"
            >
              Create Transaction
            </button>
          </div>

          {/* Transactions Table */}
          <div className="bg-white p-6 rounded-2xl shadow-xl overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-200 text-gray-700">
                  <th className="p-4">ID</th>
                  <th className="p-4">Buyer</th>
                  <th className="p-4">Seller</th>
                  <th className="p-4">Amount</th>
                  <th className="p-4">Currency</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Risk Score</th>
                  <th className="p-4">Update Status</th>
                  <th className="p-4">Actions</th>
                </tr>
              </thead>

              <tbody>
                {transactions.map((tx) => (
                  <tr
                    key={tx.id}
                    className="text-center border-b hover:bg-gray-50 transition"
                  >
                    <td className="p-4">{tx.id}</td>

                    <td className="p-4">
                      {tx.buyer_id}
                    </td>

                    <td className="p-4">
                      {tx.seller_id}
                    </td>

                    <td className="p-4 font-semibold">
                      {tx.amount}
                    </td>

                    <td className="p-4">
                      {tx.currency}
                    </td>

                    <td className="p-4">
                      <span
                        className={`px-4 py-1 rounded-full text-white text-sm
                        ${
                          tx.status === "approved"
                            ? "bg-green-500"
                            : tx.status === "rejected"
                            ? "bg-red-500"
                            : tx.status === "completed"
                            ? "bg-blue-500"
                            : "bg-yellow-500"
                        }`}
                      >
                        {tx.status}
                      </span>
                    </td>

                    <td className="p-4 font-semibold">
                      {tx.risk_score ?? 0}
                    </td>

                    <td className="p-4">
                      <select
                        value={tx.status}
                        onChange={(e) =>
                          updateStatus(
                            tx.id,
                            e.target.value
                          )
                        }
                        className="border border-gray-300 px-4 py-2 rounded-lg"
                      >
                        <option value="pending">
                          Pending
                        </option>

                        <option value="approved">
                          Approved
                        </option>

                        <option value="rejected">
                          Rejected
                        </option>

                        <option value="completed">
                          Completed
                        </option>
                      </select>
                    </td>

                    <td className="p-4">
                      <button
                        onClick={() =>
                          deleteTransaction(tx.id)
                        }
                        className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {transactions.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                No Transactions Found
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Transactions;