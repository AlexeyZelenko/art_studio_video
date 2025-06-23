import React from 'react';
import { ArrowRight, Star, Users, Award } from 'lucide-react';
import { motion } from 'framer-motion';

const Hero = () => {
  return (
    <section id="home" className="bg-gradient-to-br from-pink-400 via-purple-500 to-indigo-600 relative overflow-hidden w-full">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-72 h-72 bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-yellow-300/20 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-pink-300/30 rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto px-3 sm:px-12 pt-32 pb-16 relative z-10 max-w-full w-full">
        <div className="grid lg:grid-cols-2 gap-12 items-center w-full">
                      <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="text-white w-full max-w-full"
            >
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.8 }}
              className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold mb-6 leading-tight"
            >
              Створюємо
              <span className="block bg-gradient-to-r from-yellow-300 to-pink-300 bg-clip-text text-transparent">
                Магію
              </span>
              у кожному кадрі
            </motion.h1>
            
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.8 }}
              className="text-lg sm:text-xl md:text-2xl mb-6 md:mb-8 text-white/90 leading-relaxed"
            >
              Професійна фотостудія з сучасним обладнанням та творчим підходом. 
              Ми перетворюємо ваші моменти на неперевершені спогади.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.8 }}
              className="flex flex-col sm:flex-row gap-4 mb-12"
            >
              <motion.button
                onClick={() => {
                  document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
                }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-white text-purple-600 px-8 py-4 rounded-full font-semibold text-lg flex items-center justify-center space-x-2 hover:shadow-2xl transition-all"
              >
                <span>Замовити фотосесію</span>
                <ArrowRight size={20} />
              </motion.button>              
              
            </motion.div>           
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="relative w-full max-w-full"
          >
            <div className="relative w-full h-96 md:h-[500px] rounded-3xl overflow-hidden">
              <img
                src="https://images.pexels.com/photos/1755385/pexels-photo-1755385.jpeg?auto=compress&cs=tinysrgb&w=800"
                alt="Професійна фотосесія"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
            </div>
            
            {/* Floating Cards */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1, duration: 0.6 }}
              className="absolute top-2 left-2 md:-top-6 md:-left-6 bg-white rounded-2xl p-3 md:p-4 shadow-2xl"
            >
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-r from-pink-500 to-violet-600 rounded-full flex items-center justify-center">
                  <Star className="w-6 h-6 text-white fill-current" />
                </div>
                <div>
                  <p className="font-semibold text-gray-800">Преміум якість</p>
                  <p className="text-sm text-gray-600">4K зйомка</p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1.2, duration: 0.6 }}
              className="absolute bottom-2 right-2 md:-bottom-6 md:-right-6 bg-white rounded-2xl p-3 md:p-4 shadow-2xl"
            >
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
                  <Award className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="font-semibold text-gray-800">Швидка обробка</p>
                  <p className="text-sm text-gray-600">24-48 годин</p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Hero;