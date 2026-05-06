import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  ArrowLeft,
  BookOpen,
  Calculator,
  Puzzle,
  GitMerge,
  Dumbbell,
  Clock,
  Shapes,
} from "lucide-react";
import { cn } from "../lib/utils";
import type { Category, Difficulty } from "../lib/questionGenerator";

interface PracticeConfigProps {
  onStart: (category: Category, difficulty: Difficulty, amount: number) => void;
  onBack: () => void;
  initialCategory?: Category | null;
}

export function PracticeConfigScreen({
  onStart,
  onBack,
  initialCategory = null,
}: PracticeConfigProps) {
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(
    initialCategory,
  );
  const [selectedDifficulty, setSelectedDifficulty] =
    useState<Difficulty | null>(null);
  const [selectedAmount, setSelectedAmount] = useState<number>(10);

  const CATEGORIES = [
    {
      id: "calculation" as Category,
      label: "Tính Nhanh",
      icon: <Calculator className="w-8 h-8" />,
    },
    {
      id: "logic" as Category,
      label: "Logic IQ",
      icon: <Puzzle className="w-8 h-8" />,
    },
    {
      id: "bonds" as Category,
      label: "Sơ Đồ",
      icon: <GitMerge className="w-8 h-8" />,
    },
    {
      id: "patterns" as Category,
      label: "Quy Luật",
      icon: <Puzzle className="w-8 h-8" />,
    },
    {
      id: "word_problems" as Category,
      label: "Toán Đố",
      icon: <BookOpen className="w-8 h-8" />,
    },
    {
      id: "geometry" as Category,
      label: "Hình Học",
      icon: <Shapes className="w-8 h-8" />,
    },
    {
      id: "time" as Category,
      label: "Đo Lường",
      icon: <Clock className="w-8 h-8" />,
    },
  ];

  const DIFFICULTIES = [
    { id: "easy" as Difficulty, label: "Dễ", desc: "Làm quen cơ bản" },
    {
      id: "medium" as Difficulty,
      label: "Trung Bình",
      desc: "Thử thách nâng cao",
    },
    { id: "hard" as Difficulty, label: "Khó", desc: "Dành cho siêu sao" },
  ];

  return (
    <div className="w-full px-6 py-10 md:py-12 mx-auto min-h-[80vh] flex flex-col items-center">
      <div className="w-full max-w-2xl flex items-center gap-4 mb-8">
        <button
          onClick={onBack}
          className="p-3 bg-white border border-slate-200 rounded-2xl hover:border-indigo-300 transition-all shadow-sm text-slate-500 hover:text-indigo-600 focus:outline-none"
        >
          <ArrowLeft className="w-6 h-6 md:w-8 md:h-8" />
        </button>
        <h2 className="text-3xl font-black text-slate-900 flex items-center gap-2">
          <Dumbbell className="w-8 h-8 text-indigo-600" />
          Phòng Tập Luyện
        </h2>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-2xl bg-white border border-slate-200 rounded-[32px] p-8 mt-4 shadow-sm"
      >
        <div className="mb-8">
          <h3 className="text-xl font-bold text-slate-800 mb-4">
            1. Chọn kỹ năng
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={cn(
                  "p-4 rounded-2xl border-2 flex flex-col items-center gap-3 transition-all",
                  selectedCategory === cat.id
                    ? "border-indigo-500 bg-indigo-50 text-indigo-700 shadow-sm"
                    : "border-slate-200 hover:border-indigo-300 bg-white text-slate-600",
                )}
              >
                {cat.icon}
                <span className="font-bold">{cat.label}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="mb-10">
          <h3 className="text-xl font-bold text-slate-800 mb-4">
            2. Chọn độ khó
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {DIFFICULTIES.map((diff) => (
              <button
                key={diff.id}
                onClick={() => setSelectedDifficulty(diff.id)}
                className={cn(
                  "p-4 rounded-xl border-2 flex flex-col items-center text-center transition-all",
                  selectedDifficulty === diff.id
                    ? "border-emerald-500 bg-emerald-50 text-emerald-700 shadow-sm"
                    : "border-slate-200 hover:border-emerald-300 bg-white text-slate-600",
                )}
              >
                <span className="font-bold mb-1">{diff.label}</span>
                <span className="text-xs opacity-80">{diff.desc}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="mb-10">
          <h3 className="text-xl font-bold text-slate-800 mb-4">
            3. Số lượng câu hỏi
          </h3>
          <div className="flex gap-4">
            {[10, 20, 30].map((amount) => (
              <button
                key={amount}
                onClick={() => setSelectedAmount(amount)}
                className={cn(
                  "flex-1 p-4 rounded-xl border-2 font-bold transition-all",
                  selectedAmount === amount
                    ? "border-sky-500 bg-sky-50 text-sky-700 shadow-sm"
                    : "border-slate-200 hover:border-sky-300 bg-white text-slate-600",
                )}
              >
                {amount} câu
              </button>
            ))}
          </div>
        </div>

        <button
          disabled={!selectedCategory || !selectedDifficulty}
          onClick={() => {
            if (selectedCategory && selectedDifficulty) {
              onStart(selectedCategory, selectedDifficulty, selectedAmount);
            }
          }}
          className={cn(
            "w-full py-4 rounded-2xl font-black text-lg transition-all shadow-lg active:scale-95",
            selectedCategory && selectedDifficulty
              ? "bg-indigo-600 text-white shadow-indigo-200 hover:bg-indigo-700"
              : "bg-slate-200 text-slate-400 cursor-not-allowed shadow-none",
          )}
        >
          BẮT ĐẦU LUYỆN TẬP
        </button>
      </motion.div>
    </div>
  );
}
