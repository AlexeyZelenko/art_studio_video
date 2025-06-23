import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ChevronLeft, ChevronRight, Calendar, Tag, Share2, Heart, X } from 'lucide-react';
import { usePortfolio } from '../contexts/PortfolioContext';
import { useToast } from '../hooks/useToast';
import { PortfolioItem } from '../types/portfolio';
import LoadingSpinner from './LoadingSpinner';
import Toast from './Toast';

const PortfolioDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { portfolioItems, loading } = usePortfolio();
  const { toast, showToast, hideToast } = useToast();
  const [currentItem, setCurrentItem] = useState<PortfolioItem | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showFullscreen, setShowFullscreen] = useState(false);

  useEffect(() => {
    if (portfolioItems.length > 0 && id) {
      const item = portfolioItems.find(item => item.id === id);
      if (item) {
        setCurrentItem(item);
        setCurrentIndex(portfolioItems.findIndex(item => item.id === id));
        setCurrentImageIndex(0); // Reset image index when item changes
      } else {
        navigate('/');
      }
    }
  }, [portfolioItems, id, navigate]);

  const navigateToItem = (direction: 'prev' | 'next') => {
    let newIndex;
    if (direction === 'prev') {
      newIndex = currentIndex > 0 ? currentIndex - 1 : portfolioItems.length - 1;
    } else {
      newIndex = currentIndex < portfolioItems.length - 1 ? currentIndex + 1 : 0;
    }
    
    setCurrentIndex(newIndex);
    const newItem = portfolioItems[newIndex];
    setCurrentItem(newItem);
    setCurrentImageIndex(0); // Reset image index
    navigate(`/portfolio/${newItem.id}`, { replace: true });
  };

  const navigateImage = (direction: 'prev' | 'next') => {
    if (!currentItem?.images) return;
    
    if (direction === 'prev') {
      setCurrentImageIndex(prev => prev > 0 ? prev - 1 : currentItem.images.length - 1);
    } else {
      setCurrentImageIndex(prev => prev < currentItem.images.length - 1 ? prev + 1 : 0);
    }
  };

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      showToast('Посилання скопійовано!');
    } catch (error) {
      console.error('Помилка копіювання:', error);
      showToast('Помилка копіювання', 'error');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black flex items-center justify-center">
        <LoadingSpinner size="lg" text="Завантаження портфоліо..." />
      </div>
    );
  }

  if (!currentItem) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black flex items-center justify-center">
        <div className="text-center text-white">
          <h2 className="text-2xl font-bold mb-4">Роботу не знайдено</h2>
          <Link to="/" className="text-pink-400 hover:text-pink-300">
            Повернутися на головну
          </Link>
        </div>
      </div>
    );
  }

  // Get images array (with backward compatibility)
  const images = currentItem.images || [currentItem.imageUrl];
  const currentImage = images[currentImageIndex];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white">
      {/* Header with Navigation */}
      <div className="relative z-10 bg-black/20 backdrop-blur-sm border-b border-white/10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link 
              to="/"
              className="flex items-center space-x-2 text-white hover:text-pink-400 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Повернутися до портфоліо</span>
            </Link>
            
            <div className="flex items-center space-x-4">
              <span className="text-gray-300 text-sm">
                {currentIndex + 1} з {portfolioItems.length}
              </span>
              
              <button
                onClick={handleShare}
                className="p-2 bg-white/10 rounded-lg hover:bg-white/20 transition-colors"
              >
                <Share2 className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-4 md:py-8">
        <div className="grid lg:grid-cols-2 gap-6 lg:gap-12 items-start">
          {/* Image Gallery Section */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-4"
          >
            {/* Main Image */}
            <div className="relative group">
              <img
                src={currentImage}
                alt={`${currentItem.title} - ${currentImageIndex + 1}`}
                className="w-full h-auto rounded-2xl shadow-2xl cursor-pointer"
                onClick={() => setShowFullscreen(true)}
              />
              
              {/* Image Overlay */}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all rounded-2xl flex items-center justify-center opacity-0 group-hover:opacity-100">
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  className="bg-white/20 backdrop-blur-sm rounded-full p-4"
                >
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                  </svg>
                </motion.div>
              </div>

              {/* Image Navigation Buttons (if multiple images) */}
              {images.length > 1 && (
                <>
                  <button
                    onClick={() => navigateImage('prev')}
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/50 backdrop-blur-sm rounded-full p-2 text-white hover:bg-black/70 transition-all"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  
                  <button
                    onClick={() => navigateImage('next')}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/50 backdrop-blur-sm rounded-full p-2 text-white hover:bg-black/70 transition-all"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>

                  {/* Image counter */}
                  <div className="absolute bottom-4 left-4 bg-black/50 backdrop-blur-sm rounded-full px-3 py-1 text-white text-sm">
                    {currentImageIndex + 1} / {images.length}
                  </div>
                </>
              )}
            </div>

            {/* Thumbnails (if multiple images) */}
            {images.length > 1 && (
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2">
                {images.map((image, index) => (
                  <motion.div
                    key={index}
                    whileHover={{ scale: 1.05 }}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`relative aspect-square rounded-lg overflow-hidden cursor-pointer border-2 transition-all ${
                      index === currentImageIndex 
                        ? 'border-pink-500 shadow-lg' 
                        : 'border-white/20 hover:border-white/40'
                    }`}
                  >
                    <img
                      src={image}
                      alt={`${currentItem.title} - thumbnail ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                    {index === currentImageIndex && (
                      <div className="absolute inset-0 bg-pink-500/20" />
                    )}
                  </motion.div>
                ))}
              </div>
            )}

            {/* Portfolio Navigation Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 sm:justify-between pt-4">
              <button
                onClick={() => navigateToItem('prev')}
                className="flex items-center justify-center space-x-2 bg-white/10 hover:bg-white/20 px-4 py-2 rounded-xl transition-all"
              >
                <ChevronLeft className="w-4 h-4" />
                <span className="hidden sm:inline">Попередня робота</span>
                <span className="sm:hidden">Попередня</span>
              </button>
              
              <button
                onClick={() => navigateToItem('next')}
                className="flex items-center justify-center space-x-2 bg-white/10 hover:bg-white/20 px-4 py-2 rounded-xl transition-all"
              >
                <span className="hidden sm:inline">Наступна робота</span>
                <span className="sm:hidden">Наступна</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </motion.div>

          {/* Details Section */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="space-y-8"
          >
            {/* Title and Category */}
            <div>
              <motion.span
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="inline-flex items-center space-x-2 bg-gradient-to-r from-pink-500 to-violet-600 px-4 py-2 rounded-full text-sm font-medium mb-4"
              >
                <Tag className="w-4 h-4" />
                <span>{currentItem.category}</span>
              </motion.span>
              
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent mb-4"
              >
                {currentItem.title}
              </motion.h1>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-4 text-gray-400"
              >
                <div className="flex items-center space-x-2">
                  <Calendar className="w-4 h-4" />
                  <span>
                    {currentItem.createdAt ? new Date(currentItem.createdAt).toLocaleDateString('uk-UA', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    }) : 'Дата невідома'}
                  </span>
                </div>
                {images.length > 1 && (
                  <div className="flex items-center space-x-1">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z"/>
                    </svg>
                    <span>{images.length} фото</span>
                  </div>
                )}
              </motion.div>
            </div>

            {/* Description */}
            {currentItem.description && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10"
              >
                <h3 className="text-xl font-semibold mb-3">Про цю роботу</h3>
                <p className="text-gray-300 leading-relaxed">{currentItem.description}</p>
              </motion.div>
            )}

            {/* Action Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="flex space-x-4"
            >  
               <button 
                onClick={handleShare}
                className="flex items-center space-x-2 bg-gradient-to-r from-pink-500 to-violet-600 hover:from-pink-600 hover:to-violet-700 px-6 py-3 rounded-xl transition-all"
              >
                <Share2 className="w-5 h-5" />
                <span>Поділитися</span>
              </button>
            </motion.div>

            {/* Related Work or Call to Action */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="bg-gradient-to-r from-pink-500/10 to-violet-600/10 rounded-2xl p-6 border border-pink-500/20"
            >
              <h3 className="text-xl font-semibold mb-3">Подобається стиль?</h3>
              <p className="text-gray-300 mb-4">
                Замовте подібну фотосесію та створіть свої неповторні спогади разом з нами!
              </p>
              <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3">
                <Link
                  to="/#contact"
                  className="inline-flex items-center justify-center bg-gradient-to-r from-pink-500 to-violet-600 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-all"
                >
                  Замовити фотосесію
                </Link>
                <Link
                  to="/#portfolio"
                  className="inline-flex items-center justify-center bg-white/10 hover:bg-white/20 text-white px-6 py-3 rounded-xl font-semibold border border-white/20 transition-all"
                >
                  Все портфоліо
                </Link>
              </div>
            </motion.div>
          </motion.div>
        </div>

        {/* Related Works */}
        {portfolioItems.length > 1 && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1, duration: 0.8 }}
            className="mt-20"
          >
            <h3 className="text-2xl font-bold text-white mb-8 text-center">Інші роботи</h3>
            <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-6">
              {portfolioItems
                .filter(item => item.id !== currentItem.id)
                .slice(0, 4)
                .map((item, index) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.2 + index * 0.1 }}
                  >
                    <Link 
                      to={`/portfolio/${item.id}`}
                      className="group block bg-white/5 backdrop-blur-sm rounded-2xl overflow-hidden border border-white/10 hover:bg-white/10 transition-all"
                    >
                      <div className="aspect-square relative">
                        <img
                          src={item.imageUrl}
                          alt={item.title}
                          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                        {item.images && item.images.length > 1 && (
                          <div className="absolute top-2 right-2 bg-gradient-to-r from-pink-500 to-violet-600 text-white text-xs px-2 py-1 rounded-full">
                            +{item.images.length - 1}
                          </div>
                        )}
                      </div>
                      <div className="p-4">
                        <h4 className="text-white font-semibold text-sm mb-1 truncate">{item.title}</h4>
                        <p className="text-gray-400 text-xs">{item.category}</p>
                      </div>
                    </Link>
                  </motion.div>
                ))}
            </div>
          </motion.div>
        )}
      </div>

      {/* Fullscreen Modal */}
      <AnimatePresence>
        {showFullscreen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/95 flex items-center justify-center z-50 p-4"
            onClick={() => setShowFullscreen(false)}
          >
            <button
              onClick={() => setShowFullscreen(false)}
              className="absolute top-4 right-4 bg-white/10 backdrop-blur-sm rounded-full p-3 text-white hover:bg-white/20 transition-all z-10"
            >
              <X className="w-6 h-6" />
            </button>
            
            {/* Fullscreen Image Navigation */}
            {images.length > 1 && (
              <>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    navigateImage('prev');
                  }}
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/10 backdrop-blur-sm rounded-full p-3 text-white hover:bg-white/20 transition-all z-10"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
                
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    navigateImage('next');
                  }}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/10 backdrop-blur-sm rounded-full p-3 text-white hover:bg-white/20 transition-all z-10"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>

                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/50 backdrop-blur-sm rounded-full px-4 py-2 text-white text-sm z-10">
                  {currentImageIndex + 1} / {images.length}
                </div>
              </>
            )}
            
            <motion.img
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
              src={currentImage}
              alt={`${currentItem.title} - ${currentImageIndex + 1}`}
              className="max-w-full max-h-full object-contain"
              onClick={(e) => e.stopPropagation()}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Toast Notification */}
      <Toast
        message={toast.message}
        type={toast.type}
        isVisible={toast.isVisible}
        onClose={hideToast}
      />
    </div>
  );
};

export default PortfolioDetail; 