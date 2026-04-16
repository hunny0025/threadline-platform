// AuthCallback.jsx — Handles the Google OAuth redirect
// The backend redirects here with ?accessToken=...&refreshToken=...
// This page stores the tokens and redirects the user to the home page.

import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../components/AuthContext";

export function AuthCallback() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { checkAuth } = useAuth();
  const [status, setStatus] = useState("Processing login…");

  useEffect(() => {
    const accessToken = searchParams.get("accessToken");
    const refreshToken = searchParams.get("refreshToken");
    const error = searchParams.get("error");

    if (error) {
      setStatus("Login failed. Redirecting…");
      setTimeout(() => navigate("/"), 2000);
      return;
    }

    if (accessToken) {
      // Store tokens in localStorage
      localStorage.setItem("accessToken", accessToken);
      if (refreshToken) localStorage.setItem("refreshToken", refreshToken);

      // Verify the token and fetch user profile
      checkAuth();

      setStatus("Login successful! Redirecting…");
      setTimeout(() => navigate("/"), 1000);
    } else {
      setStatus("No token received. Redirecting…");
      setTimeout(() => navigate("/"), 2000);
    }
  }, [searchParams, navigate]);

  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="flex flex-col items-center gap-4">
        <div className="w-10 h-10 border-3 border-zinc-200 border-t-violet-600 rounded-full animate-spin" />
        <p className="text-sm text-zinc-500 tracking-wide">{status}</p>
      </div>
    </div>
  );
}
