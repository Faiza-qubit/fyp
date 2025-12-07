import React from "react";

// Single key element
function Kbd({ className = "", ...props }) {
  const style = {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "0.25rem",
    minWidth: "1.25rem",
    height: "1.25rem",
    padding: "0 0.25rem",
    fontFamily: "sans-serif",
    fontSize: "0.75rem",
    fontWeight: 500,
    backgroundColor: "#e5e5e5", // light gray
    color: "#333",
    borderRadius: "0.125rem",
    pointerEvents: "none",
    userSelect: "none",
  };

  return <kbd style={style} {...props} className={className} />;
}

// Group of keys
function KbdGroup({ className = "", ...props }) {
  const style = {
    display: "inline-flex",
    alignItems: "center",
    gap: "0.25rem",
  };

  return <div style={style} {...props} className={className} />;
}

export { Kbd, KbdGroup };
