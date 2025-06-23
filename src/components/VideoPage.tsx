import React from 'react';
import { motion } from 'framer-motion';
import { Video, Play, Award, Users, Clock, Star } from 'lucide-react';
import VideoServices from './VideoServices';
import VideoPortfolio from './VideoPortfolio';

const VideoPage = () => {
  return (
    <div className="min-h-screen w-full overflow-x-hidden">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 relative overflow-hidden w-full">
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
                Кінематографічні
                <span className="block bg-gradient-to-r from-yellow-300 to-pink-300 bg-clip-text text-transparent">
                  Відео
                </span>
                що надихають
              </motion.h1>
              
              <motion.p
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.8 }}
                className="text-lg sm:text-xl md:text-2xl mb-6 md:mb-8 text-white/90 leading-relaxed"
              >
                Створюємо емоційні відео історії з професійним підходом. 
                Від весільних фільмів до корпоративних презентацій - кожен кадр має значення.
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
                  <span>Замовити відео</span>
                  <Play size={20} fill="currentColor" />
                </motion.button>
              </motion.div>

              {/* Stats */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8, duration: 0.8 }}
                className="grid grid-cols-3 gap-6"
              >
                <div className="text-center">
                  <div className="text-2xl md:text-3xl font-bold text-yellow-300 mb-1">50+</div>
                  <div className="text-white/80 text-sm">Відео проектів</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl md:text-3xl font-bold text-pink-300 mb-1">4K</div>
                  <div className="text-white/80 text-sm">Якість зйомки</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl md:text-3xl font-bold text-blue-300 mb-1">24h</div>
                  <div className="text-white/80 text-sm">Швидка обробка</div>
                </div>
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
                  src="https://images.pexels.com/photos/66134/pexels-photo-66134.jpeg?auto=compress&cs=tinysrgb&w=800"
                  alt="Відео зйомка"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
                
                {/* Play Button Overlay */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 1, duration: 0.6 }}
                    className="w-20 h-20 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center text-purple-600 shadow-2xl"
                  >
                    <Play className="w-10 h-10 ml-1" fill="currentColor" />
                  </motion.div>
                </div>
              </div>
              
              {/* Floating Cards */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1.2, duration: 0.6 }}
                className="absolute top-2 left-2 md:-top-6 md:-left-6 bg-white rounded-2xl p-3 md:p-4 shadow-2xl"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-indigo-600 rounded-full flex items-center justify-center">
                    <Video className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800">4K зйомка</p>
                    <p className="text-sm text-gray-600">Кінематографічна якість</p>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1.4, duration: 0.6 }}
                className="absolute bottom-2 right-2 md:-bottom-6 md:-right-6 bg-white rounded-2xl p-3 md:p-4 shadow-2xl"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gradient-to-r from-pink-500 to-rose-500 rounded-full flex items-center justify-center">
                    <Award className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800">Професійний монтаж</p>
                    <p className="text-sm text-gray-600">Швидка доставка</p>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Video Services Section */}
      <VideoServices />

      {/* Video Portfolio Section */}
      <VideoPortfolio />

      {/* Why Choose Us Section */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-6 bg-gradient-to-r from-pink-600 to-violet-600 bg-clip-text text-transparent">
              Чому обирають нас?
            </h2>
            <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto">
              Ми не просто знімаємо відео - ми створюємо кінематографічні шедеври, 
              що залишаються в пам'яті назавжди
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: Video,
                title: 'Професійне обладнання',
                description: '4K камери, стабілізатори, професійний звук',
                gradient: 'from-blue-500 to-cyan-500'
              },
              {
                icon: Users,
                title: 'Досвідчена команда',
                description: 'Режисери, оператори, монтажери з багаторічним досвідом',
                gradient: 'from-green-500 to-teal-500'
              },
              {
                icon: Clock,
                title: 'Швидка доставка',
                description: 'Готове відео за 3-7 днів після зйомки',
                gradient: 'from-yellow-500 to-orange-500'
              },
              {
                icon: Star,
                title: 'Індивідуальний підхід',
                description: 'Кожен проект унікальний, як і ваша історія',
                gradient: 'from-pink-500 to-violet-600'
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
                viewport={{ once: true }}
                whileHover={{ y: -10 }}
                className="text-center bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300"
              >
                <div className={`w-16 h-16 bg-gradient-to-r ${feature.gradient} rounded-2xl flex items-center justify-center mx-auto mb-6`}>
                  <feature.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-4">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default VideoPage;