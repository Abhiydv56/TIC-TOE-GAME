import React, { useState, useEffect, useCallback, useRef } from 'react';
import confetti from 'canvas-confetti';
import {
  CellValue,
  Player,
  BoardSize,
  GameMode,
  AIDifficulty,
  GameStatus,
  Move,
  WinningLine,
  GameStats,
  DisappearingPiece,
} from './types/game';
import { checkWinner, isBoardFull, getAIMove } from './utils/ai';
import { sound } from './utils/audio';
import { generateJvmLog, JvmLogEntry } from './utils/javaCode';
import { GameBoard } from './components/GameBoard';
import { GameHUD } from './components/GameHUD';
import { TitleScreen } from './components/TitleScreen';
import { GameModal } from './components/GameModal';
import { JavaInspector } from './components/JavaInspector';
import { JavaCliTerminal } from './components/JavaCliTerminal';
import { MatchHistory } from './components/MatchHistory';

export default function App() {
  // Screen state
  const [screen, setScreen] = useState<'title' | 'playing'>('title');

  // Game configuration
  const [boardSize, setBoardSize] = useState<BoardSize>(3);
  const [gameMode, setGameMode] = useState<GameMode>('pve');
  const [aiDifficulty, setAiDifficulty] = useState<AIDifficulty>('unbeatable');

  // Active game state
  const [board, setBoard] = useState<CellValue[]>(() => Array(9).fill(null));
  const [currentPlayer, setCurrentPlayer] = useState<Player>('X');
  const [gameStatus, setGameStatus] = useState<GameStatus>('idle');
  const [winningLine, setWinningLine] = useState<WinningLine | null>(null);
  const [winner, setWinner] = useState<Player | null>(null);
  const [isAiThinking, setIsAiThinking] = useState(false);
  const [moveHistory, setMoveHistory] = useState<Move[]>([]);
  const [disappearingPieces, setDisappearingPieces] = useState<DisappearingPiece[]>([]);

  // Replay mode state
  const [isReplayMode, setIsReplayMode] = useState(false);
  const [replayStep, setReplayStep] = useState(0);

  // Victory / Game over modal state
  const [isResultModalOpen, setIsResultModalOpen] = useState(false);

  // Inspector and tools state
  const [isJavaInspectorOpen, setIsJavaInspectorOpen] = useState(false);
  const [isCliMode, setIsCliMode] = useState(false);
  const [isMuted, setIsMuted] = useState(() => sound.getMuted());
  const [jvmLogs, setJvmLogs] = useState<JvmLogEntry[]>([
    generateJvmLog('game_start', {}),
  ]);

  // Persistent Stats
  const [stats, setStats] = useState<GameStats>(() => {
    const saved = localStorage.getItem('ttt_stats');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        // Fallback
      }
    }
    return {
      xWins: 0,
      oWins: 0,
      draws: 0,
      totalGames: 0,
      currentStreak: { player: null, count: 0 },
    };
  });

  // Keep refs to latest state for timeouts & event listeners
  const boardRef = useRef(board);
  boardRef.current = board;
  const gameStatusRef = useRef(gameStatus);
  gameStatusRef.current = gameStatus;
  const disappearingPiecesRef = useRef(disappearingPieces);
  disappearingPiecesRef.current = disappearingPieces;
  const aiTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Initialize fresh board when boardSize changes
  const resetBoard = useCallback((size: BoardSize) => {
    if (aiTimeoutRef.current) {
      clearTimeout(aiTimeoutRef.current);
      aiTimeoutRef.current = null;
    }
    const freshBoard = Array(size * size).fill(null);
    setBoard(freshBoard);
    boardRef.current = freshBoard;
    setCurrentPlayer('X');
    setGameStatus('playing');
    gameStatusRef.current = 'playing';
    setWinningLine(null);
    setWinner(null);
    setIsAiThinking(false);
    setMoveHistory([]);
    setDisappearingPieces([]);
    disappearingPiecesRef.current = [];
    setIsReplayMode(false);
    setIsResultModalOpen(false);
    setReplayStep(0);
    setJvmLogs((prev) => [
      generateJvmLog('game_start', {}),
      ...prev.slice(0, 40),
    ]);
  }, []);

  // Return to title / main menu cleanly
  const handleReturnToTitle = useCallback(() => {
    sound.playClick();
    if (aiTimeoutRef.current) {
      clearTimeout(aiTimeoutRef.current);
      aiTimeoutRef.current = null;
    }
    setIsResultModalOpen(false);
    setIsReplayMode(false);
    setGameStatus('idle');
    gameStatusRef.current = 'idle';
    setWinningLine(null);
    setWinner(null);
    setIsAiThinking(false);
    setScreen('title');
  }, []);

  // Start new match from title screen
  const handleStartGame = () => {
    sound.playClick();
    resetBoard(boardSize);
    setScreen('playing');
  };

  // Sound toggle
  const handleToggleMute = () => {
    const nextMuted = sound.toggleMute();
    setIsMuted(nextMuted);
  };

  // Update persistent stats on game end
  const updateStats = useCallback((winPlayer: Player | null, isDraw: boolean) => {
    setStats((prev) => {
      let xWins = prev.xWins;
      let oWins = prev.oWins;
      let draws = prev.draws;
      let currentStreak = { ...prev.currentStreak };

      if (isDraw) {
        draws++;
        currentStreak = { player: null, count: 0 };
      } else if (winPlayer === 'X') {
        xWins++;
        if (currentStreak.player === 'X') {
          currentStreak.count++;
        } else {
          currentStreak = { player: 'X', count: 1 };
        }
      } else if (winPlayer === 'O') {
        oWins++;
        if (currentStreak.player === 'O') {
          currentStreak.count++;
        } else {
          currentStreak = { player: 'O', count: 1 };
        }
      }

      const newStats = {
        xWins,
        oWins,
        draws,
        totalGames: prev.totalGames + 1,
        currentStreak,
      };
      localStorage.setItem('ttt_stats', JSON.stringify(newStats));
      return newStats;
    });
  }, []);

  // Core move execution logic (used by both human player and AI)
  const executeMove = useCallback(
    (index: number, playerToMove: Player): boolean => {
      const currentBoard = boardRef.current;
      if (
        currentBoard[index] !== null ||
        gameStatusRef.current !== 'playing'
      ) {
        return false;
      }

      let newBoard = [...currentBoard];
      let newDisappearing = [...disappearingPiecesRef.current];

      // Disappearing mode logic: Each player can hold max 3 pieces
      if (gameMode === 'disappearing') {
        const playerPieces = newDisappearing.filter(
          (p) => p.player === playerToMove
        );
        if (playerPieces.length >= 3) {
          // Remove the oldest piece of this player
          const oldest = playerPieces[0];
          newBoard[oldest.index] = null;
          newDisappearing = newDisappearing.filter((p) => p !== oldest);
          sound.playFadePiece();

          const r = Math.floor(oldest.index / boardSize);
          const c = oldest.index % boardSize;
          setJvmLogs((prev) => [
            generateJvmLog('fade', {
              fadedCell: { row: r, col: c, player: playerToMove },
            }),
            ...prev,
          ]);
        }
        newDisappearing.push({
          index,
          player: playerToMove,
          moveNumber: moveHistory.length + 1,
        });
        setDisappearingPieces(newDisappearing);
        disappearingPiecesRef.current = newDisappearing;
      }

      // Place mark
      newBoard[index] = playerToMove;
      setBoard(newBoard);
      boardRef.current = newBoard;
      sound.playMove(playerToMove);

      const r = Math.floor(index / boardSize);
      const c = index % boardSize;

      // Log to JVM console
      setJvmLogs((prev) => [
        generateJvmLog('player_move', { player: playerToMove, row: r, col: c }),
        ...prev,
      ]);

      const newMove: Move = {
        index,
        row: r,
        col: c,
        player: playerToMove,
        timestamp: Date.now(),
        boardState: newBoard,
      };
      setMoveHistory((prev) => [...prev, newMove]);

      // Check win condition
      const winResult = checkWinner(newBoard, boardSize);
      if (winResult) {
        setWinner(winResult.winner);
        setWinningLine(winResult.line);
        setGameStatus('won');
        gameStatusRef.current = 'won';
        setIsResultModalOpen(true);
        setIsAiThinking(false);
        sound.playWin();
        confetti({
          particleCount: 80,
          spread: 65,
          origin: { y: 0.6 },
          colors: ['#F59E0B', '#22D3EE', '#FFFFFF', '#10B981'],
        });
        updateStats(winResult.winner, false);
        setJvmLogs((prev) => [
          generateJvmLog('win', { winner: winResult.winner }),
          ...prev,
        ]);
        return true;
      }

      // Check draw condition
      if (isBoardFull(newBoard)) {
        setGameStatus('draw');
        gameStatusRef.current = 'draw';
        setIsResultModalOpen(true);
        setIsAiThinking(false);
        sound.playDraw();
        updateStats(null, true);
        setJvmLogs((prev) => [generateJvmLog('draw', {}), ...prev]);
        return true;
      }

      // Turn transition
      const nextPlayer: Player = playerToMove === 'X' ? 'O' : 'X';
      setCurrentPlayer(nextPlayer);

      return true;
    },
    [boardSize, gameMode, moveHistory.length, updateStats]
  );

  // User click on cell (with guards against clicking while AI is thinking)
  const handleUserCellClick = useCallback(
    (index: number): boolean => {
      if (
        isAiThinking ||
        isReplayMode ||
        gameStatus !== 'playing' ||
        board[index] !== null
      ) {
        return false;
      }
      if (gameMode === 'pve' && currentPlayer !== 'X') {
        return false;
      }
      return executeMove(index, currentPlayer);
    },
    [isAiThinking, isReplayMode, gameStatus, board, gameMode, currentPlayer, executeMove]
  );

  // Trigger AI move reliably when it's AI turn in PvE mode
  useEffect(() => {
    if (
      gameMode === 'pve' &&
      currentPlayer === 'O' &&
      gameStatus === 'playing' &&
      !isReplayMode
    ) {
      setIsAiThinking(true);
      sound.playAiThink();
      setJvmLogs((prev) => [generateJvmLog('ai_think', {}), ...prev]);

      if (aiTimeoutRef.current) {
        clearTimeout(aiTimeoutRef.current);
      }

      aiTimeoutRef.current = setTimeout(() => {
        const currentBoard = boardRef.current;
        if (gameStatusRef.current !== 'playing') {
          setIsAiThinking(false);
          return;
        }

        const aiMove = getAIMove(currentBoard, boardSize, aiDifficulty, 'O');

        if (aiMove.index !== -1 && currentBoard[aiMove.index] === null) {
          const r = Math.floor(aiMove.index / boardSize);
          const c = aiMove.index % boardSize;
          setJvmLogs((prev) => [
            generateJvmLog('ai_move', {
              player: 'O',
              row: r,
              col: c,
              nodes: aiMove.evaluatedNodes,
              score: aiMove.chosenScore,
            }),
            ...prev,
          ]);

          executeMove(aiMove.index, 'O');
        }
        setIsAiThinking(false);
      }, 400);

      return () => {
        if (aiTimeoutRef.current) {
          clearTimeout(aiTimeoutRef.current);
          aiTimeoutRef.current = null;
        }
      };
    } else {
      setIsAiThinking(false);
    }
  }, [
    currentPlayer,
    gameMode,
    gameStatus,
    isReplayMode,
    boardSize,
    aiDifficulty,
    executeMove,
  ]);

  // Undo move
  const handleUndo = useCallback(() => {
    if (moveHistory.length === 0 || isAiThinking || isReplayMode) return;
    if (aiTimeoutRef.current) {
      clearTimeout(aiTimeoutRef.current);
      aiTimeoutRef.current = null;
    }
    sound.playClick();
    setIsAiThinking(false);

    // If PvE, undo both AI and player moves if possible
    let undoCount = 1;
    if (gameMode === 'pve' && moveHistory.length >= 2) {
      undoCount = 2;
    }

    const newHistory = moveHistory.slice(0, moveHistory.length - undoCount);
    const lastMove = newHistory[newHistory.length - 1];

    setMoveHistory(newHistory);
    const newBoard = lastMove
      ? [...lastMove.boardState]
      : Array(boardSize * boardSize).fill(null);
    setBoard(newBoard);
    boardRef.current = newBoard;
    setCurrentPlayer(lastMove ? (lastMove.player === 'X' ? 'O' : 'X') : 'X');
    setGameStatus('playing');
    gameStatusRef.current = 'playing';
    setWinningLine(null);
    setWinner(null);
  }, [moveHistory, isAiThinking, isReplayMode, gameMode, boardSize]);

  // Keyboard navigation & controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't intercept if focused in text input (e.g. terminal)
      if (
        document.activeElement?.tagName === 'INPUT' ||
        document.activeElement?.tagName === 'TEXTAREA'
      ) {
        return;
      }

      if (e.key === 'Escape') {
        if (isJavaInspectorOpen) {
          setIsJavaInspectorOpen(false);
        } else if (isCliMode) {
          setIsCliMode(false);
        } else if (isResultModalOpen) {
          handleReturnToTitle();
        } else if (isReplayMode) {
          setIsReplayMode(false);
        } else if (screen === 'playing') {
          handleReturnToTitle();
        }
        return;
      }

      if (screen === 'title') {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleStartGame();
        }
        return;
      }

      if (screen === 'playing') {
        if (e.key.toLowerCase() === 'u') {
          handleUndo();
        } else if (e.key.toLowerCase() === 'r') {
          resetBoard(boardSize);
        } else if (e.key.toLowerCase() === 'm') {
          handleToggleMute();
        } else if (e.key.toLowerCase() === 'j') {
          setIsJavaInspectorOpen((prev) => !prev);
        } else if (e.key.toLowerCase() === 't') {
          setIsCliMode((prev) => !prev);
        } else if (e.key >= '1' && e.key <= '9' && boardSize === 3) {
          const cellIdx = parseInt(e.key, 10) - 1;
          handleUserCellClick(cellIdx);
        } else if (
          (e.key === 'Enter' || e.key === ' ') &&
          (gameStatus === 'won' || gameStatus === 'draw')
        ) {
          resetBoard(boardSize);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [
    screen,
    boardSize,
    gameStatus,
    isResultModalOpen,
    isReplayMode,
    isJavaInspectorOpen,
    isCliMode,
    handleUserCellClick,
    handleUndo,
    resetBoard,
    handleReturnToTitle,
  ]);

  // Replay scrubber navigation
  const handleSelectReplayStep = (step: number) => {
    setReplayStep(step);
    if (step === 0) {
      setBoard(Array(boardSize * boardSize).fill(null));
    } else {
      const move = moveHistory[step - 1];
      if (move) {
        setBoard([...move.boardState]);
      }
    }
  };

  return (
    <div className="min-h-screen w-full bg-slate-950 text-slate-100 flex flex-col justify-between selection:bg-amber-500 selection:text-slate-950 relative overflow-x-hidden font-sans">
      {screen === 'title' ? (
        <TitleScreen
          mode={gameMode}
          difficulty={aiDifficulty}
          boardSize={boardSize}
          onSetMode={setGameMode}
          onSetDifficulty={setAiDifficulty}
          onSetBoardSize={setBoardSize}
          onStartGame={handleStartGame}
          onOpenJavaStudio={() => {
            sound.playClick();
            setIsJavaInspectorOpen(true);
          }}
        />
      ) : (
        <div className="flex-1 flex flex-col justify-between w-full max-w-5xl mx-auto py-2">
          {/* Top Bar HUD */}
          <GameHUD
            currentPlayer={currentPlayer}
            isAiThinking={isAiThinking}
            gameMode={gameMode}
            aiDifficulty={aiDifficulty}
            boardSize={boardSize}
            stats={stats}
            isMuted={isMuted}
            isJavaInspectorOpen={isJavaInspectorOpen}
            isCliMode={isCliMode}
            canUndo={moveHistory.length > 0}
            onToggleMute={handleToggleMute}
            onUndo={handleUndo}
            onReset={() => {
              sound.playClick();
              resetBoard(boardSize);
            }}
            onToggleJavaInspector={() => {
              sound.playClick();
              setIsJavaInspectorOpen((prev) => !prev);
            }}
            onToggleCliMode={() => {
              sound.playClick();
              setIsCliMode((prev) => !prev);
            }}
            onReturnToTitle={handleReturnToTitle}
          />

          {/* Replay Scrubber when reviewing match */}
          {isReplayMode && (
            <MatchHistory
              moves={moveHistory}
              currentStep={replayStep}
              onSelectStep={handleSelectReplayStep}
              onReturnToMenu={handleReturnToTitle}
              onPlayAgain={() => resetBoard(boardSize)}
              onShowResult={() => setIsResultModalOpen(true)}
              onClose={() => {
                setIsReplayMode(false);
                if (moveHistory.length > 0) {
                  setBoard([...moveHistory[moveHistory.length - 1].boardState]);
                }
              }}
            />
          )}

          {/* Primary Board Arena */}
          <main className="flex-1 flex items-center justify-center my-auto">
            <GameBoard
              board={board}
              size={boardSize}
              currentPlayer={currentPlayer}
              isAiThinking={isAiThinking}
              winningLine={winningLine}
              onCellClick={handleUserCellClick}
              disabled={gameStatus !== 'playing' || isReplayMode || isAiThinking}
              disappearingPieces={disappearingPieces}
              mode={gameMode}
            />
          </main>

          {/* Footer Control Hint Line */}
          <footer className="w-full text-center py-2 text-xs font-mono text-slate-500">
            <span>1-9 NumPad · U Undo · R Reset · M Mute · Esc Menu</span>
          </footer>
        </div>
      )}

      {/* Victory / Draw Celebration Modal */}
      {screen === 'playing' && (
        <GameModal
          isOpen={isResultModalOpen}
          status={gameStatus}
          winner={winner}
          winningLine={winningLine}
          moveCount={moveHistory.length}
          gameMode={gameMode}
          onRestart={() => {
            sound.playClick();
            resetBoard(boardSize);
          }}
          onReturnToMenu={handleReturnToTitle}
          onToggleReplay={() => {
            sound.playClick();
            setIsResultModalOpen(false);
            setIsReplayMode(true);
            setReplayStep(moveHistory.length);
          }}
        />
      )}

      {/* Java Code Studio & JVM Inspector Drawer */}
      <JavaInspector
        isOpen={isJavaInspectorOpen}
        onClose={() => setIsJavaInspectorOpen(false)}
        jvmLogs={jvmLogs}
      />

      {/* Java CLI Terminal Overlay */}
      {isCliMode && (
        <JavaCliTerminal
          board={board}
          size={boardSize}
          currentPlayer={currentPlayer}
          onMakeMove={(r, c) => handleUserCellClick(r * boardSize + c)}
          onReset={() => resetBoard(boardSize)}
          onClose={() => setIsCliMode(false)}
          isAiThinking={isAiThinking}
        />
      )}
    </div>
  );
}
