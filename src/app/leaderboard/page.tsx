"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { matchstickPuzzles } from "@/data/puzzles";

interface Completion {
    team_name: string;
    puzzle_id?: number;
    completed_at: string;
    duration_seconds?: number;
}

export default function LeaderboardPage() {
    const [completions, setCompletions] = useState<Completion[]>([]);
    const [emojiCompletions, setEmojiCompletions] = useState<Completion[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const fetchData = async () => {
        if (!process.env.NEXT_PUBLIC_SUPABASE_URL) return;

        const [puzzlesRes, emojisRes] = await Promise.all([
            supabase.from("puzzle_completions").select("*").order("completed_at", { ascending: true }),
            supabase.from("emoji_completions").select("*").order("duration_seconds", { ascending: true })
        ]);

        if (puzzlesRes.data) setCompletions(puzzlesRes.data);
        if (emojisRes.data) setEmojiCompletions(emojisRes.data);
        setIsLoading(false);
    };

    useEffect(() => {
        fetchData();

        const puzzlesChannel = supabase
            .channel("puzzle_completions_changes")
            .on("postgres_changes", { event: "INSERT", schema: "public", table: "puzzle_completions" },
                payload => {
                    setCompletions(prev => [...prev, payload.new as Completion].sort((a, b) =>
                        new Date(a.completed_at).getTime() - new Date(b.completed_at).getTime()
                    ));
                }
            )
            .subscribe();

        const emojisChannel = supabase
            .channel("emoji_completions_changes")
            .on("postgres_changes", { event: "INSERT", schema: "public", table: "emoji_completions" },
                payload => {
                    setEmojiCompletions(prev => [...prev, payload.new as Completion].sort((a, b) =>
                        (a.duration_seconds || 0) - (b.duration_seconds || 0)
                    ));
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(puzzlesChannel);
            supabase.removeChannel(emojisChannel);
        };
    }, []);

    const formatDuration = (seconds?: number) => {
        if (!seconds) return "--:--";
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    if (isLoading) return <div className="p-20 text-center">Laddar Leaderboard...</div>;

    return (
        <div className="max-w-6xl mx-auto p-8">
            <h1 className="text-5xl font-black mb-12 text-center bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                Värdpanel: Spelstatus
            </h1>

            <section className="mb-20">
                <h2 className="text-3xl font-black mb-8 flex items-center gap-3">
                    🎶 Emoji-quiz Leaderboard
                </h2>
                <div className="glass-card overflow-hidden">
                    <table className="w-full text-left">
                        <thead className="bg-primary/5 text-primary uppercase text-xs font-bold">
                            <tr>
                                <th className="p-4">Rank</th>
                                <th className="p-4">Lag</th>
                                <th className="p-4">Tid</th>
                                <th className="p-4 text-right">Slutfört</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-primary/10">
                            {emojiCompletions.map((c, idx) => (
                                <tr key={idx} className="hover:bg-primary/5 transition-colors">
                                    <td className="p-4 font-bold">
                                        {idx === 0 ? "🥇" : idx === 1 ? "🥈" : idx === 2 ? "🥉" : `#${idx + 1}`}
                                    </td>
                                    <td className="p-4 font-bold">{c.team_name}</td>
                                    <td className="p-4 font-mono text-primary font-bold">
                                        ⏱️ {formatDuration(c.duration_seconds)}
                                    </td>
                                    <td className="p-4 text-right text-xs text-gray-400">
                                        {new Date(c.completed_at).toLocaleTimeString()}
                                    </td>
                                </tr>
                            ))}
                            {emojiCompletions.length === 0 && (
                                <tr>
                                    <td colSpan={4} className="p-8 text-center text-gray-400 italic">
                                        Väntar på första laget...
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </section>

            <section>
                <h2 className="text-3xl font-black mb-8 flex items-center gap-3">
                    🔥 Tändsticksproblem (Live)
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {matchstickPuzzles.map(puzzle => (
                        <div key={puzzle.id} className="glass-card p-6 border-t-4 border-primary/20">
                            <h3 className="text-xl font-bold mb-4 border-b border-primary/20 pb-2 flex justify-between items-center">
                                <span>Pussel #{puzzle.id}</span>
                            </h3>

                            <div className="space-y-4">
                                {completions
                                    .filter(c => c.puzzle_id === puzzle.id)
                                    .map((c, idx) => (
                                        <div key={idx} className="flex justify-between items-center bg-white/40 p-3 rounded-lg shadow-sm border border-white/50">
                                            <div className="flex items-center gap-3">
                                                <span className={`w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-bold ${idx === 0 ? "bg-accent" : "bg-secondary"}`}>
                                                    {idx + 1}
                                                </span>
                                                <span className="font-bold">{c.team_name}</span>
                                            </div>
                                            <span className="text-xs font-mono font-bold text-primary">
                                                ⏱️ {formatDuration(c.duration_seconds)}
                                            </span>
                                        </div>
                                    ))}

                                {completions.filter(c => c.puzzle_id === puzzle.id).length === 0 && (
                                    <p className="text-center text-gray-400 italic py-4">Väntar på avslut...</p>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            <div className="mt-20 text-center pb-20">
                <button
                    onClick={fetchData}
                    className="btn-secondary px-8 py-3 text-sm"
                >
                    Uppdatera Data Manuellt
                </button>
            </div>
        </div>
    );
}
