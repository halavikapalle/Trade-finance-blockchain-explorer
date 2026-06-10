import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
const API = import.meta.env.VITE_API_URL;
function Register() {
  const [form, setForm] = useState({
  name: "",
  email: "",
  password: "",
  role: "",
  org_name: "",
});


  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.post(
         `${API}/auth/register`,
      
      {
    name: form.name,
    email: form.email,
    password: form.password,
    role: form.role,
    org_name: form.org_name
  }
);

      toast.success("Account created successfully");
      navigate("/login");
    } 
    catch (error) {

      console.log(error);

      toast.error("Registration failed");
    }
    
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      
      {/* Glass Card */}
      <div className="w-[420px] p-8 rounded-2xl backdrop-blur-xl bg-white/10 border border-white/20 shadow-2xl">

        {/* Header */}
        <h2 className="text-3xl font-bold text-center text-white">
          Create Account
        </h2>

        <p className="text-center text-gray-300 mt-2 text-sm">
          Trade Finance Blockchain Explorer
        </p>

        {/* Form */}
        <form onSubmit={handleSubmit} className="mt-6 space-y-4">

          <input
            name="name"
            placeholder="Full Name"
            onChange={handleChange}
            className="w-full p-3 rounded-lg bg-white/10 text-white border border-white/20 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />

          <input
            name="email"
            placeholder="Email"
            type="email"
            onChange={handleChange}
            className="w-full p-3 rounded-lg bg-white/10 text-white border border-white/20 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />

          <input
            name="password"
            placeholder="Password"
            type="password"
            onChange={handleChange}
            className="w-full p-3 rounded-lg bg-white/10 text-white border border-white/20 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          <input
            name="org_name"
            placeholder="Organization Name"
            onChange={handleChange}
            className="w-full p-3 rounded-lg bg-white/10 text-white border border-white/20 focus:outline-none"
            required
          />
                    <select
                        name="role"
                        onChange={handleChange}
                        className="w-full p-3 rounded-lg bg-white text-black border border-white/20 focus:outline-none"
                      >

                  <option value="buyer">
                    Buyer
                  </option>

                  <option value="seller">
                    Seller
                  </option>

                  <option value="bank">
                    Bank
                  </option>

                  <option value="admin">
                    Admin
                  </option>

                </select>
              <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 transition p-3 rounded-lg text-white font-semibold shadow-lg"
          >
            Create Account
          </button>
        </form>

        {/* Login Link */}
        <p className="text-center text-gray-300 mt-5 text-sm">
          Already have an account?{" "}
          <Link to="/login" className="text-blue-400 hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Register;