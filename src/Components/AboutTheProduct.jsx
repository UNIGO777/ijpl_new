import React from 'react'
import { motion } from 'framer-motion'
import { Trophy, Users, Star, Shield, Clock,  Award, Target, MapPin, Calendar, DollarSign,  Users2, Medal, Sparkles } from 'lucide-react'


const AboutTheProduct = () => {
  const fadeInUp = {
    initial: { opacity: 0, y: 30 },
    animate: { opacity: 1, y: 0 },
  }

  const staggerContainer = {
    animate: {
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  // League Benefits
  const benefits = [
    "T10 format cricket tournament",
    "Team purse limit of ₹10 Lakhs",
    "Team registration fee of ₹7 Lakhs",
    "Mandatory Under-19 player requirement",
    "Player auctions with 4 base price categories",
    "Pan-India player trials and selection",
    "Professional match broadcasting",
    "Opportunities for state/national recognition"
  ]

  // Prize Structure
  const prizes = [
    {
      title: "Winner",
      amount: "₹51 Lakhs",
      icon: <Trophy className="w-6 h-6"/>
    },
    {
      title: "Runner Up",
      amount: "₹21 Lakhs",
      icon: <Medal className="w-6 h-6"/>
    },
    {
      title: "Man of Series",
      amount: "₹2 Lakhs",
      icon: <Star className="w-6 h-6"/>
    },
    {
      title: "Best Batsman",
      amount: "₹1 Lakh",
      icon: <Target className="w-6 h-6"/>
    },
    {
      title: "Best Bowler", 
      amount: "₹1 Lakh",
      icon: <Target className="w-6 h-6"/>
    },
    {
      title: "Best Fielder",
      amount: "₹10,000",
      icon: <Users2 className="w-6 h-6"/>
    }
  ]

  const features = [
    { icon: <Trophy className="w-6 h-6" />, title: "T10 Format", desc: "Fast-paced Cricket" },
    { icon: <Shield className="w-6 h-6" />, title: "Pan-India Trials", desc: "Top Talent Selection" },
    { icon: <Award className="w-6 h-6" />, title: "₹51L Winner Prize", desc: "Huge Prize Pool" },
    { icon: <Sparkles className="w-6 h-6" />, title: "Celebrity Events", desc: "Star-studded Matches" }
  ]

  const stats = [
    { number: "₹51L", label: "Winner Prize" },
    { number: "₹10L", label: "Team Purse" },
    { number: "4", label: "Base Categories" },
    { number: "T10", label: "Format" }
  ]

  return (
    <section className="py-8 relative sm:py-12 md:py-16 bg-gradient-to-b from-blue-50 to-white">
      <div className="px-4 sm:px-8 md:px-12 lg:px-20 mx-auto">
        {/* Header */}
        <motion.div
          initial="initial"
          whileInView="animate"
          variants={staggerContainer}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <motion.div variants={fadeInUp} className="flex justify-center mb-4">
            <Trophy className="w-16 h-16 text-blue-600" />
          </motion.div>
          <motion.h2 
            variants={fadeInUp}
            className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4"
          >
            Indian Jabalpur <span className="text-blue-600">Premier League</span>
          </motion.h2>
          <motion.p 
            variants={fadeInUp}
            className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed"
          >
            Where Cricket Meets Passion - Experience the thrill of T10 cricket, showcase your talent, and unite with fans in Jabalpur's biggest cricketing spectacle
          </motion.p>
        </motion.div>

        {/* Stats Section */}
        <motion.div
          initial="initial"
          whileInView="animate"
          variants={staggerContainer}
          viewport={{ once: true }}
          className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16"
        >
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              variants={fadeInUp}
              className="text-center bg-white rounded-xl p-6 shadow-sm"
            >
              <div className="text-3xl font-bold text-blue-600 mb-2">{stat.number}</div>
              <div className="text-gray-600 font-medium">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start">
          {/* Left Column - Tournament Benefits */}
          <motion.div
            initial="initial"
            whileInView="animate"
            variants={staggerContainer}
            viewport={{ once: true }}
            className="space-y-8"
          >
            <div>
              <motion.h3 
                variants={fadeInUp}
                className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6 flex items-center gap-3"
              >
                <Star className="w-8 h-8 text-yellow-500" />
                Tournament Highlights
              </motion.h3>
              
              <motion.div variants={fadeInUp} className="space-y-4">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-6 h-6 bg-green-100 rounded-full flex items-center justify-center mt-0.5">
                      <Trophy className="w-3 h-3 text-green-600" />
                    </div>
                    <span className="text-gray-700 leading-relaxed">{benefit}</span>
                  </div>
                ))}
              </motion.div>
            </div>

            {/* Features Grid */}
            <motion.div variants={fadeInUp} className="grid grid-cols-2 gap-4">
              {features.map((feature, index) => (
                <div key={index} className="bg-white rounded-xl p-4 shadow-sm text-center">
                  <div className="text-blue-600 mb-2 flex justify-center">
                    {feature.icon}
                  </div>
                  <h4 className="font-semibold text-gray-900 mb-1">{feature.title}</h4>
                  <p className="text-sm text-gray-600">{feature.desc}</p>
                </div>
              ))}
            </motion.div>
          </motion.div>

          {/* Right Column - Prize Structure */}
          <motion.div
            initial="initial"
            whileInView="animate"
            variants={staggerContainer}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <motion.h3 
              variants={fadeInUp}
              className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6 flex items-center gap-3"
            >
              <Award className="w-8 h-8 text-blue-600" />
              Prize Structure
            </motion.h3>

            <div className="space-y-4">
              {prizes.map((prize, index) => (
                <motion.div
                  key={index}
                  variants={fadeInUp}
                  className="bg-white rounded-xl p-6 shadow-sm border-l-4 border-blue-600"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="text-blue-600">
                        {prize.icon}
                      </div>
                      <h4 className="font-bold text-gray-900">{prize.title}</h4>
                    </div>
                    <div className="text-xl font-bold text-blue-600">{prize.amount}</div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Registration Details */}
        <motion.div
          initial="initial"
          whileInView="animate"
          variants={staggerContainer}
          viewport={{ once: true }}
          className="mt-16 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-8 text-white"
        >
          <motion.h3 
            variants={fadeInUp}
            className="text-2xl sm:text-3xl font-bold mb-8 text-center"
          >
            Registration Information
          </motion.h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <motion.div variants={fadeInUp} className="text-center">
              <DollarSign className="w-8 h-8 mx-auto mb-3 text-yellow-400" />
              <h4 className="font-semibold mb-2">Base Price Categories</h4>
              <p className="text-blue-100">₹10,000 | ₹20,000 | ₹50,000 | ₹1,00,000</p>
            </motion.div>
            
            <motion.div variants={fadeInUp} className="text-center">
              <Users className="w-8 h-8 mx-auto mb-3 text-yellow-400" />
              <h4 className="font-semibold mb-2">Team Requirements</h4>
              <p className="text-blue-100">Minimum 1 Under-19 Player Mandatory</p>
            </motion.div>
            
            <motion.div variants={fadeInUp} className="text-center">
              <MapPin className="w-8 h-8 mx-auto mb-3 text-yellow-400" />
              <h4 className="font-semibold mb-2">Location</h4>
              <p className="text-blue-100">Jabalpur, Madhya Pradesh - 482001</p>
            </motion.div>
          </div>
        </motion.div>

        {/* Call to Action */}
        <motion.div
          initial="initial"
          whileInView="animate"
          variants={fadeInUp}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <h3 className="text-2xl font-bold text-gray-900 mb-4">
            Ready to Be Part of IJPL 2025?
          </h3>
          <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
            Don't miss this opportunity to participate in Madhya Pradesh's biggest T10 cricket tournament.
            Register now and compete for glory!
          </p>
          <a
            href="#checkout"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-300"
          >
            <Trophy className="w-5 h-5" />
            Register for IJPL 2025
          </a>
        </motion.div>
      </div>
    </section>
  )
}

export default AboutTheProduct
