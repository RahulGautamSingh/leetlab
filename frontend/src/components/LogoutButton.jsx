import React from "react";
import { useAuthStore } from "../store/useAuthStore";

export default function LogoutButton({ children }) {
  const { logout } = useAuthStore();

  const onLogout = async () => {
    try {
      logout();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <button className="btn btn-primary" onClick={onLogout}>
      {children}
    </button>
  );
}
