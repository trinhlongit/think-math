import React from "react";
import { motion } from "motion/react";
import {
  Calculator,
  Puzzle,
  GitMerge,
  BookOpen,
  Clock,
  Shapes,
} from "lucide-react";
import { cn } from "../lib/utils";
import { UI_CLASSES, BRAND_COLORS } from "../lib/theme";
import type { Category, Difficulty } from "../lib/questionGenerator";

interface HomeProps {
  onStartPractice: (cat: Category, diff: Difficulty, amount: number) => void;
  onStartExam: () => void;
}

const CATEGORIES: {
  id: Category;
  label: string;
  icon: React.ReactNode;
  colorClass: string;
  desc: string;
}[] = [
  {
    id: "calculation",
    label: "Tính Thần Tốc",
    desc: "Luyện cộng, trừ, nhân, chia bằng tư duy nhẩm số logic.",
    icon: <Calculator className="w-8 h-8" />,
    colorClass: BRAND_COLORS.primary,
  },
  {
    id: "logic",
    label: "Tư Duy Hình Trí Tuệ",
    desc: "Giải đề thi IKMC Kangaroo, SASMO, POMath và toán logic IQ.",
    icon: <Puzzle className="w-8 h-8" />,
    colorClass: "bg-emerald-50 text-emerald-600",
  },
  {
    id: "word_problems",
    label: "Toán Có Lời Văn",
    desc: "Bóc tách từ khoá từ Singapore Math và Khan Academy rèn luyện.",
    icon: <BookOpen className="w-8 h-8" />,
    colorClass: "bg-rose-50 text-rose-600",
  },
  {
    id: "bonds",
    label: "Số Bí Ẩn",
    desc: "Tách gộp số qua sơ đồ tư duy Bar Model và Violympic quen thuộc.",
    icon: <GitMerge className="w-8 h-8" />,
    colorClass: BRAND_COLORS.secondary,
  },
  {
    id: "patterns",
    label: "Quy Luật Dãy Số",
    desc: "Tư duy phát hiện vòng lặp dãy số như trong kỳ thi ASMO.",
    icon: <Puzzle className="w-8 h-8" />,
    colorClass: BRAND_COLORS.info,
  },
  {
    id: "geometry",
    label: "Hình Học Không Gian",
    desc: "Thiên tài tính chu vi và tưởng tượng khối vuông Rubik.",
    icon: <Shapes className="w-8 h-8" />,
    colorClass: "bg-purple-50 text-purple-600",
  },
  {
    id: "time",
    label: "Thử Thách Thời Gian",
    desc: "Bài toán đồng hồ và ngày tháng theo chuẩn quốc tế.",
    icon: <Clock className="w-8 h-8" />,
    colorClass: "bg-amber-50 text-amber-600",
  },
];

