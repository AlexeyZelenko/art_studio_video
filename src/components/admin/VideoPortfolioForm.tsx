import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X, ExternalLink, Upload, Trash2 } from 'lucide-react';
import { useVideo } from '../../contexts/VideoContext';
import { VideoPortfolioItem, VideoPortfolioFormData } from '../../types/video';

interface VideoPortfolioFormProps {
  item?: VideoPortfolioItem | null;
  onClose: () => void;
  onSuccess: () => void;
}

const VideoPortfolioForm: React.FC<VideoPortfolioFormProps> = ({ item, onClose, onSuccess }) => {
  const { addVideoPortfolioItem, updateVideoPortfolioItem } = useVideo();
  const [formData, setFormData] = useState<VideoPortfolioFormData>({
    title: item?.title || '',
    category: item?.category || 'Весілля',
    youtubeUrl: item?.youtubeUrl || '',
    description: item?.description || '',
    customThumbnailUrl: item?.customThumbnailUrl || ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(
    item?.customThumbnailUrl || null
  );

  const categories = ['Весілля', 'Корпоратив', 'Реклама', 'Музика', 'Документальне', 'Event'];

  // Helper function to validate YouTube URL
  const isValidYouTubeUrl = (url: string): boolean => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return !!(match && match[2].length === 11);
  };

  // Helper function to extract YouTube video ID
  const extractYouTubeId = (url: string): string | null => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        setError('Будь ласка, оберіть файл зображення');
        return;
      }
      
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError('Розмір файлу повинен бути менше 5MB');
        return;
      }
      
      setThumbnailFile(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setThumbnailPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
      
      setError('');
    }
  };

  const handleRemoveThumbnail = () => {
    setThumbnailFile(null);
    setThumbnailPreview(null);
    setFormData(prev => ({ ...prev, customThumbnailUrl: '' }));
    
    // Reset file input
    const fileInput = document.getElementById('thumbnail-upload') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title.trim()) {
      setError('Будь ласка, введіть назву відео');
      return;
    }

    if (!formData.youtubeUrl.trim()) {
      setError('Будь ласка, введіть посилання на YouTube відео');
      return;
    }

    if (!isValidYouTubeUrl(formData.youtubeUrl)) {
      setError('Будь ласка, введіть правильне посилання на YouTube відео');
      return;
    }

    setLoading(true);
    setError('');

    try {
      if (item) {
        await updateVideoPortfolioItem(item.id, formData, thumbnailFile || undefined);
      } else {
        await addVideoPortfolioItem(formData, thumbnailFile || undefined);
      }
      
      onSuccess();
    } catch (error: any) {
      setError('Помилка при збереженні відео');
      console.error('Error saving video portfolio item:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const videoId = extractYouTubeId(formData.youtubeUrl);
  const youtubeThumbUrl = videoId ? `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg` : '';

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-2 sm:p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white/10 backdrop-blur-lg rounded-3xl p-4 sm:p-6 md:p-8 w-full max-w-2xl border border-white/20 max-h-[95vh] sm:max-h-[90vh] overflow-y-auto"
      >
        <div className="flex justify-between items-center mb-4 md:mb-6">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-white">
            {item ? 'Редагувати відео' : 'Додати нове відео'}
          </h2>
          <button
            onClick={onClose}
            className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center text-white hover:bg-white/20 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* YouTube URL */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Посилання на YouTube відео *
            </label>
            <div className="relative">
              <input
                type="url"
                name="youtubeUrl"
                value={formData.youtubeUrl}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-pink-500 focus:ring-2 focus:ring-pink-500/20 pr-12"
                placeholder="https://www.youtube.com/watch?v=..."
              />
              {formData.youtubeUrl && (
                <a
                  href={formData.youtubeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                >
                  <ExternalLink className="w-5 h-5" />
                </a>
              )}
            </div>
            {formData.youtubeUrl && !isValidYouTubeUrl(formData.youtubeUrl) && (
              <p className="text-red-400 text-sm mt-1">
                Неправильне посилання на YouTube відео
              </p>
            )}
          </div>

          {/* Custom Thumbnail Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Кастомна мініатюра (необов'язково)
            </label>
            <div className="space-y-4">
              {/* File Upload */}
              <div className="relative">
                <input
                  type="file"
                  id="thumbnail-upload"
                  accept="image/*"
                  onChange={handleThumbnailChange}
                  className="hidden"
                />
                <label
                  htmlFor="thumbnail-upload"
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white cursor-pointer hover:bg-white/20 transition-colors flex items-center justify-center space-x-2"
                >
                  <Upload className="w-5 h-5" />
                  <span>Завантажити зображення</span>
                </label>
              </div>

              {/* Thumbnail Preview */}
              {thumbnailPreview && (
                <div className="relative">
                  <div className="aspect-video rounded-xl overflow-hidden bg-gray-800">
                    <img
                      src={thumbnailPreview}
                      alt="Custom thumbnail preview"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={handleRemoveThumbnail}
                    className="absolute top-2 right-2 w-8 h-8 bg-red-500 rounded-full flex items-center justify-center text-white hover:bg-red-600 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                  <div className="absolute top-2 left-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                    Кастомна мініатюра
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* YouTube Video Preview */}
          {youtubeThumbUrl && !thumbnailPreview && (
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                YouTube мініатюра
              </label>
              <div className="relative aspect-video rounded-xl overflow-hidden bg-gray-800">
                <img
                  src={youtubeThumbUrl}
                  alt="YouTube thumbnail"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                  <div className="w-16 h-16 bg-white/90 rounded-full flex items-center justify-center">
                    <svg className="w-8 h-8 text-gray-800 ml-1" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z"/>
                    </svg>
                  </div>
                </div>
                <div className="absolute top-2 left-2 bg-blue-500 text-white text-xs px-2 py-1 rounded-full">
                  YouTube мініатюра
                </div>
              </div>
            </div>
          )}

          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Назва відео *
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-pink-500 focus:ring-2 focus:ring-pink-500/20"
              placeholder="Введіть назву відео"
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
              placeholder="Короткий опис відео..."
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

export default VideoPortfolioForm;