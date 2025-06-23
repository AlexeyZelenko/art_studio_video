import React from 'react';
import { motion } from 'framer-motion';
import { Phone, Instagram } from 'lucide-react';

const Contact = () => {
  return (
    <section id="contact" className="py-20 bg-gradient-to-br from-gray-900 to-black text-white">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-pink-400 to-violet-400 bg-clip-text text-transparent">
            Зв'яжіться з нами
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Готові створити щось неймовірне разом? Зателефонуйте нам або напишіть у соціальних мережах, 
            і ми обговоримо всі деталі вашої майбутньої фотосесії.
          </p>
        </motion.div>

        {/* Compact Contact Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 text-center max-w-md mx-auto"
        >
          {/* Phone Section */}
          <div className="mb-6">
            <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-teal-500 rounded-xl flex items-center justify-center mx-auto mb-3">
              <Phone className="w-6 h-6 text-white" />
            </div>
            <h4 className="text-lg font-semibold text-white mb-2">Телефон</h4>
            <p className="text-gray-300 text-sm mb-1">+38 (097) 787-11-22</p>            
          </div>

          {/* Social Links */}
          <div className="border-t border-white/10 pt-6">
            <h4 className="text-lg font-semibold text-white mb-3">Instagram</h4>
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
        </motion.div>
      </div>
    </section>
  );
};

export default Contact;