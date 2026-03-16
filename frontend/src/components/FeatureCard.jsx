import React from 'react';
import { ChevronRight } from 'lucide-react';
const FeatureCard = ({ feature: f, onLearnMore }) => {
  return (
    <div className="glass-card p-6 group cursor-default transition-all duration-300 hover:border-[#00d4ff]/30">
      <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-5 transition-all duration-300 group-hover:scale-110"
        style={{ background: `${f.color}15`, border: `1px solid ${f.color}30` }}>
        <f.icon className="w-7 h-7" style={{ color: f.color }} />
      </div>
      <h3 className="font-bold text-white mb-3 text-lg">{f.title}</h3>
      <p className="text-slate-400 text-sm leading-relaxed mb-4">{f.desc}</p>
      
      {/* Static Technical Specs - Clean & Minimal */}
      <div className="grid grid-cols-2 gap-y-4 gap-x-3 pt-4 border-t border-white/5">
        {f.details.slice(0, 4).map((detail, idx) => (
          <div key={idx}>
            <div className="text-[10px] text-slate-500 uppercase tracking-tighter mb-0.5">{detail.label}</div>
            <div className="text-[11px] text-slate-200 font-medium leading-tight">{detail.value}</div>
          </div>
        ))}
      </div>

      <div 
        className="mt-6 flex items-center gap-1 text-xs font-semibold transition-colors duration-300 cursor-pointer hover:opacity-80 w-max" 
        style={{ color: f.color }}
        onClick={onLearnMore}
      >
        Learn more <ChevronRight className="w-3 h-3" />
      </div>
    </div>
  );
};

export default FeatureCard;
