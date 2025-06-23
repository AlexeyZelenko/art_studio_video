import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Edit, Trash2, Eye, EyeOff } from 'lucide-react';
import { useServices } from '../../contexts/ServicesContext';
import { Service } from '../../types/service';
import ServiceForm from './ServiceForm';
import * as LucideIcons from 'lucide-react';

const ServicesManagement: React.FC = () => {
  const { services, loading, deleteService, updateService, refreshServices } = useServices();
  const [showForm, setShowForm] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);

  const handleEdit = (service: Service) => {
    setEditingService(service);
    setShowForm(true);    
  };

  const handleDelete = async (service: Service) => {
    if (window.confirm(`Ви впевнені, що хочете видалити послугу "${service.title}"?`)) {
      try {
        await deleteService(service.id);
      } catch (error) {
        alert('Помилка при видаленні послуги');
      }
    }
  };

  const handleToggleActive = async (service: Service) => {
    try {
      await updateService(service.id, { isActive: !service.isActive });
    } catch (error) {
      alert('Помилка при зміні статусу послуги');
    }
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingService(null);
  };

  const handleSuccess = async () => {
    // Обновляем данные после успешного сохранения
    await refreshServices();
    handleCloseForm();
  };

  const getIcon = (iconName: string) => {
    const IconComponent = (LucideIcons as any)[iconName];
    return IconComponent ? <IconComponent className="w-6 h-6" /> : <LucideIcons.Camera className="w-6 h-6" />;
  };

  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="text-white text-xl">Завантаження послуг...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">
            Управління послугами
          </h2>
          <p className="text-gray-300">
            Керуйте послугами, які відображаються на головній сторінці
          </p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowForm(true)}
          className="bg-gradient-to-r from-pink-500 to-violet-600 px-6 py-3 rounded-xl font-semibold flex items-center space-x-2 text-white"
        >
          <Plus className="w-5 h-5" />
          <span>Додати послугу</span>
        </motion.button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/10">
          <div className="text-2xl font-bold text-pink-400 mb-1">{services.length}</div>
          <div className="text-gray-300 text-sm">Всього послуг</div>
        </div>
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/10">
          <div className="text-2xl font-bold text-green-400 mb-1">
            {services.filter(s => s.isActive).length}
          </div>
          <div className="text-gray-300 text-sm">Активних</div>
        </div>
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/10">
          <div className="text-2xl font-bold text-gray-400 mb-1">
            {services.filter(s => !s.isActive).length}
          </div>
          <div className="text-gray-300 text-sm">Неактивних</div>
        </div>
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/10">
          <div className="text-2xl font-bold text-violet-400 mb-1">
            {Math.max(...services.map(s => s.order), 0)}
          </div>
          <div className="text-gray-300 text-sm">Макс. порядок</div>
        </div>
      </div>

      {/* Services List */}
      <div className="space-y-4">
        {services.length === 0 ? (
          <div className="text-center py-16 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10">
            <div className="text-xl font-semibold text-gray-300 mb-2">Послуги відсутні</div>
            <p className="text-gray-400 mb-6">Додайте першу послугу для відображення на сайті</p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowForm(true)}
              className="bg-gradient-to-r from-pink-500 to-violet-600 px-8 py-3 rounded-xl font-semibold text-white"
            >
              Додати послугу
            </motion.button>
          </div>
        ) : (
          services
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
                  {/* Service Info */}
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
                          <span>
                            Оновлено: {service.updatedAt.toLocaleDateString('uk-UA')}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center space-x-2 lg:flex-col lg:space-x-0 lg:space-y-2">
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => handleToggleActive(service)}
                      className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
                        service.isActive
                          ? 'bg-green-500/20 text-green-400 hover:bg-green-500/30'
                          : 'bg-gray-500/20 text-gray-400 hover:bg-gray-500/30'
                      }`}
                      title={service.isActive ? 'Деактивувати' : 'Активувати'}
                    >
                      {service.isActive ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
                    </motion.button>

                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => handleEdit(service)}
                      className="w-10 h-10 bg-blue-500/20 text-blue-400 rounded-full flex items-center justify-center hover:bg-blue-500/30 transition-colors"
                      title="Редагувати"
                    >
                      <Edit className="w-5 h-5" />
                    </motion.button>

                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => handleDelete(service)}
                      className="w-10 h-10 bg-red-500/20 text-red-400 rounded-full flex items-center justify-center hover:bg-red-500/30 transition-colors"
                      title="Видалити"
                    >
                      <Trash2 className="w-5 h-5" />
                    </motion.button>
                  </div>
                </div>

                {/* Features Preview */}
                {service.features.length > 0 && (
                  <div className="mt-4 pt-4 border-t border-white/10">
                    <div className="flex flex-wrap gap-2">
                      {service.features.slice(0, 3).map((feature, index) => (
                        <span
                          key={index}
                          className="text-xs bg-white/10 text-gray-300 px-2 py-1 rounded-full"
                        >
                          {feature}
                        </span>
                      ))}
                      {service.features.length > 3 && (
                        <span className="text-xs bg-white/10 text-gray-400 px-2 py-1 rounded-full">
                          +{service.features.length - 3} ще
                        </span>
                      )}
                    </div>
                  </div>
                )}
              </motion.div>
            ))
        )}
      </div>

      {/* Service Form Modal */}
      {showForm && (
        <ServiceForm
          service={editingService}
          onClose={handleCloseForm}
          onSuccess={handleSuccess}
        />
      )}
    </div>
  );
};

export default ServicesManagement;