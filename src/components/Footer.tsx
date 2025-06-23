import React from 'react';
import { Camera, Phone, Instagram, Facebook, Youtube, Heart } from 'lucide-react';
import { motion } from 'framer-motion';

const Footer = () => {
  const quickLinks = [
    { name: 'Головна', href: '#home' },
    { name: 'Послуги', href: '#services' },
    { name: 'Портфоліо', href: '#portfolio' },
    { name: 'Про нас', href: '#about' },
    { name: 'Контакти', href: '#contact' }
  ];

  const services = [
    'Портретна фотосесія',
    'Весільна фотосесія',
    'Сімейна фотосесія',
    'Корпоративна зйомка',
    'Fashion фотосесія',
    'Дитяча фотосесія'
  ];

  const socialLinks = [
    { icon: Instagram, url: 'https://www.instagram.com/visualsbyyana/', name: 'Instagram' }    
  ];

  return (
    <footer className="bg-gradient-to-br from-gray-900 to-black text-white">
      <div className="container mx-auto px-4 py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Logo and Description */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="lg:col-span-1"
          >
            <div className="flex items-center space-x-2 mb-6">
              <div className="w-10 h-10 bg-gradient-to-r from-pink-500 to-violet-600 rounded-full flex items-center justify-center">
                <Camera className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-pink-400 to-violet-400 bg-clip-text text-transparent">
                PixelArt Studio
              </span>
            </div>
            <p className="text-gray-300 leading-relaxed mb-6">
              Професійна фотостудія в Україні. Створюємо неперевершені візуальні історії 
              з технічною майстерністю та творчим баченням.
            </p>            
          </motion.div>

          {/* Quick Links */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h3 className="text-xl font-semibold mb-6 text-white">Швидкі посилання</h3>
            <ul className="space-y-3">
              {quickLinks.map((link, index) => (
                <li key={index}>
                  <motion.a
                    whileHover={{ x: 5 }}
                    href={link.href}
                    className="text-gray-300 hover:text-pink-400 transition-colors"
                  >
                    {link.name}
                  </motion.a>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Services */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h3 className="text-xl font-semibold mb-6 text-white">Наші послуги</h3>
            <ul className="space-y-3">
              {services.map((service, index) => (
                <li key={index}>
                  <motion.span
                    onClick={() => {
                      document.getElementById('services')?.scrollIntoView({ behavior: 'smooth' });
                    }}
                    whileHover={{ x: 5 }}
                    className="text-gray-300 hover:text-violet-400 transition-colors cursor-pointer block"
                  >
                    {service}
                  </motion.span>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h3 className="text-xl font-semibold mb-6 text-white">Контакти</h3>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <Phone className="w-5 h-5 text-pink-400 mt-1 flex-shrink-0" />
                <div>
                  <p className="text-gray-300">+38 (097) 787-11-22</p>                  
                </div>
              </div>
              {/* Social Links */}
              <div className="border-t border-white/10 pt-6">                
                <motion.a
                  whileHover={{ scale: 1.05, y: -1 }}
                  whileTap={{ scale: 0.95 }}
                  href="https://www.instagram.com/visualsbyyana/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center space-x-2 bg-gradient-to-r from-pink-500 to-violet-600 rounded-xl px-4 py-2 text-white hover:shadow-lg transition-all text-sm"
                >
                  <Instagram className="w-4 h-4" />
                  <span>@visualsbyyana</span>
                </motion.a>
              </div>                            
            </div>
          </motion.div>
        </div>

        {/* Bottom Bar */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          viewport={{ once: true }}
          className="border-t border-white/10 mt-12 pt-8"
        >
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-gray-400 text-center md:text-left">
              © {new Date().getFullYear()} PixelArt Studio. Всі права захищені.
            </p>
            <div className="flex items-center space-x-1 text-gray-400">
              <span>Створено з</span>
              <Heart className="w-4 h-4 text-pink-400 fill-current" />
              <span>в Україні</span>
            </div>
          </div>
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer;