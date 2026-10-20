import React from 'react';
import { CellValue, Player, WinningLine, BoardSize, DisappearingPiece } from '../types/game';
import { motion, AnimatePresence } from 'motion/react';

interface GameBoardProps {
  board: CellValue[];
  size: BoardSize;
  currentPlayer: Player;
  isAiThinking: boolean;
  winningLine: WinningLine | null;
  onCellClick: (index: number) => void;
  disabled: boolean;
  disappearingPieces?: DisappearingPiece[];
  mode: string;
}

export const GameBoard: React.FC<GameBoardProps> = ({
  board,
  size,
  currentPlayer,
  isAiThinking,
  winningLine,
  onCellClick,
  disabled,
  disappearingPieces = [],
  mode,
}) => {
  // Find pieces that will disappear next for each player
  const xPieces = disappearingPieces.filter((p) => p.player === 'X');
  const oPieces = disappearingPieces.filter((p) => p.player === 'O');

  const oldestX = xPieces.length >= 3 ? xPieces[0]?.index : null;
  const oldestO = oPieces.length >= 3 ? oPieces[0]?.index : null;

  // Grid styling based on size
  const gridColsClass =
    size === 3
      ? 'grid-cols-3 w-full max-w-[420px]'
      : size === 4
      ? 'grid-cols-4 w-full max-w-[480px]'
      : 'grid-cols-5 w-full max-w-[540px]';

  const cellAspect = 'aspect-square';

  return (
    <div className="relative flex flex-col items-center justify-center p-2 sm:p-4">
      {/* Board Outer Container */}
      <div
        className={`relative grid ${gridColsClass} gap-2.5 sm:gap-3.5 p-3.5 sm:p-5 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-2xl backdrop-blur-sm select-none transition-all duration-300`}
      >
        {board.map((cell, index) => {
          const isWinningCell = winningLine?.indices.includes(index);
          const isOldestX = mode === 'disappearing' && index === oldestX;
          const isOldestO = mode === 'disappearing' && index === oldestO;
          const isFading = isOldestX || isOldestO;

          return (
            <motion.button
              key={index}
              onClick={() => onCellClick(index)}
              disabled={disabled || cell !== null || isAiThinking}
              whileHover={!cell && !disabled && !isAiThinking ? { scale: 1.02 } : {}}
              whileTap={!cell && !disabled && !isAiThinking ? { scale: 0.96 } : {}}
              aria-label={`Cell ${index + 1}: ${cell || 'Empty'}`}
              className={`
                group relative ${cellAspect} rounded-xl flex items-center justify-center font-display font-bold text-3xl sm:text-5xl md:text-6xl
                transition-all duration-200 outline-none focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950
                ${
                  isWinningCell
                    ? 'bg-amber-500/20 border-2 border-amber-400 text-amber-300 shadow-[0_0_25px_rgba(251,191,36,0.35)] scale-[1.02]'
                    : cell !== null
                    ? 'bg-slate-800/80 border border-slate-700/60 shadow-inner'
                    : 'bg-slate-850/60 border border-slate-800 hover:border-slate-700 hover:bg-slate-800/50 cursor-pointer'
                }
                ${isFading ? 'ring-2 ring-rose-500/80 animate-pulse' : ''}
              `}
            >
              {/* Keyboard indicator subscript (for 3x3 numpad) */}
              {size === 3 && cell === null && !disabled && (
                <span className="absolute top-1.5 left-2 text-[10px] font-mono text-slate-600 opacity-60 group-hover:opacity-100 transition-opacity">
                  {index + 1}
                </span>
              )}

              {/* Fading indicator in Disappearing Mode */}
              {isFading && (
                <span className="absolute bottom-1 px-1.5 py-0.5 rounded text-[9px] font-mono font-medium tracking-tight bg-rose-950/90 text-rose-300 border border-rose-800/80">
                  Fades Next
                </span>
              )}

              {/* Placed Mark */}
              <AnimatePresence mode="wait">
                {cell === 'X' && (
                  <motion.div
                    key="X"
                    initial={{ scale: 0.2, rotate: -25, opacity: 0 }}
                    animate={{ scale: 1, rotate: 0, opacity: 1 }}
                    exit={{ scale: 0.2, opacity: 0 }}
                    transition={{ type: 'spring', stiffness: 450, damping: 25 }}
                    className="text-cyan-400 drop-shadow-[0_2px_12px_rgba(34,211,238,0.35)]"
                  >
                    <svg
                      className="w-10 h-10 sm:w-16 sm:h-16 stroke-current"
                      viewBox="0 0 24 24"
                      fill="none"
                      strokeWidth="2.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <line x1="18" y1="6" x2="6" y2="18" />
                      <line x1="6" y1="6" x2="18" y2="18" />
                    </svg>
                  </motion.div>
                )}

                {cell === 'O' && (
                  <motion.div
                    key="O"
                    initial={{ scale: 0.2, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.2, opacity: 0 }}
                    transition={{ type: 'spring', stiffness: 450, damping: 25 }}
                    className="text-amber-400 drop-shadow-[0_2px_12px_rgba(251,191,36,0.35)]"
                  >
                    <svg
                      className="w-10 h-10 sm:w-16 sm:h-16 stroke-current"
                      viewBox="0 0 24 24"
                      fill="none"
                      strokeWidth="2.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <circle cx="12" cy="12" r="9" />
                    </svg>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Hover Ghost Mark */}
              {cell === null && !disabled && !isAiThinking && (
                <div
                  className={`
                    absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-30 transition-opacity duration-150 pointer-events-none
                    ${currentPlayer === 'X' ? 'text-cyan-400' : 'text-amber-400'}
                  `}
                >
                  {currentPlayer === 'X' ? (
                    <svg
                      className="w-8 h-8 sm:w-12 sm:h-12 stroke-current"
                      viewBox="0 0 24 24"
                      fill="none"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <line x1="18" y1="6" x2="6" y2="18" />
                      <line x1="6" y1="6" x2="18" y2="18" />
                    </svg>
                  ) : (
                    <svg
                      className="w-8 h-8 sm:w-12 sm:h-12 stroke-current"
                      viewBox="0 0 24 24"
                      fill="none"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <circle cx="12" cy="12" r="9" />
                    </svg>
                  )}
                </div>
              )}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
};
