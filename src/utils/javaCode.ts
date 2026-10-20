/**
 * Java Tic-Tac-Toe source code repository and JVM execution log simulator.
 * Real, standard, production-grade Java 17+ source code ready to be compiled
 * via `javac TicTacToe.java` and run via `java TicTacToe`.
 */

export interface JavaSourceFile {
  filename: string;
  className: string;
  description: string;
  code: string;
}

export const JAVA_SOURCE_FILES: JavaSourceFile[] = [
  {
    filename: 'TicTacToe.java',
    className: 'TicTacToe',
    description: 'Main game driver and interactive terminal loop using Scanner',
    code: `package com.games.tictactoe;

import java.util.Scanner;

/**
 * Standard Java Tic-Tac-Toe Game Engine.
 * Run directly in terminal:
 *   javac TicTacToe.java
 *   java TicTacToe
 */
public class TicTacToe {
    private final Board board;
    private final MinimaxAI ai;
    private Player currentPlayer;
    private final Scanner scanner;

    public TicTacToe() {
        this.board = new Board(3);
        this.ai = new MinimaxAI(Player.O);
        this.currentPlayer = Player.X;
        this.scanner = new Scanner(System.in);
    }

    public void start() {
        System.out.println("========================================");
        System.out.println("  JAVA TIC-TAC-TOE ENGINE v2.4 (JDK 21) ");
        System.out.println("========================================");
        board.display();

        while (!board.isGameOver()) {
            if (currentPlayer == Player.X) {
                userTurn();
            } else {
                aiTurn();
            }
            board.display();
            
            Player winner = board.getWinner();
            if (winner != Player.NONE) {
                System.out.println(">>> Victory! Player " + winner + " wins the match!");
                return;
            } else if (board.isFull()) {
                System.out.println(">>> Stalemate! It's a draw!");
                return;
            }

            currentPlayer = currentPlayer.opponent();
        }
    }

    private void userTurn() {
        System.out.print("[Player " + currentPlayer + "] Enter row & col (0-2, e.g., '1 2'): ");
        int row = scanner.nextInt();
        int col = scanner.nextInt();

        while (!board.makeMove(row, col, currentPlayer)) {
            System.out.print("Invalid move! Try again: ");
            row = scanner.nextInt();
            col = scanner.nextInt();
        }
    }

    private void aiTurn() {
        System.out.println("[AI Engine] Computing optimal move via Minimax Alpha-Beta...");
        Move bestMove = ai.findBestMove(board);
        System.out.printf("[AI Engine] Selected move: row %d, col %d%n", bestMove.row(), bestMove.col());
        board.makeMove(bestMove.row(), bestMove.col(), currentPlayer);
    }

    public static void main(String[] args) {
        new TicTacToe().start();
    }
}`
  },
  {
    filename: 'Board.java',
    className: 'Board',
    description: 'Encapsulates the grid, validation, and win condition checks',
    code: `package com.games.tictactoe;

import java.util.Arrays;

public class Board {
    private final int size;
    private final Player[][] grid;

    public Board(int size) {
        this.size = size;
        this.grid = new Player[size][size];
        for (int r = 0; r < size; r++) {
            Arrays.fill(grid[r], Player.NONE);
        }
    }

    public boolean makeMove(int row, int col, Player player) {
        if (row < 0 || row >= size || col < 0 || col >= size) {
            return false;
        }
        if (grid[row][col] != Player.NONE) {
            return false;
        }
        grid[row][col] = player;
        return true;
    }

    public void undoMove(int row, int col) {
        if (row >= 0 && row < size && col >= 0 && col < size) {
            grid[row][col] = Player.NONE;
        }
    }

    public Player getWinner() {
        // Check rows
        for (int r = 0; r < size; r++) {
            if (grid[r][0] != Player.NONE &&
                grid[r][0] == grid[r][1] &&
                grid[r][1] == grid[r][2]) {
                return grid[r][0];
            }
        }
        // Check columns
        for (int c = 0; c < size; c++) {
            if (grid[0][c] != Player.NONE &&
                grid[0][c] == grid[1][c] &&
                grid[1][c] == grid[2][c]) {
                return grid[0][c];
            }
        }
        // Check main diagonal
        if (grid[0][0] != Player.NONE &&
            grid[0][0] == grid[1][1] &&
            grid[1][1] == grid[2][2]) {
            return grid[0][0];
        }
        // Check anti diagonal
        if (grid[0][2] != Player.NONE &&
            grid[0][2] == grid[1][1] &&
            grid[1][1] == grid[2][0]) {
            return grid[0][2];
        }
        return Player.NONE;
    }

    public boolean isFull() {
        for (int r = 0; r < size; r++) {
            for (int c = 0; c < size; c++) {
                if (grid[r][c] == Player.NONE) return false;
            }
        }
        return true;
    }

    public boolean isGameOver() {
        return getWinner() != Player.NONE || isFull();
    }

    public Player getCell(int r, int c) {
        return grid[r][c];
    }

    public int getSize() {
        return size;
    }

    public void display() {
        System.out.println();
        for (int r = 0; r < size; r++) {
            System.out.print("  ");
            for (int c = 0; c < size; c++) {
                char ch = grid[r][c] == Player.NONE ? ' ' : grid[r][c].name().charAt(0);
                System.out.printf(" %c ", ch);
                if (c < size - 1) System.out.print("|");
            }
            System.out.println();
            if (r < size - 1) {
                System.out.println("  ---+---+---");
            }
        }
        System.out.println();
    }
}`
  },
  {
    filename: 'MinimaxAI.java',
    className: 'MinimaxAI',
    description: 'Alpha-Beta Pruning decision algorithm in pure Java',
    code: `package com.games.tictactoe;

public class MinimaxAI {
    private final Player aiPlayer;
    private final Player humanPlayer;

    public MinimaxAI(Player aiPlayer) {
        this.aiPlayer = aiPlayer;
        this.humanPlayer = aiPlayer.opponent();
    }

    public Move findBestMove(Board board) {
        int bestVal = Integer.MIN_VALUE;
        Move bestMove = new Move(-1, -1);
        int alpha = Integer.MIN_VALUE;
        int beta = Integer.MAX_VALUE;

        for (int r = 0; r < board.getSize(); r++) {
            for (int c = 0; c < board.getSize(); c++) {
                if (board.getCell(r, c) == Player.NONE) {
                    board.makeMove(r, c, aiPlayer);
                    int moveVal = minimax(board, 0, false, alpha, beta);
                    board.undoMove(r, c);

                    if (moveVal > bestVal) {
                        bestMove = new Move(r, c);
                        bestVal = moveVal;
                    }
                    alpha = Math.max(alpha, bestVal);
                }
            }
        }
        return bestMove;
    }

    private int minimax(Board board, int depth, boolean isMax, int alpha, int beta) {
        Player winner = board.getWinner();
        if (winner == aiPlayer) return 10 - depth;
        if (winner == humanPlayer) return depth - 10;
        if (board.isFull()) return 0;

        if (isMax) {
            int maxEval = Integer.MIN_VALUE;
            for (int r = 0; r < board.getSize(); r++) {
                for (int c = 0; c < board.getSize(); c++) {
                    if (board.getCell(r, c) == Player.NONE) {
                        board.makeMove(r, c, aiPlayer);
                        int eval = minimax(board, depth + 1, false, alpha, beta);
                        board.undoMove(r, c);
                        maxEval = Math.max(maxEval, eval);
                        alpha = Math.max(alpha, eval);
                        if (beta <= alpha) return maxEval;
                    }
                }
            }
            return maxEval;
        } else {
            int minEval = Integer.MAX_VALUE;
            for (int r = 0; r < board.getSize(); r++) {
                for (int c = 0; c < board.getSize(); c++) {
                    if (board.getCell(r, c) == Player.NONE) {
                        board.makeMove(r, c, humanPlayer);
                        int eval = minimax(board, depth + 1, true, alpha, beta);
                        board.undoMove(r, c);
                        minEval = Math.min(minEval, eval);
                        beta = Math.min(beta, eval);
                        if (beta <= alpha) return minEval;
                    }
                }
            }
            return minEval;
        }
    }
}`
  },
  {
    filename: 'Player.java',
    className: 'Player',
    description: 'Java Enum defining board tokens and turn switching',
    code: `package com.games.tictactoe;

public enum Player {
    X,
    O,
    NONE;

    public Player opponent() {
        if (this == X) return O;
        if (this == O) return X;
        return NONE;
    }

    @Override
    public String toString() {
        return this == NONE ? "." : name();
    }
}`
  },
  {
    filename: 'Move.java',
    className: 'Move',
    description: 'Java Record modeling coordinate pairs',
    code: `package com.games.tictactoe;

/**
 * Immutable Record representation of a move coordinate (Java 16+)
 */
public record Move(int row, int col) {
    public boolean isValid() {
        return row >= 0 && col >= 0;
    }

    @Override
    public String toString() {
        return String.format("(%d, %d)", row, col);
    }
}`
  }
];

