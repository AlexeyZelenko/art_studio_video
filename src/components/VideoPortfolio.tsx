import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Calendar, Tag, ExternalLink } from 'lucide-react';
import { useVideo } from '../contexts/VideoContext';

const VideoPortfolio = () => {
  const { videoPortfolio, portfolioLoading } = useVideo();
  const [activeCategory, setActiveCategory] = useState('Всі');

  const categories = ['Всі', 'Весілля', 'Корпоратив', 'Реклама', 'Музика', 'Документальне', 'Event'];

  const filteredItems = activeCategory === 'Всі' 
    ? videoPortfolio 
    : videoPortfolio.filter(item => item.category === activeCategory);

  // Helper function to extract YouTube video ID
  const extractYouTubeId = (url: string): string | null => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  // Helper function to get YouTube embed URL
  const getYouTubeEmbedUrl = (url: string): string => {
    const videoId = extractYouTubeId(url);
    return videoId ? `https://www.youtube.com/embed/${videoId}` : '';
  };

  const openVideo = (url: string) => {
    window.open(url, '_blank');
  };

  if (portfolioLoading) {
    return (
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="text-xl text-gray-600">Завантаження відео портфоліо...</div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-6 bg-gradient-to-r from-pink-600 to-violet-600 bg-clip-text text-transparent">
            Наше відео портфоліо
          </h2>
          <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto">
            Переглянь наші найкращі відео роботи та відчуй силу кінематографічного мистецтва
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

        {/* Video Portfolio Grid */}
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
                  className="group relative overflow-hidden rounded-3xl bg-white shadow-lg hover:shadow-2xl transition-all duration-300"
                >
                  {/* Video Thumbnail */}
                  <div className="aspect-video relative">
                    <img
                      src={
                        item.customThumbnailUrl || 
                        item.thumbnailUrl || 
                        `https://img.youtube.com/vi/${extractYouTubeId(item.youtubeUrl)}/maxresdefault.jpg`
                      }
                      alt={item.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    
                    {/* Play Button Overlay */}
                    <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => openVideo(item.youtubeUrl)}
                        className="w-16 h-16 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center text-pink-600 hover:bg-white transition-all shadow-lg"
                      >
                        <Play className="w-8 h-8 ml-1" fill="currentColor" />
                      </motion.button>
                    </div>

                    {/* Category Badge */}
                    <div className="absolute top-4 left-4 bg-gradient-to-r from-pink-500 to-violet-600 text-white text-sm px-3 py-1 rounded-full font-medium shadow-lg">
                      {item.category}
                    </div>

                    {/* Custom Thumbnail Indicator */}
                    {item.customThumbnailUrl && (
                      <div className="absolute bottom-4 left-4 bg-green-500 text-white text-xs px-2 py-1 rounded-full font-medium shadow-lg">
                        Кастомна мініатюра
                      </div>
                    )}

                    {/* External Link Button */}
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => openVideo(item.youtubeUrl)}
                      className="absolute top-4 right-4 w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-all opacity-0 group-hover:opacity-100"
                    >
                      <ExternalLink size={18} />
                    </motion.button>
                  </div>
                  
                  {/* Video Info */}
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-800 mb-2 group-hover:text-pink-600 transition-colors">
                      {item.title}
                    </h3>
                    
                    {item.description && (
                      <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                        {item.description}
                      </p>
                    )}
                    
                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <div className="flex items-center space-x-2">
                        <Calendar className="w-4 h-4" />
                        <span>
                          {item.createdAt ? new Date(item.createdAt).toLocaleDateString('uk-UA', {
                            year: 'numeric',
                            month: 'short'
                          }) : 'Дата невідома'}
                        </span>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Tag className="w-4 h-4" />
                        <span>{item.category}</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        ) : (
          <div className="text-center py-16">
            <p className="text-xl text-gray-500">
              {activeCategory === 'Всі' 
                ? 'Відео портфоліо поки що порожнє' 
                : `Немає відео у категорії "${activeCategory}"`
              }
            </p>
          </div>
        )}

        {/* Call to Action */}
        {filteredItems.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mt-16"
          >
            <div className="bg-gradient-to-r from-pink-500/10 to-violet-600/10 rounded-3xl p-8 border border-pink-500/20">
              <h3 className="text-2xl font-bold text-gray-800 mb-4">
                Готові створити своє відео?
              </h3>
              <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
                Зв'яжіться з нами, щоб обговорити ваш проект та створити неперевершене відео, 
                яке розповість вашу унікальну історію.
              </p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="bg-gradient-to-r from-pink-500 to-violet-600 text-white px-8 py-4 rounded-full font-semibold text-lg hover:shadow-xl transition-all"
              >
                Замовити відео
              </motion.button>
            </div>
          </motion.div>
        )}
      </div>
    </section>
  );
};

export default VideoPortfolio;