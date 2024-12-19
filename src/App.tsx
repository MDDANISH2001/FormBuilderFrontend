import { useEffect, useState } from "react";
import "./App.css";
import { AuthPage } from "./Pages/AuthPage";
import { HomePage } from "./Pages/HomePage";
import { useGlobalStore } from "./utils/GlobalStore";
import { Route, Routes } from "react-router-dom";
import { AllForms } from "./Pages/AllForms";
import { FormSubmition } from "./Pages/FormSubmition";

function App() {
  const [token, setToken] = useState<boolean>(false);

  const { isLoginSuccess } = useGlobalStore();
  const authToken = localStorage.getItem("formBuilderToken");

  useEffect(() => {
    setToken(!!authToken);
  }, [authToken, isLoginSuccess]);

  return (
    <div className="w-full flex flex-col items-center">
      <Routes>
        <Route path="/" element={token ? <HomePage /> : <AuthPage />} />
        <Route path="/myForms" element={<AllForms />} />
        <Route path="/formResponse" element={<FormSubmition />} />
      </Routes>
    </div>
  );
}

export default App;
