import React from 'react'
import Hero from './Hero.jsx'
import Blogs from '../blogs/Blogs.jsx'
function Home() {
  return (
    <div className="bg-white text-primary container mx-auto mt-6 p-8">
      <Hero />
      <Blogs />
    </div>
  )
}

export default Home