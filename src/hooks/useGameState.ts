"use client";

import { useState, useEffect } from "react";

export function useGameState(type: "puzzles" | "emojis") {
    const [solvedLevels, setSolvedLevels] = useState<number[]>([]);
    const [isLoaded, setIsLoaded] = useState(false);

    const storageKey = `christmas_games_${type}`;

    useEffect(() => {
        const stored = localStorage.getItem(storageKey);
        if (stored) {
            try {
                setSolvedLevels(JSON.parse(stored));
            } catch (e) {
                console.error("Failed to parse game state", e);
            }
        }
        setIsLoaded(true);
    }, [storageKey]);

    const markSolved = (levelId: number) => {
        const updated = [...new Set([...solvedLevels, levelId])];
        setSolvedLevels(updated);
        localStorage.setItem(storageKey, JSON.stringify(updated));
    };

    const isUnlocked = (levelId: number) => {
        if (levelId === 1) return true;
        return solvedLevels.includes(levelId - 1);
    };

    const getNextLevel = () => {
        if (solvedLevels.length === 0) return 1;
        return Math.max(...solvedLevels) + 1;
    };

    return { solvedLevels, markSolved, isUnlocked, getNextLevel, isLoaded };
}
