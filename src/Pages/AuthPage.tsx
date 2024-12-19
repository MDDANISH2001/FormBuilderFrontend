import React from "react";
import Registration from "../components/Registration";
import Login from "../components/Login";

export const AuthPage: React.FC = () => {
  return (
    <div className="border border-red-600 w-[90vw] h-[100vh] flex justify-center items-center">
      <Registration />
      <Login />
    </div>
  );
};
