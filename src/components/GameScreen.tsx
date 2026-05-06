import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import confetti from "canvas-confetti";
import { Trophy, ArrowLeft, Star, Heart, Timer } from "lucide-react";
import {
  generateQuestion,
  Question,
  Category,
  Difficulty,
} from "../lib/questionGenerator";
import { cn } from "../lib/utils";
import { UI_CLASSES } from "../lib/theme";
import { useProgress } from "../hooks/useProgress";

interface GameScreenProps {
  category: Category;
  mode?: "challenge" | "practice";
  difficulty?: Difficulty;
  practiceAmount?: number;
  onBack: () => void;
}

export function GameScreen({
  category,
  mode = "challenge",
  difficulty = "medium",
  practiceAmount = 10,
  onBack,
}: GameScreenProps) {
  const isPractice = mode === "practice";
  const [question, setQuestion] = useState<Question>(
    generateQuestion(category, difficulty),
  );
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [maxStreak, setMaxStreak] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const [lives, setLives] = useState(3);
  const [selectedAnswer, setSelectedAnswer] = useState<number | string | null>(
    null,
  );
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [gameOver, setGameOver] = useState(false);
  const [timeLeft, setTimeLeft] = useState(30);
  const { recordGame } = useProgress();
  const [historyTexts, setHistoryTexts] = useState<Set<string>>(
    new Set([question.text]),
  );

  // Key for forcing re-animation of the card
  const [questionKey, setQuestionKey] = useState(0);

  useEffect(() => {
    if (gameOver && totalCount > 0) {
      recordGame({
        category,
        score,
        correctCount,
        totalCount,
        maxStreak,
      });
    }
  }, [gameOver]);

  useEffect(() => {
    if (gameOver || selectedAnswer !== null || isPractice) return;
    if (timeLeft <= 0) {
      handleAnswer(-1); // -1 will trigger incorrect logic as answers are positive
      return;
    }
    const timerId = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timerId);
  }, [timeLeft, gameOver, selectedAnswer, isPractice]);

  const handleNext = (
    currentQuestionText?: string,
    nextTotalCount?: number,
  ) => {
    const actTotalCount =
      nextTotalCount !== undefined ? nextTotalCount : totalCount;
    if (actTotalCount >= practiceAmount) {
      setGameOver(true);
      return;
    }

    let nextQ = generateQuestion(category, difficulty);
    // Prevent duplicate questions in the same session
    let attempts = 0;
    while (historyTexts.has(nextQ.text) && attempts < 20) {
      nextQ = generateQuestion(category, difficulty);
      attempts++;
    }

    setHistoryTexts((prev) => {
      const newSet = new Set(prev);
      newSet.add(nextQ.text);
      return newSet;
    });

    setQuestion(nextQ);
    setSelectedAnswer(null);
    setIsCorrect(null);
    setTimeLeft(30);
    setQuestionKey((prev) => prev + 1);
  };

  const handleExit = () => {
    if (!gameOver && totalCount > 0) {
      recordGame({
        category,
        score,
        correctCount,
        totalCount,
        maxStreak,
      });
    }
    onBack();
  };

  const handleAnswer = (ans: number | string) => {
    if (selectedAnswer !== null) return; // Prevent multiple clicks

    setTotalCount((prev) => prev + 1);
    setSelectedAnswer(ans);

    if (ans === question.correctAnswer) {
      setIsCorrect(true);
      setCorrectCount((prev) => prev + 1);
      setScore((prev) => prev + (isPractice ? 5 : 10));
      setStreak((prev) => {
        const newStreak = prev + 1;
        setMaxStreak((currentMax) => Math.max(currentMax, newStreak));
        if (newStreak % 3 === 0 && !isPractice) {
          fireConfetti();
        }
        return newStreak;
      });
      setTimeout(() => handleNext(question.text, totalCount + 1), 1200);
    } else {
      setIsCorrect(false);
      setStreak(0);
      if (!isPractice) {
        setScore((prev) => Math.max(0, prev - 5)); // Penalize for wrong or timeout
        setLives((prev) => {
          const newLives = prev - 1;
          if (newLives <= 0) {
            setTimeout(() => {
              setGameOver(true);
            }, 1000);
          } else {
            setTimeout(() => handleNext(question.text, totalCount + 1), 1000);
          }
          return newLives;
        });
      } else {
        // Practice Mode: try again or move on? Let's move on to keep it fresh
        setTimeout(() => handleNext(question.text, totalCount + 1), 1000);
      }
    }
  };

  const fireConfetti = () => {
    confetti({
      particleCount: 150,
      spread: 70,
      origin: { y: 0.6 },
      colors: ["#34d399", "#fbbf24", "#f87171", "#38bdf8"],
    });
  };

  const handleRestart = () => {
    setScore(0);
    setStreak(0);
    setLives(3);
    setGameOver(false);
    setTimeLeft(30);
    setTotalCount(0);
    setCorrectCount(0);
    setMaxStreak(0);
    setHistoryTexts(new Set());
    handleNext(undefined, 0);
  };

  if (gameOver) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[80vh]">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className={cn("p-12 text-center", UI_CLASSES.card)}
        >
          <Trophy className="w-24 h-24 text-amber-400 mx-auto mb-6" />
          <h2 className="text-4xl font-black mb-4">
            {isPractice ? "Hoàn Thành Luyện Tập!" : "Tuyệt Vời!"}
          </h2>
          <p className="text-2xl font-bold mb-4">
            Điểm của bé: <span className="text-indigo-600">{score}</span>
          </p>
          <div className="flex justify-center gap-6 mb-8 text-lg">
            <div className="bg-slate-50 px-6 py-3 rounded-2xl border border-slate-100 flex flex-col items-center">
              <span className="text-slate-500 font-bold mb-1">
                Trả lời đúng
              </span>
              <span className="font-black text-emerald-500 text-2xl">
                {correctCount}{" "}
                <span className="text-slate-400 text-xl">/ {totalCount}</span>
              </span>
            </div>
          </div>
          <div className="flex gap-4 justify-center">
            <button onClick={handleRestart} className={UI_CLASSES.bouncyButton}>
              Chơi Lại
            </button>
            <button
              onClick={handleExit}
              className="px-8 py-4 bg-white text-slate-700 border border-slate-200 font-bold rounded-2xl shadow-sm hover:border-indigo-300 transition-all text-xl"
            >
              Trang Chủ
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto py-8 px-4 flex flex-col h-[90vh]">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <button
          onClick={handleExit}
          className="p-3 bg-white border border-slate-200 rounded-2xl hover:border-indigo-300 transition-all shadow-sm text-slate-500 hover:text-indigo-600 focus:outline-none"
        >
          <ArrowLeft className="w-6 h-6 md:w-8 md:h-8" />
        </button>

        <div className="flex gap-6 items-center">
          {!isPractice && (
            <div className="flex items-center gap-2 bg-white border border-slate-200 px-4 py-2 rounded-2xl shadow-sm">
              <Timer className="w-6 h-6 md:w-8 md:h-8 text-rose-400" />
              <span
                className={cn(
                  "text-xl md:text-2xl font-black",
                  timeLeft <= 5
                    ? "text-rose-500 animate-pulse"
                    : "text-slate-700",
                )}
              >
                {timeLeft}s
              </span>
            </div>
          )}
          <div className="flex items-center gap-2 bg-white border border-slate-200 px-4 py-2 rounded-2xl shadow-sm">
            <Star className="w-6 h-6 md:w-8 md:h-8 text-amber-400 fill-amber-400" />
            <span className="text-xl md:text-2xl font-black text-slate-700">
              {score}
            </span>
          </div>
          <div className="flex items-center gap-2 bg-white border border-slate-200 px-4 py-2 rounded-2xl shadow-sm">
            <span className="text-xl md:text-2xl font-black text-slate-600">
              Câu {Math.min(totalCount + 1, practiceAmount)} / {practiceAmount}
            </span>
          </div>
          {!isPractice && (
            <div className="flex items-center gap-1">
              {[...Array(3)].map((_, i) => (
                <Heart
                  key={i}
                  className={cn(
                    "w-8 h-8 md:w-10 md:h-10 transition-all duration-300",
                    i < lives
                      ? "text-rose-500 fill-rose-500"
                      : "text-slate-200 fill-slate-50",
                  )}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Main Game Area */}
      <div className="flex-1 flex flex-col items-center justify-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={questionKey}
            initial={{ x: 100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -100, opacity: 0 }}
            transition={{ type: "spring", stiffness: 200, damping: 20 }}
            className={cn(
              "w-full max-w-2xl p-8 md:p-12 text-center",
              UI_CLASSES.card,
            )}
          >
            {category !== "calculation" && (
              <h2
                className={cn(
                  "font-extrabold text-slate-700 mb-8",
                  question.visuals
                    ? "text-3xl"
                    : "text-2xl md:text-3xl leading-relaxed",
                )}
              >
                {question.text}
              </h2>
            )}

            {/* Visual Aids (if any) */}
            {question.visuals?.type === "sequence" && (
              <div className="flex justify-center gap-2 md:gap-4 mb-8">
                {question.visuals.data.map((num: number, i: number) => (
                  <div key={i} className="flex items-center">
                    <div
                      className={cn(
                        "w-14 h-14 md:w-20 md:h-20 rounded-2xl border-2 flex items-center justify-center font-black text-2xl shadow-sm transition-all",
                        num === -999
                          ? "bg-indigo-50 border-indigo-200 text-indigo-500 border-dashed"
                          : "bg-white border-slate-200 text-slate-700",
                      )}
                    >
                      {num === -999 ? "?" : num}
                    </div>
                    {i < question.visuals.data.length - 1 && (
                      <div className="w-4 h-1 bg-slate-200 mx-1 md:mx-2 rounded" />
                    )}
                  </div>
                ))}
              </div>
            )}

            {question.visuals?.type === "bond" && (
              <div className="flex flex-col items-center mb-10 mt-6 relative w-64 mx-auto">
                {/* Top Level (Whole) */}
                <div
                  className={cn(
                    "w-24 h-24 rounded-full border-2 flex items-center justify-center font-black text-3xl z-10 shadow-sm transition-all",
                    question.visuals.data.whole === "?"
                      ? "bg-indigo-50 border-indigo-200 text-indigo-500 border-dashed"
                      : "bg-white border-slate-200 text-slate-700",
                  )}
                >
                  {question.visuals.data.whole}
                </div>

                {/* Connecting lines */}
                <svg
                  className="absolute top-20 w-40 h-20 -z-10"
                  style={{ left: "50%", transform: "translateX(-50%)" }}
                >
                  <path
                    d="M 80 0 L 20 80"
                    stroke="currentColor"
                    strokeWidth="3"
                    className="text-slate-200"
                  />
                  <path
                    d="M 80 0 L 140 80"
                    stroke="currentColor"
                    strokeWidth="3"
                    className="text-slate-200"
                  />
                </svg>

                {/* Bottom Level (Parts) */}
                <div className="flex justify-between w-full mt-10">
                  <div
                    className={cn(
                      "w-20 h-20 rounded-full border-2 flex items-center justify-center font-black text-2xl z-10 shadow-sm transition-all",
                      question.visuals.data.p1 === "?"
                        ? "bg-indigo-50 border-indigo-200 text-indigo-500 border-dashed"
                        : "bg-white border-slate-200 text-slate-700",
                    )}
                  >
                    {question.visuals.data.p1}
                  </div>
                  <div
                    className={cn(
                      "w-20 h-20 rounded-full border-2 flex items-center justify-center font-black text-2xl z-10 shadow-sm transition-all",
                      question.visuals.data.p2 === "?"
                        ? "bg-indigo-50 border-indigo-200 text-indigo-500 border-dashed"
                        : "bg-white border-slate-200 text-slate-700",
                    )}
                  >
                    {question.visuals.data.p2}
                  </div>
                </div>
              </div>
            )}

            {/* Default Calculation View if no visuals */}
            {!question.visuals && category === "calculation" && (
              <div className="text-6xl md:text-7xl md:py-8 font-black mb-12 tracking-wider text-slate-800">
                {question.text}
              </div>
            )}

            {/* Answer Options */}
            <div className="grid grid-cols-2 gap-4 md:gap-6 mt-4">
              {question.options.map((opt, i) => {
                const isSelected = selectedAnswer === opt;
                let btnStateClass =
                  "bg-white border-slate-200 hover:border-indigo-400 hover:bg-slate-50 hover:shadow-md text-slate-700";

                if (isSelected) {
                  btnStateClass = isCorrect
                    ? "bg-emerald-50 border-emerald-500 text-emerald-700 shadow-sm"
                    : "bg-rose-50 border-rose-500 text-rose-700 shadow-sm";
                } else if (
                  selectedAnswer !== null &&
                  opt === question.correctAnswer
                ) {
                  // highlight correct answer if wrong
                  btnStateClass =
                    "bg-emerald-50 border-emerald-500 text-emerald-700 shadow-sm shadow-emerald-100";
                }

                return (
                  <motion.button
                    key={i}
                    whileHover={selectedAnswer === null ? { scale: 1.02 } : {}}
                    whileTap={selectedAnswer === null ? { scale: 0.98 } : {}}
                    onClick={() => handleAnswer(opt)}
                    disabled={selectedAnswer !== null}
                    className={cn(
                      "py-6 font-bold border-2 transition-all rounded-[1.5rem] shadow-sm px-2",
                      typeof opt === "string" && opt.length > 5
                        ? "text-xl md:text-2xl"
                        : "text-3xl",
                      btnStateClass,
                    )}
                  >
                    {opt}
                  </motion.button>
                );
              })}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
