"use client";

import { logout } from "../../(auth)/actions";
import { LogOut } from "lucide-react";
import { motion } from "framer-motion";

export default function LogoutButton({ showLabel = true }: { showLabel?: boolean }) {
  return (
    <button
      onClick={() => logout()}
      style={{
        display: "flex",
        alignItems: "center",
        gap: "12px",
        padding: showLabel ? "10px 16px" : "10px 0",
        justifyContent: showLabel ? "flex-start" : "center",
        borderRadius: "12px",
        fontFamily: "'Montserrat', sans-serif",
        fontSize: "14px",
        fontWeight: 500,
        color: "rgba(255, 255, 255, 0.6)",
        cursor: "pointer",
        border: "none",
        background: "none",
        width: "100%",
        textAlign: "left",
        transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
      }}
      className="nav-link-logout"
    >
      <LogOut size={20} style={{ flexShrink: 0 }} />
      {showLabel && (
        <motion.span 
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }}
          style={{ whiteSpace: "nowrap" }}
        >
          Logout
        </motion.span>
      )}
      <style>{`
        .nav-link-logout:hover {
          background: rgba(245, 166, 35, 0.1) !important;
          color: var(--secondary) !important;
        }
      `}</style>
    </button>
  );
}

