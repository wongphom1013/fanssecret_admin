"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
export default function AuthForm() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  // const [password, setPassword] = useState("");

  const toggleForm = () => setIsLogin(!isLogin);

  // const handleSubmit = (e: React.FormEvent) => {
  //   e.preventDefault();
  //   if (isLogin) {
  //     // Handle login logic
  //     console.log("Logging in with:", { email, password });
  //   } else {
  //     // Handle sign-up logic
  //     console.log("Signing up with:", { email, password });
  //   }
  // };

  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    try {
      const response = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {
        const data = await response.json();
        setErrorMessage(data.error || "Login failed");
        return;
      }

      router.push("/admin");
    } catch (error) {
      setErrorMessage("An unexpected error occurred.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-2xl font-bold mb-6">{isLogin ? "Login" : "Sign Up"}</h1>
      <form onSubmit={handleLogin} className="bg-white p-6 rounded-lg shadow-md w-80">
        <div className="mb-4">
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
            Email
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 p-2 w-full border rounded-md"
            required
          />
        </div>

        {/* <div className="mb-4">
          <label htmlFor="password" className="block text-sm font-medium text-gray-700">
            Password
          </label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-1 p-2 w-full border rounded-md"
            required
          />
        </div> */}

        <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded-md">
          {isLogin ? "Login" : "Sign Up"}
        </button>
      </form>

      <button onClick={toggleForm} className="mt-4 text-blue-500 underline">
        {isLogin ? "Don't have an account? Sign Up" : "Already have an account? Log In"}
      </button>
    </div>
  );
}
