import React from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, Trophy, Target, Zap, ChevronRight } from 'lucide-react';
import { useProgress } from '../hooks/useProgress';
import { 
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell,
  LineChart, Line
} from 'recharts';

export function ProgressScreen({ onBack }: { onBack: () => void }) {
  const { progress } = useProgress();

  const getAccuracy = (correct: number, total: number) => {
    if (total === 0) return 0;
    return Math.round((correct / total) * 100);
  };

  const chartData = [
    { name: 'Tính', value: getAccuracy(progress.categories.calculation?.correct || 0, progress.categories.calculation?.total || 0), color: '#818cf8' }, // indigo-400
    { name: 'Sơ Đồ', value: getAccuracy(progress.categories.bonds?.correct || 0, progress.categories.bonds?.total || 0), color: '#34d399' }, // emerald-400
    { name: 'Quy Luật', value: getAccuracy(progress.categories.patterns?.correct || 0, progress.categories.patterns?.total || 0), color: '#fbbf24' }, // amber-400
    { name: 'Toán Đố', value: getAccuracy(progress.categories.word_problems?.correct || 0, progress.categories.word_problems?.total || 0), color: '#fb7185' }, // rose-400
    { name: 'Hình Học', value: getAccuracy(progress.categories.geometry?.correct || 0, progress.categories.geometry?.total || 0), color: '#c084fc' }, // purple-400
    { name: 'Đo Lường', value: getAccuracy(progress.categories.time?.correct || 0, progress.categories.time?.total || 0), color: '#38bdf8' }, // sky-400
  ];

  const categoriesVals = Object.values(progress.categories) as {correct: number; total: number}[];
  const overallCorrect = categoriesVals.reduce((acc, cat) => acc + (cat?.correct || 0), 0);
  const overallTotal = categoriesVals.reduce((acc, cat) => acc + (cat?.total || 0), 0);
  const overallAccuracy = getAccuracy(overallCorrect, overallTotal);

  // For line chart: map over last N games to show score trend
  const historyData = progress.history.slice(-10).map((h, i) => ({
    name: `Lượt ${i + 1}`,
    score: h.score,
    category: h.category
  }));

  return (
    <div className="w-full px-6 py-10 md:py-12 mx-auto min-h-[80vh] flex flex-col">
      <div className="flex items-center gap-4 mb-8 max-w-5xl mx-auto w-full">
        <button 
          onClick={onBack}
          className="p-3 bg-white border border-slate-200 rounded-2xl hover:border-indigo-300 transition-all shadow-sm text-slate-500 hover:text-indigo-600 focus:outline-none"
        >
          <ArrowLeft className="w-6 h-6 md:w-8 md:h-8" />
        </button>
        <h2 className="text-3xl font-black text-slate-900">Tiến Độ Học Tập 📈</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 max-w-5xl mx-auto w-full">
        
        {/* Left Column: Summary */}
        <div className="md:col-span-4 space-y-6">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-gradient-to-br from-indigo-500 to-purple-600 p-8 rounded-[32px] shadow-lg text-white"
          >
            <h3 className="text-indigo-200 text-sm font-bold uppercase mb-2 tracking-widest">Tổng quan</h3>
            <div className="flex items-end gap-2 mb-6">
              <span className="text-5xl font-black">{overallAccuracy}%</span>
              <span className="text-indigo-200 mb-1 font-medium">chính xác</span>
            </div>
            
            <div className="space-y-4">
               <div className="flex justify-between items-center bg-white/10 p-3 rounded-2xl">
                 <div className="flex items-center gap-3">
                   <Target className="w-5 h-5 text-indigo-300" />
                   <span className="font-semibold">Số trận đã chơi</span>
                 </div>
                 <span className="font-bold text-xl">{progress.gamesPlayed}</span>
               </div>
               <div className="flex justify-between items-center bg-white/10 p-3 rounded-2xl">
                 <div className="flex items-center gap-3">
                   <Zap className="w-5 h-5 text-amber-300" />
                   <span className="font-semibold">Chuỗi đúng dài nhất</span>
                 </div>
                 <span className="font-bold text-xl">{progress.longestStreak}</span>
               </div>
               <div className="flex justify-between items-center bg-white/10 p-3 rounded-2xl">
                 <div className="flex items-center gap-3">
                   <Trophy className="w-5 h-5 text-yellow-300" />
                   <span className="font-semibold">Điểm XP</span>
                 </div>
                 <span className="font-bold text-xl text-yellow-300">{progress.xp}</span>
               </div>
            </div>
          </motion.div>
        </div>

        {/* Right Column: Charts */}
        <div className="md:col-span-8 flex flex-col gap-6">
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white border border-slate-200 rounded-[32px] p-8 shadow-sm flex flex-col"
          >
            <h3 className="text-lg font-extrabold text-slate-800 mb-6">Độ chính xác theo kỹ năng</h3>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12, fontWeight: 600 }} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} domain={[0, 100]} />
                  <Tooltip 
                    cursor={{fill: '#f1f5f9'}}
                    contentStyle={{ borderRadius: '1rem', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)' }}
                  />
                  <Bar dataKey="value" radius={[8, 8, 8, 8]} barSize={40}>
                    {
                      chartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))
                    }
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white border border-slate-200 rounded-[32px] p-8 shadow-sm flex flex-col"
          >
             <h3 className="text-lg font-extrabold text-slate-800 mb-6">Thành tích 10 lượt chơi gần nhất</h3>
            <div className="h-48 w-full">
              {historyData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={historyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12, fontWeight: 600 }} dy={10} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
                    <Tooltip 
                      contentStyle={{ borderRadius: '1rem', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)' }}
                    />
                    <Line type="monotone" dataKey="score" stroke="#6366f1" strokeWidth={4} activeDot={{ r: 8, fill: '#4f46e5', stroke: '#c7d2fe', strokeWidth: 4 }} />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                 <div className="w-full h-full flex items-center justify-center text-slate-400 font-medium italic">
                    Bé chưa chơi lượt nào. Hãy bắt đầu ngay nhé!
                 </div>
              )}
            </div>
          </motion.div>

        </div>
      </div>
    </div>
  );
}
