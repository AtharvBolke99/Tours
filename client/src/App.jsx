import React from "react";
import "./App.css";
import Home from "./views/Home.jsx";
import TourForm from "./views/TourForm.jsx";
import MyTours from "./views/MyTours.jsx";
import { Routes, Route, BrowserRouter } from "react-router";
import Login from "./views/Login.jsx";
import Signup from "./views/Signup.jsx";
import { Toaster } from "react-hot-toast";
import Mytours from "./views/MyTours.jsx";

function App() {
  return (
    <div>
      <Toaster />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/addtour" element={<TourForm />} />
          <Route path="/edittour/:id" element={<TourForm />} />
          <Route path="/mytours" element={<Mytours />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
