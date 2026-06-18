import { useEffect, useState } from "react";
import axios from "axios";

import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
const API = import.meta.env.VITE_API_URL;
function Profile() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await axios.get(
        `${API}/users/me`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setUser(response.data);
    } catch (error) {
    console.log(error.response?.data);
    console.log(error);
  }
  };

  const updateRole = async (newRole) => {
  try {
    const token = localStorage.getItem("token");

    await axios.put(
      `${API}/users/role`,
      { role: newRole },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    
    await fetchProfile(); 

  } catch (error) {
    console.log(error);
  }
};

  
{user?.name}
{user?.email}
{user?.role}
{user?.org_name}
  return (
    <div className="flex">
      <Sidebar />

      <div className="flex-1 bg-gray-100 min-h-screen">
        <Navbar />

        <div className="p-8">
          <h1 className="text-3xl font-bold mb-8">
            My Profile
          </h1>

          <div className="bg-white rounded-2xl shadow-xl p-8 max-w-2xl">

            <div className="mb-6">
              <h2 className="text-gray-500">
                Name
              </h2>

              <p className="text-xl font-semibold">
                {user?.name}
              </p>
            </div>

            <div className="mb-6">
              <h2 className="text-gray-500">
                Email
              </h2>

              <p className="text-xl font-semibold">
                {user?.email}
              </p>
            </div>

            <div className="mb-6">
              <h2 className="text-gray-500">
                Role
              </h2>

              <p className="text-xl font-semibold">
                {user?.role}
              </p>

              </div>

            <div>
              <h2 className="text-gray-500">
                Organization
              </h2>

              <p className="text-xl font-semibold">
                {user?.org_name}
              </p>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;