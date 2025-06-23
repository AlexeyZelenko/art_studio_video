import React, { useState, useEffect } from 'react';
import { Camera, Menu, X, Settings } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const menuItems = [
    { name: 'Головна', href: '/' },
    { name: 'Послуги', href: '/#services' },
    { name: 'Портфоліо', href: '/#portfolio' },
    { name: 'Відео', href: '/video' },
    { name: 'Про нас', href: '/#about' },
    { name: 'Контакти', href: '/#contact' }
  ];

  const handleMenuClick = (href: string) => {
    setIsMenuOpen(false);
    
    // Handle internal anchors
    if (href.startsWith('/#')) {
      if (location.pathname !== '/') {
        // If not on home page, navigate to home first
        window.location.href = href;
      } else {
        // If on home page, scroll to section
        const elementId = href.substring(2);
        const element = document.getElementById(elementId);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }
    }
  };

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={`fixed w-full z-50 transition-all duration-300 ${
        isScrolled ? 'bg-white/95 backdrop-blur-lg shadow-lg' : 'bg-transparent'
      }`}
    >
      <div className="container mx-auto px-3 sm:px-4 py-4 max-w-full">
        <div className="flex items-center justify-between w-full">
          <Link to="/">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="flex items-center space-x-2 flex-shrink-0"
            >
              <div className="w-10 h-10 bg-gradient-to-r from-pink-500 to-violet-600 rounded-full flex items-center justify-center">
                <Camera className="w-6 h-6 text-white" />
              </div>
              <span className={`text-xl sm:text-2xl font-bold bg-gradient-to-r from-pink-600 to-violet-600 bg-clip-text text-transparent ${
                isScrolled ? '' : 'text-white'
              }`}>
                PixelArt Studio
              </span>
            </motion.div>
          </Link>

          {/* Desktop Menu */}
          <nav className="hidden md:flex space-x-8 items-center">
            {menuItems.map((item) => (
              <motion.div key={item.name}>
                {item.href.startsWith('/') && !item.href.startsWith('/#') ? (
                  <Link
                    to={item.href}
                    className={`font-medium transition-colors hover:text-pink-500 ${
                      isScrolled ? 'text-gray-800' : 'text-white'
                    } ${location.pathname === item.href ? 'text-pink-500' : ''}`}
                  >
                    {item.name}
                  </Link>
                ) : (
                  <button
                    onClick={() => handleMenuClick(item.href)}
                    className={`font-medium transition-colors hover:text-pink-500 ${
                      isScrolled ? 'text-gray-800' : 'text-white'
                    }`}
                  >
                    {item.name}
                  </button>
                )}
              </motion.div>
            ))}
            
            {/* Admin Button - только для десктопа */}
            <Link to="/admin">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`p-2 rounded-lg transition-colors ${
                  isScrolled 
                    ? 'text-gray-600 hover:bg-gray-100 hover:text-pink-500' 
                    : 'text-white/80 hover:bg-white/10 hover:text-white'
                }`}
                title="Адмін-панель"
              >
                <Settings className="w-5 h-5" />
              </motion.button>
            </Link>
          </nav>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className={`p-2 rounded-lg transition-colors ${
                isScrolled ? 'text-gray-800 hover:bg-gray-100' : 'text-white hover:bg-white/10'
              }`}
              aria-label="Меню"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.nav
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden mt-4 bg-white rounded-lg shadow-lg overflow-hidden mx-0"
            >
              {menuItems.map((item, index) => (
                <motion.div
                  key={item.name}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  {item.href.startsWith('/') && !item.href.startsWith('/#') ? (
                    <Link
                      to={item.href}
                      onClick={() => setIsMenuOpen(false)}
                      className={`block px-6 py-3 text-gray-800 hover:bg-gradient-to-r hover:from-pink-50 hover:to-violet-50 hover:text-pink-600 transition-all ${
                        location.pathname === item.href ? 'bg-gradient-to-r from-pink-50 to-violet-50 text-pink-600' : ''
                      }`}
                    >
                      {item.name}
                    </Link>
                  ) : (
                    <button
                      onClick={() => handleMenuClick(item.href)}
                      className="block w-full text-left px-6 py-3 text-gray-800 hover:bg-gradient-to-r hover:from-pink-50 hover:to-violet-50 hover:text-pink-600 transition-all"
                    >
                      {item.name}
                    </button>
                  )}
                </motion.div>
              ))}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: menuItems.length * 0.1 }}
                className="border-t border-gray-100"
              >
                <Link
                  to="/admin"
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center space-x-2 px-6 py-3 text-gray-600 hover:bg-gradient-to-r hover:from-pink-50 hover:to-violet-50 hover:text-pink-600 transition-all"
                >
                  <Settings className="w-4 h-4" />
                  <span>Адмін-панель</span>
                </Link>
              </motion.div>
            </motion.nav>
          )}
        </AnimatePresence>
      </div>
    </motion.header>
  );
};

export default Header;