import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Shield, Layout, Zap, Users, BarChart3, Bell, Settings } from 'lucide-react';

const menuItems = [
  { id: 0, label: 'Hero', icon: Shield },
  { id: 1, label: 'Problem', icon: Layout },
  { id: 2, label: 'Solution', icon: Zap },
  { id: 3, label: 'Features', icon: Users },
  { id: 4, label: 'How It Works', icon: BarChart3 },
  { id: 5, label: 'Benefits', icon: Bell },
];

export default function SlideMenu({ activeSlide, onSelect }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div 
      className="fixed left-6 top-1/2 -translate-y-1/2 z-[100]"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <motion.div 
        className="glass-card flex flex-col items-start gap-2 p-3 overflow-hidden"
        style={{ background: 'rgba(13, 25, 48, 0.9)', backdropFilter: 'blur(16px)' }}
        animate={{ 
          width: isHovered ? 240 : 64,
          borderRadius: isHovered ? '24px' : '32px',
          borderColor: isHovered ? 'rgba(0, 212, 255, 0.4)' : 'rgba(0, 212, 255, 0.15)',
          boxShadow: isHovered ? '0 0 30px rgba(0, 212, 255, 0.15)' : 'none'
        }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
      >
        {/* Toggle Icon (the "3 lines") */}
        <div className="w-10 h-10 flex items-center justify-center text-[#00d4ff] flex-shrink-0 transition-transform duration-300"
          style={{ transform: isHovered ? 'rotate(90deg)' : 'none' }}>
          <Menu className="w-6 h-6" />
        </div>

        {/* Menu Items */}
        <div className="flex flex-col gap-1 w-full mt-2">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => onSelect(item.id)}
              className={`flex items-center gap-3 w-full p-2.5 rounded-lg transition-all duration-200 group relative
                ${activeSlide === item.id ? 'bg-[#00d4ff]/10 text-[#00d4ff]' : 'text-slate-400 hover:bg-white/5 hover:text-white'}`}
            >
              <item.icon className={`w-5 h-5 flex-shrink-0 ${activeSlide === item.id ? 'text-[#00d4ff]' : 'group-hover:text-[#00d4ff]'}`} />
              
              <AnimatePresence>
                {isHovered && (
                  <motion.span
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    transition={{ duration: 0.2 }}
                    className="text-sm font-medium whitespace-nowrap"
                  >
                    {item.label}
                  </motion.span>
                )}
              </AnimatePresence>

              {activeSlide === item.id && (
                <motion.div 
                  layoutId="active-indicator"
                  className="absolute left-0 w-1 h-5 bg-[#00d4ff] rounded-full"
                />
              )}
            </button>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
