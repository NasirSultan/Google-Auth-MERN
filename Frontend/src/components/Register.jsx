import React, { useState } from "react";
import { FaEnvelope, FaLock, FaUser, FaPhone } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
  });

  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await fetch("http://localhost:5000/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.token) {
          localStorage.setItem("token", data.token);
        }
        navigate("/");
      } else {
        const err = await response.json();
        setError(err.message || "Failed to register");
      }
    } catch (err) {
      setError("Network error: " + err.message);
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl border border-gray-300 max-w-md w-full p-8">
        <h2 className="text-2xl font-bold text-black mb-1">Welcome </h2>
        <p className="text-gray-700 mb-6">Please enter your details</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <FaUser className="absolute left-3 top-3.5 text-black" size={24} />
            <input
              type="text"
              name="name"
              placeholder="Name"
              className="pl-10 w-full px-4 py-2 border rounded-lg bg-white text-black border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500"
              value={form.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="relative">
            <FaEnvelope
              className="absolute left-3 top-3.5 text-black"
              size={24}
            />
            <input
              type="email"
              name="email"
              placeholder="Email"
              className="pl-10 w-full px-4 py-2 border rounded-lg bg-white text-black border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500"
              value={form.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="relative">
            <FaLock className="absolute left-3 top-3.5 text-black" size={24} />
            <input
              type="password"
              name="password"
              placeholder="Password"
              className="pl-10 w-full px-4 py-2 border rounded-lg bg-white text-black border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500"
              value={form.password}
              onChange={handleChange}
              required
            />
          </div>

          <div className="relative">
            <FaPhone className="absolute left-3 top-3.5 text-black" size={24} />
            <input
              type="tel"
              name="phone"
              placeholder="Phone"
              className="pl-10 w-full px-4 py-2 border rounded-lg bg-white text-black border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500"
              value={form.phone}
              onChange={handleChange}
              required
            />
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <button
            type="submit"
            className="w-full bg-black text-white font-semibold py-2 px-4 rounded-lg transition hover:opacity-90"
          >
            Register
          </button>
        </form>

        <p className="mt-6 text-center text-gray-700 text-sm">
          Already registered?{" "}
          <a href="/login" className="text-black underline hover:opacity-80">
            Login here
          </a>
        </p>
      </div>
    </div>
  );
}
