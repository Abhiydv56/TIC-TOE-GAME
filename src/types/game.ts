export type Player = 'X' | 'O';
export type CellValue = Player | null;

export type BoardSize = 3 | 4 | 5;

export type GameMode = 'pve' | 'pvp' | 'disappearing';

export type AIDifficulty = 'easy' | 'medium' | 'hard' | 'unbeatable';

export type GameStatus = 'idle' | 'playing' | 'won' | 'draw';

export interface Move {
  index: number;
  row: number;
  col: number;
  player: Player;
  timestamp: number;
  boardState: CellValue[];
  evaluation?: number;
}

export interface WinningLine {
  indices: number[];
  direction: 'horizontal' | 'vertical' | 'diagonal-main' | 'diagonal-anti';
  lineIndex: number;
}

export interface GameStats {
  xWins: number;
  oWins: number;
  draws: number;
  totalGames: number;
  currentStreak: {
    player: Player | null;
    count: number;
  };
}

export interface DisappearingPiece {
  index: number;
  player: Player;
  moveNumber: number;
}
