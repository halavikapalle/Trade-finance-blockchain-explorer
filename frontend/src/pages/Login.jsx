import { useState, useEffect } from "react"
import axios from "axios"
import { useNavigate, Link} from "react-router-dom"
import { toast } from "react-toastify";
const API = import.meta.env.VITE_API_URL;
function Login() {
  
  const navigate = useNavigate();
  useEffect(() => {
  const token = localStorage.getItem("token")

  if (token) {
    navigate("/dashboard")
  }
}, [])
  

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showAccounts, setShowAccounts] = useState(false);
  const [savedUsers, setSavedUsers] = useState([]);
  const handleLogin = async (e) => {
    e.preventDefault();

  const params = new URLSearchParams();
  params.append("username", email);
  params.append("password", password);

  try {
  const response = await axios.post(
      `${API}/auth/login`,
      params,
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        }
      }
    );

    localStorage.setItem("token", response.data.access_token);
    localStorage.setItem("role", response.data.role);

    toast.success("Login successful");
    navigate("/dashboard");

  } catch (error) {
  console.log("FULL ERROR:", error);
  console.log("RESPONSE:", error.response);

  toast.error(
    error.response?.data?.detail || "Login failed"
  );
}
};
  useEffect(() => {

  const users =
    JSON.parse(localStorage.getItem("savedUsers"))
    || [];

  setSavedUsers(users);

}, []);
   
  return (

    <div className="min-h-screen bg-gray-100 flex items-center justify-center">

      <div className="bg-gray-900 p-10 rounded-2xl shadow-2xl w-full max-w-md border border-gray-700">

        <h1 className="text-4xl font-bold text-center text-blue-400 mb-2">
          Trade Finance
        </h1>

        <p className="text-center text-gray-200 mb-8">
          Blockchain Explorer Login
        </p>  
      
       
        <form onSubmit={handleLogin}>

       <div className="relative mb-4">

        <input
          type="email"
          placeholder="Enter Email"
          className="w-full p-4 rounded-xl bg-gray-800 border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          onFocus={() => setShowAccounts(true)}
        />

        {showAccounts && savedUsers.length > 0 && (

          <div className="absolute w-full mt-1 bg-white rounded-xl shadow-lg z-10 overflow-hidden">

            {savedUsers.map((user, index) => (

              <div
                key={index}
                onClick={() => {

                  setEmail(user);
                  setShowAccounts(false);

                }}
                className="p-3 hover:bg-gray-200 cursor-pointer text-black"
              >
                {user}
              </div>

            ))}

          </div>

        )}

      </div> 

       <input
        type="password"
        placeholder="Enter Password"
        value={password}
        onChange={(e) => {
          console.log("PASSWORD:", e.target.value);
          setPassword(e.target.value);
        }}
        className="w-full p-4 rounded-xl bg-white text-black border"
      />

        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-xl font-semibold"
        >
          Login
        </button>

        <p className="text-center mt-5 text-gray-600">
          Don’t have an account?{" "}
          <Link
            to="/register"
            className="text-blue-600 hover:underline"
          >
      Register
    </Link>
  </p>

</form>
          
        

      </div>

    </div>
  )
}

export default Login;