import React from "react";
import { useEffect, useState } from "react";
import { getTasks } from "../../api/tasks.api";
import { getUsuario } from "../../api/usuario.api";
import Navbar from "../../components/home/navbar";
import Header from "../../components/home/header";
import OrganizerSection from "../../components/home/organizerSection";
import WorkSection from "../../components/home/workSection";
import AddSection from "../../components/home/addSection";
import DownlandSection from "../../components/home/downlandSection";
import TestimoniosSection from "../../components/home/testimoniosSection";
import Footer from "../../components/home/footer";

const Homepage = () => {
  const [tasks, setTasks] = useState([]);
  const [usuario, setUsuario] = useState([]);
  useEffect(() => {
    async function fetchTasks() {
      const res = await getTasks();
      console.log(res);
      setTasks(res.data);
    }
    async function fetchUsuarios() {
      const res = await getUsuario();
      console.log(res);
      setUsuario(res.data);
    }
    fetchTasks();
    fetchUsuarios();
  }, []);

  return (
    <>
      {/* <div>
        {usuario.map((usuario) => (
          <div className="text-white" key={usuario.id}>
            <h1>{usuario.nombre}</h1>
            <p>{usuario.apellido}</p>
          </div>
        ))}
      </div>
      <h1 className="text-white">hola</h1> */}
      <Navbar />
      <Header />
      <OrganizerSection />
      <WorkSection />
      <AddSection />
      <DownlandSection />
      <TestimoniosSection />
      <Footer />
    </>
  );
};

export default Homepage;
