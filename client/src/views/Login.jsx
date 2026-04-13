import React, { useState, useEffect } from "react";
import Input from "../components/Input";
import Button from "../components/Button";
import Navbar from "../components/Navbar";
import toast, { Toaster } from "react-hot-toast";
import axios from "axios";
import { Link, useNavigate } from "react-router";
import { SetPageTitle } from "/Utils.jsx";

function Login() {
  const navigate = useNavigate();

  useEffect(() => {
    SetPageTitle({ title: "Login" });
  }, []);

  const [loginUser, setLoginUser] = useState({
    email: "",
    password: "",
  });

  const checkLoginUser = async () => {
    if (!loginUser.email || !loginUser.password) {
      toast.error("Please fill all fields");
      return;
    }

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/login`,
        loginUser,
      );

      if(res.data.status == true) {
        localStorage.setItem("user", JSON.stringify(res.data));
        console.log(res.data);
        localStorage.setItem("token", res.data.jwtToken);
        toast.success("Login Successful...");
        navigate("/");
        setLoginUser({ email: "", password: "" });
      }
    } catch (err) {
      console.error(err);
      toast.error("Invalid email or password");
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <Navbar />

      <div className="mt-10 text-center">
        <h1 className="text-4xl font-bold text-[#0F172A]">Welcome Back</h1>
        <p className="text-sm text-gray-500 mt-1">
          Login to continue your journey
        </p>
      </div>

      <div className="flex flex-col gap-4 w-[90%] md:w-[420px] border border-[#CBD5E1] rounded-xl shadow-xl mx-auto mt-10 p-6 bg-white">
        <Input
          type="email"
          placeholder="Enter your email"
          value={loginUser.email}
          onChange={(e) =>
            setLoginUser({ ...loginUser, email: e.target.value })
          }
        />

        <Input
          type="password"
          placeholder="Enter your password"
          value={loginUser.password}
          onChange={(e) =>
            setLoginUser({
              ...loginUser,
              password: e.target.value,
            })
          }
        />

        <Button
          title={"Login"}
          onClick={checkLoginUser}
        />

        <Link to="/signup" className="text-blue-700 text-center">
          Don't have an account? Sign Up
        </Link>
      </div>

      <Toaster />
    </div>
  );
}

export default Login;
