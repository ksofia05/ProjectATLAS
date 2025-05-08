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

const Homepage = () => {

  const [tasks, setTasks] = useState([])

  useEffect(() => {
    async function fetchTasks() {
        const res = await getTasks()
        console.log(res)
        setTasks(res.data)
    }

    fetchTasks();
  }, []);

  return (
    <>
    {/* <div>
      {tasks.map(task => (
        <div key={task.id}>
          <h1>{task.title}</h1>
          <p>{task.description}</p>
        </div>
      ))}
    </div>
    <h1 className='text-white'>hola</h1> */}
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