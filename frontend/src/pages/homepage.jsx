import Navbar from '../components/navbar/navbar'
import React from 'react'
import Header from '../components/componentsHome/header'
import OrganizerSection from '../components/componentsHome/organizerSection'
import WorkSection from '../components/componentsHome/workSection'
import AddSection from '../components/componentsHome/addSection'
import DownlandSection from '../components/componentsHome/downlandSection'
import TestimoniosSection from '../components/componentsHome/testimoniosSection'
import Footer from '../components/componentsHome/footer'

const homepage = () => {
  return (
    <>
    <Navbar />
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

export default homepage
