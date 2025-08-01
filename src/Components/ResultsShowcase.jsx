import React from 'react';
import { motion } from 'framer-motion';
import { Trophy, Award, Star, Target, Users, Calendar, TrendingUp, Medal } from 'lucide-react';

const ResultsShowcase = () => {
  // Cricket achievements and success stories
  const achievements = [
    {
      id: 1,
      icon: <Trophy className="w-8 h-8" />,
      title: "Tournament Champions",
      description: "Previous winners have gone on to represent state teams",
      stat: "15+",
      statLabel: "State Team Selections"
    },
    {
      id: 2,
      icon: <Users className="w-8 h-8" />,
      title: "Player Development",
      description: "Professional coaching has improved player performance by average",
      stat: "75%",
      statLabel: "Skill Improvement"
    },
    {
      id: 3,
      icon: <Award className="w-8 h-8" />,
      title: "Recognition", 
      description: "Players have received state and national level recognition",
      stat: "50+",
      statLabel: "Awards Won"
    },
    {
      id: 4,
      icon: <Target className="w-8 h-8" />,
      title: "Career Advancement",
      description: "Direct pathway to higher level cricket opportunities",
      stat: "90%",
      statLabel: "Career Growth"
    }
  ];

  // Success stories from players
  const successStories = [
    {
      id: 1,
      name: "Rajesh Kumar",
      role: "All Rounder",
      ageGroup: "Under 19",
      achievement: "Selected for Karnataka Under-19 Team",
      quote: "IJPL gave me the platform to showcase my talent. The professional coaching and competitive environment prepared me for state-level cricket.",
      before: "Club level player with limited exposure",
      after: "Karnataka Under-19 team member, scored 450+ runs in debut season",
      image: "https://images.unsplash.com/photo-1633332755192-727a05c4013d?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80"
    },
    {
      id: 2,
      name: "Deepika Singh",
      role: "Fast Bowler",
      ageGroup: "Senior Player",
      achievement: "Railways Sports Team Selection",
      quote: "The professional environment at IJPL helped me develop my bowling skills. Now I'm representing Indian Railways at national level.",
      before: "Weekend cricket player with raw talent",
      after: "Professional cricket player with 25+ wickets record",
      image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80"
    },
    {
      id: 3,
      name: "Rahul Desai",
      role: "Wicket Keeper",
      ageGroup: "Senior Player",
      achievement: "Mumbai District Team Captain",
      quote: "IJPL not only improved my keeping skills but also developed my leadership qualities. The experience was invaluable.",
      before: "Local team wicket keeper with potential",
      after: "District team captain, 90% success rate behind stumps",
      image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80"
    }
  ];

  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5 }
  };

  return (
    <section className="py-12 sm:py-16 bg-gradient-to-b from-gray-900 to-blue-900 text-white">
      <div className="container mx-auto px-4">
        {/* Header */}
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
            Real Success <span className="text-yellow-400">Stories</span>
          </h2>
          <p className="text-lg text-gray-300 max-w-3xl mx-auto">
            See how IJPL has transformed cricket careers and created opportunities for talented players across India
          </p>
        </motion.div>

        <div className="max-w-7xl mx-auto">
          {/* Achievement Stats */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16"
          >
            {achievements.map((achievement, index) => (
              <motion.div
                key={achievement.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ scale: 1.05 }}
                className="bg-gradient-to-br from-blue-600/20 to-indigo-600/20 backdrop-blur-sm rounded-xl p-6 border border-blue-400/20 text-center group"
              >
                <div className="w-16 h-16 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-blue-500/30 transition-colors duration-300">
                  <div className="text-yellow-400">
                    {achievement.icon}
                  </div>
                </div>
                
                <div className="text-3xl font-bold text-white mb-2">{achievement.stat}</div>
                <div className="text-yellow-400 text-sm font-semibold mb-3">{achievement.statLabel}</div>
                <h3 className="text-lg font-bold text-white mb-2">{achievement.title}</h3>
                <p className="text-gray-300 text-sm">{achievement.description}</p>
              </motion.div>
            ))}
          </motion.div>

          {/* Success Stories */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mb-16"
          >
            <h3 className="text-2xl sm:text-3xl font-bold text-center mb-12">
              Player <span className="text-yellow-400">Success Stories</span>
            </h3>
            
            <div className="grid gap-8 md:grid-cols-3">
              {successStories.map((story, index) => (
                <motion.div
                  key={story.id}
                  className="bg-gradient-to-br from-black/40 to-blue-900/40 backdrop-blur-sm rounded-xl p-6 border border-blue-500/20"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  whileHover={{ y: -5, boxShadow: '0 10px 25px -5px rgba(59, 130, 246, 0.4)' }}
                >
                  {/* Player Info */}
                  <div className="flex items-center mb-4">
                    <img
                      src={story.image}
                      alt={story.name}
                      className="w-16 h-16 rounded-full object-cover mr-4 border-2 border-yellow-400"
                    />
                    <div>
                      <h4 className="text-lg font-bold text-white">{story.name}</h4>
                      <p className="text-yellow-400 text-sm">{story.role}</p>
                      <p className="text-gray-300 text-xs">{story.ageGroup}</p>
                    </div>
                  </div>

                  {/* Achievement Badge */}
                  <div className="bg-gradient-to-r from-yellow-500 to-orange-500 text-black px-3 py-1 rounded-full text-xs font-semibold mb-4 inline-block">
                    <Medal className="w-3 h-3 inline mr-1" />
                    {story.achievement}
                  </div>
                  
                  {/* Quote */}
                  <p className="text-gray-100 italic mb-6 text-sm">"{story.quote}"</p>
                  
                  {/* Before/After Comparison */}
                  <div className="bg-black/30 rounded-lg p-4">
                    <div className="mb-3">
                      <div className="flex items-center mb-2">
                        <div className="w-2 h-2 rounded-full bg-red-400 mr-2"></div>
                        <h5 className="text-xs text-red-300 font-semibold">BEFORE IJPL:</h5>
                      </div>
                      <p className="text-xs text-gray-300">{story.before}</p>
                    </div>
                    
                    <div className="flex justify-center my-2">
                      <TrendingUp className="text-yellow-400 w-4 h-4" />
                    </div>
                    
                    <div>
                      <div className="flex items-center mb-2">
                        <div className="w-2 h-2 rounded-full bg-green-400 mr-2"></div>
                        <h5 className="text-xs text-green-300 font-semibold">AFTER IJPL:</h5>
                      </div>
                      <p className="text-xs text-gray-300">{story.after}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* League Impact Stats */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-8 text-center"
          >
            <h3 className="text-2xl sm:text-3xl font-bold mb-6">
              IJPL's Impact on Cricket Development
            </h3>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
              <div>
                <div className="text-3xl font-bold text-yellow-400 mb-2">200+</div>
                <div className="text-blue-100 text-sm">Players Trained</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-yellow-400 mb-2">3</div>
                <div className="text-blue-100 text-sm">Successful Seasons</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-yellow-400 mb-2">25+</div>
                <div className="text-blue-100 text-sm">State Selections</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-yellow-400 mb-2">₹15L+</div>
                <div className="text-blue-100 text-sm">Total Prize Money</div>
              </div>
            </div>

            <p className="text-blue-100 mb-6 max-w-3xl mx-auto">
              Join the league that has consistently produced talented cricketers who have gone on to achieve success 
              at district, state, and national levels. Your cricket journey starts here!
            </p>

            <a
              href="#checkout"
              className="inline-flex items-center gap-2 bg-yellow-500 text-black px-8 py-4 rounded-lg font-semibold text-lg hover:bg-yellow-400 transition-colors duration-300"
            >
              <Trophy className="w-5 h-5" />
              Start Your Success Story
            </a>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default ResultsShowcase; 