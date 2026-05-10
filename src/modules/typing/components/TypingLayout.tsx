import React from 'react';
import { useTypingStore } from '@/store/useTypingStore';
import { cn } from "@/lib/utils";

interface TypingLayoutProps {
  timerSlot: React.ReactNode;
  typingSlot: React.ReactNode;
  passageSlot: React.ReactNode;
  statsSlot: React.ReactNode;
  settingsSlot: React.ReactNode;
}

/**
 * TypingLayout Component
 * Implements a high-focus, 3-column architecture:
 * TOP: Timer & Meta
 * LEFT: Passage + Input (Main Focus)
 * RIGHT: Real-time Stats & Speedometer
 */
export const TypingLayout: React.FC<TypingLayoutProps> = ({
  timerSlot,
  typingSlot,
  passageSlot,
  statsSlot,
  settingsSlot
}) => {
  const { settings, updateSettings, isFullScreen } = useTypingStore();
  const [isDragging, setIsDragging] = React.useState(false);
  const containerRef = React.useRef<HTMLDivElement>(null);

  const handleDragStart = (e: React.MouseEvent | React.TouchEvent) => {
    // e.preventDefault(); // Don't prevent default on touch, but we can on mouse
    setIsDragging(true);
  };

  React.useEffect(() => {
    const handleMove = (e: MouseEvent | TouchEvent) => {
      if (!isDragging || !containerRef.current) return;
      
      const clientX = 'touches' in e ? e.touches[0].clientX : (e as MouseEvent).clientX;
      const clientY = 'touches' in e ? e.touches[0].clientY : (e as MouseEvent).clientY;
      
      const containerRect = containerRef.current.getBoundingClientRect();
      
      if (settings.textPosition === 'side') {
        const newWidth = ((clientX - containerRect.left) / containerRect.width) * 100;
        if (newWidth > 20 && newWidth < 80) {
           updateSettings({ passageHeight: newWidth });
        }
      } else {
        const newHeight = ((clientY - containerRect.top) / containerRect.height) * 100;
        if (newHeight > 20 && newHeight < 80) {
           updateSettings({ passageHeight: newHeight });
        }
      }
    };

    const handleUp = () => setIsDragging(false);

    if (isDragging) {
      document.addEventListener('mousemove', handleMove);
      document.addEventListener('mouseup', handleUp);
      document.addEventListener('touchmove', handleMove, { passive: false });
      document.addEventListener('touchend', handleUp);
      document.body.style.userSelect = 'none';
      document.body.style.cursor = settings.textPosition === 'side' ? 'col-resize' : 'row-resize';
    } else {
      document.removeEventListener('mousemove', handleMove);
      document.removeEventListener('mouseup', handleUp);
      document.removeEventListener('touchmove', handleMove);
      document.removeEventListener('touchend', handleUp);
      document.body.style.userSelect = '';
      document.body.style.cursor = '';
    }

    return () => {
      document.removeEventListener('mousemove', handleMove);
      document.removeEventListener('mouseup', handleUp);
      document.removeEventListener('touchmove', handleMove);
      document.removeEventListener('touchend', handleUp);
      document.body.style.userSelect = '';
      document.body.style.cursor = '';
    };
  }, [isDragging, settings.textPosition, updateSettings]);

  return (
    <div className={cn(
      "min-h-screen bg-[#f8fafc] flex flex-col font-sans text-slate-900 transition-all duration-500",
      isFullScreen ? "fixed inset-0 z-[9999] h-screen w-screen overflow-hidden bg-white" : "relative"
    )}>
      <main className={cn(
        "flex-1 mx-auto w-full p-6 grid grid-cols-1 lg:grid-cols-12 gap-8 overflow-hidden transition-all duration-700",
        isFullScreen ? "max-w-none h-screen p-10 pt-24 gap-10" : "max-w-[1600px] pt-8"
      )}>
        
        {/* LEFT / CENTER COLUMN - PASSAGE & INPUT */}
        <div 
          ref={containerRef}
          className={cn(
          "lg:col-span-10 flex gap-4 lg:gap-6",
          settings.textPosition === 'side' ? 'flex-row' : 'flex-col',
          "h-[calc(100vh-100px)] min-h-[500px]", // ensure it fits the screen height
          isFullScreen && "gap-6 lg:gap-10 h-full min-h-0"
        )}>
          <div 
            className={cn("min-h-0 flex flex-col", !isFullScreen && "min-h-[150px]", settings.textPosition === 'side' ? "h-full w-1/2" : "w-full")}
            style={{ flex: `${settings.passageHeight} 1 0%` }}
          >
            {passageSlot}
          </div>
          
          {/* Draggable Divider */}
          <div 
            onMouseDown={handleDragStart}
            onTouchStart={handleDragStart}
            className={cn(
              "group flex items-center justify-center transition-colors",
              settings.textPosition === 'side' 
                ? "w-2 hover:w-3 h-full cursor-col-resize -mx-3 z-10" 
                : "h-2 hover:h-3 w-full cursor-row-resize -my-3 z-10"
            )}
          >
            <div className={cn(
              "bg-slate-200 group-hover:bg-indigo-400 rounded-full transition-colors",
              isDragging && "bg-indigo-500",
              settings.textPosition === 'side' ? "w-1 h-12" : "h-1 w-12"
            )} />
          </div>

          <div 
            className={cn("min-h-[150px] flex flex-col", !isFullScreen && "min-h-[150px]", settings.textPosition === 'side' ? "h-full w-1/2" : "w-full")}
            style={{ flex: `${100 - settings.passageHeight} 1 0%` }}
          >
            {typingSlot}
          </div>
        </div>

        {/* RIGHT COLUMN - STATS & SETTINGS */}
        <aside className={cn(
          "lg:col-span-2",
          isFullScreen ? "h-full overflow-y-auto pr-4 scrollbar-hide" : "space-y-6"
        )}>
          <div className={cn(
            "space-y-8",
            !isFullScreen && "sticky top-6"
          )}>
            {timerSlot}
            {statsSlot}
            {!isFullScreen && settingsSlot}
          </div>
        </aside>
      </main>

      {!isFullScreen && (
        <footer className="h-12 bg-slate-900 text-white flex items-center justify-center text-[10px] font-black uppercase tracking-[0.2em] opacity-80">
          Professional Typing Examination Environment v2.0
        </footer>
      )}
    </div>
  );
};
