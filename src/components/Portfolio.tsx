import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, Heart, Share2, ArrowUpRight } from 'lucide-react';
import { usePortfolio } from '../contexts/PortfolioContext';
import { useToast } from '../hooks/useToast';
import Toast from './Toast';

const Portfolio = () => {
  const { portfolioItems, loading } = usePortfolio();
  const { toast, showToast, hideToast } = useToast();
  const [activeCategory, setActiveCategory] = useState('Всі');

  const categories = ['Всі', 'Портрети', 'Весілля', 'Сім\'я', 'Fashion', 'Корпоратив'];

  const filteredItems = activeCategory === 'Всі' 
    ? portfolioItems 
    : portfolioItems.filter(item => item.category === activeCategory);

  if (loading) {
    return (
      <section id="portfolio" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="text-xl text-gray-600">Завантаження портфоліо...</div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="portfolio" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-6 bg-gradient-to-r from-pink-600 to-violet-600 bg-clip-text text-transparent">
            Наше портфоліо
          </h2>
          <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto">
            Переглянь наші найкращі роботи та відчуй магію професійної фотографії
          </p>
        </motion.div>

        {/* Category Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="flex flex-wrap justify-center gap-4 mb-12"
        >
          {categories.map((category) => (
            <motion.button
              key={category}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setActiveCategory(category)}
              className={`px-6 py-3 rounded-full font-semibold transition-all ${
                activeCategory === category
                  ? 'bg-gradient-to-r from-pink-500 to-violet-600 text-white shadow-lg'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {category}
            </motion.button>
          ))}
        </motion.div>

        {/* Portfolio Grid */}
        {filteredItems.length > 0 ? (
          <motion.div
            layout
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8"
          >
            <AnimatePresence>
              {filteredItems.map((item) => (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.4 }}
                  whileHover={{ y: -10 }}
                  className="group relative overflow-hidden rounded-3xl"
                >
                  <Link to={`/portfolio/${item.id}`} className="block">
                    <div className="aspect-square relative">
                      <img
                        src={item.imageUrl}
                        alt={item.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                      {/* Image count indicator */}
                      {item.images && item.images.length > 1 && (
                        <div className="absolute top-4 left-4 bg-gradient-to-r from-pink-500 to-violet-600 text-white text-sm px-3 py-1 rounded-full font-medium shadow-lg">
                          {item.images.length} фото
                        </div>
                      )}
                    </div>
                    
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="absolute bottom-6 left-6 right-6">
                        <h3 className="text-white font-semibold text-lg mb-2">{item.title}</h3>
                        <p className="text-white/80 text-sm">{item.category}</p>
                        {item.description && (
                          <p className="text-white/70 text-xs mt-1 line-clamp-2">{item.description}</p>
                        )}
                      </div>
                      
                      <div className="absolute top-6 right-6 flex space-x-2">
                        <motion.div
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-all"
                        >
                          <ArrowUpRight size={18} />
                        </motion.div>
                      </div>
                      
                      {/* Bottom action buttons */}
                      <div className="absolute bottom-6 right-6 flex space-x-2">
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                          }}
                          className="w-8 h-8 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-all"
                        >
                          <Heart size={14} />
                        </motion.button>
                        
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={async (e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            try {
                              await navigator.clipboard.writeText(`${window.location.origin}/portfolio/${item.id}`);
                              showToast('Посилання скопійовано!');
                            } catch (error) {
                              console.error('Помилка копіювання:', error);
                              showToast('Помилка копіювання', 'error');
                            }
                          }}
                          className="w-8 h-8 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-all"
                        >
                          <Share2 size={14} />
                        </motion.button>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        ) : (
          <div className="text-center py-16">
            <p className="text-xl text-gray-500">
              {activeCategory === 'Всі' 
                ? 'Портфоліо поки що порожнє' 
                : `Немає робіт у категорії "${activeCategory}"`
              }
            </p>
          </div>
        )}

        {/* Toast Notification */}
        <Toast
          message={toast.message}
          type={toast.type}
          isVisible={toast.isVisible}
          onClose={hideToast}
        />
      </div>
    </section>
  );
};

export default Portfolio;