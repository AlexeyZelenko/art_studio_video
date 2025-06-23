import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X, Plus, Trash2 } from 'lucide-react';
import { useServices } from '../../contexts/ServicesContext';
import { Service, ServiceFormData } from '../../types/service';

interface ServiceFormProps {
  service?: Service | null;
  onClose: () => void;
  onSuccess: () => void;
}

const ServiceForm: React.FC<ServiceFormProps> = ({ service, onClose, onSuccess }) => {
  const { addService, updateService } = useServices();
  const [formData, setFormData] = useState<ServiceFormData>({
    title: service?.title || '',
    description: service?.description || '',
    price: service?.price || '',
    features: service?.features || [''],
    iconName: service?.iconName || 'Camera',
    gradient: service?.gradient || 'from-pink-500 to-rose-500',
    order: service?.order || 1,
    isActive: service?.isActive ?? true
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const iconOptions = [
    'Camera', 'Heart', 'Briefcase', 'Users', 'Baby', 'Zap', 
    'Star', 'Award', 'Crown', 'Sparkles', 'Image', 'Video'
  ];

  const gradientOptions = [
    { name: 'Pink to Rose', value: 'from-pink-500 to-rose-500' },
    { name: 'Purple to Indigo', value: 'from-purple-500 to-indigo-500' },
    { name: 'Blue to Cyan', value: 'from-blue-500 to-cyan-500' },
    { name: 'Green to Teal', value: 'from-green-500 to-teal-500' },
    { name: 'Yellow to Orange', value: 'from-yellow-500 to-orange-500' },
    { name: 'Violet to Purple', value: 'from-violet-500 to-purple-500' },
    { name: 'Red to Pink', value: 'from-red-500 to-pink-500' },
    { name: 'Indigo to Blue', value: 'from-indigo-500 to-blue-500' }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title.trim()) {
      setError('Будь ласка, введіть назву послуги');
      return;
    }

    if (!formData.description.trim()) {
      setError('Будь ласка, введіть опис послуги');
      return;
    }

    if (!formData.price.trim()) {
      setError('Будь ласка, введіть ціну послуги');
      return;
    }

    const validFeatures = formData.features.filter(f => f.trim());
    if (validFeatures.length === 0) {
      setError('Будь ласка, додайте хоча б одну особливість');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const serviceData = {
        ...formData,
        features: validFeatures
      };

      if (service) {
        await updateService(service.id, serviceData);
      } else {
        await addService(serviceData);
      }
      
      onSuccess();
    } catch (error: any) {
      setError('Помилка при збереженні послуги');
      console.error('Error saving service:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else if (name === 'order') {
      setFormData(prev => ({ ...prev, [name]: parseInt(value) || 1 }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const addFeature = () => {
    setFormData(prev => ({
      ...prev,
      features: [...prev.features, '']
    }));
  };

  const removeFeature = (index: number) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features.filter((_, i) => i !== index)
    }));
  };

  const updateFeature = (index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features.map((feature, i) => i === index ? value : feature)
    }));
  };

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-2 sm:p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white/10 backdrop-blur-lg rounded-3xl p-4 sm:p-6 md:p-8 w-full max-w-2xl border border-white/20 max-h-[95vh] sm:max-h-[90vh] overflow-y-auto"
      >
        <div className="flex justify-between items-center mb-4 md:mb-6">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-white">
            {service ? 'Редагувати послугу' : 'Додати нову послугу'}
          </h2>
          <button
            onClick={onClose}
            className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center text-white hover:bg-white/20 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Назва послуги *
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-pink-500 focus:ring-2 focus:ring-pink-500/20"
              placeholder="Введіть назву послуги"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Опис послуги *
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              rows={3}
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-pink-500 focus:ring-2 focus:ring-pink-500/20 resize-none"
              placeholder="Короткий опис послуги..."
            />
          </div>

          {/* Price */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Ціна *
            </label>
            <input
              type="text"
              name="price"
              value={formData.price}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-pink-500 focus:ring-2 focus:ring-pink-500/20"
              placeholder="від 1500 грн"
            />
          </div>

          {/* Features */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Особливості послуги *
            </label>
            <div className="space-y-3">
              {formData.features.map((feature, index) => (
                <div key={index} className="flex space-x-2">
                  <input
                    type="text"
                    value={feature}
                    onChange={(e) => updateFeature(index, e.target.value)}
                    className="flex-1 px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-pink-500 focus:ring-2 focus:ring-pink-500/20"
                    placeholder="Особливість послуги"
                  />
                  {formData.features.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeFeature(index)}
                      className="w-12 h-12 bg-red-500/20 hover:bg-red-500/30 rounded-xl flex items-center justify-center text-red-400 transition-colors"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                onClick={addFeature}
                className="w-full py-3 bg-white/10 hover:bg-white/20 rounded-xl flex items-center justify-center space-x-2 text-white transition-colors border-2 border-dashed border-white/20"
              >
                <Plus className="w-5 h-5" />
                <span>Додати особливість</span>
              </button>
            </div>
          </div>

          {/* Icon and Gradient */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Іконка
              </label>
              <select
                name="iconName"
                value={formData.iconName}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:border-pink-500 focus:ring-2 focus:ring-pink-500/20"
              >
                {iconOptions.map((icon) => (
                  <option key={icon} value={icon} className="bg-gray-800">
                    {icon}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Градієнт
              </label>
              <select
                name="gradient"
                value={formData.gradient}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:border-pink-500 focus:ring-2 focus:ring-pink-500/20"
              >
                {gradientOptions.map((gradient) => (
                  <option key={gradient.value} value={gradient.value} className="bg-gray-800">
                    {gradient.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Order and Active Status */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Порядок відображення
              </label>
              <input
                type="number"
                name="order"
                value={formData.order}
                onChange={handleChange}
                min="1"
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-pink-500 focus:ring-2 focus:ring-pink-500/20"
              />
            </div>

            <div className="flex items-center space-x-3 pt-8">
              <input
                type="checkbox"
                name="isActive"
                checked={formData.isActive}
                onChange={handleChange}
                className="w-5 h-5 text-pink-500 bg-white/10 border-white/20 rounded focus:ring-pink-500 focus:ring-2"
              />
              <label className="text-sm font-medium text-gray-300">
                Активна послуга
              </label>
            </div>
          </div>

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-red-500/20 border border-red-500/30 rounded-xl p-3 text-red-300 text-sm"
            >
              {error}
            </motion.div>
          )}

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 sm:space-x-4">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={loading}
              className="flex-1 bg-gradient-to-r from-pink-500 to-violet-600 text-white py-3 rounded-xl font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Збереження...' : (service ? 'Оновити' : 'Додати')}
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="button"
              onClick={onClose}
              className="sm:px-8 py-3 bg-white/10 text-white rounded-xl font-semibold hover:bg-white/20 transition-colors"
            >
              Скасувати
            </motion.button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default ServiceForm;