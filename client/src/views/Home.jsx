import React from "react";
import Navbar from "../components/Navbar";
import Button from "../components/Button";
import { useNavigate } from "react-router";

function Home() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F8FAFC] to-[#E2E8F0]">
      <Navbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <h1 className="text-5xl md:text-6xl font-bold text-[#0F172A] mb-6 leading-tight">
              Discover Your Next
              <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent"> Adventure</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Plan, organize, and cherish your travel memories with TineyTours.
              Create unforgettable journeys and share your stories with the world.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {token ? (
                <>
                  <Button
                    title="My Tours"
                    onClick={() => navigate("/mytours")}
                    variant="primary"
                  />
                  <Button
                    title="Add New Tour"
                    onClick={() => navigate("/addtour")}
                    variant="secondary"
                  />
                </>
              ) : (
                <>
                  <Button
                    title="Get Started"
                    onClick={() => navigate("/login")}
                    variant="primary"
                  />
                  <Button
                    title="Learn More"
                    onClick={() => document.getElementById('features').scrollIntoView({ behavior: 'smooth' })}
                    variant="secondary"
                  />
                </>
              )}
            </div>
          </div>
        </div>

        {/* Decorative Elements */}
        <div className="absolute top-10 left-10 w-20 h-20 bg-purple-200 rounded-full opacity-20 animate-pulse"></div>
        <div className="absolute bottom-10 right-10 w-32 h-32 bg-blue-200 rounded-full opacity-20 animate-pulse"></div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-[#0F172A] mb-4">Why Choose TineyTours?</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Experience the ultimate travel planning platform designed for adventurers like you.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-gradient-to-br from-purple-50 to-blue-50 p-8 rounded-3xl shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-blue-500 rounded-2xl flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <h3 className="text-2xl font-semibold text-[#0F172A] mb-4">Plan Your Journeys</h3>
              <p className="text-gray-600">
                Easily organize your travel itineraries with our intuitive tour creation tools.
                Add destinations, dates, and descriptions to plan the perfect trip.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-gradient-to-br from-blue-50 to-purple-50 p-8 rounded-3xl shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-2xl font-semibold text-[#0F172A] mb-4">Capture Memories</h3>
              <p className="text-gray-600">
                Upload and organize your travel photos directly in your tours.
                Keep all your memories in one beautiful, organized place.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-gradient-to-br from-purple-50 to-blue-50 p-8 rounded-3xl shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-blue-500 rounded-2xl flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-2xl font-semibold text-[#0F172A] mb-4">Share Your Stories</h3>
              <p className="text-gray-600">
                Connect with fellow travelers and share your adventures.
                Build a community of explorers and inspire others.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="py-20 bg-gradient-to-r from-purple-600 to-blue-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-white mb-6">Ready to Start Your Journey?</h2>
          <p className="text-xl text-purple-100 mb-8">
            Join thousands of travelers who trust TineyTours to plan their perfect adventures.
          </p>
          {!token && (
            <Button
              title="Join Now - It's Free"
              onClick={() => navigate("/signup")}
              variant="secondary"
            />
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#0F172A] text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-gradient-to-r from-orange-400 to-red-500 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-md">
                T
              </div>
              <span className="text-white text-xl font-bold tracking-wide">TineyTours</span>
            </div>
            <p className="text-gray-400 mb-4">© 2026 TineyTours. All rights reserved.</p>
            <p className="text-sm text-gray-500">Made with ❤️ for travelers worldwide</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Home;
