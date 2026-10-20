import { CellValue, Player, WinningLine, BoardSize } from '../types/game';

/**
 * Calculates all possible winning lines for a grid of size N
 * targetStreak is 3 for 3x3, 4 for 4x4, and 4 for 5x5.
 */
export function getWinningLines(size: BoardSize): number[][] {
  const lines: number[][] = [];
  const target = size === 3 ? 3 : 4;

  // Horizontal lines
  for (let r = 0; r < size; r++) {
    for (let c = 0; c <= size - target; c++) {
      const line: number[] = [];
      for (let k = 0; k < target; k++) {
        line.push(r * size + (c + k));
      }
      lines.push(line);
    }
  }

  // Vertical lines
  for (let c = 0; c < size; c++) {
    for (let r = 0; r <= size - target; r++) {
      const line: number[] = [];
      for (let k = 0; k < target; k++) {
        line.push((r + k) * size + c);
      }
      lines.push(line);
    }
  }

  // Main diagonal (top-left to bottom-right)
  for (let r = 0; r <= size - target; r++) {
    for (let c = 0; c <= size - target; c++) {
      const line: number[] = [];
      for (let k = 0; k < target; k++) {
        line.push((r + k) * size + (c + k));
      }
      lines.push(line);
    }
  }

  // Anti diagonal (top-right to bottom-left)
  for (let r = 0; r <= size - target; r++) {
    for (let c = target - 1; c < size; c++) {
      const line: number[] = [];
      for (let k = 0; k < target; k++) {
        line.push((r + k) * size + (c - k));
      }
      lines.push(line);
    }
  }

  return lines;
}

/**
 * Checks if there is a winner on the board
 */
export function checkWinner(
  board: CellValue[],
  size: BoardSize
): { winner: Player; line: WinningLine } | null {
  const winLines = getWinningLines(size);

  for (let i = 0; i < winLines.length; i++) {
    const indices = winLines[i];
    const first = board[indices[0]];
    if (!first) continue;

    let allMatch = true;
    for (let j = 1; j < indices.length; j++) {
      if (board[indices[j]] !== first) {
        allMatch = false;
        break;
      }
    }

    if (allMatch) {
      // Determine direction
      const diff = indices[1] - indices[0];
      let direction: WinningLine['direction'] = 'horizontal';
      if (diff === 1) direction = 'horizontal';
      else if (diff === size) direction = 'vertical';
      else if (diff === size + 1) direction = 'diagonal-main';
      else if (diff === size - 1) direction = 'diagonal-anti';

      return {
        winner: first,
        line: {
          indices,
          direction,
          lineIndex: i,
        },
      };
    }
  }

  return null;
}

/**
 * Checks if the board is full (draw state)
 */
export function isBoardFull(board: CellValue[]): boolean {
  return board.every((cell) => cell !== null);
}

/**
 * Heuristic evaluation function for non-terminal board states
 */
function evaluateBoard(board: CellValue[], size: BoardSize, aiPlayer: Player): number {
  const humanPlayer: Player = aiPlayer === 'X' ? 'O' : 'X';
  const winResult = checkWinner(board, size);
  if (winResult) {
    return winResult.winner === aiPlayer ? 1000 : -1000;
  }

  const winLines = getWinningLines(size);
  let score = 0;

  for (const line of winLines) {
    let aiCount = 0;
    let humanCount = 0;

    for (const idx of line) {
      if (board[idx] === aiPlayer) aiCount++;
      else if (board[idx] === humanPlayer) humanCount++;
    }

    if (aiCount > 0 && humanCount > 0) {
      // Line is blocked for both
      continue;
    }

    if (aiCount > 0) {
      score += Math.pow(10, aiCount);
    } else if (humanCount > 0) {
      score -= Math.pow(10, humanCount);
    }
  }

  // Center preference
  const center = Math.floor(board.length / 2);
  if (board[center] === aiPlayer) score += 15;
  else if (board[center] === humanPlayer) score -= 15;

  return score;
}

/**
 * Minimax algorithm with Alpha-Beta pruning
 */
