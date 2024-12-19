import { useUserLogin } from "@/apis/authApis";
import { useGlobalStore } from "@/utils/GlobalStore";
import React, { useState } from "react";
import { ImSpinner10 } from "react-icons/im";

const Login: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { setIsLoginSuccess } = useGlobalStore();

  const { mutate: loginUser, isPending } = useUserLogin();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      alert("Please enter both email and password.");
      return;
    }

    const formData = { email, password };
    console.log("Login Data:", formData);
    loginUser(
      { email, password },
      {
        onSuccess: (data) => {
          localStorage.setItem("formBuilderToken", JSON.stringify(data.token));
          localStorage.setItem("userDetails", JSON.stringify(data.user));
          console.log("Login successful!", data);
          setIsLoginSuccess(true);
        },
        onError: (err) => {
          console.error("Login failed", err);
        },
      }
    );

    setEmail("");
    setPassword("");
  };

  return (
    <div className="max-w-sm mx-auto p-6 bg-white border border-gray-200 rounded shadow-sm">
      <h1 className="text-xl font-semibold mb-4">Login</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Email
          </label>
          <input
            type="email"
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring focus:ring-indigo-200"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="yourname@example.com"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Password
          </label>
          <input
            type="password"
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring focus:ring-indigo-200"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Your Password"
          />
        </div>

        <button
          type="submit"
          className="w-full flex justify-center py-2 bg-indigo-600 text-white font-medium rounded hover:bg-indigo-700 focus:outline-none focus:ring focus:ring-indigo-300"
        >
          {isPending ? (
            <ImSpinner10 className="animate-spin w-6 h-6" />
          ) : (
            "Login"
          )}
        </button>
      </form>
    </div>
  );
};

export default Login;
