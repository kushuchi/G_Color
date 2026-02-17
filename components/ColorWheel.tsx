import React, { useMemo, useEffect, useState, useRef, useCallback } from 'react';
import { hexToHsv, hsvToHex, hexToRgb, rgbToHex } from '../utils/colorUtils';
import { HSV } from '../types';

interface ColorWheelProps {
  color: string;
  onChange: (color: string) => void;
}

const ColorWheel: React.FC<ColorWheelProps> = ({ color, onChange }) => {
  // Sync internal state with external prop
  const hsv = useMemo(() => hexToHsv(color), [color]);
  const rgb = useMemo(() => hexToRgb(color) || { r: 0, g: 0, b: 0 }, [color]);

  // Handle HSV Change
  const handleHsvChange = (newHsv: HSV) => {
    onChange(hsvToHex(newHsv));
  };

  // --- Input Handlers ---
  const updateRgb = (key: 'r' | 'g' | 'b', val: string) => {
    const num = Math.min(255, Math.max(0, parseInt(val) || 0));
    const newRgb = { ...rgb, [key]: num };
    onChange(rgbToHex(newRgb.r, newRgb.g, newRgb.b));
  };

  const updateHsv = (key: 'h' | 's' | 'v', val: string) => {
    const num = parseInt(val) || 0;
    const limit = key === 'h' ? 360 : 100;
    const clamped = Math.min(limit, Math.max(0, num));
    onChange(hsvToHex({ ...hsv, [key]: clamped }));
  };

  const updateHex = (val: string) => {
    const clean = val.replace(/#/g, '');
    if (clean.length <= 6) {
      if (/^[0-9A-F]{6}$/i.test(clean)) {
        onChange(`#${clean}`);
      }
    }
  };

  return (
    <div className="bg-slate-800 rounded-xl p-4 shadow-xl border border-slate-700 select-none flex flex-row gap-4 h-full">
      {/* Saturation/Brightness Area */}
      <SaturationArea hsv={hsv} onChange={handleHsvChange} />

      {/* Hue Slider */}
      <HueSlider hsv={hsv} onChange={handleHsvChange} />

      {/* Controls & Inputs */}
      <div className="flex flex-col gap-3 w-40 shrink-0">
        
        {/* New/Current Preview */}
        <div className="space-y-1">
            <div className="text-[10px] text-slate-400 font-bold">カラー</div>
            <div className="flex border border-slate-600 rounded overflow-hidden h-12">
                <div className="w-full h-full" style={{ backgroundColor: color }}></div>
            </div>
        </div>

        <div className="h-px bg-slate-700 my-1"></div>

        {/* HSB Inputs */}
        <div className="space-y-1">
            <InputRow label="H" value={hsv.h} suffix="°" max={360} onChange={(v) => updateHsv('h', v)} />
            <InputRow label="S" value={hsv.s} suffix="%" max={100} onChange={(v) => updateHsv('s', v)} />
            <InputRow label="B" value={hsv.v} suffix="%" max={100} onChange={(v) => updateHsv('v', v)} />
        </div>

        <div className="h-px bg-slate-700 my-1"></div>

        {/* RGB Inputs */}
        <div className="space-y-1">
            <InputRow label="R" value={rgb.r} max={255} onChange={(v) => updateRgb('r', v)} />
            <InputRow label="G" value={rgb.g} max={255} onChange={(v) => updateRgb('g', v)} />
            <InputRow label="B" value={rgb.b} max={255} onChange={(v) => updateRgb('b', v)} />
        </div>
        
        <div className="h-px bg-slate-700 my-1"></div>

        {/* Hex Input */}
        <div className="flex items-center gap-1">
            <label className="text-xs font-bold text-slate-400 w-3">#</label>
            <input 
                type="text" 
                defaultValue={color.replace('#','')}
                key={color} 
                onBlur={(e) => updateHex(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && updateHex(e.currentTarget.value)}
                className="flex-1 bg-slate-900 border border-slate-600 rounded px-1 py-1 text-sm text-white font-mono uppercase focus:ring-1 focus:ring-blue-500 outline-none w-full"
            />
        </div>
      </div>
    </div>
  );
};

// --- Sub Components for Custom Picker ---

const SaturationArea = ({ hsv, onChange }: { hsv: HSV, onChange: (val: HSV) => void }) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const [isDragging, setIsDragging] = useState(false);

    // Convert HSV to background color for the area (Hue only)
    const hueColor = useMemo(() => {
        return hsvToHex({ h: hsv.h, s: 100, v: 100 });
    }, [hsv.h]);

    const handleMove = useCallback((e: MouseEvent | React.MouseEvent) => {
        if (!containerRef.current) return;
        const rect = containerRef.current.getBoundingClientRect();
        
        const clientX = 'touches' in e ? (e as any).touches[0].clientX : (e as MouseEvent).clientX;
        const clientY = 'touches' in e ? (e as any).touches[0].clientY : (e as MouseEvent).clientY;

        const x = Math.min(Math.max(0, clientX - rect.left), rect.width);
        const y = Math.min(Math.max(0, clientY - rect.top), rect.height);

        const s = Math.round((x / rect.width) * 100);
        const v = Math.round(100 - (y / rect.height) * 100);

        onChange({ ...hsv, s, v });
    }, [hsv, onChange]);

    const handleMouseDown = (e: React.MouseEvent) => {
        setIsDragging(true);
        handleMove(e);
    };

    useEffect(() => {
        const handleUp = () => setIsDragging(false);
        const handleWindowMove = (e: MouseEvent) => {
            if (isDragging) handleMove(e);
        };

        if (isDragging) {
            window.addEventListener('mousemove', handleWindowMove);
            window.addEventListener('mouseup', handleUp);
        }
        return () => {
            window.removeEventListener('mousemove', handleWindowMove);
            window.removeEventListener('mouseup', handleUp);
        };
    }, [isDragging, handleMove]);

    // Calculate pointer position
    const top = 100 - hsv.v;
    const left = hsv.s;

    return (
        <div 
            ref={containerRef}
            className="flex-1 h-full relative rounded-md overflow-hidden cursor-crosshair border border-slate-600"
            style={{ 
                backgroundColor: hueColor,
                minHeight: '250px'
            }}
            onMouseDown={handleMouseDown}
        >
            <div className="absolute inset-0" style={{ background: 'linear-gradient(to right, #fff, transparent)' }}></div>
            <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, #000, transparent)' }}></div>
            
            <div 
                className="absolute w-3 h-3 border-2 border-white rounded-full shadow-[0_0_2px_rgba(0,0,0,0.8)] -ml-1.5 -mt-1.5 pointer-events-none"
                style={{ top: `${top}%`, left: `${left}%` }}
            ></div>
        </div>
    );
};

const HueSlider = ({ hsv, onChange }: { hsv: HSV, onChange: (val: HSV) => void }) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const [isDragging, setIsDragging] = useState(false);

    const handleMove = useCallback((e: MouseEvent | React.MouseEvent) => {
        if (!containerRef.current) return;
        const rect = containerRef.current.getBoundingClientRect();
        
        const clientY = 'touches' in e ? (e as any).touches[0].clientY : (e as MouseEvent).clientY;
        const y = Math.min(Math.max(0, clientY - rect.top), rect.height);

        // 0 at top, 360 at bottom? Usually 0 is Red. 
        // Standard CSS Hue gradient: Red(0) -> Yellow -> Green -> Cyan -> Blue -> Magenta -> Red(360)
        // Let's map Y(0->1) to H(360->0) or H(0->360). 
        // Photoshop standard is 360 at top (Red) to 0 at bottom (Red).
        // Let's do 360 -> 0 to match Photoshop visual
        const percent = y / rect.height;
        const h = Math.round(360 - (percent * 360));

        // Clamp to 0-360, wrapping 360 to 0 is handled by calc
        onChange({ ...hsv, h: h === 360 ? 0 : h });
    }, [hsv, onChange]);

    const handleMouseDown = (e: React.MouseEvent) => {
        setIsDragging(true);
        handleMove(e);
    };

    useEffect(() => {
        const handleUp = () => setIsDragging(false);
        const handleWindowMove = (e: MouseEvent) => {
            if (isDragging) handleMove(e);
        };

        if (isDragging) {
            window.addEventListener('mousemove', handleWindowMove);
            window.addEventListener('mouseup', handleUp);
        }
        return () => {
            window.removeEventListener('mousemove', handleWindowMove);
            window.removeEventListener('mouseup', handleUp);
        };
    }, [isDragging, handleMove]);

    // Position: 360 is top (0%), 0 is bottom (100%)
    const top = 100 - (hsv.h / 360) * 100;

    return (
        <div 
            ref={containerRef}
            className="w-10 h-full relative rounded-md overflow-hidden cursor-ns-resize border border-slate-600"
            style={{ 
                background: 'linear-gradient(to bottom, #ff0000 0%, #ff00ff 17%, #0000ff 33%, #00ffff 50%, #00ff00 67%, #ffff00 83%, #ff0000 100%)'
            }}
            onMouseDown={handleMouseDown}
        >
            {/* Slider Handle */}
             <div 
                className="absolute left-0 w-full h-1 bg-transparent border-y border-white/80 shadow-[0_1px_2px_rgba(0,0,0,0.5)] -mt-0.5 pointer-events-none"
                style={{ top: `${top}%` }}
            >
                {/* Arrow indicators on sides */}
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-0 h-0 border-l-[4px] border-l-white border-y-[3px] border-y-transparent"></div>
                <div className="absolute right-0 top-1/2 -translate-y-1/2 w-0 h-0 border-r-[4px] border-r-white border-y-[3px] border-y-transparent"></div>
            </div>
        </div>
    );
};

