import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import GoogleLoginButton from "./GoogleLoginButton";
import axios from "axios";
import { FaEnvelope, FaLock, FaGoogle } from "react-icons/fa";

function Login() {
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("user")) || null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, [user, navigate]);

  const handleManualLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5000/api/login", {
        email,
        password,
      });
      localStorage.setItem("user", JSON.stringify(res.data.user));
      localStorage.setItem("token", res.data.token);
      setUser(res.data.user);
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl border border-gray-300 max-w-md w-full p-8">
        <h2 className="text-2xl font-bold text-black mb-1">Welcome Back</h2>
        <p className="text-gray-700 mb-6">Please enter your details</p>

        {/* Manual Login Form */}
        <form onSubmit={handleManualLogin} className="space-y-4">

          <div className="relative">
            <FaEnvelope className="absolute left-3 top-3.5 text-black text-xl" />
            <input
              type="email"
              placeholder="Email"
              className="pl-12 w-full px-4 py-2 border rounded-lg bg-white text-black border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="relative">
            <FaLock className="absolute left-3 top-3.5 text-black text-xl" />
            <input
              type="password"
              placeholder="Password"
              className="pl-12 w-full px-4 py-2 border rounded-lg bg-white text-black border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <button
            type="submit"
            className="w-full bg-black text-white font-semibold py-2 px-4 rounded-lg transition hover:opacity-90"
          >
            Login
          </button>
        </form>

        <div className="flex items-center my-6">
          <hr className="flex-grow border-t border-gray-300" />
          <span className="px-4 text-gray-400">or</span>
          <hr className="flex-grow border-t border-gray-300" />
        </div>

  
        <GoogleLoginButton setUser={setUser} />

        <p className="mt-6 text-center text-gray-700 text-sm">
          Not registered?{" "}
          <a href="/register" className="text-black underline hover:opacity-80">
            Create an account
          </a>
        </p>
      </div>
    </div>



  );
}

export default Login;
