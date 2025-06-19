import React from "react";

const Loader = ({ text = "Cargando..." }) => (
  <div className="flex flex-col items-center justify-center py-8">
    <div className="loader mb-4"></div>
    <span className="text-white text-lg">{text}</span>
    <style jsx="true">{`
      .loader {
        border: 4px solid #a78bfa;
        border-top: 4px solid #fff;
        border-radius: 50%;
        width: 48px;
        height: 48px;
        animation: spin 1s linear infinite;
      }
      @keyframes spin {
        0% { transform: rotate(0deg);}
        100% { transform: rotate(360deg);}
      }
    `}</style>
  </div>
);

export default Loader;