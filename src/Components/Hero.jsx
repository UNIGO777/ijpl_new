import React from 'react'
import { motion } from 'framer-motion'
import heroBg from '../assets/HeroImage.png'
import { Trophy, Users, Calendar, MapPin } from 'lucide-react'

// Cricket stadium background image
const HERO_BG_IMAGE = 'https://images.unsplash.com/photo-1594470117722-de4b9a02ebed?q=80&w=3458&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'; // Cricket stadium background

const Hero = () => {
  const textVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
  }

  const formVariants = {
    initial: { opacity: 0, x: 100 },
    animate: { opacity: 1, x: 0 },
  }

  const textContainerVariants = {
    animate: {
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  }

  // Fade-in animation for the background image
  const bgFadeVariants = {
    initial: { opacity: 0 },
    animate: { opacity: 1, transition: { duration: 1.2, ease: 'easeOut' } },
  }

  return (
    <section className="relative text-white flex items-center justify-between min-h-[70vh] overflow-hidden py-12 sm:py-16 lg:py-20">
      {/* Animated Background Image */}
      <motion.div
        variants={bgFadeVariants}
        initial="initial"
        animate="animate"
        className="absolute inset-0 w-full h-full bg-black"
        style={{
          backgroundImage: `url(${HERO_BG_IMAGE})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }}
      />
      {/* Overlay */}
      <div className="absolute inset-0 bg-black opacity-60"></div>
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row justify-between items-center gap-8 lg:gap-12">
          <motion.div
            variants={textContainerVariants}
            initial="initial"
            animate="animate"
            className="w-full lg:w-3/5"
          >
            <motion.h1 
              variants={textVariants}
              className="text-4xl sm:text-5xl lg:text-7xl font-extrabold text-blue-400 mb-4 uppercase text-center lg:text-left"
            >
              INDIAN JABALPUR
            </motion.h1>
            <motion.h2 
              variants={textVariants}
              className="text-3xl sm:text-4xl lg:text-6xl font-bold text-white mb-6 uppercase text-center lg:text-left"
            >
              PREMIER LEAGUE
            </motion.h2>
            
            <motion.p 
              variants={textVariants}
              className="text-lg sm:text-xl lg:text-2xl text-yellow-400 mb-4 text-center lg:text-left leading-relaxed font-semibold"
            >
              – Where Cricket Meets Passion
            </motion.p>
            
            <motion.p 
              variants={textVariants}
              className="text-lg sm:text-xl text-gray-200 mb-8 text-center lg:text-left leading-relaxed"
            >
              Experience the thrill of T10 cricket, showcase your talent, and unite with fans in Jabalpur's biggest cricketing spectacle
            </motion.p>

            <motion.div 
              variants={textVariants}
              className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
            >
              <div className="flex items-center gap-2 text-white">
                <Trophy className="w-5 h-5 text-yellow-400" />
                <span className="text-sm">T10 Format</span>
              </div>
              <div className="flex items-center gap-2 text-white">
                <Users className="w-5 h-5 text-yellow-400" />
                <span className="text-sm">All India Trials</span>
              </div>
              <div className="flex items-center gap-2 text-white">
                <Calendar className="w-5 h-5 text-yellow-400" />
                <span className="text-sm">IJPL 2025</span>
              </div>
              <div className="flex items-center gap-2 text-white">
                <MapPin className="w-5 h-5 text-yellow-400" />
                <span className="text-sm">Jabalpur, MP</span>
              </div>
            </motion.div>
          </motion.div>

          <motion.div
            initial="initial"
            animate="animate"
            variants={formVariants}
            transition={{ duration: 0.5 }}
            className="w-full max-w-sm lg:w-2/5 bg-blue-600 bg-opacity-95 p-6 rounded-xl shadow-2xl border border-blue-400"
          >
            <motion.div
              variants={textVariants}
              className="text-center mb-6"
            >
              <Trophy className="w-12 h-12 text-yellow-400 mx-auto mb-3" />
              <h2 className="text-2xl sm:text-3xl font-bold uppercase text-white">
                PLAYER REGISTRATION
              </h2>
              <p className="text-blue-200 text-sm mt-2">Secure Your Spot Today</p>
            </motion.div>
            <motion.div
              variants={textVariants}
              className="flex flex-col items-center gap-3 mb-6"
            >
              <span className="text-lg font-bold text-yellow-400">Prize Pool</span>
              <span className="text-3xl sm:text-4xl font-bold text-white">₹76+ Lakhs</span>
              <span className="text-blue-200 text-sm">Winner: ₹51L | Runner-up: ₹21L</span>
              <span className="bg-yellow-500 text-black px-3 py-1 rounded text-sm font-semibold">
                All India Trials
              </span>
            </motion.div>
            <motion.ul
              variants={textVariants}
              className="mb-6 space-y-2 text-sm sm:text-base text-white"
            >
              <li className="flex items-center gap-2">
                <span className="text-green-400">✓</span> T10 Cricket Format
              </li>
              <li className="flex items-center gap-2">
                <span className="text-green-400">✓</span> Celebrity Cricket Events
              </li>
              <li className="flex items-center gap-2">
                <span className="text-green-400">✓</span> All India Player Trials
              </li>
              <li className="flex items-center gap-2">
                <span className="text-green-400">✓</span> Under-19 Mandatory Slot
              </li>
            </motion.ul>
            <motion.a
              href="#checkout"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="block w-full bg-gradient-to-r from-yellow-500 to-orange-500 text-black font-bold py-3 rounded-lg hover:from-yellow-600 hover:to-orange-600 uppercase text-center text-sm sm:text-base transition-all duration-300"
            >
              Register Now
            </motion.a>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

export default Hero