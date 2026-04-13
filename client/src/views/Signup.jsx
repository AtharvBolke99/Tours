import React, { useEffect, useState, useRef } from "react";
import Input from "../components/Input";
import Button from "../components/Button";
import toast, { Toaster } from "react-hot-toast";
import axios from "axios";
import { Link, useNavigate } from "react-router"; // ✅ as per your requirement
import { SetPageTitle } from "/Utils.jsx";
import Navbar from "../components/Navbar";
import {
  ImageKitAbortError,
  ImageKitInvalidRequestError,
  ImageKitServerError,
  ImageKitUploadNetworkError,
  upload,
} from "@imagekit/react";

function SignUp() {
  useEffect(() => {
    SetPageTitle({ title: "SignUp" });
  }, []);

  const navigate = useNavigate();

  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    mobile: "",
    city: "",
    country: "",
    password: "",
    profilePhoto: "",
  });

  const [progress, setProgress] = useState(0);
  const fileInputRef = useRef();

  // ✅ AUTH FUNCTION
  const authenticator = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/auth`);

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
          `Request failed with status ${response.status}: ${errorText}`,
        );
      }

      const data = await response.json();

      return {
        signature: data.signature,
        token: data.token,
        publicKey: data.publicKey,
        expire: Number(data.expire), // ✅ IMPORTANT FIX
      };
    } catch (error) {
      console.error("Authentication error:", error);
      throw new Error("Authentication request failed");
    }
  };

  // ✅ HANDLE UPLOAD (NOW IN CORRECT SCOPE)
  const handleUpload = async () => {
    const fileInput = fileInputRef.current;

    if (!fileInput || !fileInput.files.length) {
      alert("Please select a file");
      return;
    }

    const file = fileInput.files[0];

    try {
      const { signature, expire, token, publicKey } = await authenticator();

      const res = await upload({
        file,
        fileName: file.name,
        publicKey,
        signature,
        token,
        expire,
        onProgress: (event) => {
          setProgress((event.loaded / event.total) * 100);
        },
      });

      console.log("Upload success:", res);

      // ✅ store image URL
      setNewUser((prev) => ({
        ...prev,
        profilePhoto: res.url,
      }));
    } catch (error) {
      if (error instanceof ImageKitAbortError) {
        console.error("Upload aborted:", error.reason);
      } else if (error instanceof ImageKitInvalidRequestError) {
        console.error("Invalid request:", error.message);
      } else if (error instanceof ImageKitUploadNetworkError) {
        console.error("Network error:", error.message);
      } else if (error instanceof ImageKitServerError) {
        console.error("Server error:", error.message);
      } else {
        console.error("Upload error:", error);
      }
    }
  };

  const createUser = async () => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/signUp`,
        newUser,
      );
      if (response.data.status == true) {
        navigate("/login");
        toast.success("Account Created Successfully");

        setNewUser({
          name: "",
          email: "",
          password: "",
          mobile: "",
          city: "",
          country: "",
          profilePhoto: "",
        });
      } else {
        toast.error(response.data.message || "Signup failed");
      }
    } catch (e) {
      toast.error("please check the details you have entered");
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <Navbar />

      <div className="flex flex-col gap-3 w-[90%] border border-2 border-[#CBD5E1] rounded-xl m-5 shadow-2xl justify-center items-center mx-auto md:p-8 p-5">
        <h1 className="text-[#0F172A] my-2 text-2xl font-bold">
          Create Account
        </h1>

        {/* NAME + EMAIL */}
        <div className="flex md:flex-row flex-col w-full gap-3">
          <Input
            type="text"
            placeholder="Enter Your Name"
            value={newUser.name}
            onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
          />

          <Input
            type="email"
            placeholder="Enter Your Email"
            value={newUser.email}
            onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
          />
        </div>

        {/* MOBILE + CITY */}
        <div className="flex md:flex-row flex-col w-full gap-3">
          <Input
            type="number"
            placeholder="Enter Your Mobile"
            value={newUser.mobile}
            onChange={(e) => setNewUser({ ...newUser, mobile: e.target.value })}
          />

          <Input
            type="text"
            placeholder="Enter Your City"
            value={newUser.city}
            onChange={(e) => setNewUser({ ...newUser, city: e.target.value })}
          />
        </div>

        {/* COUNTRY + PASSWORD */}
        <div className="flex md:flex-row flex-col w-full gap-3">
          <Input
            type="text"
            placeholder="Enter Country"
            value={newUser.country}
            onChange={(e) =>
              setNewUser({ ...newUser, country: e.target.value })
            }
          />

          <Input
            type="password"
            placeholder="Enter Password"
            value={newUser.password}
            onChange={(e) =>
              setNewUser({ ...newUser, password: e.target.value })
            }
          />
        </div>

        {/* IMAGE */}
        <input
          type="file"
          ref={fileInputRef}
          className="border m-2 px-4 py-1 rounded-xl w-full"
          onChange={handleUpload}
        />

        {progress > 0 && (
          <p className="text-sm text-gray-500">Uploading: {progress}%</p>
        )}

        <Button title="Sign Up" onClick={createUser} />

        <Link to="/login" className="text-blue-900">
          Already have an Account? Login
        </Link>
      </div>

      <Toaster position="top-center" />
    </div>
  );
}

export default SignUp;
