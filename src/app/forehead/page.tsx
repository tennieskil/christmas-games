"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { foreheadWords } from "@/data/forehead-words";

type Word = {
    id?: string;
    word: string;
};

export default function ForeheadGame() {
    const [gameState, setGameState] = useState<"lobby" | "loading" | "playing" | "finished">("lobby");
    const [timeLeft, setTimeLeft] = useState(45);
    const [currentWordIndex, setCurrentWordIndex] = useState(0);
    const [words, setWords] = useState<Word[]>([]);
    const [bgColor, setBgColor] = useState("bg-background");

    // Fisher-Yates shuffle
    const shuffleArray = (array: Word[]) => {
        const newArray = [...array];
        for (let i = newArray.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
        }
        return newArray;
    };

    const fetchWords = async () => {
        try {
            const { data, error } = await supabase
                .from('forehead_words')
                .select('id, word')
                .order('last_seen_at', { ascending: true, nullsFirst: true })
                .limit(50);

            if (data && data.length > 0) {
                return shuffleArray(data);
            }
            if (error) {
                console.error("Supabase fetch error:", error);
            }
        } catch (e) {
            console.error("Failed to fetch words from DB, using fallback:", e);
        }

        // Fallback if DB is empty or fails
        return shuffleArray(foreheadWords.map(w => ({ word: w })));
    };

    const startGame = async () => {
        setGameState("loading");
        const fetchedWords = await fetchWords();
        setWords(fetchedWords);
        setCurrentWordIndex(0);
        setTimeLeft(45);
        setGameState("playing");
        setBgColor("bg-background");
    };

    const updateLastSeen = async (id?: string) => {
        if (!id) return;
        try {
            await supabase
                .from('forehead_words')
                .update({ last_seen_at: new Date().toISOString() })
                .eq('id', id);
        } catch (e) {
            console.error("Failed to update last seen timestamp:", e);
        }
    };

    const nextWord = useCallback(() => {
        if (gameState !== "playing") return;

        // Update last seen for the current word - fire and forget
        const currentWord = words[currentWordIndex];
        if (currentWord && currentWord.id) {
            updateLastSeen(currentWord.id);
        }

        // Visual feedback
        setBgColor("bg-primary/20");
        setTimeout(() => setBgColor("bg-background"), 200);

        if (currentWordIndex < words.length - 1) {
            setCurrentWordIndex((prev) => prev + 1);
        } else {
            // If we run out of words in the batch, loop back to start
            setCurrentWordIndex(0);
        }
    }, [gameState, currentWordIndex, words]);

    useEffect(() => {
        let timer: NodeJS.Timeout;
        if (gameState === "playing" && timeLeft > 0) {
            timer = setInterval(() => {
                setTimeLeft((prev) => prev - 1);
            }, 1000);
        } else if (timeLeft === 0) {
            setGameState("finished");
        }
        return () => clearInterval(timer);
    }, [gameState, timeLeft]);

    return (
        <div
            className={`min-h-screen flex flex-col items-center justify-center p-4 transition-colors duration-200 ${bgColor}`}
            onClick={gameState === "playing" ? nextWord : undefined}
        >
            {gameState === "loading" && (
                <div className="animate-pulse flex flex-col items-center gap-4">
                    <div className="text-4xl animate-spin">🔄</div>
                    <p className="text-xl font-bold">Laddar ord...</p>
                </div>
            )}

            {gameState === "lobby" && (
                <div className="text-center max-w-md space-y-8 animate-in fade-in zoom-in duration-500">
                    <div className="space-y-4">
                        <h1 className="text-6xl font-black text-primary mb-2">Pannband</h1>
                        <p className="text-xl text-muted-foreground">
                            Håll mobilen mot pannan. Dina lagkamrater förklarar ordet som visas!
                        </p>
                    </div>

                    <div className="p-6 glass-card rounded-2xl space-y-4">
                        <div className="flex items-center gap-4 text-left">
                            <span className="text-4xl">⏱️</span>
                            <div>
                                <p className="font-bold">45 sekunder</p>
                                <p className="text-sm text-muted-foreground">Försök klara så många som möjligt</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4 text-left">
                            <span className="text-4xl">👆</span>
                            <div>
                                <p className="font-bold">Tryck för nästa</p>
                                <p className="text-sm text-muted-foreground">Tryck var som helst på skärmen för nytt ord</p>
                            </div>
                        </div>
                    </div>

                    <button
                        onClick={(e) => { e.stopPropagation(); startGame(); }}
                        className="w-full py-6 text-2xl font-bold btn-primary rounded-full shadow-xl hover:scale-105 transition-transform"
                    >
                        Starta Rundan
                    </button>

                    <div className="pt-8">
                        <Link href="/" className="text-muted-foreground hover:text-primary transition-colors">
                            ← Tillbaka till menyn
                        </Link>
                    </div>
                </div>
            )}

            {gameState === "playing" && words.length > 0 && (
                <div className="w-full h-screen flex flex-col items-center justify-center relative select-none">
                    <div className="absolute top-10 right-10 flex flex-col items-center">
                        <div className="text-6xl font-black font-mono text-primary/50">
                            {timeLeft}
                        </div>
                        <div className="text-sm font-bold uppercase tracking-widest text-primary/30">Sekunder</div>
                    </div>

                    <div className="transform rotate-90 md:rotate-0 transition-all duration-300">
                        <h1 className="text-[15vw] md:text-9xl font-black text-center leading-none tracking-tighter break-words max-w-[90vw]">
                            {words[currentWordIndex].word}
                        </h1>
                    </div>

                    <div className="absolute bottom-10 animate-pulse text-muted-foreground">
                        Tryck för nästa
                    </div>
                </div>
            )}

            {gameState === "finished" && (
                <div className="text-center space-y-8 animate-in zoom-in duration-300">
                    <div className="text-8xl mb-4">⏰</div>
                    <h1 className="text-6xl font-black text-primary">Tiden är ute!</h1>
                    <p className="text-2xl text-muted-foreground">Bra jobbat!</p>

                    <div className="flex flex-col gap-4 mt-8">
                        <button
                            onClick={(e) => { e.stopPropagation(); startGame(); }}
                            className="px-12 py-6 text-2xl font-bold btn-primary rounded-full shadow-lg"
                        >
                            Spela Igen
                        </button>
                        <Link
                            href="/"
                            className="px-12 py-4 text-xl font-bold text-muted-foreground hover:text-primary transition-colors"
                        >
                            Avsluta
                        </Link>
                    </div>
                </div>
            )}
        </div>
    );
}
