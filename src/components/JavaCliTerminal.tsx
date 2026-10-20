import React, { useState, useRef, useEffect } from 'react';
import { CellValue, Player, BoardSize } from '../types/game';
import { Terminal as TerminalIcon, Send, X, RotateCcw } from 'lucide-react';

interface JavaCliTerminalProps {
  board: CellValue[];
  size: BoardSize;
  currentPlayer: Player;
  onMakeMove: (row: number, col: number) => boolean;
  onReset: () => void;
  onClose: () => void;
  isAiThinking: boolean;
}

export const JavaCliTerminal: React.FC<JavaCliTerminalProps> = ({
  board,
  size,
  currentPlayer,
  onMakeMove,
  onReset,
  onClose,
  isAiThinking,
}) => {
  const [inputVal, setInputVal] = useState('');
  const [terminalHistory, setTerminalHistory] = useState<string[]>([
    '========================================',
    '  JAVA TIC-TAC-TOE CONSOLE (JDK 21)     ',
    '========================================',
    'System.out.println("Welcome to Java Tic-Tac-Toe CLI.");',
    'Type row and col coordinates (e.g., "1 2" or "0 0")',
    'Commands: "help", "restart", "board", "status"',
    '----------------------------------------',
  ]);

  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll to bottom of terminal
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [terminalHistory]);

  // Focus input on mount
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const renderAsciiBoard = (): string[] => {
    const lines: string[] = [''];
    // Col header
    let header = '    ';
    for (let c = 0; c < size; c++) header += ` ${c}  `;
    lines.push(header);

    for (let r = 0; r < size; r++) {
      let rowStr = `  ${r} `;
      for (let c = 0; c < size; c++) {
        const cell = board[r * size + c];
        const char = cell === null ? '·' : cell;
        rowStr += ` ${char} `;
        if (c < size - 1) rowStr += '|';
      }
      lines.push(rowStr);
      if (r < size - 1) {
        let divider = '    ';
        for (let c = 0; c < size; c++) {
          divider += '---';
          if (c < size - 1) divider += '+';
        }
        lines.push(divider);
      }
    }
    lines.push('');
    return lines;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cmd = inputVal.trim();
    if (!cmd) return;

    setInputVal('');
    const newLogs = [...terminalHistory, `> ${cmd}`];

    if (cmd.toLowerCase() === 'help') {
      newLogs.push(
        'Available CLI inputs:',
        '  <row> <col>    - Place mark at row and col (0-indexed, e.g. "0 1")',
        '  board          - Print the current ASCII board state',
        '  restart        - Reset match and clear board',
        '  status         - View current player and turn details',
        '  cls / clear    - Clear terminal buffer'
      );
      setTerminalHistory(newLogs);
      return;
    }

    if (cmd.toLowerCase() === 'cls' || cmd.toLowerCase() === 'clear') {
      setTerminalHistory(['[Terminal Cleared]']);
      return;
    }

    if (cmd.toLowerCase() === 'restart') {
      onReset();
      newLogs.push('[JVM] Board reset triggered.', ...renderAsciiBoard());
      setTerminalHistory(newLogs);
      return;
    }

    if (cmd.toLowerCase() === 'board') {
      newLogs.push(...renderAsciiBoard());
      setTerminalHistory(newLogs);
      return;
    }

    if (cmd.toLowerCase() === 'status') {
      newLogs.push(
        `[Status] Current Turn: Player ${currentPlayer}`,
        `[Status] Grid Dimension: ${size}x${size}`,
        `[Status] AI Status: ${isAiThinking ? 'Computing...' : 'Idle'}`
      );
      setTerminalHistory(newLogs);
      return;
    }

    // Try parsing as "row col" or "row,col"
    const parts = cmd.split(/[\s,]+/).map((s) => parseInt(s, 10));
    if (parts.length >= 2 && !isNaN(parts[0]) && !isNaN(parts[1])) {
      const [r, c] = parts;
      if (r < 0 || r >= size || c < 0 || c >= size) {
        newLogs.push(`[Error] Coordinate out of bounds (valid range: 0 to ${size - 1}).`);
      } else {
        const success = onMakeMove(r, c);
        if (success) {
          newLogs.push(`[JVM] Player ${currentPlayer} placed at (${r}, ${c}).`);
        } else {
          newLogs.push(`[Error] Cell (${r}, ${c}) is already occupied!`);
        }
      }
    } else {
      newLogs.push(`[Error] Unrecognized command "${cmd}". Type "help" or enter "row col" (e.g. 1 1).`);
    }

    setTerminalHistory(newLogs);
  };

  return (
    <div className="fixed inset-x-4 bottom-4 md:right-4 md:left-auto md:w-[500px] z-30 bg-slate-950/95 border border-slate-800 rounded-xl shadow-2xl overflow-hidden flex flex-col font-mono text-xs max-h-[460px]">
      {/* Title bar */}
      <div className="px-3.5 py-2.5 bg-slate-900 border-b border-slate-800 flex items-center justify-between text-slate-300">
        <div className="flex items-center gap-2">
          <TerminalIcon className="w-4 h-4 text-amber-400" />
          <span className="font-semibold text-slate-100">Java Scanner Terminal</span>
          <span className="text-[10px] text-slate-500">System.in</span>
        </div>
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setTerminalHistory((prev) => [...prev, ...renderAsciiBoard()])}
            className="p-1 text-slate-400 hover:text-white rounded hover:bg-slate-800"
            title="Print ASCII Board"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-white rounded hover:bg-slate-800"
            title="Close Terminal"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Terminal Output */}
      <div className="flex-1 p-3.5 overflow-y-auto space-y-1 text-slate-300 leading-relaxed max-h-[300px]">
        {terminalHistory.map((line, idx) => (
          <div
            key={idx}
            className={
              line.startsWith('>')
                ? 'text-amber-400 font-semibold'
                : line.startsWith('[Error]')
                ? 'text-rose-400'
                : line.startsWith('[JVM]')
                ? 'text-cyan-400'
                : 'text-slate-300'
            }
          >
            {line}
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      {/* Input row */}
      <form onSubmit={handleSubmit} className="p-2 bg-slate-900/90 border-t border-slate-800 flex items-center gap-2">
        <span className="text-amber-400 font-bold pl-1">&gt;</span>
        <input
          ref={inputRef}
          type="text"
          value={inputVal}
          onChange={(e) => setInputVal(e.target.value)}
          placeholder={`Enter row & col (e.g. 1 1) or 'help'`}
          disabled={isAiThinking}
          className="flex-1 bg-transparent border-none outline-none text-slate-100 placeholder:text-slate-600 font-mono text-xs"
        />
        <button
          type="submit"
          disabled={!inputVal.trim() || isAiThinking}
          className="px-2.5 py-1 rounded bg-amber-500 hover:bg-amber-400 disabled:opacity-40 text-slate-950 font-semibold text-xs transition-colors flex items-center gap-1"
        >
          <Send className="w-3 h-3" />
          <span>Run</span>
        </button>
      </form>
    </div>
  );
};
