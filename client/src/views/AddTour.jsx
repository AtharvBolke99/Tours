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
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [progress, setProgress] = useState(0);
  const [loading, setLoading] = useState(false);

  const authenticator = async () => {
    try {
      const response = await fetch(`http://localhost:8000/auth`);
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
          `Request failed with status ${response.status}: ${errorText}`,
        );
      }
      const data = await response.json();
      const { signature, expire, token, publicKey } = data;
      return { signature, expire, token, publicKey };
    } catch (error) {
      console.error("Authentication error:", error);
      throw new Error("Authentication request failed");
    }
  };
  const handleUpload = async () => {
    if (!selectedFile) {
      toast.error("Please select an image to upload.");
      return;
    }

    let authParams;
    try {
      authParams = await authenticator();
    } catch (authError) {
      console.error("Failed to authenticate for upload:", authError);
      return;
    }

    const { signature, expire, token, publicKey } = authParams;
    try {
      const uploadResponse = await upload({
        expire,
        token,
        signature,
        publicKey,
        file: selectedFile,
        fileName: selectedFile.name,
        onProgress: (event) => {
          setProgress(Math.round((event.loaded / event.total) * 100));
        },
      });

      setPhotos((prev) => [...prev, uploadResponse.url]);
      setSelectedFile(null);
      setPreviewUrl("");
      setProgress(0);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      toast.success("Image uploaded successfully.");
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

  const handleFileChange = (event) => {
    const file = event.target.files?.[0] || null;
    setSelectedFile(file);
    if (file) {
      setPreviewUrl(URL.createObjectURL(file));
    } else {
      setPreviewUrl("");
    }
  };

  const removePhoto = (index) => {
    setPhotos((prev) => prev.filter((_, idx) => idx !== index));
  };
  const createTour = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Please login before adding a tour.");
      navigate("/login");
      return;
    }

    if (
      !tour.title ||
      !tour.description ||
      !tour.city ||
      !tour.startDate ||
      !tour.endDate
    ) {
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
        setTour({
          title: "",
          description: "",
          city: "",
          startDate: "",
          endDate: "",
        });
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
            <label className="text-sm font-medium text-[#0F172A]">
              Upload Tour Images
            </label>
            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              onChange={handleFileChange}
              className="border border-[#CBD5E1] rounded-xl p-2"
            />
            {previewUrl && (
              <div className="relative mt-3 w-full sm:w-64 rounded-2xl overflow-hidden border border-[#CBD5E1]">
                <img
                  src={previewUrl}
                  alt="Selected upload preview"
                  className="w-full h-40 object-cover"
                />
                <button
                  type="button"
                  onClick={() => {
                    setSelectedFile(null);
                    setPreviewUrl("");
                    if (fileInputRef.current) fileInputRef.current.value = "";
                  }}
                  className="absolute top-2 right-2 bg-black/70 text-white rounded-full px-3 py-1 text-xs"
                >
                  Remove
                </button>
              </div>
            )}
            <div className="flex gap-3 items-center">
              <Button
                title="Upload Image"
                onClick={handleUpload}
                variant="primary"
              />
              <span className="text-sm text-gray-500">
                {progress > 0
                  ? `Upload progress: ${progress}%`
                  : "No upload yet"}
              </span>
            </div>
          </div>

          {photos.length > 0 && (
            <div className="grid gap-3 sm:grid-cols-3">
              {photos.map((photo, index) => (
                <div key={index} className="relative group">
                  <img
                    src={photo}
                    alt={`Tour upload ${index + 1}`}
                    className="w-full h-32 object-cover rounded-2xl border border-[#CBD5E1]"
                  />
                  <button
                    type="button"
                    onClick={() => removePhoto(index)}
                    className="absolute top-2 right-2 bg-white/90 text-[#EF4444] px-2 py-1 rounded-full text-xs opacity-0 group-hover:opacity-100 transition"
                  >
                    Delete
                  </button>
                </div>
              ))}
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-3">
            <Button
              title={loading ? "Saving..." : "Create Tour"}
              onClick={createTour}
              variant="primary"
            />
            <Button
              title="Back to Home"
              onClick={() => navigate("/")}
              variant="secondary"
            />
          </div>
        </div>
      </div>
      <Toaster position="top-center" />
    </div>
  );
}

export default AddTour;
