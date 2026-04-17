import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router";
import Navbar from "../components/Navbar";
import Button from "../components/Button";
import Input from "../components/Input";
import PhotoPreview from "../components/PhotoPreview";
import toast, { Toaster } from "react-hot-toast";
import {
  ImageKitAbortError,
  ImageKitInvalidRequestError,
  ImageKitServerError,
  ImageKitUploadNetworkError,
  upload,
} from "@imagekit/react";

function TourForm() {
  const navigate = useNavigate();
  const { id } = useParams(); // For edit mode
  const fileInputRef = useRef(null);
  const isEditMode = !!id;

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
  const [initialLoading, setInitialLoading] = useState(isEditMode);

  useEffect(() => {
    if (isEditMode) {
      fetchTour();
    }
  }, [id]);

  const fetchTour = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Please login to edit tour.");
      navigate("/login");
      return;
    }

    try {
      const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/tours`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data.status) {
        const tourData = response.data.data.find(t => t._id === id);
        if (tourData) {
          setTour({
            title: tourData.title,
            description: tourData.description,
            city: tourData.city,
            startDate: tourData.startDate ? new Date(tourData.startDate).toISOString().split('T')[0] : "",
            endDate: tourData.endDate ? new Date(tourData.endDate).toISOString().split('T')[0] : "",
          });
          setPhotos(tourData.photos || []);
        } else {
          toast.error("Tour not found");
          navigate("/my-tours");
        }
      } else {
        toast.error(response.data.message || "Unable to fetch tour");
        navigate("/my-tours");
      }
    } catch (error) {
      console.error("Fetch tour error:", error);
      toast.error("Unable to load tour. Please try again.");
      navigate("/my-tours");
    } finally {
      setInitialLoading(false);
    }
  };

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
      toast.error("Authentication failed. Please try again.");
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
        toast.error("Upload was aborted.");
      } else if (error instanceof ImageKitInvalidRequestError) {
        console.error("Invalid request:", error.message);
        toast.error("Invalid upload request. Please check your file.");
      } else if (error instanceof ImageKitUploadNetworkError) {
        console.error("Network error:", error.message);
        toast.error("Network error during upload. Please try again.");
      } else if (error instanceof ImageKitServerError) {
        console.error("Server error:", error.message);
        toast.error("Server error during upload. Please try again later.");
      } else {
        console.error("Upload error:", error);
        toast.error("Failed to upload image. Please try again.");
      }
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

  const removePreview = () => {
    setSelectedFile(null);
    setPreviewUrl("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const saveTour = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Please login before saving a tour.");
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
      const url = isEditMode
        ? `${import.meta.env.VITE_API_BASE_URL}/tours/${id}`
        : `${import.meta.env.VITE_API_BASE_URL}/tours`;
      const method = isEditMode ? 'put' : 'post';

      const response = await axios[method](
        url,
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
        toast.success(response.data.message || `Tour ${isEditMode ? 'updated' : 'created'} successfully`);
        if (!isEditMode) {
          setTour({
            title: "",
            description: "",
            city: "",
            startDate: "",
            endDate: "",
          });
          setPhotos([]);
        }
        setProgress(0);
        navigate("/mytours");
      } else {
        toast.error(response.data.message || `Unable to ${isEditMode ? 'update' : 'create'} tour.`);
      }
    } catch (error) {
      console.error(`${isEditMode ? 'Update' : 'Create'} tour error:`, error);
      toast.error(`Unable to ${isEditMode ? 'update' : 'create'} tour. Please try again.`);
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) {
    return (
      <div className="min-h-screen page-bg transition-colors duration-300">
        <Navbar />
        <div className="max-w-3xl mx-auto mt-10 p-6">
          <div className="text-center text-muted">Loading tour...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen page-bg transition-colors duration-300">
      <Navbar />
      <div className="max-w-3xl mx-auto mt-10 p-6 surface rounded-3xl shadow-xl border border-surface">
        <h1 className="text-3xl font-bold text-primary mb-4">
          {isEditMode ? "Edit Tour" : "Add New Tour"}
        </h1>

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
              className="input-field rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
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
            <label className="text-sm font-medium text-primary">
              Upload Tour Images
            </label>
            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              onChange={handleFileChange}
              className="input-field rounded-xl p-2"
            />
            <PhotoPreview
              previewUrl={previewUrl}
              onRemove={removePreview}
            />
            <div className="flex gap-3 items-center">
              <Button
                title="Upload Image"
                onClick={handleUpload}
                variant="primary"
              />
              <span className="text-sm text-muted">
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
                    className="w-full h-32 object-cover rounded-2xl border border-surface"
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
              title={loading ? "Saving..." : (isEditMode ? "Update Tour" : "Create Tour")}
              onClick={saveTour}
              variant="primary"
            />
            <Button
              title="Back to My Tours"
              onClick={() => navigate("/my-tours")}
              variant="secondary"
            />
          </div>
        </div>
      </div>
      <Toaster position="top-center" />
    </div>
  );
}

export default TourForm;