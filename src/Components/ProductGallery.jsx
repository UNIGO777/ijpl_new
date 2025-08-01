import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, ZoomIn, Trophy, Play, Users, Award } from 'lucide-react';

// Cricket League Gallery Component
const ProductGallery = () => {
  // Cricket tournament showcase images
  const images = [
    { 
      id: 1, 
      src: 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80', 
      alt: 'Jabalpur Cricket Stadium',
      caption: 'World-class Cricket Stadium'
    },
    { 
      id: 2, 
      src: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80', 
      alt: 'Cricket team celebration',
      caption: 'Championship Winning Moment'
    },
    { 
      id: 3, 
      src: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80', 
      alt: 'Cricket players in action',
      caption: 'Professional Training Sessions'
    },
    { 
      id: 4, 
      src: 'https://images.unsplash.com/photo-1561287750-4c8e0acf956c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80', 
      alt: 'Cricket coaching session',
      caption: 'Expert Coaching & Mentorship'
    },
    { 
      id: 5, 
      src: 'https://images.unsplash.com/photo-1596422846543-75c6fc197f07?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80', 
      alt: 'Cricket match in progress',
      caption: 'Live Tournament Action'
    },
    { 
      id: 6, 
      src: 'https://images.unsplash.com/photo-1579952363873-27d3bfad9c0d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80', 
      alt: 'Trophy presentation ceremony',
      caption: 'Prize Distribution Ceremony'
    }
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length);
  };

  const toggleZoom = () => {
    setIsZoomed(!isZoomed);
  };

  const fadeVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  };

  const highlights = [
    {
      icon: <Trophy className="w-6 h-6" />,
      title: "Professional Tournament",
      description: "IPL-style format with 8 teams"
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: "120+ Players",
      description: "Elite cricket talent from across MP"
    },
    {
      icon: <Award className="w-6 h-6" />,
      title: "₹5L Prize Pool",
      description: "Substantial rewards for winners"
    },
    {
      icon: <Play className="w-6 h-6" />,
      title: "Live Coverage",
      description: "Media coverage & live streaming"
    }
  ];

  return (
    <section className="py-12 sm:py-16 bg-gradient-to-b from-white to-blue-50">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 text-gray-900">
            Experience <span className="text-blue-600">IJPL 2025</span>
          </h2>
          <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Get a glimpse of the premier cricket tournament that's transforming cricket in Madhya Pradesh. 
            Professional facilities, expert coaching, and unforgettable moments await.
          </p>
        </motion.div>

        <div className="max-w-6xl mx-auto">
          {/* Main Gallery */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative rounded-2xl overflow-hidden bg-white shadow-2xl mb-12"
          >
            {/* Main image */}
            <div 
              className={`relative aspect-[16/9] cursor-pointer transition-all duration-500 ${isZoomed ? 'scale-110' : 'scale-100'}`}
              onClick={toggleZoom}
            >
              <motion.img
                key={currentIndex}
                initial="hidden"
                animate="visible"
                variants={fadeVariants}
                transition={{ duration: 0.5 }}
                src={images[currentIndex].src}
                alt={images[currentIndex].alt}
                className="w-full h-full object-cover"
              />
              
              {/* Overlay with caption */}
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6">
                <h3 className="text-white text-xl font-bold mb-2">
                  {images[currentIndex].caption}
                </h3>
                <p className="text-gray-200 text-sm">
                  {images[currentIndex].alt}
                </p>
              </div>

              {/* Zoom indicator */}
              <div className="absolute top-4 right-4 bg-black/50 rounded-full p-2">
                <ZoomIn className="w-5 h-5 text-white" />
              </div>
            </div>

            {/* Navigation arrows */}
            <button
              onClick={prevSlide}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 rounded-full p-2 transition-colors duration-200"
            >
              <ChevronLeft className="w-6 h-6 text-white" />
            </button>
            <button
              onClick={nextSlide}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 rounded-full p-2 transition-colors duration-200"
            >
              <ChevronRight className="w-6 h-6 text-white" />
            </button>

            {/* Thumbnails */}
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
              {images.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`w-3 h-3 rounded-full transition-colors duration-200 ${
                    index === currentIndex ? 'bg-white' : 'bg-white/50'
                  }`}
                />
              ))}
            </div>
          </motion.div>

          {/* Tournament Highlights */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {highlights.map((highlight, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ scale: 1.05 }}
                className="bg-white rounded-xl p-6 shadow-lg border border-blue-100 text-center group"
              >
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-blue-200 transition-colors duration-300">
                  <div className="text-blue-600">
                    {highlight.icon}
                  </div>
                </div>
                <h3 className="font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors duration-300">
                  {highlight.title}
                </h3>
                <p className="text-gray-600 text-sm">
                  {highlight.description}
                </p>
              </motion.div>
            ))}
          </motion.div>

          {/* Video Showcase */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-12 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-8 text-white text-center"
          >
            <h3 className="text-2xl sm:text-3xl font-bold mb-4">
              Watch Previous Tournament Highlights
            </h3>
            <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
              Experience the excitement, passion, and professional cricket action from our previous seasons. 
              See what awaits you in IJPL 2025!
            </p>
            <div className="inline-flex items-center gap-3 bg-white text-blue-600 px-6 py-3 rounded-full font-semibold hover:bg-blue-50 transition-colors duration-300 cursor-pointer">
              <Play className="w-5 h-5" />
              <span>Watch Tournament Highlights</span>
            </div>
          </motion.div>

          {/* Registration CTA */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="mt-12 text-center"
          >
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Ready to Be Part of This Amazing Experience?
            </h3>
            <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
              Join the most prestigious cricket tournament in Madhya Pradesh. Limited spots available for Season 2025.
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
      </div>
    </section>
  );
};

export default ProductGallery; 