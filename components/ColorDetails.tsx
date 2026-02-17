import React, { useState } from 'react';
import { ColorState } from '../types';
import { Copy, Check } from 'lucide-react';

interface ColorDetailsProps {
  colorState: ColorState;
}

const ColorDetails: React.FC<ColorDetailsProps> = ({ colorState }) => {
  const [copied, setCopied] = useState<string | null>(null);

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopied(label);
    setTimeout(() => setCopied(null), 1500);
  };

  const cssStringHSL = `hsl(${colorState.hsl.h}, ${colorState.hsl.s}%, ${colorState.hsl.l}%)`;
  const cssStringRGB = `rgb(${colorState.rgb.r}, ${colorState.rgb.g}, ${colorState.rgb.b})`;

  return (
    <div className="bg-slate-800 rounded-xl border border-slate-700 p-4">
      <h3 className="text-sm font-semibold text-slate-300 mb-3">カラーコード</h3>
      <div className="grid grid-cols-2 gap-2">
        <ValueRow 
          label="HEX" 
          value={colorState.hex} 
          onCopy={() => handleCopy(colorState.hex, 'HEX')} 
          isCopied={copied === 'HEX'} 
        />
        <ValueRow 
          label="RGB" 
          value={cssStringRGB} 
          onCopy={() => handleCopy(cssStringRGB, 'RGB')} 
          isCopied={copied === 'RGB'} 
        />
        <ValueRow 
          label="HSL" 
          value={cssStringHSL} 
          onCopy={() => handleCopy(cssStringHSL, 'HSL')} 
          isCopied={copied === 'HSL'} 
        />
        <ValueRow 
          label="Tailwind" 
          value={`[${colorState.hex}]`} 
          onCopy={() => handleCopy(`[${colorState.hex}]`, 'Tailwind')} 
          isCopied={copied === 'Tailwind'} 
        />
      </div>
    </div>
  );
};

const ValueRow: React.FC<{ label: string; value: string; onCopy: () => void; isCopied: boolean }> = ({ 
  label, value, onCopy, isCopied 
}) => (
  <button 
    onClick={onCopy}
    className="group flex items-center justify-between px-3 py-2 bg-slate-900/50 hover:bg-slate-700 border border-slate-700/50 hover:border-slate-600 rounded-lg transition-all"
  >
    <div className="flex flex-col items-start overflow-hidden">
      <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">{label}</span>
      <span className="font-mono text-xs text-slate-300 truncate w-full text-left">{value}</span>
    </div>
    <div className={`ml-2 p-1 rounded transition-colors ${isCopied ? 'text-green-400' : 'text-slate-600 group-hover:text-slate-300'}`}>
      {isCopied ? <Check size={14} /> : <Copy size={14} />}
    </div>
  </button>
);

export default ColorDetails;
