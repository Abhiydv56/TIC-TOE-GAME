import React from 'react';
import { Player, GameStatus, WinningLine } from '../types/game';
import { RotateCcw, Home, Sparkles, History } from 'lucide-react';
import { motion } from 'motion/react';

interface GameModalProps {
  isOpen: boolean;
  status: GameStatus;
  winner: Player | null;
  winningLine: WinningLine | null;
  moveCount: number;
  gameMode: string;
  onRestart: () => void;
  onReturnToMenu: () => void;
  onToggleReplay: () => void;
}

export const GameModal: React.FC<GameModalProps> = ({
  isOpen,
  status,
  winner,
  moveCount,
  gameMode,
  onRestart,
  onReturnToMenu,
  onToggleReplay,
}) => {
  if (!isOpen || (status !== 'won' && status !== 'draw')) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.92, y: 12 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="w-full max-w-sm rounded-2xl bg-slate-900 border border-slate-800 p-6 shadow-2xl text-center relative overflow-hidden"
      >
        {/* Glow ambient */}
        <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-48 h-48 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />

        {/* Modal Avatar / Icon */}
        <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-slate-800/80 border border-slate-700/80 flex items-center justify-center relative">
          {status === 'won' ? (
            winner === 'X' ? (
              <span className="text-3xl font-display font-extrabold text-cyan-400">X</span>
            ) : (
              <span className="text-3xl font-display font-extrabold text-amber-400">O</span>
            )
          ) : (
            <span className="text-2xl text-slate-400">🤝</span>
          )}
          {status === 'won' && (
            <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-amber-400 text-slate-950 flex items-center justify-center text-xs">
              <Sparkles className="w-3 h-3 fill-current" />
            </div>
          )}
        </div>

        {/* Title */}
        <h2 className="font-display font-bold text-2xl text-white mb-1">
          {status === 'won'
            ? gameMode === 'pve'
              ? winner === 'X'
                ? 'You Won the Match!'
                : 'Java AI Won the Match!'
              : `Player ${winner} Triumphs!`
            : 'Match Ended in a Draw'}
        </h2>

        {/* Clean unboxed metadata with dot separators */}
        <div className="flex items-center justify-center gap-2 text-xs text-slate-400 font-mono mb-6">
          <span>{moveCount} Total Moves</span>
          <span aria-hidden="true">·</span>
          <span>
            {status === 'won' ? `Decisive Line Formed` : `Board Fully Exhausted`}
          </span>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-2.5">
          <button
            onClick={onRestart}
            className="w-full py-3 px-4 rounded-xl font-display font-semibold text-sm bg-amber-500 hover:bg-amber-400 text-slate-950 transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-amber-500/20"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Play Again</span>
          </button>

          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={onToggleReplay}
              className="py-2.5 px-3 rounded-lg text-xs font-mono font-medium bg-slate-800 hover:bg-slate-750 text-slate-300 hover:text-white border border-slate-700/60 transition-colors flex items-center justify-center gap-1.5"
            >
              <History className="w-3.5 h-3.5" />
              <span>Review Match</span>
            </button>

            <button
              onClick={onReturnToMenu}
              className="py-2.5 px-3 rounded-lg text-xs font-mono font-medium bg-slate-800 hover:bg-slate-750 text-slate-300 hover:text-white border border-slate-700/60 transition-colors flex items-center justify-center gap-1.5"
            >
              <Home className="w-3.5 h-3.5" />
              <span>Main Menu</span>
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
