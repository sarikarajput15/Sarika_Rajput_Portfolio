import { useEffect, useState, useCallback } from "react";
import { TbX, TbChessKnight, TbRotate } from "react-icons/tb";
import "./styles/ChessGame.css";

// Knight's Tour puzzle on a 5x5 board.
// Click squares the knight can legally jump to. Try to visit all 25.
const SIZE = 5;
const TOTAL = SIZE * SIZE;

const KNIGHT_MOVES = [
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

const ChessGame = () => {
  const [open, setOpen] = useState(false);
  const [knight, setKnight] = useState<Cell | null>(null);
  const [visited, setVisited] = useState<Set<string>>(new Set());
  const [order, setOrder] = useState<Cell[]>([]);
  const [message, setMessage] = useState(
    "Pick any square to place the knight."
  );

  const reset = useCallback(() => {
    setKnight(null);
    setVisited(new Set());
    setOrder([]);
    setMessage("Pick any square to place the knight.");
  }, []);

  useEffect(() => {
    const onOpen = () => {
      setOpen(true);
      reset();
    };
    window.addEventListener("open-chess-game", onOpen);
    return () => window.removeEventListener("open-chess-game", onOpen);
  }, [reset]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    if (open) window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const isLegalMove = (r: number, c: number) => {
    if (!knight) return true;
    if (visited.has(cellKey(r, c))) return false;
    const dr = Math.abs(knight.r - r);
    const dc = Math.abs(knight.c - c);
    return (dr === 2 && dc === 1) || (dr === 1 && dc === 2);
  };

  const handleClick = (r: number, c: number) => {
    if (!knight) {
      setKnight({ r, c });
      const v = new Set<string>();
      v.add(cellKey(r, c));
      setVisited(v);
      setOrder([{ r, c }]);
      setMessage("Now move like a knight — L-shape. Visit all 25 squares.");
      return;
    }
    if (!isLegalMove(r, c)) {
      setMessage("Not a legal knight move. Try an L-shape.");
      return;
    }
    const v = new Set(visited);
    v.add(cellKey(r, c));
    const newOrder = [...order, { r, c }];
    setVisited(v);
    setKnight({ r, c });
    setOrder(newOrder);
    if (v.size === TOTAL) {
      setMessage("Checkmate-level focus! You completed the Knight's Tour. ♞");
    } else {
      // Check if there are any legal moves left
      let anyLegal = false;
      for (const [dr, dc] of KNIGHT_MOVES) {
        const nr = r + dr;
        const nc = c + dc;
        if (
          nr >= 0 &&
          nr < SIZE &&
          nc >= 0 &&
          nc < SIZE &&
          !v.has(cellKey(nr, nc))
        ) {
          anyLegal = true;
          break;
        }
      }
      if (!anyLegal) {
        setMessage(
          `No legal moves left. You visited ${v.size}/${TOTAL}. Reset to try again.`
        );
      } else {
        setMessage(`${v.size} / ${TOTAL} squares visited.`);
      }
    }
  };

  if (!open) return null;

  return (
    <div
      className="chess-overlay"
      onClick={() => setOpen(false)}
      data-testid="chess-overlay"
    >
      <div className="chess-modal" onClick={(e) => e.stopPropagation()}>
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
        >
          {Array.from({ length: SIZE }).map((_, r) =>
            Array.from({ length: SIZE }).map((_, c) => {
              const key = cellKey(r, c);
              const isDark = (r + c) % 2 === 1;
              const isKnight = knight?.r === r && knight?.c === c;
              const isVisited = visited.has(key);
              const legal = isLegalMove(r, c);
              const moveNum = order.findIndex((o) => o.r === r && o.c === c);
              return (
                <button
                  key={key}
                  className={[
                    "chess-cell",
                    isDark ? "chess-dark" : "chess-light",
                    isKnight ? "chess-knight-cell" : "",
                    isVisited && !isKnight ? "chess-visited" : "",
                    legal && knight && !isVisited ? "chess-legal" : "",
                  ]
                    .join(" ")
                    .trim()}
                  onClick={() => handleClick(r, c)}
                  data-cursor="disable"
                  data-testid={`chess-cell-${r}-${c}`}
                  type="button"
                >
                  {isKnight ? (
                    <TbChessKnight className="chess-knight-icon" />
                  ) : isVisited ? (
                    <span className="chess-step">{moveNum + 1}</span>
                  ) : null}
                </button>
              );
            })
          )}
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
