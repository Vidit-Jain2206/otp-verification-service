// src/components/LoginRegister.tsx
import React, { useState } from "react";
import { useAuth } from "../context/authContext";

const LoginRegister = () => {
  const { login } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    username: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Mock API response
    if (isLogin) {
      // Login API call
      try {
        const response = await fetch("https://api.example.com/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: formData.email,
            password: formData.password,
          }),
        });
        const data = await response.json();
        if (response.ok) {
          login(data.token);
        } else {
          console.error(data.message);
        }
      } catch (error) {
        console.error("Login error:", error);
      }
    } else {
      // Register API call
      try {
        const response = await fetch("https://api.example.com/register", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username: formData.username,
            email: formData.email,
            password: formData.password,
          }),
        });
        const data = await response.json();
        if (response.ok) {
          login(data.token);
        } else {
          console.error(data.message);
        }
      } catch (error) {
        console.error("Register error:", error);
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
      <div className="w-full max-w-md p-8 space-y-4 bg-gray-800 rounded-lg">
        <h2 className="text-2xl font-bold">{isLogin ? "Login" : "Register"}</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <div>
              <label className="block text-sm">Username</label>
              <input
                type="text"
                value={formData.username}
                onChange={(e) =>
                  setFormData({ ...formData, username: e.target.value })
                }
                className="w-full px-4 py-2 bg-gray-700 rounded-md"
                required
              />
            </div>
          )}
          <div>
            <label className="block text-sm">Email</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              className="w-full px-4 py-2 bg-gray-700 rounded-md"
              required
            />
          </div>
          <div>
            <label className="block text-sm">Password</label>
            <input
              type="password"
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              className="w-full px-4 py-2 bg-gray-700 rounded-md"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-md"
          >
            {isLogin ? "Login" : "Register"}
          </button>
        </form>
        <p className="text-sm text-gray-400">
          {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="text-blue-500 underline"
          >
            {isLogin ? "Register" : "Login"}
          </button>
        </p>
      </div>
    </div>
  );
};

export default LoginRegister;
