import React from 'react';
import { useTypingStore } from '@/store/useTypingStore';

/**
 * Speedometer Component
 * A high-end visual gauge for WPM
 * Categories:
 * - 0-20: POOR (Red)
 * - 20-40: FAIR (Amber)
 * - 40-60: GOOD (Emerald)
 * - 60+: EXCELLENT (Indigo)
 */
export const Speedometer: React.FC = () => {
  const { wpm } = useTypingStore();

  // Map WPM to Degree (0 to 180 degrees)
  // We cap max WPM at 100 for the visual scale
  const maxWpm = 100;
  const percentage = Math.min(wpm / maxWpm, 1);
  const rotation = (percentage * 180) - 90; // Rotate from -90 to 90

  const getCategory = (val: number) => {
    if (val < 20) return { label: 'POOR', hex: '#f43f5e' }; // Rose 500
    if (val < 40) return { label: 'FAIR', hex: '#f59e0b' }; // Amber 500
    if (val < 60) return { label: 'GOOD', hex: '#10b981' }; // Emerald 500
    return { label: 'EXCELLENT', hex: '#4f46e5' }; // Indigo 600
  };

  const category = getCategory(wpm);

  return (
    <div className="bg-white border border-slate-200 rounded-[2rem] p-5 flex flex-col items-center justify-center relative overflow-hidden shadow-sm">
      {/* Decorative Background Glow */}
      <div 
        className="absolute -bottom-10 w-24 h-24 opacity-[0.03] blur-[50px] rounded-full transition-colors duration-1000" 
        style={{ backgroundColor: category.hex }}
      />
      
      <div className="relative w-36 h-18 mb-4">
        {/* Gauge Background Path */}
        <svg viewBox="0 0 100 50" className="w-full h-full overflow-visible">
          <path
            d="M 10 50 A 40 40 0 0 1 90 50"
            fill="none"
            stroke="#f1f5f9"
            strokeWidth="10"
            strokeLinecap="round"
          />
          {/* Active Progress Path */}
          <path
            d="M 10 50 A 40 40 0 0 1 90 50"
            fill="none"
            stroke={category.hex}
            strokeWidth="10"
            strokeLinecap="round"
            strokeDasharray="125.6"
            strokeDashoffset={125.6 - (percentage * 125.6)}
            className="transition-all duration-1000 ease-out"
          />
          
          {/* Gauge Needle */}
          <line
            x1="50" y1="50"
            x2="50" y2="15"
            stroke={category.hex}
            strokeWidth="3"
            strokeLinecap="round"
            className="transition-transform duration-1000 ease-out"
            style={{ transform: `rotate(${rotation}deg)`, transformOrigin: '50px 50px' }}
          />
          <circle cx="50" cy="50" r="4" fill={category.hex} />
        </svg>

        {/* Center Labels */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pt-6">
          <span className="text-3xl font-black text-slate-900 tracking-tighter">{wpm}</span>
          <span className="text-[8px] font-black text-slate-400 uppercase tracking-[0.2em] -mt-1">WPM</span>
        </div>
      </div>

      {/* Rank Label */}
      <div 
        className="px-4 py-1.5 rounded-full border transition-all duration-500" 
        style={{ 
          backgroundColor: `${category.hex}15`, 
          borderColor: `${category.hex}30` 
        }}
      >
        <span 
          className="text-[9px] font-black tracking-[0.1em] uppercase"
          style={{ color: category.hex }}
        >
          {category.label}
        </span>
      </div>

      {/* Scale Labels */}
      <div className="w-full flex justify-between mt-4 px-2 text-[7px] font-black text-slate-300 uppercase tracking-widest">
        <span>0</span>
        <span>50</span>
        <span>100+</span>
      </div>
    </div>
  );
};
