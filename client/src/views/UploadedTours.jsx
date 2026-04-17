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
    <div className="min-h-screen page-bg transition-colors duration-300">
      <Navbar />
      <div className="max-w-6xl mx-auto mt-10 px-4 sm:px-6 lg:px-8">
        <div className="surface rounded-3xl shadow-xl border border-surface p-6">
          <h1 className="text-3xl font-bold text-primary mb-4">All Uploaded Tours</h1>
          <p className="text-sm text-muted mb-6">
            This page shows all tours uploaded by users on the platform.
            These tours are read-only and cannot be edited.
          </p>

          {loading && <p className="text-muted">Loading tours...</p>}

          {!loading && tours.length === 0 && (
            <p className="text-muted">No tours have been uploaded yet.</p>
          )}

          {!loading && tours.length > 0 && (
            <div className="grid gap-6">
              {tours.map((tour) => (
                <div key={tour._id} className="border border-surface rounded-3xl p-5 surface">
                  <h2 className="text-2xl font-semibold text-primary">{tour.title}</h2>
                  <p className="text-muted mt-2">{tour.description}</p>
                  <p className="mt-2 text-sm text-primary">
                    <span className="font-semibold">Uploaded by:</span> {tour.user?.name || "Unknown"}
                  </p>
                  <p className="mt-2 text-sm text-primary">
                    <span className="font-semibold">City:</span> {tour.city || "Unknown"}
                  </p>
                  <p className="mt-3 text-sm text-primary">
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
                          className="w-full sm:w-48 h-32 object-cover rounded-2xl border border-surface"
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
