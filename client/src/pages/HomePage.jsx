import React from 'react'
import Hero from '../components/Hero'
import FeaturedSection from '../components/FeaturedSection'
import Newsletter from '../components/NewsLetter'
import Testimonals from '../components/Testimonals'

const HomePage = () => {
  return (
    <div>
      <Hero/>
      <FeaturedSection/>
      <Testimonals/>
      <Newsletter/>
      
    </div>
  )
}

export default HomePage