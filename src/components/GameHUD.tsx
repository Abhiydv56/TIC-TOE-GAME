import React from 'react';
import { Player, GameMode, AIDifficulty, GameStats, BoardSize } from '../types/game';
import { Volume2, VolumeX, RotateCcw, Undo2, Code2, Terminal, Home } from 'lucide-react';

interface GameHUDProps {
  currentPlayer: Player;
  isAiThinking: boolean;
  gameMode: GameMode;
  aiDifficulty: AIDifficulty;
  boardSize: BoardSize;
  stats: GameStats;
  isMuted: boolean;
  isJavaInspectorOpen: boolean;
  isCliMode: boolean;
  canUndo: boolean;
  onToggleMute: () => void;
  onUndo: () => void;
  onReset: () => void;
  onToggleJavaInspector: () => void;
  onToggleCliMode: () => void;
  onReturnToTitle: () => void;
}

export const GameHUD: React.FC<GameHUDProps> = ({
  currentPlayer,
  isAiThinking,
  gameMode,
  aiDifficulty,
  boardSize,
  stats,
  isMuted,
  isJavaInspectorOpen,
  isCliMode,
  canUndo,
  onToggleMute,
  onUndo,
  onReset,
  onToggleJavaInspector,
  onToggleCliMode,
  onReturnToTitle,
}) => {
  return (
    <header className="w-full max-w-5xl mx-auto px-4 py-3 flex flex-col gap-3">
      {/* Top Bar Contract: 3 Zones */}
      <div className="flex items-center justify-between gap-4 border-b border-slate-800 pb-3">
        {/* Zone 1: Brand / Title */}
        <div className="flex items-center gap-3">
          <button
            onClick={onReturnToTitle}
            className="group flex items-center gap-2 text-slate-400 hover:text-slate-100 transition-colors"
            title="Return to Menu"
          >
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 group-hover:scale-105 transition-transform">
              ☕
            </div>
            <span className="font-display font-bold text-lg text-slate-100 tracking-tight whitespace-nowrap">
              Java Tic-Tac-Toe
            </span>
          </button>
        </div>

        {/* Zone 2: Current Status / Mode info */}
        <div className="hidden sm:flex items-center gap-2 text-xs text-slate-400 font-mono">
          <span>
            {gameMode === 'pve'
              ? `AI (${aiDifficulty.toUpperCase()})`
              : gameMode === 'disappearing'
              ? 'DISAPPEARING 3-PIECE'
              : 'PASS & PLAY'}
          </span>
          <span aria-hidden="true">·</span>
          <span>{boardSize}x{boardSize} GRID</span>
          {stats.currentStreak.count > 1 && (
            <>
              <span aria-hidden="true">·</span>
              <span className="text-amber-400 tabular-nums">
                {stats.currentStreak.player} STREAK: {stats.currentStreak.count}W
              </span>
            </>
          )}
        </div>

        {/* Zone 3: Interactive Affordances */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* CLI Terminal Toggle */}
          <button
            onClick={onToggleCliMode}
            className={`px-2.5 py-1.5 rounded-lg text-xs font-mono font-medium flex items-center gap-1.5 transition-colors whitespace-nowrap ${
              isCliMode
                ? 'bg-amber-500 text-slate-950 font-semibold'
                : 'bg-slate-800/80 text-slate-300 hover:bg-slate-800 hover:text-white border border-slate-700/60'
            }`}
            title="Toggle Java Terminal Console Mode"
          >
            <Terminal className="w-3.5 h-3.5" />
            <span className="hidden md:inline">CLI Mode</span>
          </button>

          {/* Java Code & JVM Inspector Toggle */}
          <button
            onClick={onToggleJavaInspector}
            className={`px-2.5 py-1.5 rounded-lg text-xs font-mono font-medium flex items-center gap-1.5 transition-colors whitespace-nowrap ${
              isJavaInspectorOpen
                ? 'bg-amber-500 text-slate-950 font-semibold'
                : 'bg-slate-800/80 text-slate-300 hover:bg-slate-800 hover:text-white border border-slate-700/60'
            }`}
            title="Inspect Java Source Code and Live JVM Trace"
          >
            <Code2 className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Java Code</span>
          </button>

          {/* Undo */}
          <button
            onClick={onUndo}
            disabled={!canUndo || isAiThinking}
            className="p-1.5 sm:px-2.5 sm:py-1.5 rounded-lg text-xs font-medium bg-slate-850 text-slate-300 hover:bg-slate-800 hover:text-white border border-slate-800 disabled:opacity-40 disabled:pointer-events-none transition-colors flex items-center gap-1"
            title="Undo move (Key: U)"
          >
            <Undo2 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Undo</span>
          </button>

          {/* Reset */}
          <button
            onClick={onReset}
            disabled={isAiThinking}
            className="p-1.5 sm:px-2.5 sm:py-1.5 rounded-lg text-xs font-medium bg-slate-850 text-slate-300 hover:bg-slate-800 hover:text-white border border-slate-800 transition-colors flex items-center gap-1"
            title="Reset Match (Key: R)"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Reset</span>
          </button>

          {/* Sound Toggle */}
          <button
            onClick={onToggleMute}
            className="p-1.5 sm:p-2 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-slate-800/60 transition-colors"
            title={isMuted ? 'Unmute (Key: M)' : 'Mute (Key: M)'}
            aria-label={isMuted ? 'Unmute' : 'Mute'}
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4" />}
          </button>

          {/* Return Home */}
          <button
            onClick={onReturnToTitle}
            className="p-1.5 sm:p-2 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-slate-800/60 transition-colors"
            title="Menu (Key: Esc)"
            aria-label="Back to Menu"
          >
            <Home className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Middle Status Row: Turn Status & Scoreboard */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-1">
        {/* Active Turn Indicator */}
        <div className="flex items-center gap-2.5">
          <div
            className={`w-3 h-3 rounded-full ${
              isAiThinking
                ? 'bg-amber-400 animate-ping'
                : currentPlayer === 'X'
                ? 'bg-cyan-400 shadow-[0_0_10px_rgba(34,211,238,0.7)]'
                : 'bg-amber-400 shadow-[0_0_10px_rgba(251,191,36,0.7)]'
            }`}
          />
          <span className="text-sm font-medium tracking-tight text-slate-200">
            {isAiThinking ? (
              <span className="text-amber-300 font-mono">Minimax AI computing move...</span>
            ) : gameMode === 'pve' ? (
              currentPlayer === 'X' ? (
                <span>Your Turn (Player X)</span>
              ) : (
                <span>AI Turn (Player O)</span>
              )
            ) : (
              <span>Player {currentPlayer}&apos;s Turn</span>
            )}
          </span>
        </div>

        {/* Tabular Scoreboard (Zero-Pill: Clean unboxed text with dots) */}
        <div className="flex items-center gap-3 text-xs text-slate-400 tabular-nums font-mono">
          <span className="text-cyan-400">
            X Wins: <strong className="text-white font-semibold">{stats.xWins}</strong>
          </span>
          <span aria-hidden="true" className="text-slate-600">·</span>
          <span className="text-amber-400">
            O Wins: <strong className="text-white font-semibold">{stats.oWins}</strong>
          </span>
          <span aria-hidden="true" className="text-slate-600">·</span>
          <span>
            Draws: <strong className="text-white font-semibold">{stats.draws}</strong>
          </span>
        </div>
      </div>
    </header>
  );
};
