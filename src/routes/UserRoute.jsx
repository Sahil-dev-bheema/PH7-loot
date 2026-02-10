import React from "react";
import { Navigate, useLocation } from "react-router-dom";

export default function UserRoute({ children }) {
  const location = useLocation();

  const token =
    localStorage.getItem("user_token") || localStorage.getItem("token");
  const userRaw = localStorage.getItem("user");

  const isLoggedIn = Boolean(token && userRaw);

  if (!isLoggedIn) {
    return (
      <Navigate
        to="/login"
        replace
        state={{ from: location.pathname }}
      />
    );
  }

  return children;
}
