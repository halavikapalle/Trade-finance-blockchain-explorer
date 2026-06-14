import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

function Users() {

  const [users, setUsers] = useState([]);

  const [editingUser, setEditingUser] =
    useState(null);

  const [editForm, setEditForm] = useState({
    name: "",
    email: "",
    role: "",
  });

  // Fetch Users
  const fetchUsers = async () => {

    try {

      const token =
        localStorage.getItem("token");

      const response = await axios.get(
        "https://trade-finance-backend-oi57.onrender.com/users/",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setUsers(response.data);

    } catch (error) {

      console.log(error);

      toast.error("Failed to fetch users");
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);


  const deleteUser = async (id) => {

    const confirmDelete = window.confirm(
      "Are you sure you want to delete this user?"
    );

    if (!confirmDelete) return;

    try {

      const token =
        localStorage.getItem("token");

      await axios.delete(
        `https://trade-finance-backend-oi57.onrender.com/users/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success("User deleted");

      fetchUsers();

    } catch (error) {

      console.log(error);

      toast.error("Delete failed");
    }
  };

  // Start Edit
  const startEdit = (user) => {

    setEditingUser(user.id);

    setEditForm({
      name: user.name,
      email: user.email,
      role: user.role,
    });
  };

  // Update User
  const updateUser = async (id) => {

    try {

      const token =
        localStorage.getItem("token");

      await axios.put(
        `https://trade-finance-backend-oi57.onrender.com/users/${id}`,
        editForm,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success("User updated");

      setEditingUser(null);

      fetchUsers();

    } catch (error) {

      console.log(error);

      toast.error("Update failed");
    }
  };

  return (
    <div className="flex">

      <Sidebar />

      <div className="flex-1 bg-gray-100 min-h-screen">

        <Navbar />

        <div className="p-8">

          <h1 className="text-3xl font-bold mb-6">
            User Management
          </h1>

          <div className="bg-white rounded-2xl shadow-xl p-6">

            <table className="w-full border-collapse">

              <thead>

                <tr className="bg-gray-200">

                  <th className="p-4">ID</th>

                  <th className="p-4">Name</th>

                  <th className="p-4">Email</th>

                  <th className="p-4">Role</th>

                  <th className="p-4">Actions</th>

                </tr>

              </thead>

              <tbody>

                {users.map((user) => (

                  <tr
                    key={user.id}
                    className="border-b text-center"
                  >

                    <td className="p-4">
                      {user.id}
                    </td>

                    <td className="p-4">

                      {editingUser === user.id ? (

                        <input
                          value={editForm.name}
                          onChange={(e) =>
                            setEditForm({
                              ...editForm,
                              name: e.target.value,
                            })
                          }
                          className="border p-2 rounded"
                        />

                      ) : (
                        user.name
                      )}

                    </td>

                    <td className="p-4">

                      {editingUser === user.id ? (

                        <input
                          value={editForm.email}
                          onChange={(e) =>
                            setEditForm({
                              ...editForm,
                              email: e.target.value,
                            })
                          }
                          className="border p-2 rounded"
                        />

                      ) : (
                        user.email
                      )}

                    </td>

                    <td className="p-4">

                      {editingUser === user.id ? (

                        <select
                          value={editForm.role}
                          onChange={(e) =>
                            setEditForm({
                              ...editForm,
                              role: e.target.value,
                            })
                          }
                          className="border p-2 rounded"
                        >
                          <option value="admin">
                            admin
                          </option>

                          <option value="buyer">
                            buyer
                          </option>

                          <option value="seller">
                            seller
                          </option>

                          <option value="bank">
                            bank
                          </option>

                        </select>

                      ) : (
                        user.role
                      )}

                    </td>

                    <td className="p-4 flex gap-2 justify-center">

                      {editingUser === user.id ? (

                        <button
                          onClick={() =>
                            updateUser(user.id)
                          }
                          className="bg-green-500 text-white px-4 py-2 rounded"
                        >
                          Save
                        </button>

                      ) : (

                        <button
                          onClick={() =>
                            startEdit(user)
                          }
                          className="bg-blue-500 text-white px-4 py-2 rounded"
                        >
                          Edit
                        </button>

                      )}

                      <button
                        onClick={() =>
                          deleteUser(user.id)
                        }
                        className="bg-red-500 text-white px-4 py-2 rounded"
                      >
                        Delete
                      </button>

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

export default Users;