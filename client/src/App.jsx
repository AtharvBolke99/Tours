import React from "react";
import "./App.css";
import Home from "./views/Home.jsx";
import AddTour from "./views/AddTour.jsx";
import MyTours from "./views/MyTours.jsx";
import { Routes, Route, BrowserRouter } from "react-router";
import Login from "./views/Login.jsx";
import Signup from "./views/Signup.jsx";
import { Toaster } from "react-hot-toast";

function App() {
  return (
    <div>
      <Toaster />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/addtour" element={<AddTour />} />
          <Route path="/mytours" element={<MyTours />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