const InputRow = ({ label, value, suffix, max, onChange }: { 
  label: string; 
  value: number; 
  suffix?: string; 
  max: number; 
  onChange: (val: string) => void; 
}) => {
  const [localVal, setLocalVal] = useState(value.toString());

  useEffect(() => {
    setLocalVal(value.toString());
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLocalVal(e.target.value);
    onChange(e.target.value);
  };

  return (
    <div className="flex items-center gap-1 group">
      <div className="w-3 shrink-0">
        <input 
          type="radio" 
          name="color-mode" 
          disabled 
          className="appearance-none w-1.5 h-1.5 rounded-full border border-slate-500 group-hover:border-blue-400 checked:bg-blue-500" 
        />
      </div>
      <span className="text-xs font-bold text-slate-400 w-3">{label}</span>
      <div className="flex-1 flex items-center bg-slate-900 border border-slate-600 rounded px-1 focus-within:ring-1 focus-within:ring-blue-500 transition-all h-7">
        <input
          type="number"
          value={localVal}
          onChange={handleChange}
          className="w-full bg-transparent text-sm text-slate-200 outline-none font-mono text-right"
        />
        {suffix && <span className="text-[10px] text-slate-500 select-none ml-1 w-2">{suffix}</span>}
      </div>
    </div>
  );
};

export default ColorWheel;
