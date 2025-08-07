import React, { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import Navbar from './Components/Navbar'
import Hero from './Components/Hero'
import OfferBar from './Components/OfferBar'
import AboutTheProduct from './Components/AboutTheProduct'
import ProductGallery from './Components/ProductGallery'
import BenefitsBanner from './Components/BenefitsBanner'
import ResultsShowcase from './Components/ResultsShowcase'
import Testimonials from './Components/Testimonials'
import Checkout from './Components/Checkout'

const Home = () => {
  const location = useLocation();

  useEffect(() => {
    // Check if URL has #checkout hash
    if (location.hash === '#checkout') {
      // Find checkout section and scroll to it smoothly
      const checkoutSection = document.getElementById('checkout');
      if (checkoutSection) {
        checkoutSection.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }, [location]);

  return (
    <>
      <Navbar/>
      <Hero/>
      {/* <OfferBar/> */}
      <AboutTheProduct/>
      {/* <ProductGallery/> */}
      <BenefitsBanner/>
      <Testimonials/>
      
      <div id="checkout">
        <Checkout/>
      </div>
      
    </> 
  )
}

export default Home