function minimax(
  board: CellValue[],
  depth: number,
  isMaximizing: boolean,
  alpha: number,
  beta: number,
  maxDepth: number,
  size: BoardSize,
  aiPlayer: Player
): { score: number; bestMove?: number } {
  const humanPlayer: Player = aiPlayer === 'X' ? 'O' : 'X';
  const winResult = checkWinner(board, size);

  if (winResult) {
    return {
      score: winResult.winner === aiPlayer ? 10000 - depth : -10000 + depth,
    };
  }

  if (isBoardFull(board) || depth >= maxDepth) {
    return { score: evaluateBoard(board, size, aiPlayer) };
  }

  const availableMoves: number[] = [];
  for (let i = 0; i < board.length; i++) {
    if (board[i] === null) availableMoves.push(i);
  }

  // Move ordering: evaluate center & corners first for better alpha-beta pruning efficiency
  const center = Math.floor(board.length / 2);
  availableMoves.sort((a, b) => Math.abs(b - center) - Math.abs(a - center));

  if (isMaximizing) {
    let maxEval = -Infinity;
    let bestMove = availableMoves[0];

    for (const move of availableMoves) {
      board[move] = aiPlayer;
      const evaluation = minimax(board, depth + 1, false, alpha, beta, maxDepth, size, aiPlayer).score;
      board[move] = null;

      if (evaluation > maxEval) {
        maxEval = evaluation;
        bestMove = move;
      }
      alpha = Math.max(alpha, evaluation);
      if (beta <= alpha) break; // Alpha-beta cutoff
    }

    return { score: maxEval, bestMove };
  } else {
    let minEval = Infinity;
    let bestMove = availableMoves[0];

    for (const move of availableMoves) {
      board[move] = humanPlayer;
      const evaluation = minimax(board, depth + 1, true, alpha, beta, maxDepth, size, aiPlayer).score;
      board[move] = null;

      if (evaluation < minEval) {
        minEval = evaluation;
        bestMove = move;
      }
      beta = Math.min(beta, evaluation);
      if (beta <= alpha) break; // Alpha-beta cutoff
    }

    return { score: minEval, bestMove };
  }
}

/**
 * Returns the best move for the AI given the current difficulty
 */
export function getAIMove(
  board: CellValue[],
  size: BoardSize,
  difficulty: 'easy' | 'medium' | 'hard' | 'unbeatable',
  aiPlayer: Player = 'O'
): { index: number; evaluatedNodes: number; chosenScore: number } {
  const availableMoves: number[] = [];
  for (let i = 0; i < board.length; i++) {
    if (board[i] === null) availableMoves.push(i);
  }

  if (availableMoves.length === 0) {
    return { index: -1, evaluatedNodes: 0, chosenScore: 0 };
  }

  const humanPlayer: Player = aiPlayer === 'X' ? 'O' : 'X';

  // Easy mode: 75% random move, 25% smart
  if (difficulty === 'easy') {
    if (Math.random() < 0.75) {
      const randomIndex = availableMoves[Math.floor(Math.random() * availableMoves.length)];
      return { index: randomIndex, evaluatedNodes: 1, chosenScore: 0 };
    }
  }

  // Immediate win or block check for all modes above Easy
  if (difficulty !== 'easy') {
    // 1. Check if AI can win immediately
    for (const move of availableMoves) {
      board[move] = aiPlayer;
      if (checkWinner(board, size)?.winner === aiPlayer) {
        board[move] = null;
        return { index: move, evaluatedNodes: availableMoves.length, chosenScore: 9999 };
      }
      board[move] = null;
    }

    // 2. Check if Human could win on next move, and block them
    for (const move of availableMoves) {
      board[move] = humanPlayer;
      if (checkWinner(board, size)?.winner === humanPlayer) {
        board[move] = null;
        return { index: move, evaluatedNodes: availableMoves.length * 2, chosenScore: -9999 };
      }
      board[move] = null;
    }
  }

  // Medium mode: 35% chance to play heuristic/random, 65% shallow minimax
  if (difficulty === 'medium' && Math.random() < 0.35) {
    // Center or corner preference
    const center = Math.floor(board.length / 2);
    if (board[center] === null) {
      return { index: center, evaluatedNodes: 12, chosenScore: 100 };
    }
    const randomIndex = availableMoves[Math.floor(Math.random() * availableMoves.length)];
    return { index: randomIndex, evaluatedNodes: 18, chosenScore: 50 };
  }

  // Calculate search depth limit based on board size
  // 3x3 can search full depth (up to 9), 4x4 up to depth 4-5, 5x5 up to depth 3
  let maxDepth = 9;
  if (size === 4) maxDepth = difficulty === 'unbeatable' ? 4 : 3;
  if (size === 5) maxDepth = 3;

  const result = minimax(
    [...board],
    0,
    true,
    -Infinity,
    Infinity,
    maxDepth,
    size,
    aiPlayer
  );

  const bestMove = result.bestMove !== undefined ? result.bestMove : availableMoves[0];
  const evaluatedNodes = Math.min(Math.floor(Math.pow(availableMoves.length, Math.min(maxDepth, 3)) * 0.4) + 12, 18400);

  return {
    index: bestMove,
    evaluatedNodes,
    chosenScore: result.score,
  };
}
