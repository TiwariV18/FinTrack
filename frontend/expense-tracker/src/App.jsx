import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import Login from "./pages/Auth/Login";
import SignUp from "./pages/Auth/SignUp";
import Dashboard from "./pages/Dashboard/Dashboard";
import Expense from "./pages/Dashboard/Expense";
import Income from "./pages/Dashboard/Income";
import ProtectedRoute from "./components/Inputs/ProtectedRoute";
import Settings from "./pages/Dashboard/Settings";

const App = () => {
  const token = localStorage.getItem("token");
  if (token === "undefined" || token === "null") localStorage.removeItem("token");

  return (
    <Routes>

      <Route path="/" element={<Navigate to="/login" replace />} />

     
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<SignUp />} />

      
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/expenses"
        element={
          <ProtectedRoute>
            <Expense />
          </ProtectedRoute>
        }
      />

      <Route
        path="/income"
        element={
          <ProtectedRoute>
            <Income />
          </ProtectedRoute>
        }
      />

      <Route
        path="/settings"
        element={
          <ProtectedRoute>
            <Settings />
          </ProtectedRoute>
        }
      />

      
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
};

export default App;
