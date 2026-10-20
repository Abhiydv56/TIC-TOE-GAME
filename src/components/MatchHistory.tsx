import React from 'react';
import { Move } from '../types/game';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, X, RotateCcw, Home, Trophy } from 'lucide-react';

interface MatchHistoryProps {
  moves: Move[];
  currentStep: number;
  onSelectStep: (step: number) => void;
  onClose: () => void;
  onReturnToMenu?: () => void;
  onPlayAgain?: () => void;
  onShowResult?: () => void;
}

export const MatchHistory: React.FC<MatchHistoryProps> = ({
  moves,
  currentStep,
  onSelectStep,
  onClose,
  onReturnToMenu,
  onPlayAgain,
  onShowResult,
}) => {
  return (
    <div className="w-full max-w-md mx-auto my-3 p-3 bg-slate-900 border border-slate-800 rounded-xl flex items-center justify-between text-xs font-mono text-slate-300">
      <div className="flex items-center gap-1">
        <button
          onClick={() => onSelectStep(0)}
          disabled={currentStep === 0}
          className="p-1 rounded hover:bg-slate-800 disabled:opacity-30 disabled:pointer-events-none text-slate-400 hover:text-white"
          title="Start of Match"
        >
          <ChevronsLeft className="w-4 h-4" />
        </button>
        <button
          onClick={() => onSelectStep(Math.max(0, currentStep - 1))}
          disabled={currentStep === 0}
          className="p-1 rounded hover:bg-slate-800 disabled:opacity-30 disabled:pointer-events-none text-slate-400 hover:text-white"
          title="Previous Move"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
      </div>

      <div className="flex items-center gap-2">
        <span className="text-amber-400 font-semibold">
          Turn {currentStep} / {moves.length}
        </span>
        {currentStep > 0 && (
          <span className="text-slate-500">
            (P: {moves[currentStep - 1]?.player} at {moves[currentStep - 1]?.row},{moves[currentStep - 1]?.col})
          </span>
        )}
      </div>

      <div className="flex items-center gap-1">
        <button
          onClick={() => onSelectStep(Math.min(moves.length, currentStep + 1))}
          disabled={currentStep === moves.length}
          className="p-1 rounded hover:bg-slate-800 disabled:opacity-30 disabled:pointer-events-none text-slate-400 hover:text-white"
          title="Next Move"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
        <button
          onClick={() => onSelectStep(moves.length)}
          disabled={currentStep === moves.length}
          className="p-1 rounded hover:bg-slate-800 disabled:opacity-30 disabled:pointer-events-none text-slate-400 hover:text-white"
          title="Latest State"
        >
          <ChevronsRight className="w-4 h-4" />
        </button>

        {onShowResult && (
          <button
            onClick={onShowResult}
            className="p-1 ml-1 rounded hover:bg-slate-800 text-amber-400 hover:text-amber-300"
            title="Show Result Modal"
          >
            <Trophy className="w-4 h-4" />
          </button>
        )}

        {onPlayAgain && (
          <button
            onClick={onPlayAgain}
            className="p-1 rounded hover:bg-slate-800 text-emerald-400 hover:text-emerald-300"
            title="Play Again"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        )}

        {onReturnToMenu && (
          <button
            onClick={onReturnToMenu}
            className="p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-white"
            title="Main Menu"
          >
            <Home className="w-4 h-4" />
          </button>
        )}

        <button
          onClick={onClose}
          className="p-1 ml-1 rounded hover:bg-slate-800 text-slate-400 hover:text-white"
          title="Exit Replay Mode"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