const DAILY_CHALLENGES = [
  {
    id: "c1",
    title: "Giải Cứu Kẹo Ngọt",
    desc: "Vượt qua 10 phép tính nhẩm liên tiếp để giải cứu các viên kẹo bị lấy cắp.",
    level: "Dễ",
    levelColor: "text-emerald-700 bg-emerald-50 border-emerald-200",
    reward: "+50 XP",
    icon: "🍬",
    bg: "bg-gradient-to-br from-emerald-50/50 to-teal-50 border-emerald-100 hover:border-emerald-300",
    btn: "bg-emerald-500 hover:bg-emerald-600 shadow-emerald-200 text-white",
  },
  {
    id: "c2",
    title: "Truy Tìm Kho Báu",
    desc: "Mở khóa 5 rương báu bằng cách giải mã chính xác sơ đồ tách gộp số.",
    level: "Trung bình",
    levelColor: "text-amber-700 bg-amber-50 border-amber-200",
    reward: "+100 XP",
    icon: "🏴‍☠️",
    bg: "bg-gradient-to-br from-amber-50/50 to-orange-50 border-amber-100 hover:border-amber-300",
    btn: "bg-amber-500 hover:bg-amber-600 shadow-amber-200 text-white",
  },
  {
    id: "c3",
    title: "Đấu Trường Vinschool",
    desc: "Thi tài tìm quy luật số với 150 học sinh khác để giành huy hiệu vàng.",
    level: "Khó",
    levelColor: "text-rose-700 bg-rose-50 border-rose-200",
    reward: "+300 XP",
    icon: "🏆",
    bg: "bg-gradient-to-br from-indigo-50/50 to-purple-50 border-indigo-100 hover:border-indigo-300",
    btn: "bg-indigo-600 hover:bg-indigo-700 shadow-indigo-200 text-white",
  },
  {
    id: "c4",
    title: "Bậc Thầy Phép Nhân",
    desc: "Sử dụng bảng cửu chương để đánh bại quái vật số học trước khi hết giờ.",
    level: "Trung bình",
    levelColor: "text-sky-700 bg-sky-50 border-sky-200",
    reward: "+120 XP • 🏅 Huy hiệu",
    icon: "⚔️",
    bg: "bg-gradient-to-br from-sky-50/50 to-blue-50 border-sky-100 hover:border-sky-300",
    btn: "bg-sky-500 hover:bg-sky-600 shadow-sky-200 text-white",
  },
  {
    id: "c5",
    title: "Thiên Tài Phép Chia",
    desc: "Giúp bác nông dân thu hoạch và chia đều số táo vào các giỏ. Cẩn thận đừng nhầm lẫn!",
    level: "Khó",
    levelColor: "text-fuchsia-700 bg-fuchsia-50 border-fuchsia-200",
    reward: "+250 XP • 👑 Vương miện",
    icon: "🍎",
    bg: "bg-gradient-to-br from-fuchsia-50/50 to-pink-50 border-fuchsia-100 hover:border-fuchsia-300",
    btn: "bg-fuchsia-500 hover:bg-fuchsia-600 shadow-fuchsia-200 text-white",
  },
];

