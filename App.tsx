import React, { useState, useCallback } from 'react';
import ColorWheel from './components/ColorWheel';
import ColorDetails from './components/ColorDetails';
import PaletteGenerator from './components/PaletteGenerator';
import ContrastChecker from './components/ContrastChecker';
import { ColorState, HistoryItem } from './types';
import { hexToRgb, rgbToHsl } from './utils/colorUtils';
import { Droplet, History } from 'lucide-react';

const App: React.FC = () => {
  const [color, setColor] = useState<string>("#3B82F6");
  const [history, setHistory] = useState<HistoryItem[]>([]);
  
  const rgb = hexToRgb(color) || { r: 0, g: 0, b: 0 };
  const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
  const colorState: ColorState = { hex: color.toUpperCase(), rgb, hsl };

  const addToHistory = useCallback((newColor: string) => {
    setHistory(prev => {
      // Avoid duplicates at the start
      if (prev.length > 0 && prev[0].hex === newColor) return prev;
      const filtered = prev.filter(h => h.hex !== newColor);
      return [{ hex: newColor, timestamp: Date.now() }, ...filtered].slice(0, 16);
    });
  }, []);

  const handleColorChange = (newColor: string) => {
    setColor(newColor);
  };

  // Trigger history add on mouse up logic is inside components implicitly,
  // but for the picker, we might want to add history when dragging stops.
  // For simplicity, we add history when "selecting" from palette or history.
  // Real-time picker updates don't trigger history to avoid spam.

  return (
    <div className="flex flex-col h-screen bg-[#0f172a] text-slate-100 font-sans overflow-hidden">
      
      {/* Compact Header */}
      <header className="h-12 border-b border-slate-800 bg-[#0f172a] flex items-center px-4 shrink-0">
        <div className="flex items-center gap-2">
          <div className="text-blue-500">
            <Droplet size={18} fill="currentColor" />
          </div>
          <h1 className="text-sm font-bold tracking-wide text-slate-200">
            CHROMAGEN <span className="text-slate-600 font-normal">AI</span>
          </h1>
        </div>
      </header>

      {/* Main Content Area - 2 Columns */}
      <main className="flex flex-1 overflow-hidden">
        
        {/* Left Column: Picker (Fixed width or flex) */}
        <div className="w-[500px] flex flex-col p-4 border-r border-slate-800 gap-4 shrink-0">
            <div className="flex-1 min-h-0">
                <ColorWheel color={color} onChange={handleColorChange} />
            </div>
            
            {/* History Section (moved to bottom left for quick access) */}
            <div className="h-32 bg-slate-800 rounded-xl border border-slate-700 p-3 shrink-0">
                 <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-1.5">
                        <History className="text-slate-400" size={14} />
                        <h2 className="text-xs font-bold text-slate-300 uppercase">履歴</h2>
                    </div>
                    <button onClick={() => setHistory([])} className="text-[10px] text-slate-500 hover:text-red-400">クリア</button>
                 </div>
                 <div className="flex flex-wrap gap-1.5 content-start h-full overflow-y-auto pr-1">
                    {history.map((item) => (
                        <button
                          key={item.timestamp}
                          onClick={() => handleColorChange(item.hex)}
                          className="w-6 h-6 rounded border border-slate-600 hover:border-white transition-all"
                          style={{ backgroundColor: item.hex }}
                          title={item.hex}
                        />
                    ))}
                    {history.length === 0 && <span className="text-xs text-slate-600">履歴なし</span>}
                 </div>
            </div>
        </div>

        {/* Right Column: Tools & Info (Scrollable if needed) */}
        <div className="flex-1 flex flex-col p-4 gap-4 overflow-y-auto bg-slate-900/50">
            
            <div className="grid grid-cols-2 gap-4">
                <ColorDetails colorState={colorState} />
                <ContrastChecker fgColor="#FFFFFF" bgColor={color} />
            </div>

            <div className="flex-1 min-h-[200px]">
                <PaletteGenerator onSelectColor={(c) => {
                    handleColorChange(c);
                    addToHistory(c);
                }} />
            </div>

            {/* Quick Presets / Trending */}
            <div className="bg-slate-800 rounded-xl border border-slate-700 p-4 shrink-0">
               <h2 className="text-xs font-bold text-slate-300 uppercase mb-3">トレンドパレット</h2>
               <div className="grid grid-cols-3 gap-3">
                 {[
                   ['#3B82F6', '#2563EB', '#1D4ED8', '#60A5FA', '#93C5FD'], 
                   ['#10B981', '#059669', '#047857', '#34D399', '#6EE7B7'], 
                   ['#F43F5E', '#E11D48', '#BE123C', '#FB7185', '#FDA4AF'],
                   ['#8B5CF6', '#7C3AED', '#5B21B6', '#A78BFA', '#C4B5FD'],
                   ['#F59E0B', '#D97706', '#B45309', '#FBBF24', '#FCD34D'],
                   ['#64748B', '#475569', '#334155', '#94A3B8', '#CBD5E1'],
                 ].map((palette, i) => (
                   <div key={i} className="flex rounded overflow-hidden h-6 cursor-pointer ring-0 hover:ring-2 ring-white/30 transition-all"
                        onClick={() => handleColorChange(palette[2])}>
                     {palette.map((c) => (
                       <div key={c} className="flex-1 h-full" style={{ backgroundColor: c }} />
                     ))}
                   </div>
                 ))}
               </div>
            </div>

        </div>
      </main>
    </div>
  );
};

export default App;
