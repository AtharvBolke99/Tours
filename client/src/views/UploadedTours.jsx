import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import { useNavigate } from "react-router";

function UploadedTours() {
  const navigate = useNavigate();
  const [tours, setTours] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTours = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }

      try {
        const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/all-tours`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.data.status) {
          setTours(response.data.data || []);
        } else {
          toast.error(response.data.message || "Unable to fetch uploaded tours");
        }
      } catch (error) {
        console.error("Fetch uploaded tours error:", error);
        toast.error("Unable to load uploaded tours. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchTours();
  }, [navigate]);

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <Navbar />
      <div className="max-w-6xl mx-auto mt-10 px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl shadow-xl border border-[#CBD5E1] p-6">
          <h1 className="text-3xl font-bold text-[#0F172A] mb-4">All Uploaded Tours</h1>
          <p className="text-sm text-gray-500 mb-6">
            This page shows all tours uploaded by users on the platform.
            These tours are read-only and cannot be edited.
          </p>

          {loading && <p className="text-gray-500">Loading tours...</p>}

          {!loading && tours.length === 0 && (
            <p className="text-gray-500">No tours have been uploaded yet.</p>
          )}

          {!loading && tours.length > 0 && (
            <div className="grid gap-6">
              {tours.map((tour) => (
                <div key={tour._id} className="border border-[#CBD5E1] rounded-3xl p-5 bg-[#F8FAFC]">
                  <h2 className="text-2xl font-semibold text-[#0F172A]">{tour.title}</h2>
                  <p className="text-gray-600 mt-2">{tour.description}</p>
                  <p className="mt-2 text-sm text-[#0F172A]">
                    <span className="font-semibold">Uploaded by:</span> {tour.user?.name || "Unknown"}
                  </p>
                  <p className="mt-2 text-sm text-[#0F172A]">
                    <span className="font-semibold">City:</span> {tour.city || "Unknown"}
                  </p>
                  <p className="mt-3 text-sm text-[#0F172A]">
                    <span className="font-semibold">Start:</span> {new Date(tour.startDate).toLocaleDateString()}
                    <span className="mx-2">•</span>
                    <span className="font-semibold">End:</span> {new Date(tour.endDate).toLocaleDateString()}
                  </p>
                  {tour.photos && tour.photos.length > 0 && (
                    <div className="mt-4 flex flex-wrap gap-3">
                      {tour.photos.map((photo, index) => (
                        <img
                          key={index}
                          src={photo}
                          alt={`${tour.title} ${index + 1}`}
                          className="w-full sm:w-48 h-32 object-cover rounded-2xl border border-[#CBD5E1]"
                        />
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      <Toaster position="top-center" />
    </div>
  );
}

export default UploadedTours;
