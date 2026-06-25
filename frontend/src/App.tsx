import React from "react";
import { Routes, Route } from "react-router-dom";
import Graphs from "./pages/admin/Graphs";
import ChartsPage from "./pages/admin/ChartsPage"; // ✅ Correct import (from admin folder)
import LandingPage from "./pages/LandingPage";
import AuthCard from "./components/auth/AuthCard";
import StudentDashboard from "./pages/student/StudentDashboard";
import AdminDashboard from "./pages/admin/AdminDashboard";

const App: React.FC = () => (
  <Routes>
    {/* 🌐 Public Routes */}
    <Route path="/" element={<LandingPage />} />
    <Route path="/signin" element={<AuthCard mode="signin" />} />
    <Route path="/sign-in" element={<AuthCard mode="signin" />} />
    <Route path="/signup" element={<AuthCard mode="signup" />} />
    <Route path="/sign-up" element={<AuthCard mode="signup" />} />

    {/* 🎓 Student Dashboard */}
    <Route path="/student-dashboard" element={<StudentDashboard />} />

    {/* 🧑‍💼 Admin Dashboard */}
    <Route path="/admin-dashboard" element={<AdminDashboard />} />
    <Route path="/dashboard" element={<AdminDashboard />} />

    {/* 📊 Charts & Graphs Pages */}
    <Route path="/admin/charts" element={<ChartsPage />} />  {/* ✅ added */}
    <Route path="/admin/graphs" element={<Graphs />} />      {/* ✅ already exists */}
  </Routes>
);

export default App;
