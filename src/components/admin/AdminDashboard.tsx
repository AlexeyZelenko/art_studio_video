import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, LogOut, Edit, Trash2, Image as ImageIcon, User, Settings, Camera, Home, Video } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { usePortfolio } from '../../contexts/PortfolioContext';
import { useServices } from '../../contexts/ServicesContext';
import { PortfolioItem } from '../../types/portfolio';
import PortfolioForm from './PortfolioForm';
import ServicesManagement from './ServicesManagement';
import VideoManagement from './VideoManagement';

const AdminDashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const { portfolioItems, loading: portfolioLoading, deletePortfolioItem } = usePortfolio();
  const { services, loading: servicesLoading } = useServices();
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState<PortfolioItem | null>(null);
  const [activeTab, setActiveTab] = useState<'portfolio' | 'services' | 'video'>('portfolio');

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const handleEdit = (item: PortfolioItem) => {
    setEditingItem(item);
    setShowForm(true);
  };

  const handleDelete = async (item: PortfolioItem) => {
    if (window.confirm(`Ви впевнені, що хочете видалити "${item.title}"?`)) {
      try {
        await deletePortfolioItem(item.id, item.images || [item.imageUrl]);
      } catch (error) {
        alert('Помилка при видаленні роботи');
      }
    }
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingItem(null);
  };

  const categories = ['Всі', 'Портрети', 'Весілля', 'Сім\'я', 'Fashion', 'Корпоратив'];

  const loading = portfolioLoading || servicesLoading;

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black flex items-center justify-center">
        <div className="text-white text-xl">Завантаження...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-8">
          <div>
            <h1 className="text-2xl md:text-4xl font-bold bg-gradient-to-r from-pink-400 to-violet-400 bg-clip-text text-transparent">
              Адмін-панель
            </h1>
            <p className="text-gray-300 mt-2">Управління контентом студії</p>
            {user && (
              <div className="flex items-center space-x-2 mt-2">
                <User className="w-4 h-4 text-gray-400" />
                <span className="text-sm text-gray-400">
                  {user.displayName || user.email}
                </span>
              </div>
            )}
          </div>
          <div className="flex flex-col sm:flex-row gap-3 sm:space-x-4">
            {/* Home Page Button */}
            <Link to="/">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-gradient-to-r from-green-500 to-teal-600 px-4 md:px-6 py-3 rounded-xl font-semibold flex items-center justify-center space-x-2 text-white"
              >
                <Home className="w-5 h-5" />
                <span>На головну</span>
              </motion.button>
            </Link>
            
            {activeTab === 'portfolio' && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowForm(true)}
                className="bg-gradient-to-r from-pink-500 to-violet-600 px-4 md:px-6 py-3 rounded-xl font-semibold flex items-center justify-center space-x-2"
              >
                <Plus className="w-5 h-5" />
                <span>Додати роботу</span>
              </motion.button>
            )}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleLogout}
              className="bg-red-500 hover:bg-red-600 px-4 md:px-6 py-3 rounded-xl font-semibold flex items-center justify-center space-x-2"
            >
              <LogOut className="w-5 h-5" />
              <span>Вийти</span>
            </motion.button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex space-x-1 mb-8 bg-white/10 backdrop-blur-sm rounded-2xl p-1">
          <button
            onClick={() => setActiveTab('portfolio')}
            className={`flex-1 flex items-center justify-center space-x-2 py-3 px-4 rounded-xl font-semibold transition-all ${
              activeTab === 'portfolio'
                ? 'bg-gradient-to-r from-pink-500 to-violet-600 text-white'
                : 'text-gray-300 hover:text-white hover:bg-white/10'
            }`}
          >
            <ImageIcon className="w-5 h-5" />
            <span>Фото портфоліо</span>
          </button>
          <button
            onClick={() => setActiveTab('services')}
            className={`flex-1 flex items-center justify-center space-x-2 py-3 px-4 rounded-xl font-semibold transition-all ${
              activeTab === 'services'
                ? 'bg-gradient-to-r from-pink-500 to-violet-600 text-white'
                : 'text-gray-300 hover:text-white hover:bg-white/10'
            }`}
          >
            <Settings className="w-5 h-5" />
            <span>Фото послуги</span>
          </button>
          <button
            onClick={() => setActiveTab('video')}
            className={`flex-1 flex items-center justify-center space-x-2 py-3 px-4 rounded-xl font-semibold transition-all ${
              activeTab === 'video'
                ? 'bg-gradient-to-r from-pink-500 to-violet-600 text-white'
                : 'text-gray-300 hover:text-white hover:bg-white/10'
            }`}
          >
            <Video className="w-5 h-5" />
            <span>Відео</span>
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === 'portfolio' ? (
          <>
            {/* Portfolio Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 md:gap-6 mb-8">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
                <div className="text-3xl font-bold text-pink-400 mb-2">{portfolioItems.length}</div>
                <div className="text-gray-300">Всього робіт</div>
              </div>
              {categories.slice(1).map((category) => (
                <div key={category} className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
                  <div className="text-3xl font-bold text-violet-400 mb-2">
                    {portfolioItems.filter(item => item.category === category).length}
                  </div>
                  <div className="text-gray-300">{category}</div>
                </div>
              ))}
            </div>

            {/* Portfolio Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
              {portfolioItems.map((item) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-white/10 backdrop-blur-sm rounded-2xl overflow-hidden border border-white/10 group"
                >
                  <div className="aspect-square relative">
                    <img
                      src={item.imageUrl}
                      alt={item.title}
                      className="w-full h-full object-cover"
                    />
                    {/* Image count indicator */}
                    {item.images && item.images.length > 1 && (
                      <div className="absolute top-2 right-2 bg-gradient-to-r from-pink-500 to-violet-600 text-white text-xs px-2 py-1 rounded-full">
                        +{item.images.length - 1}
                      </div>
                    )}
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center space-x-2">
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => handleEdit(item)}
                        className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white"
                      >
                        <Edit className="w-5 h-5" />
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => handleDelete(item)}
                        className="w-10 h-10 bg-red-500 rounded-full flex items-center justify-center text-white"
                      >
                        <Trash2 className="w-5 h-5" />
                      </motion.button>
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-white mb-1">{item.title}</h3>
                    <p className="text-sm text-gray-300">{item.category}</p>
                    {item.description && (
                      <p className="text-xs text-gray-400 mt-2 line-clamp-2">{item.description}</p>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>

            {portfolioItems.length === 0 && (
              <div className="text-center py-16">
                <ImageIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-300 mb-2">Портфоліо порожнє</h3>
                <p className="text-gray-400 mb-6">Додайте першу роботу до вашого портфоліо</p>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowForm(true)}
                  className="bg-gradient-to-r from-pink-500 to-violet-600 px-8 py-3 rounded-xl font-semibold"
                >
                  Додати роботу
                </motion.button>
              </div>
            )}
          </>
        ) : activeTab === 'services' ? (
          <ServicesManagement />
        ) : (
          <VideoManagement />
        )}
      </div>

      {/* Portfolio Form Modal */}
      {showForm && (
        <PortfolioForm
          item={editingItem}
          onClose={handleCloseForm}
          onSuccess={handleCloseForm}
        />
      )}
    </div>
  );
};

export default AdminDashboard;