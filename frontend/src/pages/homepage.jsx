import React from 'react'
import { useEffect, useState } from 'react' 
import Header from '../components/componentsHome/header'
import OrganizerSection from '../components/componentsHome/organizerSection'
import WorkSection from '../components/componentsHome/workSection'
import AddSection from '../components/componentsHome/addSection'
import DownlandSection from '../components/componentsHome/downlandSection'
import TestimoniosSection from '../components/componentsHome/testimoniosSection'
import Footer from '../components/componentsHome/footer'
import { getTasks } from '../api/tasks.api'
import { getUsuario } from '../api/usuario.api'

const Homepage = () => {

  const [tasks, setTasks] = useState([])
  const [usuario, setUsuario] = useState([])
  useEffect(() => {
    async function fetchTasks() {
        const res = await getTasks()
        console.log(res)
        setTasks(res.data)
    }
    async function fetchUsuarios(){
      const res=await getUsuario()
      console.log(res)
      setUsuario(res.data)
    }
    fetchTasks();
    fetchUsuarios();
  }, []);


  return (
    <>
    <div>
      {usuario.map(usuario => (
        <div className='text-white' key={usuario.id}>
          <h1>{usuario.nombre}</h1>
          <p>{usuario.apellido}</p>
        </div>
      ))}
    </div>
    <h1 className='text-white'>hola</h1>
      <Header />
      <OrganizerSection />
      <WorkSection />
      <AddSection />
      <DownlandSection />
      <TestimoniosSection />
      <Footer />
    </>
  ) 
}

export default Homepage;