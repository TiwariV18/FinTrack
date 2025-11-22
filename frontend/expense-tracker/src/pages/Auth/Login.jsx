import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import Input from "../../components/Inputs/Input";
import { validateEmail } from "../../utils/helper";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!validateEmail(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    if (!email || !password) {
      setError("Please enter both email and password.");
      return;
    }

    setError("");
    setLoading(true);

    try {
      const response = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
  setError(data.message || "Login failed.");
} else {
  // Clear previous data & store fresh user session
localStorage.setItem("token", data.token);
localStorage.setItem("user", JSON.stringify(data.user));


  navigate("/dashboard", { replace: true });
}

    } catch (err) {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex items-center justify-center h-screen overflow-hidden">

      <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 animate-gradient-x"></div>

      <div className="absolute w-full h-full opacity-20">
        {[...Array(30)].map((_, i) => (
          <div
            key={i}
            className="absolute bg-white rounded-full"
            style={{
              width: Math.random() * 5 + 2 + "px",
              height: Math.random() * 5 + 2 + "px",
              top: Math.random() * 100 + "%",
              left: Math.random() * 100 + "%",
              animation: `float ${5 + Math.random() * 10}s ease-in-out infinite`,
            }}
          ></div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative z-10 w-96 p-8 bg-white/20 backdrop-blur-md rounded-2xl shadow-2xl border border-white/30"
      >
        <h3 className="text-2xl font-bold text-center text-white">Welcome Back 👋</h3>
        <p className="text-sm text-center text-gray-200 mt-2 mb-6">
          Please enter your details to log in
        </p>

        <form onSubmit={handleLogin}>
          {error && <p className="text-red-400 text-sm mb-3">{error}</p>}

          <Input
            value={email}
            onChange={({ target }) => setEmail(target.value)}
            label="Email Address"
            placeholder="vanshika@example.com"
            type="text"
          />

          <Input
            value={password}
            onChange={({ target }) => setPassword(target.value)}
            label="Password"
            placeholder="••••••••"
            type="password"
          />

          <button
            type="submit"
            className="mt-5 w-full py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-semibold transition-all"
            disabled={loading}
          >
            {loading ? "Logging in..." : "LOGIN"}
          </button>

          <p className="mt-4 text-sm text-gray-200 text-center">
            Don’t have an account?{" "}
            <Link className="font-semibold text-pink-300 hover:text-white underline" to="/SignUp">
              Sign Up
            </Link>
          </p>
        </form>
      </motion.div>

      <style>{`
        @keyframes gradient-x {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        .animate-gradient-x {
          background-size: 200% 200%;
          animation: gradient-x 10s ease infinite;
        }
        @keyframes float {
          0% { transform: translateY(0px); opacity: 0.5; }
          50% { transform: translateY(-20px); opacity: 1; }
          100% { transform: translateY(0px); opacity: 0.5; }
        }
      `}</style>
    </div>
  );
};

export default Login;
