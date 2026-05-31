import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";

import { logout, loginSuccess } from "./redux/features/auth/authSlice";

import { LoginPage } from "./Pages/auth/LoginPage";
import { DashboardPage } from "./Pages/dashboardPage/Dashboard";

const API_BASE_URL =
  import.meta.env.VITE_BASE_API_URL || "http://localhost:5000";

export const App = () => {
  const [checkingAuth, setCheckingAuth] = useState(true);
  const dispatch = useDispatch();

  // ✅ direct Redux access (no useAuth hook)
  const { token } = useSelector(
    (state) => state.auth
  );

  const isAuthenticated = Boolean(token);

  useEffect(() => {
    const token =
      localStorage.getItem("token") ||
      sessionStorage.getItem("token");

    const loadUser = async () => {
      if (!token) {
        setCheckingAuth(false);
        return;
      }

      try {
        const response = await axios.get(
          `${API_BASE_URL}/api/auth/user`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = response.data.data;

        dispatch(
          loginSuccess({
            user: data.user,
            token,
          })
        );
      } catch (error) {
        dispatch(logout());
      } finally {
        setCheckingAuth(false);
      }
    };

    loadUser();
  }, [dispatch]);

  if (checkingAuth) {
    return (
      <div className="h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }

  return (
    <BrowserRouter>
      <Routes>
        {/* Login */}
        <Route
          path="/login"
          element={
            isAuthenticated ? (
              <Navigate to="/dashboard" replace />
            ) : (
              <LoginPage />
            )
          }
        />

        {/* Dashboard */}
        <Route
          path="/dashboard"
          element={
            isAuthenticated ? (
              <DashboardPage />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />

        {/* Default */}
        <Route
          path="/"
          element={
            <Navigate
              to={isAuthenticated ? "/dashboard" : "/login"}
              replace
            />
          }
        />
      </Routes>
    </BrowserRouter>
  );
};

export default App;