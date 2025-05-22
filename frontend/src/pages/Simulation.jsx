import React from "react";
import Sidebar from "../components/layout/Sidebar";
import Navbar from "../components/layout/Navbar";
import CreateProjectPanel from "../components/layout/CreateProjectPanel";

const Simulation = () => {
  const handleCreateProject = () => {
    console.log("Crear nuevo proyecto");
  };
  return (
    <div className="min-h-screen flex bg-gradient-to-b from-gray-950 to-zinc--950 ">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Navbar />
        <div className="flex-1">
          <CreateProjectPanel onCreate={handleCreateProject} />
        </div>
      </div>
    </div>
  );
};

export default Simulation;