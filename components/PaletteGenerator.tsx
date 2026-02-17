import React, { useState } from 'react';
import { generateAiPalette } from '../services/geminiService';
import { Sparkles, Loader2 } from 'lucide-react';

interface PaletteGeneratorProps {
  onSelectColor: (color: string) => void;
}

const PaletteGenerator: React.FC<PaletteGeneratorProps> = ({ onSelectColor }) => {
  const [keyword, setKeyword] = useState('');
  const [palette, setPalette] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!keyword.trim()) return;

    setLoading(true);
    setPalette([]);
    try {
      const colors = await generateAiPalette(keyword);
      setPalette(colors);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-slate-800 rounded-xl border border-slate-700 p-4 flex flex-col h-full">
      <div className="flex items-center gap-2 mb-3">
        <Sparkles className="text-purple-400" size={16} />
        <h2 className="text-sm font-semibold text-white">AI配色ジェネレーター</h2>
      </div>

      <form onSubmit={handleGenerate} className="flex gap-2 mb-3">
        <input
          type="text"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          placeholder="テーマ (例: ネオン街、春の桜)"
          className="flex-1 bg-slate-900 border border-slate-600 text-white text-xs px-3 py-2 rounded focus:ring-1 focus:ring-purple-500 outline-none placeholder:text-slate-600"
        />
        <button
          type="submit"
          disabled={loading || !keyword}
          className="bg-purple-600 hover:bg-purple-500 disabled:bg-slate-700 disabled:text-slate-500 text-white px-3 py-2 rounded text-xs font-medium transition-colors flex items-center gap-1 whitespace-nowrap"
        >
          {loading ? <Loader2 className="animate-spin" size={14} /> : '生成'}
        </button>
      </form>

      <div className="flex-1 bg-slate-900/50 rounded-lg p-2 border border-slate-700/50 min-h-[60px]">
        {palette.length > 0 ? (
          <div className="grid grid-cols-5 gap-2 h-full">
            {palette.map((color, index) => (
              <button
                key={index}
                onClick={() => onSelectColor(color)}
                className="group relative h-full w-full rounded overflow-hidden border border-white/10 hover:border-white/50 transition-all hover:scale-105"
                style={{ backgroundColor: color }}
                title={color}
              >
                <span className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 bg-black/40 text-white text-[9px] font-mono">
                  {color}
                </span>
              </button>
            ))}
          </div>
        ) : (
          <div className="h-full flex items-center justify-center text-slate-600 text-xs">
            {loading ? (
               <span className="flex items-center gap-2 text-purple-400">
                 <Loader2 className="animate-spin" size={14} /> 生成中...
               </span>
            ) : (
               <span>キーワードを入力してパレットを生成</span>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default PaletteGenerator;