export function HomeScreen({ onStartPractice, onStartExam }: HomeProps) {
  const [difficulty, setDifficulty] = React.useState<Difficulty>("medium");
  const [amount, setAmount] = React.useState<number>(10);

  return (
    <div className="w-full px-6 py-10 md:py-12 mx-auto">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-5xl mx-auto mb-10 flex flex-col md:flex-row justify-between items-start md:items-end gap-4"
      >
        <div>
          <h2 className="text-3xl font-black text-slate-900">
            Chào buổi sáng, Thiên Minh!
          </h2>
          <p className="text-slate-500 mt-2 text-lg">
            Hôm nay chúng ta sẽ tiếp tục chinh phục{" "}
            <span className="text-indigo-600 font-semibold underline decoration-2 underline-offset-4">
              Toán tư duy Singapore
            </span>{" "}
            nhé.
          </p>
        </div>
      </motion.div>

      {/* Tweak Practice Config Block */}
      <div className="max-w-5xl mx-auto w-full mb-8 flex flex-col md:flex-row gap-4 justify-between items-center bg-white p-4 rounded-[24px] shadow-sm border border-slate-200">
        <div className="flex items-center gap-4 w-full md:w-auto overflow-x-auto">
          <span className="text-sm font-bold text-slate-500 uppercase tracking-widest whitespace-nowrap px-2">
            Độ Khó
          </span>
          <div className="flex bg-slate-100 p-1 rounded-xl gap-1 shrink-0">
            {(["easy", "medium", "hard"] as Difficulty[]).map((d) => (
              <button
                key={d}
                onClick={() => setDifficulty(d)}
                className={cn(
                  "px-4 py-2 rounded-lg text-sm font-bold transition-all capitalize",
                  difficulty === d
                    ? "bg-white text-indigo-600 shadow-sm"
                    : "text-slate-500 hover:text-slate-700",
                )}
              >
                {d === "easy" ? "Dễ" : d === "medium" ? "Vừa" : "Khó"}
              </button>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-4 w-full md:w-auto overflow-x-auto">
          <span className="text-sm font-bold text-slate-500 uppercase tracking-widest whitespace-nowrap px-2">
            Số Câu
          </span>
          <div className="flex bg-slate-100 p-1 rounded-xl gap-1 shrink-0">
            {[5, 10, 20, 30].map((n) => (
              <button
                key={n}
                onClick={() => setAmount(n)}
                className={cn(
                  "px-4 py-2 rounded-lg text-sm font-bold transition-all",
                  amount === n
                    ? "bg-white text-indigo-600 shadow-sm"
                    : "text-slate-500 hover:text-slate-700",
                )}
              >
                {n}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 max-w-5xl mx-auto w-full">
        {CATEGORIES.map((cat, i) => (
          <motion.div
            key={cat.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="group"
          >
            <button
              onClick={() => onStartPractice(cat.id, difficulty, amount)}
              className="bg-white border border-slate-200 p-8 rounded-[32px] shadow-sm hover:border-indigo-300 hover:shadow-xl transition-all flex flex-col items-start text-left w-full h-full relative overflow-hidden"
            >
              <div
                className={cn(
                  "w-14 h-14 rounded-2xl flex items-center justify-center mb-6",
                  cat.colorClass,
                )}
              >
                {cat.icon}
              </div>
              <h4 className="text-xl font-bold text-slate-900 mb-2">
                {cat.label}
              </h4>
              <p className="text-slate-500 text-sm leading-relaxed mb-8">
                {cat.desc}
              </p>

              <div className="mt-auto w-full flex items-center justify-between">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                  Sẵn sàng
                </span>
                <div className="px-5 py-2 bg-indigo-50 text-indigo-700 font-bold rounded-xl text-sm group-hover:bg-indigo-600 group-hover:text-white transition-colors duration-300">
                  Luyện tập
                </div>
              </div>
            </button>
          </motion.div>
        ))}
      </div>

      {/* Daily Challenges Section */}
      <div className="max-w-5xl mx-auto mt-14 mb-8">
        <div className="flex items-center justify-between mb-6 px-2">
          <h3 className="text-2xl font-black text-slate-800">
            Kỳ Thi Tốc Độ 🎯
          </h3>
          <button className="text-sm font-bold text-indigo-600 hover:text-indigo-700 bg-indigo-50 px-4 py-2 rounded-xl">
            Xem tất cả
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {DAILY_CHALLENGES.map((challenge, i) => (
            <motion.div
              key={challenge.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 + i * 0.1 }}
              className={cn(
                "rounded-[32px] border p-8 flex flex-col items-center text-center hover:shadow-xl transition-all group",
                challenge.bg,
              )}
            >
              <div className="w-20 h-20 bg-white rounded-3xl shadow-sm flex items-center justify-center text-4xl mb-6 group-hover:scale-110 group-hover:-rotate-3 transition-transform duration-300">
                {challenge.icon}
              </div>
              <div
                className={cn(
                  "px-4 py-1.5 rounded-xl text-xs font-bold mb-4 border uppercase tracking-wider",
                  challenge.levelColor,
                )}
              >
                {challenge.level}
              </div>
              <h4 className="text-xl font-extrabold text-slate-900 leading-tight mb-3">
                {challenge.title}
              </h4>
              <p className="text-slate-600 text-sm mb-8 flex-1 leading-relaxed">
                {challenge.desc}
              </p>

              <div className="w-full mt-auto">
                <button
                  onClick={onStartExam}
                  className={cn(
                    "w-full py-4 font-black rounded-2xl shadow-lg active:scale-95 transition-all text-sm",
                    challenge.btn,
                  )}
                >
                  {"THAM GIA KỲ THI • " + challenge.reward}
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
