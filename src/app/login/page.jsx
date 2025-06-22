"use client";
import { useState } from "react";
import { toast } from "react-toastify";
import { ToastContainer } from "react-toastify";
import { useRouter } from "next/navigation";

const LoginPage = () => {
  const hostURL = process.env.NEXT_PUBLIC_HOST_URL;
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (!email || !password) {
        toast.error("Please fill in both fields.");
        return;
      }

      const data = { email, password };
      const response = await fetch(`${hostURL}/users/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
        credentials: 'include',
      });

      if (response.ok) {
        setEmail("");
        setPassword("");
        toast.success("Logged in successfully!");
        setTimeout(() => {
          router.push("/generate");
        }, 1000);
      } else {
        toast.error("Login failed. Email or password is incorrect.");
      }
    } catch (err) {
      toast.error("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#e0f7fa] via-[#ffffff] to-[#f3e5f5] animate-gradient-x bg-[length:400%_400%] px-4">
      <ToastContainer />
      <style>{`
        @keyframes gradient-x {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .animate-gradient-x {
          animation: gradient-x 8s ease infinite;
        }
      `}</style>
      <div className="max-w-md w-full rounded-3xl p-8 space-y-6 ">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">
            FlowChart<span className="text-blue-600">-AI</span>
          </h1>
          <p className="mt-2 text-gray-500 text-sm">
            Turn ideas into intelligent flowcharts
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm text-gray-700 mb-1">Email</label>
            <input
              type="email"
              className="w-full px-4 py-2 rounded-lg border border-gray-300 bg-gray-50 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-sm text-gray-700 mb-1">Password</label>
            <input
              type="password"
              className="w-full px-4 py-2 rounded-lg border border-gray-300 bg-gray-50 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-purple-500 hover:to-blue-500 text-white font-semibold py-2 rounded-xl transition duration-300 ease-in-out"
          >
            {loading ? "Logging in..." : "Login to FlowChart-AI"}
          </button>
        </form>

        <p className="text-center text-sm text-gray-500">
          Don’t have an account?{" "}
          <a href="/register" className="text-blue-500 font-medium hover:underline">
            Sign up
          </a>
        </p>
      </div>
    </main>
  );
};

export default LoginPage;