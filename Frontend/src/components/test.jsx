// components/Home.js
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Home() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login");
    } else {
      // Optionally decode user info from token or fetch from API
      const email = token.split('.')[1]; // just for demo, use real JWT decode in prod
      setUser({
        name: "Welcome User",
        email: email,
        avatar: `https://i.pravatar.cc/150?u=${email}`,
      });
    }
  }, [navigate]);

  const handleLogout = () => {
   localStorage.clear();

    navigate("/login");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4 py-8">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md flex flex-col items-center space-y-4">
        {user ? (
          <>
            <img
              src={user.avatar}
              alt="Avatar"
              className="w-20 h-20 rounded-full object-cover"
            />
            <h1 className="text-2xl font-bold text-gray-800">
              Hello, {user.name}
            </h1>
    
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
            >
              Logout
            </button>
          </>
        ) : (
          <p>Loading...</p>
        )}
      </div>
    </div>
  );
}

export default Home;
