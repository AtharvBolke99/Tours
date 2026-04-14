import React from "react";
import { Link } from "react-router";

function Navbar() {
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/login";
  };

  return (
    <nav className="bg-gradient-to-r from-purple-500 to-blue-600 shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-orange-400 to-red-500 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-md">
              T
            </div>
            <span className="text-white text-xl font-bold tracking-wide">
              TineyTours
            </span>
          </div>

          <div className="flex items-center space-x-4">
            {token ? (
              <>
                <Link to="/addtour">
                  <button className="bg-white text-[#0F172A] font-semibold py-2 px-5 rounded-lg transition duration-300 transform hover:scale-105 shadow-md">
                    Add Tour
                  </button>
                </Link>
                <Link to="/mytours">
                  <button className="bg-white text-[#0F172A] font-semibold py-2 px-5 rounded-lg transition duration-300 transform hover:scale-105 shadow-md">
                    Manage Tours
                  </button>
                </Link>
                <Link to="/uploaded-tours">
                  <button className="bg-white text-[#0F172A] font-semibold py-2 px-5 rounded-lg transition duration-300 transform hover:scale-105 shadow-md">
                    Uploaded Tours
                  </button>
                </Link>
                <button
                  onClick={handleLogout}
                  className="bg-gradient-to-r from-teal-400 to-green-500 hover:from-teal-500 hover:to-green-600 text-white font-semibold py-2 px-6 rounded-lg transition duration-300 transform hover:scale-105 shadow-md"
                >
                  Logout
                </button>
              </>
            ) : (
              <Link to="/login">
                <button className="bg-gradient-to-r from-teal-400 to-green-500 hover:from-teal-500 hover:to-green-600 text-white font-semibold py-2 px-6 rounded-lg transition duration-300 transform hover:scale-105 shadow-md">
                  Login
                </button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
