import React from 'react';
import { motion } from 'framer-motion';
import { Trophy, Users, Star, Target, Award, Medal, Zap, Shield } from 'lucide-react';

const BenefitsBanner = () => {
  // Cricket league benefits with icons and descriptions
  const benefits = [
    {
      icon: <Trophy size={28} className="text-yellow-400" />,
      title: "Professional Training",
      description: "Expert coaching from certified trainers"
    },
    {
      icon: <Star size={28} className="text-yellow-400" />,
      title: "Media Coverage",
      description: "Live streaming and sports journalism"
    },
    {
      icon: <Target size={28} className="text-yellow-400" />,
      title: "Performance Analytics",
      description: "Detailed stats and skill assessment"
    },
    {
      icon: <Medal size={28} className="text-yellow-400" />,
      title: "Recognition",
      description: "State-level certificates and awards"
    },
    {
      icon: <Users size={28} className="text-yellow-400" />,
      title: "Team Environment",
      description: "Professional team dynamics"
    },
    {
      icon: <Shield size={28} className="text-yellow-400" />,
      title: "Complete Kit",
      description: "Tournament jersey and equipment"
    },
    {
      icon: <Zap size={28} className="text-yellow-400" />,
      title: "Fast Track Career",
      description: "Direct pathway to higher levels"
    },
    {
      icon: <Award size={28} className="text-yellow-400" />,
      title: "₹5L Prize Pool",
      description: "Substantial rewards for top performers"
    }
  ];

  return (
    <section className="relative py-16 overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-900 via-indigo-900 to-blue-800"></div>
      
      {/* Cricket-themed background patterns */}
      <div className="absolute inset-0 overflow-hidden opacity-10">
        {/* Cricket ball pattern */}
        {[...Array(15)].map((_, i) => (
          <div 
            key={`cricket-ball-${i}`}
            className="absolute rounded-full border-2 border-white"
            style={{
              width: `${Math.random() * 60 + 30}px`,
              height: `${Math.random() * 60 + 30}px`,
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              opacity: Math.random() * 0.3
            }}
          />
        ))}
        
        {/* Wicket stumps pattern */}
        {[...Array(10)].map((_, i) => (
          <div 
            key={`stump-${i}`}
            className="absolute bg-white"
            style={{
              height: `${Math.random() * 40 + 20}px`,
              width: '3px',
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              opacity: Math.random() * 0.4,
              transform: 'rotate(15deg)'
            }}
          />
        ))}
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">
            Why Choose <span className="text-yellow-400">IJPL 2025</span>?
          </h2>
          <p className="text-lg sm:text-xl text-blue-200 max-w-3xl mx-auto leading-relaxed">
            Join Madhya Pradesh's premier cricket tournament and experience professional cricket 
            with world-class facilities, expert coaching, and incredible opportunities for growth.
          </p>
        </motion.div>

        {/* Benefits Grid */}
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {benefits.map((benefit, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ 
                scale: 1.05,
                transition: { duration: 0.2 }
              }}
              className="group relative"
            >
              <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-6 h-full hover:bg-white/20 transition-all duration-300">
                {/* Icon */}
                <div className="mb-4 flex justify-center">
                  <div className="w-16 h-16 bg-blue-600/20 rounded-full flex items-center justify-center group-hover:bg-blue-600/30 transition-colors duration-300">
                    {benefit.icon}
                  </div>
                </div>
                
                {/* Content */}
                <div className="text-center">
                  <h3 className="text-lg font-bold text-white mb-2 group-hover:text-yellow-300 transition-colors duration-300">
                    {benefit.title}
                  </h3>
                  <p className="text-blue-200 text-sm leading-relaxed">
                    {benefit.description}
                  </p>
                </div>

                {/* Hover effect overlay */}
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600/0 to-indigo-600/0 group-hover:from-blue-600/10 group-hover:to-indigo-600/10 rounded-xl transition-all duration-300" />
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Call to Action */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-center mt-12"
        >
          <div className="inline-flex items-center gap-3 bg-yellow-500 text-black px-8 py-4 rounded-full font-bold text-lg hover:bg-yellow-400 transition-colors duration-300 cursor-pointer">
            <Trophy className="w-6 h-6" />
            <span>Register Now for ₹3,300</span>
          </div>
          <p className="text-blue-200 mt-4 text-sm">
            Limited spots available • Early bird registration ending soon
          </p>
        </motion.div>

        {/* Additional Stats */}
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-16 pt-12 border-t border-white/20"
        >
          <div className="text-center">
            <div className="text-3xl font-bold text-yellow-400 mb-2">8</div>
            <div className="text-blue-200 text-sm">Professional Teams</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-yellow-400 mb-2">25+</div>
            <div className="text-blue-200 text-sm">Tournament Matches</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-yellow-400 mb-2">120+</div>
            <div className="text-blue-200 text-sm">Player Positions</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-yellow-400 mb-2">3</div>
            <div className="text-blue-200 text-sm">Months Duration</div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default BenefitsBanner; 