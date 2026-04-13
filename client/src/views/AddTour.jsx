import React, { useState, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router";
import Navbar from "../components/Navbar";
import Button from "../components/Button";
import Input from "../components/Input";
import toast, { Toaster } from "react-hot-toast";
import {
  ImageKitAbortError,
  ImageKitInvalidRequestError,
  ImageKitServerError,
  ImageKitUploadNetworkError,
  upload,
} from "@imagekit/react";

function AddTour() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [tour, setTour] = useState({
    title: "",
    description: "",
    city: "",
    startDate: "",
    endDate: "",
  });
  const [photos, setPhotos] = useState([]);
  const [progress, setProgress] = useState(0);
  const [loading, setLoading] = useState(false);

  const authenticator = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/auth`);
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Request failed with status ${response.status}: ${errorText}`);
      }
      const data = await response.json();
      if (!data.signature || !data.expire || !data.token || !data.publicKey) {
        throw new Error("Invalid auth response from server");
      }

      return {
        signature: data.signature,
        token: data.token,
        publicKey: data.publicKey,
        expire: Number(data.expire),
      };
    } catch (error) {
      console.error("Authentication error:", error);
      throw new Error("Image upload authentication failed.");
    }
  };

  const handleUpload = async () => {
    const fileInput = fileInputRef.current;
    if (!fileInput || !fileInput.files || fileInput.files.length === 0) {
      toast.error("Please select an image before uploading.");
      return;
    }

    const file = fileInput.files[0];
    setProgress(0);

    try {
      const { signature, token, publicKey, expire } = await authenticator();
      const uploadResponse = await upload({
        file,
        fileName: file.name,
        publicKey,
        signature,
        token,
        expire,
        onProgress: (event) => {
          setProgress(Math.round((event.loaded / event.total) * 100));
        },
      });

      setPhotos((prev) => [...prev, uploadResponse.url]);
      toast.success("Image uploaded successfully.");
      fileInput.value = "";
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
      toast.error("Failed to upload image.");
    }
  };

  const createTour = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Please login before adding a tour.");
      navigate("/login");
      return;
    }

    if (!tour.title || !tour.description || !tour.city || !tour.startDate || !tour.endDate) {
      toast.error("Please fill in all required tour fields.");
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/tours`,
        {
          ...tour,
          photos,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (response.data.status) {
        toast.success(response.data.message || "Tour created successfully");
        setTour({ title: "", description: "", city: "", startDate: "", endDate: "" });
        setPhotos([]);
        setProgress(0);
        navigate("/");
      } else {
        toast.error(response.data.message || "Unable to create tour.");
      }
    } catch (error) {
      console.error("Add tour error:", error);
      toast.error("Unable to create tour. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <Navbar />
      <div className="max-w-3xl mx-auto mt-10 p-6 bg-white rounded-3xl shadow-xl border border-[#CBD5E1]">
        <h1 className="text-3xl font-bold text-[#0F172A] mb-4">Add New Tour</h1>

        <div className="grid gap-4">
          <Input
            type="text"
            placeholder="Tour Title"
            value={tour.title}
            onChange={(e) => setTour({ ...tour, title: e.target.value })}
          />

          <textarea
            rows="5"
            placeholder="Tour Description"
            value={tour.description}
            onChange={(e) => setTour({ ...tour, description: e.target.value })}
            className="border border-[#CBD5E1] rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
          />

          <Input
            type="text"
            placeholder="City"
            value={tour.city}
            onChange={(e) => setTour({ ...tour, city: e.target.value })}
          />

          <div className="grid md:grid-cols-2 gap-4">
            <Input
              type="date"
              placeholder="Start Date"
              value={tour.startDate}
              onChange={(e) => setTour({ ...tour, startDate: e.target.value })}
            />
            <Input
              type="date"
              placeholder="End Date"
              value={tour.endDate}
              onChange={(e) => setTour({ ...tour, endDate: e.target.value })}
            />
          </div>

          <div className="grid gap-2">
            <label className="text-sm font-medium text-[#0F172A]">Upload Tour Images</label>
            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              className="border border-[#CBD5E1] rounded-xl p-2"
            />
            <div className="flex gap-3 items-center">
              <Button title="Upload Image" onClick={handleUpload} variant="primary" />
              <span className="text-sm text-gray-500">{progress > 0 ? `Upload progress: ${progress}%` : "No upload yet"}</span>
            </div>
          </div>

          {photos.length > 0 && (
            <div className="grid gap-3 sm:grid-cols-3">
              {photos.map((photo, index) => (
                <img
                  key={index}
                  src={photo}
                  alt={`Tour upload ${index + 1}`}
                  className="w-full h-32 object-cover rounded-2xl border border-[#CBD5E1]"
                />
              ))}
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-3">
            <Button
              title={loading ? "Saving..." : "Create Tour"}
              onClick={createTour}
              variant="primary"
            />
            <Button title="Back to Home" onClick={() => navigate("/")} variant="secondary" />
          </div>
        </div>
      </div>
      <Toaster position="top-center" />
    </div>
  );
}

export default AddTour;
