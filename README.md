# Java Tic-Tac-Toe Studio ☕

An interactive, production-grade Tic-Tac-Toe application combining tactile web gameplay with an integrated **Java Engine & JVM Studio**. Play in browser or run the pure Java 17+ Minimax Alpha-Beta engine locally in your terminal.

---

## 🌟 Highlights

- 🧠 **Minimax AI with Alpha-Beta Pruning**: Challenge an unbeatable AI algorithm with 3 distinct difficulty settings (*Easy*, *Medium*, *Unbeatable*).
- ☕ **Embedded Java Engine Studio**: Inspect, copy, and download 100% standard, compilable Java 17+ source code (`TicTacToe.java`, `Board.java`, `MinimaxAI.java`, `Player.java`, `Move.java`).
- ⚡ **Live JVM Telemetry**: Real-time console logs stream move calculations, memory allocations, and tree search metrics directly to the interface.
- 💻 **Java Scanner CLI Console**: An authentic terminal simulator replicating Java `Scanner(System.in)` inputs (`1 2`, `board`, `status`, `restart`) with live ASCII board rendering.
- 📐 **Multiple Board Formats**:
  - **3×3 Classic**: Standard 3-in-a-row.
  - **4×4 Tactical**: 4-in-a-row with expanded depth evaluation.
  - **5×5 Strategic**: 4-in-a-row Gomoku-style grid.
- ⏳ **Disappearing 3-Piece Mode**: Each player can only maintain 3 pieces on the board. Placing a 4th piece evicts the oldest piece, eliminating stalemates for fast-paced tactical gameplay.
- 🔊 **Zero-Dependency Web Audio Synth**: Procedural sound effects generated on-the-fly via Web Audio API (placement pops, AI think ticks, win fanfare, tie chord).
- ⏪ **Move Review Scrubber**: Step-through match replay viewer allowing post-game move-by-move inspection.
- 📊 **Persistent Statistics**: Win/loss counts and win streaks stored in `localStorage`.

---

## 🎮 Game Modes

| Mode | Description |
| :--- | :--- |
| **vs Java AI** | Play against the Minimax Alpha-Beta algorithm with selectable difficulty (*Easy*, *Medium*, *Unbeatable*). |
| **Pass & Play** | Local two-player mode with alternating turns and active player indicators. |
| **Disappearing 3-Piece** | Tactical memory mode where each player can hold at most 3 marks. The oldest mark fades when placing the 4th. |
| **Java CLI Mode** | Interactive terminal console simulating Java terminal execution with ASCII grid display and coordinate commands. |

---

## ⌨️ Keyboard Shortcuts

| Key | Action |
| :--- | :--- |
| `Enter` / `Space` | Start game / Play again / Confirm rematch |
| `1` – `9` | Place mark in corresponding cell on 3×3 grid |
| `U` | Undo previous move (reverts both player & AI moves in PvE) |
| `R` | Reset current match |
| `M` | Toggle sound effects (Mute / Unmute) |
| `J` or `C` | Toggle Java Code Studio & Live JVM Inspector |
| `T` | Toggle Java Scanner CLI Terminal |
| `Esc` | Return to Main Menu / Close drawers and overlays |

---

## 🚀 Getting Started (Web App)

### Prerequisites

- **Node.js**: v18.0.0 or higher
- **npm**: v9.0.0 or higher

### Installation

1. Clone this repository:
   ```bash
   git clone https://github.com/your-username/java-tic-tac-toe-studio.git
   cd java-tic-tac-toe-studio
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Launch development server:
   ```bash
   npm run dev
   ```

4. Open your browser and navigate to:
   ```
   http://localhost:3000
   ```

### Production Build

```bash
npm run build
npm run preview
```

---

## ☕ Running the Standalone Java Version

The Java source code included in this project can be compiled and executed directly on any machine with Java 17+ installed.

### Option A: From the Web App
1. Launch the web app and click **"Java Code"** in the top bar.
2. Select any file (or click **Download** to save the `.java` files).
3. Follow the compilation line shown at the bottom of the editor.

### Option B: Terminal Compilation
Create the directory structure `com/games/tictactoe/` and place the source files inside:

```bash
# Compile all source files
javac com/games/tictactoe/*.java

# Run the interactive console game
java com.games.tictactoe.TicTacToe
```

#### Example Java Terminal Session:
```text
========================================
  JAVA TIC-TAC-TOE ENGINE v2.4 (JDK 21) 
========================================

     0   1   2  
  0  · | · | · 
    ---+---+---
  1  · | · | · 
    ---+---+---
  2  · | · | · 

[Player X] Enter row & col (0-2, e.g., '1 2'): 1 1

[AI Engine] Computing optimal move via Minimax Alpha-Beta...
[AI Engine] Selected move: row 0, col 0
```

---

## 📁 Project Architecture

```text
├── index.html                   # HTML entry point with metadata and Google Fonts
├── metadata.json                # Project description and frame permissions
├── package.json                 # Project dependencies and npm scripts
├── tsconfig.json                # TypeScript configuration
├── vite.config.ts               # Vite configuration with Tailwind CSS plugin
└── src/
    ├── main.tsx                 # React DOM root entry
    ├── App.tsx                  # Main game loop, state coordinator, and keyboard listeners
    ├── index.css                # Tailwind CSS v4 setup and typography layers
    ├── types/
    │   └── game.ts              # TypeScript interfaces (Player, BoardSize, Move, Stats)
    ├── utils/
    │   ├── ai.ts                # Minimax Alpha-Beta search, heuristics, and win checks
    │   ├── audio.ts             # Procedural Web Audio API sound synthesizer
    │   └── javaCode.ts          # Compilable Java source code files and JVM log generator
    └── components/
        ├── GameBoard.tsx        # Responsive grid (3x3, 4x4, 5x5) with mark animations
        ├── GameHUD.tsx          # Top bar adhering to Top Bar Contract and Zero-Pill rules
        ├── GameModal.tsx        # Victory/Draw dialog with rematch and replay controls
        ├── TitleScreen.tsx      # Title view with bespoke inline SVG and mode setup
        ├── JavaInspector.tsx    # Java source viewer, copy/download tools, and live JVM stream
        ├── JavaCliTerminal.tsx  # Scanner(System.in) console terminal with ASCII board
        └── MatchHistory.tsx     # Turn-by-turn match review scrubber
```

---

## 🛠️ Tech Stack

- **Frontend Framework**: [React 19](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- **Bundler & Dev Server**: [Vite 8](https://vitejs.dev/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Animations**: [Motion](https://motion.dev/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Celebration Effects**: [Canvas Confetti](https://www.npmjs.com/package/canvas-confetti)
- **Audio**: Native Browser Web Audio API (OscillatorNode & GainNode)
- **Core Engine**: Pure Java 17+ OOP implementation (Record, Enum, Minimax with Alpha-Beta Pruning)

---

## 📄 License

This project is licensed under the Apache-2.0 License.
