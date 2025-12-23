"use client";

import { emojiQuiz } from "@/data/emojis";
import Link from "next/link";

export default function EmojiSolutionsPage() {
    return (
        <div className="max-w-4xl mx-auto p-8">
            <div className="mb-12 text-center">
                <h1 className="text-5xl font-black mb-4 bg-gradient-to-r from-accent to-secondary bg-clip-text text-transparent">
                    📜 Värdvy: Facit Julquiz
                </h1>
                <p className="text-xl text-gray-500">
                    Här är alla svar för emoji-quizet.
                </p>
            </div>

            <div className="flex flex-col gap-4 mb-16">
                {emojiQuiz.map((q) => (
                    <div key={q.id} className="glass-card p-6 flex items-center justify-between gap-6">
                        <div className="flex items-center gap-6">
                            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center text-lg font-bold text-accent">
                                {q.id}
                            </div>
                            <div className="text-4xl">{q.emojis}</div>
                        </div>
                        <div className="text-right">
                            <p className="text-2xl font-bold text-gray-800 dark:text-white">{q.answer}</p>
                            {q.description && (
                                <p className="text-sm text-gray-500 italic mt-1">{q.description}</p>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            <div className="text-center pb-20">
                <Link href="/" className="text-gray-400 hover:text-primary transition-colors">
                    ← Tillbaka till start
                </Link>
            </div>
        </div>
    );
}
