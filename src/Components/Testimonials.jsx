import React from 'react';
import { motion } from 'framer-motion';
import { Star, Quote, MapPin, Calendar, Trophy, Target } from 'lucide-react';

const Testimonials = () => {
  const testimonials = [
    {
      id: 1,
      name: "Rahul Sharma",
      role: "All Rounder", 
      location: "Jabalpur",
      age: 22,
      rating: 5,
      date: "IJPL 2024 Winner",
      review: "IJPL gave my cricket career a new direction. Professional coaching and tournament experience prepared me for the state team. Now I'm part of MP Under-23 team.",
      achievement: "MP Under-23 Team Selection"
    },
    {
      id: 2,
      name: "Priya Patel",
      role: "Fast Bowler",
      location: "Indore",
      age: 19,
      rating: 5,
      date: "IJPL 2024 Rising Star",
      review: "Had a dream to play in IJPL. The training and professional environment here increased my bowling speed by 15 kmph. Now playing for Railway team.",
      achievement: "Railway Sports Team Selection"
    },
    {
      id: 3,
      name: "Vikas Kumar",
      role: "Wicket Keeper",
      location: "Bhopal",
      age: 25,
      rating: 5,
      date: "IJPL 2023 Champion",
      review: "Played IJPL for 3 seasons. The team culture and leadership training here made me a captain. Now I'm the district team captain. IJPL is the best platform.",
      achievement: "District Team Captain"
    },
    {
      id: 4,
      name: "Arjun Singh",
      role: "Batsman",
      location: "Gwalior",
      age: 18,
      rating: 5,
      date: "IJPL 2024 Best Batsman",
      review: "Joined IJPL in Under-19. The coaches and advanced training improved my technique. Now I'm top scorer of MP Under-19 and selected for IPL trials.",
      achievement: "IPL Trials Selection"
    },
    {
      id: 5,
      name: "Akash Mishra",
      role: "Spinner",
      location: "Jabalpur",
      age: 21,
      rating: 5,
      date: "IJPL 2024 Best Bowler",
      review: "Got advanced spin bowling training at IJPL. The fielding standards and professional approach here took me to the next level. Now playing at state level.",
      achievement: "State Level Player"
    },
    {
      id: 6,
      name: "Sumitra Devi",
      role: "All Rounder",
      location: "Sagar",
      age: 23,
      rating: 5,
      date: "IJPL 2024 Women's Champion",
      review: "Experience in women's cricket at IJPL was unforgettable. The training and motivation here helped me give my best performance. Now participating in national level tournaments.",
      achievement: "National Tournament Player"
    }
  ];

  const stats = [
    { label: "Player Satisfaction", value: "98%" },
    { label: "Career Advancement", value: "85%" },
    { label: "State Selections", value: "25+" },
    { label: "Tournament Wins", value: "50+" }
  ];

  return (
    <section className="py-12 sm:py-16 bg-gradient-to-b from-blue-50 to-white">
      <div className="container mx-auto px-4">
        {/* Header */}
        <motion.div 
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 text-gray-900">
            Player <span className="text-blue-600">Testimonials</span>
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Hear from our talented cricketers who have achieved remarkable success through IJPL. 
            Their journey from local players to state and national level cricket is truly inspiring.
          </p>
        </motion.div>

        {/* Stats Section */}
        <motion.div
          initial={{ opacity: 0, }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16"
        >
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="text-center bg-white rounded-xl p-6 "
            >
              <div className="text-3xl font-bold text-blue-600 mb-2">{stat.value}</div>
              <div className="text-gray-600 text-sm">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>

        {/* Testimonials Grid */}
        <div className=" mx-auto">
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.id}
                className="bg-white rounded-xl p-6  border border-gray-100 hover:shadow-xl transition-shadow duration-300"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -5 }}
              >
                {/* Quote Icon */}
                <div className="flex justify-between items-start mb-4">
                  <Quote className="w-8 h-8 text-blue-600/30" />
                  <div className="flex">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star 
                        key={i} 
                        size={16} 
                        className="text-yellow-400 fill-yellow-400"
                      />
                    ))}
                  </div>
                </div>

                {/* Review Text */}
                <div className="mb-4">
                  <p className="text-gray-700 italic text-sm leading-relaxed">
                    "{testimonial.review}"
                  </p>
                </div>

                {/* Achievement Badge */}
                <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-3 py-1 rounded-full text-xs font-semibold mb-4 inline-flex items-center">
                  <Trophy className="w-3 h-3 mr-1" />
                  {testimonial.achievement}
                </div>

                {/* Player Info */}
                <div className="border-t border-gray-100 pt-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <h4 className="font-bold text-gray-900">
                        {testimonial.name}
                      </h4>
                      <p className="text-blue-600 text-sm font-medium">{testimonial.role}</p>
                      <div className="flex items-center text-gray-500 text-xs mt-1">
                        <MapPin size={12} className="mr-1" />
                        <span>{testimonial.location}, Age {testimonial.age}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center text-gray-500 text-xs">
                        <Calendar size={12} className="mr-1" />
                        <span>{testimonial.date}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center mt-16"
        >
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-8 text-white">
            <h3 className="text-2xl sm:text-3xl font-bold mb-4">
              Ready to Write Your Success Story?
            </h3>
            <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
              Join hundreds of talented cricketers who have transformed their careers through IJPL. 
              Your journey to professional cricket starts here!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <a
                href="#checkout"
                className="inline-flex items-center gap-2 bg-yellow-500 text-black px-8 py-4 rounded-lg font-semibold text-lg hover:bg-yellow-400 transition-colors duration-300"
              >
                <Trophy className="w-5 h-5" />
                Register for IJPL 2025
              </a>
              <div className="text-yellow-200 text-sm">
                1,100 • Limited Spots Available • All Age Groups Welcome
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Testimonials;