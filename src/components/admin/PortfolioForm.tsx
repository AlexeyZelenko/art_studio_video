import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Upload, Image as ImageIcon, Trash2, Plus } from 'lucide-react';
import { usePortfolio } from '../../contexts/PortfolioContext';
import { PortfolioItem } from '../../types/portfolio';

interface PortfolioFormProps {
  item?: PortfolioItem | null;
  onClose: () => void;
  onSuccess: () => void;
}

const PortfolioForm: React.FC<PortfolioFormProps> = ({ item, onClose, onSuccess }) => {
  const { addPortfolioItem, updatePortfolioItem, deleteImageFromPortfolio } = usePortfolio();
  const [formData, setFormData] = useState({
    title: item?.title || '',
    category: item?.category || 'Портрети',
    description: item?.description || ''
  });
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [existingImages, setExistingImages] = useState<string[]>(item?.images || []);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const categories = ['Портрети', 'Весілля', 'Сім\'я', 'Fashion', 'Корпоратив'];

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    
    if (files.length === 0) return;

    // Validate files
    const validFiles: File[] = [];
    const errors: string[] = [];

    files.forEach((file, index) => {
      if (file.size > 5 * 1024 * 1024) {
        errors.push(`Файл ${index + 1} занадто великий (макс. 5MB)`);
        return;
      }
      
      if (!file.type.startsWith('image/')) {
        errors.push(`Файл ${index + 1} не є зображенням`);
        return;
      }

      validFiles.push(file);
    });

    if (errors.length > 0) {
      setError(errors.join(', '));
      return;
    }

    setError('');
    setSelectedFiles(prev => [...prev, ...validFiles]);

    // Create previews for new files
    validFiles.forEach(file => {
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreviewUrls(prev => [...prev, e.target?.result as string]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeNewImage = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
    setPreviewUrls(prev => prev.filter((_, i) => i !== index));
  };

  const removeExistingImage = async (imageUrl: string) => {
    if (!item) return;
    
    if (window.confirm('Ви впевнені, що хочете видалити це зображення?')) {
      try {
        await deleteImageFromPortfolio(item.id, imageUrl);
        setExistingImages(prev => prev.filter(img => img !== imageUrl));
      } catch (error) {
        setError('Помилка при видаленні зображення');
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const totalImages = existingImages.length + selectedFiles.length;
    
    if (!item && selectedFiles.length === 0) {
      setError('Будь ласка, оберіть хоча б одне зображення');
      return;
    }

    if (totalImages === 0) {
      setError('Роботa повинна мати хоча б одне зображення');
      return;
    }

    if (!formData.title.trim()) {
      setError('Будь ласка, введіть назву роботи');
      return;
    }

    setLoading(true);
    setError('');

    try {
      if (item) {
        // Update existing item - only add new files
        if (selectedFiles.length > 0) {
          await updatePortfolioItem(item.id, formData, selectedFiles);
        } else {
          await updatePortfolioItem(item.id, formData);
        }
      } else {
        // Add new item
        await addPortfolioItem(formData, selectedFiles);
      }
      
      onSuccess();
    } catch (error: any) {
      setError('Помилка при збереженні роботи');
      console.error('Error saving portfolio item:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-2 sm:p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white/10 backdrop-blur-lg rounded-3xl p-4 sm:p-6 md:p-8 w-full max-w-4xl border border-white/20 max-h-[95vh] sm:max-h-[90vh] overflow-y-auto"
      >
        <div className="flex justify-between items-center mb-4 md:mb-6">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-white">
            {item ? 'Редагувати роботу' : 'Додати нову роботу'}
          </h2>
          <button
            onClick={onClose}
            className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center text-white hover:bg-white/20 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Existing Images (for editing) */}
          {item && existingImages.length > 0 && (
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-4">
                Поточні зображення
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 md:gap-4 mb-4">
                {existingImages.map((imageUrl, index) => (
                  <motion.div
                    key={imageUrl}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="relative group bg-white/5 rounded-xl overflow-hidden"
                  >
                    <img
                      src={imageUrl}
                      alt={`Existing ${index + 1}`}
                      className="w-full h-32 object-cover"
                    />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <button
                        type="button"
                        onClick={() => removeExistingImage(imageUrl)}
                        className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center text-white hover:bg-red-600 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    {index === 0 && (
                      <div className="absolute top-2 left-2 bg-gradient-to-r from-pink-500 to-violet-600 text-white text-xs px-2 py-1 rounded-full">
                        Головна
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {/* New Images Preview */}
          {previewUrls.length > 0 && (
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-4">
                Нові зображення
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 md:gap-4 mb-4">
                {previewUrls.map((previewUrl, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="relative group bg-white/5 rounded-xl overflow-hidden"
                  >
                    <img
                      src={previewUrl}
                      alt={`Preview ${index + 1}`}
                      className="w-full h-32 object-cover"
                    />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <button
                        type="button"
                        onClick={() => removeNewImage(index)}
                        className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center text-white hover:bg-red-600 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    {existingImages.length === 0 && index === 0 && (
                      <div className="absolute top-2 left-2 bg-gradient-to-r from-pink-500 to-violet-600 text-white text-xs px-2 py-1 rounded-full">
                        Головна
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {/* Image Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              {item ? 'Додати ще зображення' : 'Зображення *'}
            </label>
            <div
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-white/30 rounded-xl p-6 text-center cursor-pointer hover:border-pink-500 transition-colors"
            >
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 bg-gradient-to-r from-pink-500 to-violet-600 rounded-xl flex items-center justify-center mb-4">
                  <Plus className="w-8 h-8 text-white" />
                </div>
                <p className="text-gray-300 mb-2">
                  {item ? 'Додати ще зображення' : 'Натисніть для вибору зображень'}
                </p>
                <p className="text-sm text-gray-400">
                  Можна вибрати кілька файлів. PNG, JPG до 5MB кожен
                </p>
              </div>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              onChange={handleFileSelect}
              className="hidden"
            />
          </div>

          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Назва роботи *
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-pink-500 focus:ring-2 focus:ring-pink-500/20"
              placeholder="Введіть назву роботи"
            />
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Категорія *
            </label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:border-pink-500 focus:ring-2 focus:ring-pink-500/20"
            >
              {categories.map((category) => (
                <option key={category} value={category} className="bg-gray-800">
                  {category}
                </option>
              ))}
            </select>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Опис (необов'язково)
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={3}
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-pink-500 focus:ring-2 focus:ring-pink-500/20 resize-none"
              placeholder="Короткий опис роботи..."
            />
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
              {loading ? 'Збереження...' : (item ? 'Оновити' : 'Додати')}
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

export default PortfolioForm;