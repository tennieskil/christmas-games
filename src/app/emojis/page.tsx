"use client";

import { emojiQuiz } from "@/data/emojis";
import { useState, useEffect } from "react";
import Link from "next/link";
import confetti from "canvas-confetti";
import { supabase } from "@/lib/supabase";

type QuizState = 'START' | 'QUIZ' | 'FINISH';

export default function EmojiQuizPage() {
    const [view, setView] = useState<QuizState>('START');
    const [currentIndex, setCurrentIndex] = useState(0);
    const [startTime, setStartTime] = useState<number | null>(null);
    const [endTime, setEndTime] = useState<number | null>(null);
    const [elapsed, setElapsed] = useState(0);
    const [teamName, setTeamName] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (view === 'QUIZ' && startTime) {
            interval = setInterval(() => {
                setElapsed(Math.floor((Date.now() - startTime) / 1000));
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [view, startTime]);

    const handleStart = () => {
        if (!teamName.trim()) return;
        setStartTime(Date.now());
        setView('QUIZ');
        setCurrentIndex(0);
        setElapsed(0);
    };

    const handleNext = () => {
        if (currentIndex < emojiQuiz.length - 1) {
            setCurrentIndex(prev => prev + 1);
        }
    };

    const handlePrev = () => {
        if (currentIndex > 0) {
            setCurrentIndex(prev => prev - 1);
        }
    };

    const handleFinish = async () => {
        const finalEndTime = Date.now();
        const duration = Math.floor((finalEndTime - (startTime || 0)) / 1000);

        setEndTime(finalEndTime);
        setView('FINISH');
        setIsSubmitting(true);

        try {
            const { error } = await supabase
                .from('emoji_completions')
                .insert({
                    team_name: teamName,
                    duration_seconds: duration,
                });

            if (error) throw error;
        } catch (err) {
            console.error("Failed to save emoji completion", err);
        } finally {
            setIsSubmitting(false);
        }

        confetti({
            particleCount: 150,
            spread: 70,
            origin: { y: 0.6 },
            colors: ["#c41e3a", "#2d5a27", "#d4af37"]
        });
    };

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    if (view === 'START') {
        return (
            <div className="max-w-4xl mx-auto p-8 text-center min-h-[70vh] flex flex-col items-center justify-center">
                <h1 className="text-6xl font-black mb-6 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                    🎅 Julquiz: Emoji-utmaningen
                </h1>
                <p className="text-2xl text-gray-600 dark:text-gray-300 mb-12 max-w-2xl">
                    Gissa titlarna. 10 frågor. Timer startar när du klickar på knappen!
                </p>

                <div className="w-full max-w-md space-y-4 mb-12">
                    <input
                        type="text"
                        placeholder="Skriv in lagnamn..."
                        className="w-full p-4 rounded-xl border-2 border-primary/20 bg-white/50 focus:border-primary outline-none text-center text-xl"
                        value={teamName}
                        onChange={(e) => setTeamName(e.target.value)}
                    />
                    <button
                        onClick={handleStart}
                        disabled={!teamName.trim()}
                        className={`w-full btn-primary text-2xl px-16 py-6 shadow-xl shadow-primary/20 transform hover:scale-105 transition-all ${!teamName.trim() ? 'opacity-50 cursor-not-allowed grayscale' : ''}`}
                    >
                        Starta Quiz 🔥
                    </button>
                </div>
            </div>
        );
    }

    if (view === 'FINISH') {
        const totalTime = endTime && startTime ? Math.floor((endTime - startTime) / 1000) : 0;
        return (
            <div className="max-w-4xl mx-auto p-8 text-center min-h-[70vh] flex flex-col items-center justify-center">
                <div className="text-8xl mb-8 animate-bounce">🏆</div>
                <h1 className="text-5xl font-black mb-4">Bra jobbat, {teamName}!</h1>
                <p className="text-2xl text-gray-500 mb-8">
                    {isSubmitting ? "Sparar ditt resultat..." : "Ditt resultat har sparats i leaderboarden."}
                </p>

                <div className="glass-card p-12 mb-12">
                    <p className="text-sm uppercase tracking-widest text-gray-400 font-bold mb-2">Din Tid</p>
                    <p className="text-7xl font-mono font-black text-primary">{formatTime(totalTime)}</p>
                </div>

                <Link href="/" className="btn-secondary text-xl px-12 py-4">
                    Tillbaka till start
                </Link>
            </div>
        );
    }

    const currentQuestion = emojiQuiz[currentIndex];

    return (
        <div className="max-w-4xl mx-auto p-8 min-h-[80vh] flex flex-col">
            <div className="flex justify-between items-center mb-12">
                <div className="flex flex-col">
                    <div className="text-gray-400 font-bold tracking-widest uppercase text-xs">
                        Fråga {currentIndex + 1} av {emojiQuiz.length}
                    </div>
                    <div className="text-primary font-bold">{teamName}</div>
                </div>
                <div className="text-2xl font-mono font-bold text-primary flex items-center gap-2">
                    ⏱️ {formatTime(elapsed)}
                </div>
            </div>

            <div className="flex-grow flex flex-col items-center justify-center">
                <div className="glass-card p-16 w-full flex flex-col items-center justify-center min-h-[300px] transform transition-all duration-500">
                    <div className="text-9xl mb-4 animate-in zoom-in duration-300">
                        {currentQuestion.emojis}
                    </div>
                </div>
            </div>

            <div className="flex justify-between items-center mt-12 gap-6">
                <button
                    onClick={handlePrev}
                    disabled={currentIndex === 0}
                    className={`btn-secondary flex-1 py-4 text-xl ${currentIndex === 0 ? 'opacity-20 cursor-not-allowed' : ''}`}
                >
                    ← Föregående
                </button>

                {currentIndex === emojiQuiz.length - 1 ? (
                    <button
                        onClick={handleFinish}
                        className="btn-primary flex-1 py-4 text-xl shadow-lg shadow-primary/20"
                    >
                        Avsluta & Stoppa Tid 🏁
                    </button>
                ) : (
                    <button
                        onClick={handleNext}
                        className="btn-primary flex-1 py-4 text-xl shadow-lg shadow-primary/20"
                    >
                        Nästa →
                    </button>
                )}
            </div>
        </div>
    );
}
