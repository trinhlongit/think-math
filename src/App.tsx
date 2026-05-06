import React, { useState } from "react";
import { HomeScreen } from "./components/HomeScreen";
import { GameScreen } from "./components/GameScreen";
import { ProgressScreen } from "./components/ProgressScreen";
import type { Category, Difficulty } from "./lib/questionGenerator";
import { useProgress } from "./hooks/useProgress";

type ScreenType = "home" | "game" | "progress";

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<ScreenType>("home");
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(
    null,
  );
  const [gameMode, setGameMode] = useState<"challenge" | "practice">(
    "challenge",
  );
  const [gameDifficulty, setGameDifficulty] = useState<Difficulty>("medium");
  const [practiceAmount, setPracticeAmount] = useState<number>(10);
  const { progress } = useProgress();

  const handleStartExam = () => {
    setSelectedCategory("mixed");
    setGameMode("challenge");
    setGameDifficulty("hard"); // Default for challenges
    setPracticeAmount(15);
    setCurrentScreen("game");
  };

  const handleStartPractice = (
    category: Category,
    difficulty: Difficulty,
    amount: number,
  ) => {
    setSelectedCategory(category);
    setGameMode("practice");
    setGameDifficulty(difficulty);
    setPracticeAmount(amount);
    setCurrentScreen("game");
  };

  const handleBackToHome = () => {
    setCurrentScreen("home");
    setSelectedCategory(null);
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800 flex flex-col overflow-x-hidden selection:bg-indigo-100">
      {/* Top Navigation Bar */}
      <nav className="h-20 bg-white border-b border-slate-200 flex items-center justify-between px-6 md:px-10 shrink-0">
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center cursor-pointer"
            onClick={handleBackToHome}
          >
            <span className="text-white font-bold text-xl">Σ</span>
          </div>
          <h1
            className="text-2xl font-extrabold tracking-tight text-slate-900 cursor-pointer"
            onClick={handleBackToHome}
          >
            THINK<span className="text-indigo-600">MATH</span>
          </h1>
          <span className="hidden md:inline-block ml-4 px-3 py-1 bg-indigo-50 text-indigo-700 text-xs font-bold rounded-full border border-indigo-100 uppercase tracking-widest">
            Lộ trình Lớp 2 → Lớp 3
          </span>
        </div>
        <div className="flex items-center gap-4 md:gap-6">
          <button
            onClick={() => setCurrentScreen("progress")}
            className="flex items-center gap-2 bg-amber-50 px-3 py-1 md:px-4 md:py-2 rounded-full border border-amber-200 hover:bg-amber-100 transition-colors"
          >
            <span className="text-lg md:text-xl">⭐</span>
            <span className="font-bold text-amber-700 text-sm md:text-base">
              {progress.xp} XP
            </span>
          </button>
          <div
            className="hidden md:flex items-center gap-3 border-l border-slate-200 pl-6 cursor-pointer"
            onClick={() => setCurrentScreen("progress")}
          >
            <div className="text-right">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-tighter">
                Học viên
              </p>
              <p className="font-bold text-slate-900 focus:outline-none">
                Thiên Minh
              </p>
            </div>
            <div className="w-10 h-10 md:w-12 md:h-12 bg-slate-200 rounded-full border-2 border-white shadow-sm overflow-hidden flex items-center justify-center">
              <div className="w-full h-full bg-gradient-to-br from-indigo-400 to-purple-500"></div>
            </div>
          </div>
        </div>
      </nav>

      <main className="flex-1 overflow-y-auto">
        {currentScreen === "home" && (
          <HomeScreen
            onStartPractice={handleStartPractice}
            onStartExam={handleStartExam}
          />
        )}

        {currentScreen === "game" && selectedCategory && (
          <GameScreen
            category={selectedCategory}
            mode={gameMode}
            difficulty={gameDifficulty}
            practiceAmount={practiceAmount}
            onBack={handleBackToHome}
          />
        )}

        {currentScreen === "progress" && (
          <ProgressScreen onBack={handleBackToHome} />
        )}
      </main>
    </div>
  );
}
