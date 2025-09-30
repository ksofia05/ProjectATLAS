import React from "react";

export default function ButtonGray({ className = "", ...props }) {
  return (
    <button
      className={`px-4 py-2 rounded ${className}`}
      {...props}
    />
  );
}