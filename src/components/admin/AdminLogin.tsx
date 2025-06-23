import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { motion } from 'framer-motion';
import { Lock, Chrome } from 'lucide-react';
import { Link } from "react-router-dom";

interface AdminLoginProps {
  onLogin: () => void;
}

const AdminLogin: React.FC<AdminLoginProps> = ({ onLogin }) => {
  const { signInWithGoogle } = useAuth();
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState('');

  const handleGoogleLogin = async () => {
    setGoogleLoading(true);
    setError('');

    try {
      await signInWithGoogle();
      onLogin();
    } catch (error: any) {
      if (error.message === 'У вас немає доступу до цієї програми' || error.message.includes('доступ')) {
        setError('У вас немає доступу до цього додатку');
      } else {
        setError('Помилка входу через Google');
      }
    } finally {
      setGoogleLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 w-full max-w-md border border-white/20"
      >
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-r from-pink-500 to-violet-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <Lock className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-3xl font-bold text-white mb-2">Адмін-панель</h2>
          <p className="text-gray-400">Увійдіть через Google для доступу до адмін-панелі</p>
        </div>

        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-red-500/20 border border-red-500/30 rounded-xl p-3 text-red-300 text-sm mb-6"
          >
            {error}
          </motion.div>
        )}

        {/* Google Sign In Button */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleGoogleLogin}
          disabled={googleLoading}
          className="w-full bg-white text-gray-800 py-4 rounded-xl font-semibold flex items-center justify-center space-x-3 hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
        >
          <Chrome className="w-6 h-6" />
          <span className="text-lg">
            {googleLoading ? 'Вхід через Google...' : 'Увійти через Google'}
          </span>
        </motion.button>

        <div className="mt-8 text-center">
          <p className="text-gray-400 text-sm">
            Доступ обмежений для авторизованих користувачів
          </p>

          <p className="text-gray-400 text-sm">
            <Link 
              to="/" 
              className="text-blue-500 hover:text-blue-600 hover:underline transition-colors duration-200"
            >
              На головну
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default AdminLogin;