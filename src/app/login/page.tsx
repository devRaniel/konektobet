"use client";

import { useState } from "react";
import axios from "axios";

export default function LoginPage() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState<string | null>(null);

    const handleLogin = async () => {
    try {
      const res = await axios.post("/api/auth/login", { username, password });
      localStorage.setItem("access", res.data.access);
      alert(`Logged in as ${res.data.user.username}`);
    } catch (err: any) {
      setError(err.response?.data?.error || "Login failed");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-20 p-4 border rounded">
      <h1 className="text-2xl mb-4">Login</h1>
      {error && <p className="text-red-500">{error}</p>}
      <input
        type="text"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        className="border p-2 w-full mb-2"
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="border p-2 w-full mb-2"
      />
      <button
        onClick={handleLogin}
        className="bg-blue-500 text-white p-2 w-full rounded"
      >
        Login
      </button>
    </div>
  );
}