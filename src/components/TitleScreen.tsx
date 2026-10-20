import React from 'react';
import { GameMode, AIDifficulty, BoardSize } from '../types/game';
import { Bot, Users, Sparkles, Play, Code2, ShieldAlert } from 'lucide-react';

interface TitleScreenProps {
  mode: GameMode;
  difficulty: AIDifficulty;
  boardSize: BoardSize;
  onSetMode: (mode: GameMode) => void;
  onSetDifficulty: (diff: AIDifficulty) => void;
  onSetBoardSize: (size: BoardSize) => void;
  onStartGame: () => void;
  onOpenJavaStudio: () => void;
}

export const TitleScreen: React.FC<TitleScreenProps> = ({
  mode,
  difficulty,
  boardSize,
  onSetMode,
  onSetDifficulty,
  onSetBoardSize,
  onStartGame,
  onOpenJavaStudio,
}) => {
  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-between p-6 sm:p-10 bg-slate-950 text-slate-100 select-none relative overflow-hidden">
      {/* Subtle geometric ambient background lines */}
      <div className="absolute inset-0 pointer-events-none opacity-20">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-gradient-to-tr from-amber-500/10 via-cyan-500/5 to-transparent rounded-full blur-3xl" />
        <div className="w-full h-full [background:radial-gradient(#334155_1px,transparent_1px)] [background-size:32px_32px] opacity-40" />
      </div>

      {/* Top quiet info bar */}
      <div className="w-full max-w-4xl flex items-center justify-between text-xs text-slate-500 font-mono z-10">
        <span>JDK 21 ARCHITECTURE</span>
        <span aria-hidden="true">·</span>
        <span>MINIMAX ALPHA-BETA</span>
        <span aria-hidden="true">·</span>
        <span>REACT 19 + TAILWIND</span>
      </div>

      {/* Centerpiece Hero */}
      <div className="w-full max-w-3xl flex flex-col items-center text-center my-auto py-8 z-10">
        {/* Bespoke inline SVG Title Lockup */}
        <div className="relative mb-6">
          <div className="w-20 h-20 sm:w-24 sm:h-24 mx-auto rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl flex items-center justify-center p-3 relative group">
            <svg
              className="w-full h-full text-amber-400 drop-shadow-[0_0_20px_rgba(251,191,36,0.35)]"
              viewBox="0 0 48 48"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              {/* Stylized Java Coffee Cup & Tic-Tac-Toe cross */}
              <path d="M8 18h26v14a8 8 0 0 1-8 8H16a8 8 0 0 1-8-8V18z" />
              <path d="M34 22h3a4 4 0 0 1 0 8h-3" />
              <path d="M14 10c0-2 2-3 2-5" />
              <path d="M21 10c0-2 2-3 2-5" />
              <path d="M28 10c0-2 2-3 2-5" />
            </svg>
            <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-cyan-400 border-2 border-slate-950" />
          </div>
        </div>

        <h1 className="font-display font-extrabold text-4xl sm:text-6xl text-white tracking-tight mb-3">
          Java Tic-Tac-Toe
        </h1>
        <p className="text-sm sm:text-base text-slate-400 max-w-lg mb-8 leading-relaxed">
          Tactile web board powered by pure Java algorithmic Minimax Alpha-Beta logic, live JVM stdout telemetry, and tactical grid variations.
        </p>

        {/* Configuration Setup */}
        <div className="w-full max-w-xl bg-slate-900/80 border border-slate-800/90 rounded-2xl p-4 sm:p-6 mb-8 text-left space-y-5 backdrop-blur-sm shadow-xl">
          {/* Game Mode */}
          <div>
            <label className="text-xs font-mono font-medium text-slate-400 block mb-2">
              GAME MODE
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => onSetMode('pve')}
                className={`p-3 rounded-xl border text-left transition-all ${
                  mode === 'pve'
                    ? 'bg-amber-500/15 border-amber-500/50 text-white shadow-sm'
                    : 'bg-slate-850/60 border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                }`}
              >
                <Bot className="w-4 h-4 text-amber-400 mb-1.5" />
                <div className="text-xs font-semibold">vs Java AI</div>
                <div className="text-[10px] text-slate-500 truncate">Minimax bot</div>
              </button>

              <button
                onClick={() => onSetMode('pvp')}
                className={`p-3 rounded-xl border text-left transition-all ${
                  mode === 'pvp'
                    ? 'bg-amber-500/15 border-amber-500/50 text-white shadow-sm'
                    : 'bg-slate-850/60 border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                }`}
              >
                <Users className="w-4 h-4 text-cyan-400 mb-1.5" />
                <div className="text-xs font-semibold">Pass &amp; Play</div>
                <div className="text-[10px] text-slate-500 truncate">2 Players local</div>
              </button>

              <button
                onClick={() => onSetMode('disappearing')}
                className={`p-3 rounded-xl border text-left transition-all ${
                  mode === 'disappearing'
                    ? 'bg-amber-500/15 border-amber-500/50 text-white shadow-sm'
                    : 'bg-slate-850/60 border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                }`}
              >
                <Sparkles className="w-4 h-4 text-rose-400 mb-1.5" />
                <div className="text-xs font-semibold">Disappearing</div>
                <div className="text-[10px] text-slate-500 truncate">3-piece limit</div>
              </button>
            </div>
          </div>

          {/* AI Difficulty (when PvE) */}
          {mode === 'pve' && (
            <div>
              <label className="text-xs font-mono font-medium text-slate-400 block mb-2">
                AI DIFFICULTY (JAVA HEURISTIC ENGINE)
              </label>
              <div className="grid grid-cols-3 gap-2">
                {(['easy', 'medium', 'unbeatable'] as AIDifficulty[]).map((d) => (
                  <button
                    key={d}
                    onClick={() => onSetDifficulty(d)}
                    className={`py-2 px-3 rounded-lg text-xs font-medium capitalize border transition-all text-center ${
                      difficulty === d
                        ? 'bg-slate-800 border-amber-500/60 text-amber-300 font-semibold'
                        : 'bg-slate-850/60 border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                    }`}
                  >
                    {d === 'unbeatable' ? 'Unbeatable' : d}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Grid Size */}
          <div>
            <label className="text-xs font-mono font-medium text-slate-400 block mb-2">
              GRID SCALE
            </label>
            <div className="grid grid-cols-3 gap-2">
              {([3, 4, 5] as BoardSize[]).map((sz) => (
                <button
                  key={sz}
                  onClick={() => onSetBoardSize(sz)}
                  className={`py-2 px-3 rounded-lg text-xs font-medium border transition-all text-center ${
                    boardSize === sz
                      ? 'bg-slate-800 border-amber-500/60 text-amber-300 font-semibold'
                      : 'bg-slate-850/60 border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                  }`}
                >
                  {sz}x{sz} {sz === 3 ? '(Classic)' : sz === 4 ? '(4 in Row)' : '(Strategic)'}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Start CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 w-full max-w-md">
          <button
            onClick={onStartGame}
            className="w-full sm:flex-1 py-3.5 px-6 rounded-xl font-display font-semibold text-sm bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-[0_0_20px_rgba(251,191,36,0.3)] transition-all flex items-center justify-center gap-2 group cursor-pointer active:scale-95"
          >
            <Play className="w-4 h-4 fill-current group-hover:scale-110 transition-transform" />
            <span>Start Game</span>
          </button>

          <button
            onClick={onOpenJavaStudio}
            className="w-full sm:w-auto py-3.5 px-5 rounded-xl font-mono text-xs font-medium bg-slate-900 hover:bg-slate-850 text-slate-300 hover:text-white border border-slate-800 transition-colors flex items-center justify-center gap-2 cursor-pointer"
          >
            <Code2 className="w-4 h-4 text-amber-400" />
            <span>Java Code Studio</span>
          </button>
        </div>
      </div>

      {/* Control Hint Line (Single Flat Line per Game Craft Guidelines) */}
      <div className="text-xs text-slate-500 font-mono tracking-wide z-10">
        Enter / Space Start · 1-9 Cell · U Undo · R Reset · M Mute · Esc Menu
      </div>
    </div>
  );
};
