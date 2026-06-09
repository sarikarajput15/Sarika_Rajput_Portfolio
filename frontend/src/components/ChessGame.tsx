import { useEffect, useState, useCallback, useMemo } from "react";
import { TbX, TbChessKnight, TbRotate } from "react-icons/tb";
import "./styles/ChessGame.css";

// Knight's Tour puzzle on a 5x5 board.
// Click squares the knight can legally jump to. Try to visit all 25.
const SIZE = 5;
const TOTAL = SIZE * SIZE;

const KNIGHT_MOVES: ReadonlyArray<readonly [number, number]> = [
  [-2, -1],
  [-2, 1],
  [-1, -2],
  [-1, 2],
  [1, -2],
  [1, 2],
  [2, -1],
  [2, 1],
];

type Cell = { r: number; c: number };

const cellKey = (r: number, c: number) => `${r}-${c}`;

const inBounds = (r: number, c: number) =>
  r >= 0 && r < SIZE && c >= 0 && c < SIZE;

const legalMovesFrom = (
  knight: Cell,
  visited: ReadonlySet<string>
): Set<string> => {
  const out = new Set<string>();
  for (let i = 0; i < KNIGHT_MOVES.length; i++) {
    const dr = KNIGHT_MOVES[i][0];
    const dc = KNIGHT_MOVES[i][1];
    const nr = knight.r + dr;
    const nc = knight.c + dc;
    if (inBounds(nr, nc) && !visited.has(cellKey(nr, nc))) {
      out.add(cellKey(nr, nc));
    }
  }
  return out;
};

const ChessGame = () => {
  const [open, setOpen] = useState(false);
  const [knight, setKnight] = useState<Cell | null>(null);
  const [visited, setVisited] = useState<Set<string>>(() => new Set());
  const [order, setOrder] = useState<Cell[]>([]);
  const [message, setMessage] = useState(
    "Pick any square to place the knight."
  );

  const legalSet = useMemo<Set<string>>(() => {
    if (!knight) return new Set();
    return legalMovesFrom(knight, visited);
  }, [knight, visited]);

  const won = visited.size === TOTAL;
  const stuck = Boolean(knight) && !won && legalSet.size === 0;
  const gameOver = won || stuck;

  const reset = useCallback(() => {
    setKnight(null);
    setVisited(new Set());
    setOrder([]);
    setMessage("Pick any square to place the knight.");
  }, []);

  useEffect(() => {
    const onOpen = () => {
      setOpen(true);
      setKnight(null);
      setVisited(new Set());
      setOrder([]);
      setMessage("Pick any square to place the knight.");
    };
    window.addEventListener("open-chess-game", onOpen);
    return () => window.removeEventListener("open-chess-game", onOpen);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const handleClick = useCallback(
    (r: number, c: number) => {
      // Hard guards
      if (!inBounds(r, c)) return;
      if (gameOver) return;

      setKnight((prevKnight) => {
        if (!prevKnight) {
          // Place knight (first move)
          const start = { r, c };
          const v = new Set<string>();
          v.add(cellKey(r, c));
          setVisited(v);
          setOrder([start]);
          setMessage("Now move like a knight — L-shape. Visit all 25 squares.");
          return start;
        }

        const targetKey = cellKey(r, c);

        // Pull latest visited via functional updater
        let didMove = false;
        setVisited((prevVisited) => {
          if (prevVisited.has(targetKey)) {
            setMessage("Already visited. Pick an unvisited L-move.");
            return prevVisited;
          }
          const dr = Math.abs(prevKnight.r - r);
          const dc = Math.abs(prevKnight.c - c);
          const isL = (dr === 2 && dc === 1) || (dr === 1 && dc === 2);
          if (!isL) {
            setMessage("Not a legal knight move. Try an L-shape.");
            return prevVisited;
          }
          const v = new Set(prevVisited);
          v.add(targetKey);
          didMove = true;

          // Compute next state messages here using the post-move set
          if (v.size === TOTAL) {
            setMessage("Checkmate-level focus! You completed the tour. ♞");
          } else {
            const nextLegal = legalMovesFrom({ r, c }, v);
            if (nextLegal.size === 0) {
              setMessage(
                `No legal moves left. You visited ${v.size}/${TOTAL}. Reset to try again.`
              );
            } else {
              setMessage(`${v.size} / ${TOTAL} squares visited.`);
            }
          }
          return v;
        });

        if (didMove) {
          setOrder((prev) => [...prev, { r, c }]);
          return { r, c };
        }
        return prevKnight;
      });
    },
    [gameOver]
  );

  if (!open) return null;

  // Build the cells once per render
  const cells: JSX.Element[] = [];
  for (let r = 0; r < SIZE; r++) {
    for (let c = 0; c < SIZE; c++) {
      const key = cellKey(r, c);
      const isDark = (r + c) % 2 === 1;
      const isKnight = knight !== null && knight.r === r && knight.c === c;
      const isVisited = visited.has(key);
      const isLegalTarget = legalSet.has(key);
      const moveNum = order.findIndex((o) => o.r === r && o.c === c);
      const classes = ["chess-cell", isDark ? "chess-dark" : "chess-light"];
      if (isKnight) classes.push("chess-knight-cell");
      else if (isVisited) classes.push("chess-visited");
      if (isLegalTarget && !isVisited && !gameOver) classes.push("chess-legal");
      const disabled = gameOver || (isVisited && !isKnight);
      cells.push(
        <button
          key={key}
          className={classes.join(" ")}
          onClick={(e) => {
            e.stopPropagation();
            handleClick(r, c);
          }}
          disabled={disabled}
          data-cursor="disable"
          data-testid={`chess-cell-${r}-${c}`}
          type="button"
        >
          {isKnight ? (
            <TbChessKnight className="chess-knight-icon" />
          ) : isVisited && moveNum >= 0 ? (
            <span className="chess-step">{moveNum + 1}</span>
          ) : null}
        </button>
      );
    }
  }

  return (
    <div
      className="chess-overlay"
      onClick={() => setOpen(false)}
      data-testid="chess-overlay"
    >
      <div
        className="chess-modal"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        <div className="chess-modal-head">
          <div className="chess-title">
            <TbChessKnight />
            <h3>Knight's Tour</h3>
          </div>
          <button
            className="chess-close"
            onClick={() => setOpen(false)}
            aria-label="Close"
            data-cursor="disable"
            data-testid="chess-close-btn"
            type="button"
          >
            <TbX />
          </button>
        </div>
        <p className="chess-message" data-testid="chess-message">
          {message}
        </p>
        <div
          className="chess-board"
          style={{
            gridTemplateColumns: `repeat(${SIZE}, 1fr)`,
            gridTemplateRows: `repeat(${SIZE}, 1fr)`,
          }}
          data-testid="chess-board"
          onClick={(e) => e.stopPropagation()}
        >
          {cells}
        </div>
        <div className="chess-actions">
          <button
            className="chess-reset"
            onClick={reset}
            data-cursor="disable"
            data-testid="chess-reset-btn"
            type="button"
          >
            <TbRotate /> Reset
          </button>
          <span className="chess-counter" data-testid="chess-counter">
            {visited.size} / {TOTAL}
          </span>
        </div>
      </div>
    </div>
  );
};

export default ChessGame;
