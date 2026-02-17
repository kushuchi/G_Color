import React from 'react';
import { getContrastRatio } from '../utils/colorUtils';
import { AlertCircle, CheckCircle2, XCircle } from 'lucide-react';

interface ContrastCheckerProps {
  fgColor: string;
  bgColor: string;
}

const ContrastChecker: React.FC<ContrastCheckerProps> = ({ fgColor, bgColor }) => {
  const ratio = getContrastRatio(fgColor, bgColor);
  const roundedRatio = ratio.toFixed(2);
  
  const getRating = (val: number) => {
    if (val >= 7) return { label: 'AAA', sub: '最高', color: 'text-green-400', icon: CheckCircle2 };
    if (val >= 4.5) return { label: 'AA', sub: '良', color: 'text-green-300', icon: CheckCircle2 };
    if (val >= 3) return { label: 'AA Large', sub: '大文字', color: 'text-yellow-400', icon: AlertCircle };
    return { label: 'Fail', sub: '不可', color: 'text-red-400', icon: XCircle };
  };

  const rating = getRating(ratio);
  const Icon = rating.icon;

  return (
    <div className="bg-slate-800 rounded-xl border border-slate-700 p-3 h-full flex flex-col">
      <h2 className="text-xs font-bold text-slate-400 uppercase mb-2">白文字コントラスト</h2>
      
      <div className="flex items-center justify-between mb-3 px-3 py-2 rounded bg-slate-900 border border-slate-700">
         <div className="flex flex-col">
            <span className="text-[10px] text-slate-500 uppercase leading-none">比率</span>
            <span className="text-xl font-bold text-white leading-tight tracking-tight">{roundedRatio}</span>
         </div>
         <div className={`flex flex-col items-end ${rating.color}`}>
            <div className="flex items-center gap-1.5">
                <span className="font-bold text-sm leading-none">{rating.label}</span>
                <Icon size={16} strokeWidth={2.5} />
            </div>
            <span className="text-[10px] opacity-80 mt-0.5 font-medium">{rating.sub}</span>
         </div>
      </div>

      {/* Preview */}
      <div 
        className="w-full flex-1 flex flex-col justify-center items-center rounded border border-slate-600 text-center shadow-inner transition-colors duration-200 min-h-[50px]"
        style={{ backgroundColor: bgColor, color: fgColor }}
      >
        <p className="text-sm font-bold">見出し Text</p>
        <p className="text-[10px] opacity-90">本文 Sample</p>
      </div>
    </div>
  );
};

export default ContrastChecker;
