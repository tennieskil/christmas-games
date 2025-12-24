import Link from "next/link";

export default function Home() {
  return (
    <main className="flex flex-col items-center justify-center px-4 py-20 text-center">
      <div className="max-w-3xl">
        <h1 className="text-7xl font-black tracking-tight mb-6 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
          Julens Spelkväll
        </h1>
        <p className="text-xl text-gray-600 mb-12 dark:text-gray-300">
          Den ultimata julutmaningen. Lös tändsticksproblem och gissa jullåtarna från emojis. Kan du klara alla?
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Link href="/puzzles/1" className="glass-card p-8 group hover:scale-[1.02] transition-transform flex flex-col items-center">
            <div className="text-6xl mb-4 group-hover:rotate-12 transition-transform">🔥</div>
            <h2 className="text-2xl font-bold mb-2">Tändsticksproblem</h2>
            <p className="text-gray-500 mb-6">Logiska utmaningar som testar din hjärna under julhelgen.</p>
            <span className="btn-primary">Starta Pussel</span>
          </Link>

          <Link href="/emojis" className="glass-card p-8 group hover:scale-[1.02] transition-transform flex flex-col items-center">
            <div className="text-6xl mb-4 group-hover:-rotate-12 transition-transform">🎶</div>
            <h2 className="text-2xl font-bold mb-2">Gissa Låten</h2>
            <p className="text-gray-500 mb-6">Kan du namnge julklassikerna med hjälp av bara några emojis?</p>
            <span className="btn-secondary">Starta Emojis</span>
          </Link>

          <Link href="/forehead" className="glass-card p-8 group hover:scale-[1.02] transition-transform flex flex-col items-center md:col-span-2">
            <div className="text-6xl mb-4 group-hover:scale-110 transition-transform">📱</div>
            <h2 className="text-2xl font-bold mb-2">Pannband</h2>
            <p className="text-gray-500 mb-6">Håll mobilen mot pannan och låt laget gissa ordet!</p>
            <span className="btn-primary bg-gradient-to-r from-green-500 to-emerald-600 border-none">Starta Pannband</span>
          </Link>
        </div>

        <div className="mt-20 border-t border-primary/10 pt-8">
          <Link href="/leaderboard" className="text-gray-400 hover:text-primary transition-colors text-sm uppercase tracking-widest font-bold">
            Värdvy (Live Leaderboard)
          </Link>
        </div>
      </div>
    </main>
  );
}