export interface JvmLogEntry {
  id: string;
  timestamp: string;
  type: 'info' | 'jvm' | 'ai' | 'event' | 'win';
  message: string;
  sourceMethod?: string;
}

export function generateJvmLog(
  action: 'game_start' | 'player_move' | 'ai_think' | 'ai_move' | 'win' | 'draw' | 'fade',
  details: {
    player?: 'X' | 'O';
    row?: number;
    col?: number;
    nodes?: number;
    score?: number;
    winner?: 'X' | 'O';
    fadedCell?: { row: number; col: number; player: 'X' | 'O' };
  }
): JvmLogEntry {
  const d = new Date();
  const time = d.toTimeString().split(' ')[0] + '.' + String(d.getMilliseconds()).padStart(3, '0');
  const id = Math.random().toString(36).substring(2, 9);

  switch (action) {
    case 'game_start':
      return {
        id,
        timestamp: time,
        type: 'jvm',
        message: 'JVM initialized. Board instance allocated (Grid: 3x3, Heap: 18.4MB).',
        sourceMethod: 'TicTacToe.<init>()',
      };
    case 'player_move':
      return {
        id,
        timestamp: time,
        type: 'info',
        message: `Player [${details.player}] invoked board.makeMove(${details.row}, ${details.col}) -> SUCCESS`,
        sourceMethod: 'Board.makeMove(int, int, Player)',
      };
    case 'ai_think':
      return {
        id,
        timestamp: time,
        type: 'ai',
        message: `MinimaxAI.findBestMove() executing Alpha-Beta search... evaluating state tree.`,
        sourceMethod: 'MinimaxAI.minimax(Board, int, boolean, int, int)',
      };
    case 'ai_move':
      return {
        id,
        timestamp: time,
        type: 'ai',
        message: `AI [${details.player}] placed at (${details.row}, ${details.col}) | Nodes pruned: ${details.nodes || 42} | Eval score: ${details.score ?? 0}`,
        sourceMethod: 'MinimaxAI.findBestMove()',
      };
    case 'fade':
      return {
        id,
        timestamp: time,
        type: 'event',
        message: `[Disappearing Rule] Player ${details.fadedCell?.player}'s oldest piece at (${details.fadedCell?.row}, ${details.fadedCell?.col}) expired from board.`,
        sourceMethod: 'DynamicBoard.evictOldestPiece()',
      };
    case 'win':
      return {
        id,
        timestamp: time,
        type: 'win',
        message: `Win condition verified! Winner: Player ${details.winner} -> board.getWinner() == Player.${details.winner}`,
        sourceMethod: 'Board.getWinner()',
      };
    case 'draw':
      return {
        id,
        timestamp: time,
        type: 'event',
        message: `Board full (grid cells exhausted). Stalemate -> board.isFull() == true`,
        sourceMethod: 'Board.isFull()',
      };
  }
}
