"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import Image from "next/image";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

export default function LoginPage() {
  const router = useRouter();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const formData = new URLSearchParams();
      formData.append("username", username);
      formData.append("password", password);

      const res = await axios.post(
        `${API_URL}/login`,
        formData,
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        }
      );

      localStorage.setItem("token", res.data.access_token);
      localStorage.setItem("username", res.data.username);

      router.push("/dashboard");
    } catch (err: any) {
      setError(err?.response?.data?.detail || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-100 flex items-center justify-center px-6">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="bg-gradient-to-r from-sky-900 via-cyan-800 to-emerald-700 text-white px-6 py-6">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="bg-white/95 rounded-xl p-2 shadow-lg">
                <Image
                  src="/CM.JPG"
                  alt="Chief Minister"
                  width={56}
                  height={56}
                  className="object-cover rounded-full border-2 border-white"
                  priority
                />
              </div>

              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-sky-100 font-semibold">
                  Telangana Governance Platform
                </p>
                <h1 className="text-2xl font-bold mt-1">Officer Login</h1>
              </div>
            </div>

            <div className="bg-white/95 rounded-xl p-2 shadow-lg">
              <Image
                src="/logo.PNG"
                alt="Government Logo"
                width={56}
                height={56}
                className="object-contain"
                priority
              />
            </div>
          </div>
        </div>

        <div className="p-8">
          <p className="text-slate-600 mb-6">
            Only authorized government officials can access the dashboard.
          </p>

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Username
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter username"
                className="w-full border border-slate-300 rounded-lg p-3 bg-slate-50 text-slate-900 focus:outline-none focus:ring-2 focus:ring-cyan-700"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                className="w-full border border-slate-300 rounded-lg p-3 bg-slate-50 text-slate-900 focus:outline-none focus:ring-2 focus:ring-cyan-700"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-sky-900 hover:bg-sky-800 text-white px-6 py-3 rounded-lg font-semibold transition disabled:opacity-60"
            >
              {loading ? "Signing in..." : "Login"}
            </button>

            {error && (
              <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-red-700 text-sm">
                {error}
              </div>
            )}
          </form>
        </div>
      </div>
    </main>
  );
}