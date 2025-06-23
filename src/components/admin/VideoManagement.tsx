import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Edit, Trash2, Eye, EyeOff, Video, Play, ExternalLink } from 'lucide-react';
import { useVideo } from '../../contexts/VideoContext';
import { VideoService, VideoPortfolioItem } from '../../types/video';
import VideoServiceForm from './VideoServiceForm';
import VideoPortfolioForm from './VideoPortfolioForm';
import * as LucideIcons from 'lucide-react';

const VideoManagement: React.FC = () => {
  const { 
    videoServices, 
    videoPortfolio, 
    servicesLoading, 
    portfolioLoading, 
    deleteVideoService, 
    updateVideoService,
    deleteVideoPortfolioItem,
    refreshVideoData 
  } = useVideo();
  
  const [activeTab, setActiveTab] = useState<'services' | 'portfolio'>('services');
  const [showServiceForm, setShowServiceForm] = useState(false);
  const [showPortfolioForm, setShowPortfolioForm] = useState(false);
  const [editingService, setEditingService] = useState<VideoService | null>(null);
  const [editingPortfolioItem, setEditingPortfolioItem] = useState<VideoPortfolioItem | null>(null);

  const handleEditService = (service: VideoService) => {
    setEditingService(service);
    setShowServiceForm(true);
  };

  const handleDeleteService = async (service: VideoService) => {
    if (window.confirm(`Ви впевнені, що хочете видалити послугу "${service.title}"?`)) {
      try {
        await deleteVideoService(service.id);
      } catch (error) {
        alert('Помилка при видаленні послуги');
      }
    }
  };

  const handleToggleServiceActive = async (service: VideoService) => {
    try {
      await updateVideoService(service.id, { isActive: !service.isActive });
    } catch (error) {
      alert('Помилка при зміні статусу послуги');
    }
  };

  const handleEditPortfolioItem = (item: VideoPortfolioItem) => {
    setEditingPortfolioItem(item);
    setShowPortfolioForm(true);
  };

  const handleDeletePortfolioItem = async (item: VideoPortfolioItem) => {
    if (window.confirm(`Ви впевнені, що хочете видалити відео "${item.title}"?`)) {
      try {
        await deleteVideoPortfolioItem(item.id);
      } catch (error) {
        alert('Помилка при видаленні відео');
      }
    }
  };

  const handleCloseServiceForm = () => {
    setShowServiceForm(false);
    setEditingService(null);
  };

  const handleClosePortfolioForm = () => {
    setShowPortfolioForm(false);
    setEditingPortfolioItem(null);
  };

  const handleServiceSuccess = async () => {
    await refreshVideoData();
    handleCloseServiceForm();
  };

  const handlePortfolioSuccess = async () => {
    await refreshVideoData();
    handleClosePortfolioForm();
  };

  const getIcon = (iconName: string) => {
    const IconComponent = (LucideIcons as any)[iconName];
    return IconComponent ? <IconComponent className="w-6 h-6" /> : <LucideIcons.Video className="w-6 h-6" />;
  };

  const loading = servicesLoading || portfolioLoading;

  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="text-white text-xl">Завантаження відео даних...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">
            Управління відео контентом
          </h2>
          <p className="text-gray-300">
            Керуйте відео послугами та портфоліо
          </p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => {
            if (activeTab === 'services') {
              setShowServiceForm(true);
            } else {
              setShowPortfolioForm(true);
            }
          }}
          className="bg-gradient-to-r from-pink-500 to-violet-600 px-6 py-3 rounded-xl font-semibold flex items-center space-x-2 text-white"
        >
          <Plus className="w-5 h-5" />
          <span>{activeTab === 'services' ? 'Додати послугу' : 'Додати відео'}</span>
        </motion.button>
      </div>

      {/* Tabs */}
      <div className="flex space-x-1 bg-white/10 backdrop-blur-sm rounded-2xl p-1">
        <button
          onClick={() => setActiveTab('services')}
          className={`flex-1 flex items-center justify-center space-x-2 py-3 px-4 rounded-xl font-semibold transition-all ${
            activeTab === 'services'
              ? 'bg-gradient-to-r from-pink-500 to-violet-600 text-white'
              : 'text-gray-300 hover:text-white hover:bg-white/10'
          }`}
        >
          <Video className="w-5 h-5" />
          <span>Відео послуги</span>
        </button>
        <button
          onClick={() => setActiveTab('portfolio')}
          className={`flex-1 flex items-center justify-center space-x-2 py-3 px-4 rounded-xl font-semibold transition-all ${
            activeTab === 'portfolio'
              ? 'bg-gradient-to-r from-pink-500 to-violet-600 text-white'
              : 'text-gray-300 hover:text-white hover:bg-white/10'
          }`}
        >
          <Play className="w-5 h-5" />
          <span>Відео портфоліо</span>
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === 'services' ? (
        <>
          {/* Services Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/10">
              <div className="text-2xl font-bold text-pink-400 mb-1">{videoServices.length}</div>
              <div className="text-gray-300 text-sm">Всього послуг</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/10">
              <div className="text-2xl font-bold text-green-400 mb-1">
                {videoServices.filter(s => s.isActive).length}
              </div>
              <div className="text-gray-300 text-sm">Активних</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/10">
              <div className="text-2xl font-bold text-gray-400 mb-1">
                {videoServices.filter(s => !s.isActive).length}
              </div>
              <div className="text-gray-300 text-sm">Неактивних</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/10">
              <div className="text-2xl font-bold text-violet-400 mb-1">
                {Math.max(...videoServices.map(s => s.order), 0)}
              </div>
              <div className="text-gray-300 text-sm">Макс. порядок</div>
            </div>
          </div>

          {/* Services List */}
          <div className="space-y-4">
            {videoServices.length === 0 ? (
              <div className="text-center py-16 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10">
                <Video className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <div className="text-xl font-semibold text-gray-300 mb-2">Відео послуги відсутні</div>
                <p className="text-gray-400 mb-6">Додайте першу відео послугу</p>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowServiceForm(true)}
                  className="bg-gradient-to-r from-pink-500 to-violet-600 px-8 py-3 rounded-xl font-semibold text-white"
                >
                  Додати послугу
                </motion.button>
              </div>
            ) : (
              videoServices
                .sort((a, b) => a.order - b.order)
                .map((service) => (
                  <motion.div
                    key={service.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/10 ${
                      !service.isActive ? 'opacity-60' : ''
                    }`}
                  >
                    <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                      <div className="flex-1">
                        <div className="flex items-start space-x-4">
                          <div className={`w-12 h-12 bg-gradient-to-r ${service.gradient} rounded-xl flex items-center justify-center text-white flex-shrink-0`}>
                            {getIcon(service.iconName)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center space-x-3 mb-2">
                              <h3 className="text-xl font-semibold text-white truncate">
                                {service.title}
                              </h3>
                              <span className="text-sm bg-white/20 px-2 py-1 rounded-full text-white">
                                #{service.order}
                              </span>
                              {!service.isActive && (
                                <span className="text-xs bg-red-500/20 text-red-300 px-2 py-1 rounded-full">
                                  Неактивна
                                </span>
                              )}
                            </div>
                            <p className="text-gray-300 mb-3 line-clamp-2">
                              {service.description}
                            </p>
                            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-400">
                              <span className="font-semibold text-pink-400">
                                {service.price}
                              </span>
                              <span>
                                {service.features.length} особливостей
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2">
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => handleToggleServiceActive(service)}
                          className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
                            service.isActive
                              ? 'bg-green-500/20 text-green-400 hover:bg-green-500/30'
                              : 'bg-gray-500/20 text-gray-400 hover:bg-gray-500/30'
                          }`}
                        >
                          {service.isActive ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
                        </motion.button>

                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => handleEditService(service)}
                          className="w-10 h-10 bg-blue-500/20 text-blue-400 rounded-full flex items-center justify-center hover:bg-blue-500/30 transition-colors"
                        >
                          <Edit className="w-5 h-5" />
                        </motion.button>

                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => handleDeleteService(service)}
                          className="w-10 h-10 bg-red-500/20 text-red-400 rounded-full flex items-center justify-center hover:bg-red-500/30 transition-colors"
                        >
                          <Trash2 className="w-5 h-5" />
                        </motion.button>
                      </div>
                    </div>
                  </motion.div>
                ))
            )}
          </div>
        </>
      ) : (
        <>
          {/* Portfolio Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/10">
              <div className="text-2xl font-bold text-pink-400 mb-1">{videoPortfolio.length}</div>
              <div className="text-gray-300 text-sm">Всього відео</div>
            </div>
            {['Весілля', 'Корпоратив', 'Реклама'].map((category) => (
              <div key={category} className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/10">
                <div className="text-2xl font-bold text-violet-400 mb-1">
                  {videoPortfolio.filter(item => item.category === category).length}
                </div>
                <div className="text-gray-300 text-sm">{category}</div>
              </div>
            ))}
          </div>

          {/* Portfolio Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {videoPortfolio.length === 0 ? (
              <div className="col-span-full text-center py-16 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10">
                <Play className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <div className="text-xl font-semibold text-gray-300 mb-2">Відео портфоліо порожнє</div>
                <p className="text-gray-400 mb-6">Додайте перше відео до портфоліо</p>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowPortfolioForm(true)}
                  className="bg-gradient-to-r from-pink-500 to-violet-600 px-8 py-3 rounded-xl font-semibold text-white"
                >
                  Додати відео
                </motion.button>
              </div>
            ) : (
              videoPortfolio.map((item) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-white/10 backdrop-blur-sm rounded-2xl overflow-hidden border border-white/10 group"
                >
                  <div className="aspect-video relative">
                    <img
                      src={item.thumbnailUrl}
                      alt={item.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center space-x-2">
                      <motion.a
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        href={item.youtubeUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center text-white"
                      >
                        <ExternalLink className="w-5 h-5" />
                      </motion.a>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => handleEditPortfolioItem(item)}
                        className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white"
                      >
                        <Edit className="w-5 h-5" />
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => handleDeletePortfolioItem(item)}
                        className="w-10 h-10 bg-red-500 rounded-full flex items-center justify-center text-white"
                      >
                        <Trash2 className="w-5 h-5" />
                      </motion.button>
                    </div>
                    <div className="absolute top-2 right-2 bg-gradient-to-r from-pink-500 to-violet-600 text-white text-xs px-2 py-1 rounded-full">
                      {item.category}
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-white mb-1 truncate">{item.title}</h3>
                    {item.description && (
                      <p className="text-xs text-gray-400 line-clamp-2">{item.description}</p>
                    )}
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </>
      )}

      {/* Forms */}
      {showServiceForm && (
        <VideoServiceForm
          service={editingService}
          onClose={handleCloseServiceForm}
          onSuccess={handleServiceSuccess}
        />
      )}

      {showPortfolioForm && (
        <VideoPortfolioForm
          item={editingPortfolioItem}
          onClose={handleClosePortfolioForm}
          onSuccess={handlePortfolioSuccess}
        />
      )}
    </div>
  );
};

export default VideoManagement;