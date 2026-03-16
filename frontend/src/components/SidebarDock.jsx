import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../lib/utils';
import { useLocation, useNavigate } from 'react-router-dom';
import { Menu } from 'lucide-react';

export function SidebarDock({ items, className, onMenuClick }) {
  const [hovered, setHovered] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();

  const isActive = (item) => {
    if (item.exact) return location.pathname === item.path;
    return location.pathname.startsWith(item.path);
  };

  return (
    <div className={cn("flex flex-col items-center justify-center h-full py-6 px-4 z-20 flex-shrink-0", className)}>
      <motion.div
        className={cn(
          "flex flex-col items-center gap-3 px-2.5 py-6 rounded-[2.5rem]",
          "border relative"
        )}
        style={{
          background: 'rgba(5, 12, 25, 0.45)',
          backdropFilter: 'blur(20px)',
          borderColor: 'rgba(0, 212, 255, 0.15)',
          boxShadow: '0 10px 40px rgba(0, 0, 0, 0.5)'
        }}
      >
        {/* Menu Icon at the top */}
        <button 
          onClick={onMenuClick}
          className="mb-3 p-2 text-[#00d4ff] hover:text-white transition-colors duration-300"
        >
          <Menu className="w-6 h-6 stroke-[2.5]" />
        </button>

        {items.map((item, i) => {
          const active = isActive(item);
          const isHovered = hovered === i;

          return (
            <div key={item.path} className="relative group flex items-center justify-center">
              <motion.button
                onMouseEnter={() => setHovered(i)}
                onMouseLeave={() => setHovered(null)}
                animate={{
                  scale: isHovered ? 1.1 : 1,
                }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className={cn(
                  "relative flex items-center justify-center w-[3.25rem] h-[3.25rem] rounded-2xl transition-all duration-300 cursor-pointer outline-none",
                  active ? "bg-[rgba(0,212,255,0.12)]" : "hover:bg-[rgba(255,255,255,0.05)]",
                  isHovered && !active && "shadow-lg shadow-[#00d4ff]/5"
                )}
                onClick={() => navigate(item.path)}
              >
                <item.icon
                  className={cn(
                    "w-6 h-6 transition-colors duration-300",
                    active ? "text-[#00d4ff]" : isHovered ? "text-[#00d4ff]" : "text-slate-400"
                  )}
                  strokeWidth={active || isHovered ? 2 : 1.5}
                />
                
                {/* Active Indicator Line (Left Side) */}
                {active && (
                   <motion.div
                      layoutId="active-nav-indicator"
                      className="absolute left-[-2px] top-1/2 -translate-y-1/2 w-[4px] h-[1.125rem] rounded-full bg-[#00d4ff]"
                      style={{ boxShadow: '0 0 10px rgba(0,212,255,0.6)' }}
                      initial={false}
                      transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                   />
                )}

                {/* Badge */}
                {item.badge && (
                  <span className="absolute top-1 right-1 -mr-1 -mt-1 w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-bold z-10"
                    style={{ background: '#ff0055', color: '#fff', boxShadow: '0 0 8px rgba(255,0,85,0.5)' }}>
                    {item.badge}
                  </span>
                )}
              </motion.button>

              {/* Tooltip */}
              <AnimatePresence>
                {isHovered && (
                  <motion.div
                    initial={{ opacity: 0, x: -10, scale: 0.95 }}
                    animate={{ opacity: 1, x: 0, scale: 1 }}
                    exit={{ opacity: 0, x: -10, scale: 0.95 }}
                    className="absolute left-full ml-4 top-1/2 -translate-y-1/2 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap pointer-events-none z-50 flex items-center"
                    style={{
                      background: 'rgba(13, 21, 38, 0.95)',
                      border: '1px solid rgba(0, 212, 255, 0.3)',
                      color: '#00d4ff',
                      boxShadow: '0 8px 32px rgba(0,0,0,0.5)'
                    }}
                  >
                    {item.label}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </motion.div>
    </div>
  );
}
