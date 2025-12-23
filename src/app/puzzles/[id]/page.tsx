"use client";

import { use } from "react";
import { useRouter } from "next/navigation";
import { matchstickPuzzles } from "@/data/puzzles";
import { useGameState } from "@/hooks/useGameState";
import { useState, useEffect } from "react";
import Link from "next/link";
import confetti from "canvas-confetti";
import { supabase } from "@/lib/supabase";

export default function PuzzlePage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const router = useRouter();
    const puzzleId = parseInt(id);
    const { isUnlocked, isLoaded, markSolved } = useGameState("puzzles");

    const [teamName, setTeamName] = useState("");
    const [hasStarted, setHasStarted] = useState(false);
    const [isPlaying, setIsPlaying] = useState(false);
    const [startTime, setStartTime] = useState<number | null>(null);
    const [elapsedTime, setElapsedTime] = useState(0);
    const [isDone, setIsDone] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const puzzle = matchstickPuzzles.find((p) => p.id === puzzleId);

    useEffect(() => {
        const storedName = localStorage.getItem("team_name");
        if (storedName) {
            setTeamName(storedName);
            setHasStarted(true);
        }
    }, []);

    useEffect(() => {
        if (isLoaded && !isUnlocked(puzzleId)) {
            router.push(`/puzzles/${Math.max(1, puzzleId - 1)}`);
        }
    }, [isLoaded, isUnlocked, puzzleId, router]);

    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (isPlaying && !isDone) {
            interval = setInterval(() => {
                setElapsedTime((Date.now() - (startTime || Date.now())) / 1000);
            }, 100);
        }
        return () => clearInterval(interval);
    }, [isPlaying, isDone, startTime]);

    const handleStartGame = () => {
        setIsPlaying(true);
        setStartTime(Date.now());
    };

    if (!isLoaded || !puzzle) return <div className="p-20 text-center text-2xl">🎄 Laddar...</div>;

    const handleStart = () => {
        if (teamName.trim()) {
            localStorage.setItem("team_name", teamName);
            setHasStarted(true);
        }
    };

    const handleDone = async () => {
        setIsSubmitting(true);
        try {
            // Record in Supabase
            if (process.env.NEXT_PUBLIC_SUPABASE_URL) {
                await supabase
                    .from("puzzle_completions")
                    .insert([{
                        team_name: teamName,
                        puzzle_id: puzzleId,
                        completed_at: new Date().toISOString(),
                        duration_seconds: Math.round(elapsedTime)
                    }]);
            }

            setIsDone(true);
            markSolved(puzzleId);
            confetti({
                particleCount: 150,
                spread: 100,
                origin: { y: 0.6 },
                colors: ["#c41e3a", "#2d5a27", "#d4af37"]
            });
        } catch (err) {
            console.error("Submission error:", err);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!hasStarted) {
        return (
            <div className="max-w-md mx-auto p-12 glass-card text-center mt-20">
                <h1 className="text-3xl font-bold mb-6">Ange Lagnamn</h1>
                <input
                    type="text"
                    placeholder="Lag Rudolf..."
                    className="w-full p-4 rounded-xl border-2 border-primary/20 bg-white/50 focus:border-primary outline-none text-center text-xl mb-6"
                    value={teamName}
                    onChange={(e) => setTeamName(e.target.value)}
                />
                <button onClick={handleStart} className="btn-primary w-full">Gå med i spelet</button>
            </div>
        );
    }

    return (
        <div className="max-w-5xl mx-auto p-2 md:p-8 flex flex-col min-h-screen">
            <div className="mb-2 md:mb-8 flex justify-between items-end">
                <div>
                    <h1 className="text-2xl md:text-4xl font-bold mb-1">Pussel #{puzzleId}</h1>
                    <p className="text-base md:text-lg text-primary font-medium">{puzzle.title}</p>
                </div>
                <div className="text-right">
                    <p className="text-[10px] md:text-sm uppercase tracking-widest text-gray-400">Lag</p>
                    <p className="text-lg md:text-xl font-bold text-secondary">{teamName}</p>
                    {isPlaying && !isDone && (
                        <p className="text-2xl font-mono text-primary mt-1">
                            {Math.floor(elapsedTime / 60)}:{(Math.floor(elapsedTime) % 60).toString().padStart(2, '0')}
                        </p>
                    )}
                </div>
            </div>

            <div className="flex-1 flex flex-col gap-4 mb-8">
                <div className="glass-card p-2 md:p-6 flex flex-col items-center flex-1 relative">
                    {!isPlaying && !isDone && (
                        <div className="absolute inset-0 z-10 bg-black flex flex-col items-center justify-center rounded-xl border-4 border-white/10">
                            <h2 className="text-6xl md:text-8xl font-black text-white text-center uppercase tracking-tighter">
                                Pussel #{puzzleId}
                            </h2>
                            <p className="text-white mt-8 uppercase tracking-[0.2em] text-xl md:text-3xl font-bold text-center px-4">
                                Tryck på knappen nedan för att starta
                            </p>
                        </div>
                    )}
                    <div className={!isPlaying && !isDone ? "opacity-0 invisible" : ""}>
                        <p className="text-xl md:text-2xl mb-2 md:mb-6 font-semibold text-center leading-tight px-2">{puzzle.problem}</p>
                        <div className="w-full flex-1 min-h-[50vh] md:min-h-[400px] relative rounded-xl overflow-hidden bg-white/30 border border-white/20 shadow-inner flex items-center justify-center">
                            <img
                                src={puzzle.problemImage}
                                alt="Matchstick Problem"
                                className="w-full h-full object-contain absolute inset-0 p-2"
                                onError={(e) => {
                                    // If image fails, show placeholder text
                                    e.currentTarget.style.display = 'none';
                                    (e.currentTarget.parentNode as HTMLElement).innerHTML = `<div class="p-12 text-gray-400 text-center italic">Utmaningsbild: ${puzzle.problemImage}<br/>(Vänligen ersätt med faktiska filen)</div>`;
                                }}
                            />
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex flex-col items-center gap-4 pb-8">
                {!isPlaying && !isDone ? (
                    <button
                        onClick={handleStartGame}
                        className="bg-black hover:bg-gray-800 text-white text-3xl md:text-4xl px-12 md:px-20 py-8 md:py-10 shadow-2xl active:scale-95 w-full max-w-md rounded-2xl font-black transition-all border-4 border-white/20 uppercase tracking-tight"
                    >
                        ⏱️ Starta Tiden
                    </button>
                ) : !isDone ? (
                    <button
                        onClick={handleDone}
                        className="btn-primary text-2xl md:text-3xl px-12 md:px-20 py-6 md:py-8 shadow-primary/30 active:scale-95 w-full max-w-sm"
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? "Skickar..." : "KLART! 🔔"}
                    </button>
                ) : (
                    <div className="flex flex-col items-center gap-4 w-full">
                        <p className="text-xl md:text-2xl font-bold text-secondary text-center">Klarmarkering registrerad!</p>
                        <p className="text-lg font-mono text-primary font-bold">
                            Tid: {Math.floor(elapsedTime / 60)}:{(Math.floor(elapsedTime) % 60).toString().padStart(2, '0')}
                        </p>
                        {puzzleId < matchstickPuzzles.length && (
                            <Link href={`/puzzles/${puzzleId + 1}`} className="btn-secondary w-full max-w-sm text-center py-4">Nästa Utmaning →</Link>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
