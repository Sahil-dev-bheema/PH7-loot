import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";

export default function UserRoute({ children }) {
  const location = useLocation();

  const user = useSelector((state) => state.auth.user);
  const token = useSelector((state) => state.auth.token);

  const isLoggedIn = Boolean(token && user);

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