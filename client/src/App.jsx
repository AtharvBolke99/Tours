import React from "react";
import "./App.css";
import Home from "./views/Home.jsx";
import TourForm from "./views/TourForm.jsx";
import MyTours from "./views/MyTours.jsx";
import UploadedTours from "./views/UploadedTours.jsx";
import { Routes, Route, BrowserRouter } from "react-router";
import Login from "./views/Login.jsx";
import Signup from "./views/Signup.jsx";
import { Toaster } from "react-hot-toast";
import { ThemeProvider } from "./ThemeContext.jsx";

function App() {
  return (
    <ThemeProvider>
      <div className="min-h-screen page-bg transition-colors duration-300">
        <Toaster />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/addtour" element={<TourForm />} />
            <Route path="/edittour/:id" element={<TourForm />} />
            <Route path="/mytours" element={<MyTours />} />
            <Route path="/uploaded-tours" element={<UploadedTours />} />
          </Routes>
        </BrowserRouter>
      </div>
    </ThemeProvider>
  );
}

export default App;
