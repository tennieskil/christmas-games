"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";

export default function LayoutWrapper({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const isPuzzlePage = pathname.startsWith("/puzzles/");
    const isEmojiPage = pathname.startsWith("/emojis");
    const isHideHeader = isPuzzlePage || isEmojiPage;

    return (
        <>
            {!isHideHeader && (
                <nav className="fixed top-0 w-full z-50 p-6 flex justify-between items-center bg-white/10 backdrop-blur-md border-b border-white/20">
                    <Link href="/" className="text-2xl font-bold tracking-tighter text-secondary">
                        🎄 Julspel
                    </Link>
                    <div className="flex gap-8 font-medium">
                        <Link href="/puzzles/1" className="hover:text-primary transition-colors">Pussel</Link>
                        <Link href="/emojis" className="hover:text-primary transition-colors">Emojis</Link>
                    </div>
                </nav>
            )}
            <main className={`${isHideHeader ? 'pt-4 md:pt-8' : 'pt-24'} min-h-screen`}>
                {children}
            </main>
        </>
    );
}
