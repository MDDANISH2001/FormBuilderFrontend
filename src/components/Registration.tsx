import { useUserRegister } from "@/apis/authApis";
import React, { useState } from "react";
import { ImSpinner10 } from "react-icons/im";

const Registration: React.FC = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { mutate: registerUser, isPending } = useUserRegister();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !password) {
      alert("Please fill in all fields");
      return;
    }

    const formData = { name, email, password };
    console.log("Registration Data:", formData);
    registerUser(
      { email, name, password },
      {
        onSuccess: (data) => {
          console.log("Registration successful", data);
        },
        onError: (err) => {
          console.error("Registration failed", err);
        },
      }
    );

    setName("");
    setEmail("");
    setPassword("");
  };

  return (
    <div className="max-w-sm mx-auto p-6 bg-white border border-gray-200 rounded shadow-sm">
      <h1 className="text-xl font-semibold mb-4">Register</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Name
          </label>
          <input
            type="text"
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring focus:ring-indigo-200"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your Name"
          />
        </div>

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
            placeholder="At least 6 characters"
          />
        </div>

        <button
          type="submit"
          className="w-full py-2 flex justify-center bg-indigo-600 text-white font-medium rounded hover:bg-indigo-700 focus:outline-none focus:ring focus:ring-indigo-300"
        >
          {isPending ? (
            <ImSpinner10 className="animate-spin w-6 h-6" />
          ) : (
            "Register"
          )}
        </button>
      </form>
    </div>
  );
};

export default Registration;
