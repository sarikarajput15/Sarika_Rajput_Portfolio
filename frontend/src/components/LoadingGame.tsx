import { useEffect, useRef, useState, useCallback } from "react";
import { TbRocket, TbReload, TbPlayerPlay } from "react-icons/tb";
import "./styles/LoadingGame.css";

const TILE_WIDTH = 56; // px
const VIEWPORT_TILES = 6;
const PLAYER_TILE_INDEX = 1; // player visually sits at the 2nd tile from left
const HOP_MS = 380;
const INITIAL_TILES = 12;
const GAP_CHANCE = 0.32;

function generateChunk(n: number, lastWasGap: boolean): boolean[] {
  const out: boolean[] = [];
  let prevGap = lastWasGap;
  for (let i = 0; i < n; i++) {
    if (prevGap) {
      out.push(true);
      prevGap = false;
    } else {
      const gap = Math.random() < GAP_CHANCE;
      out.push(!gap);
      prevGap = gap;
    }
  }
  return out;
}

function initialTiles(): boolean[] {
  // start with 3 safe tiles so the player has time to react
  return [true, true, true, ...generateChunk(INITIAL_TILES - 3, false)];
}

const LoadingGame = () => {
  const [tiles, setTiles] = useState<boolean[]>(initialTiles);
  const [pos, setPos] = useState(0); // index of player's current tile
  const [jumping, setJumping] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [best, setBest] = useState<number>(() => {
    if (typeof window === "undefined") return 0;
    const v = window.localStorage.getItem("space-hopper-best");
    return v ? parseInt(v, 10) || 0 : 0;
  });

  const bestRef = useRef(0);
  bestRef.current = best;

  const stateRef = useRef({ jumping, gameOver, pos, tiles, score });
  stateRef.current = { jumping, gameOver, pos, tiles, score };

  const restart = useCallback(() => {
    setTiles(initialTiles());
    setPos(0);
    setScore(0);
    setJumping(false);
    setGameOver(false);
  }, []);

  const jump = useCallback(() => {
    const s = stateRef.current;
    if (s.jumping || s.gameOver) return;
    const nextIndex = s.pos + 1;
    const willLand = s.tiles[nextIndex];
    setJumping(true);

    window.setTimeout(() => {
      if (!willLand) {
        setBest((prev) => {
          const b = Math.max(prev, stateRef.current.score);
          try {
            window.localStorage.setItem("space-hopper-best", String(b));
          } catch {
            // ignore quota / privacy mode
          }
          return b;
        });
        setGameOver(true);
        setJumping(false);
        return;
      }
      setPos(nextIndex);
      setScore((prev) => prev + 1);
      setJumping(false);
      // extend tile world when getting close to the end
      setTiles((prev) => {
        if (nextIndex > prev.length - 8) {
          const last = prev[prev.length - 1];
          return [...prev, ...generateChunk(10, !last)];
        }
        return prev;
      });
    }, HOP_MS);
  }, []);

  // Add best to stateRef
  // (bestRef tracks separately above)

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.code === "Space" || e.key === " " || e.key === "Spacebar") {
        // don't hijack space in input fields
        const tag = (e.target as HTMLElement)?.tagName;
        if (tag === "INPUT" || tag === "TEXTAREA") return;
        e.preventDefault();
        if (stateRef.current.gameOver) {
          restart();
        } else {
          jump();
        }
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [jump, restart]);

  // World offset: keep the player at PLAYER_TILE_INDEX visually
  const worldOffset = (pos - PLAYER_TILE_INDEX) * TILE_WIDTH;

  // Slice of tiles we care about rendering (the visible window + buffer)
  const renderStart = Math.max(0, pos - PLAYER_TILE_INDEX - 1);
  const renderEnd = Math.min(tiles.length, pos + VIEWPORT_TILES + 2);
  const visible: { idx: number; safe: boolean }[] = [];
  for (let i = renderStart; i < renderEnd; i++) {
    visible.push({ idx: i, safe: tiles[i] });
  }

  return (
    <div className="lg-wrap" data-testid="loading-game">
      <div className="lg-hud">
        <div className="lg-hud-left">
          <span className="lg-label">SPACE&nbsp;HOPPER</span>
          <span className="lg-help">press SPACE to jump</span>
        </div>
        <div className="lg-hud-right">
          <span className="lg-score" data-testid="lg-score">
            {score.toString().padStart(3, "0")}
          </span>
          <span className="lg-best" data-testid="lg-best">
            BEST {best.toString().padStart(3, "0")}
          </span>
        </div>
      </div>

      <div className="lg-stage">
        {/* twinkling background dots */}
        <div className="lg-stars" aria-hidden="true">
          {Array.from({ length: 30 }).map((_, i) => (
            <span
              key={i}
              style={{
                left: `${(i * 37) % 100}%`,
                top: `${(i * 53) % 100}%`,
                animationDelay: `${(i % 7) * 0.4}s`,
              }}
            />
          ))}
        </div>

        {/* world (tiles slide left as player advances) */}
        <div
          className="lg-world"
          style={{ transform: `translateX(${-worldOffset}px)` }}
        >
          {visible.map(({ idx, safe }) => (
            <div
              key={idx}
              className={`lg-tile ${safe ? "lg-tile-safe" : "lg-tile-gap"}`}
              style={{ left: `${idx * TILE_WIDTH}px` }}
              data-testid={`lg-tile-${idx}`}
            >
              {safe && <span className="lg-tile-glow" />}
            </div>
          ))}
        </div>

        {/* player */}
        <div
          className={`lg-player ${jumping ? "lg-player-hop" : ""} ${
            gameOver ? "lg-player-fall" : ""
          }`}
          data-testid="lg-player"
        >
          <TbRocket />
        </div>

        {/* overlay messages */}
        {gameOver && (
          <button
            type="button"
            className="lg-overlay"
            onClick={restart}
            data-testid="lg-restart"
          >
            <span className="lg-over-title">Lost in space</span>
            <span className="lg-over-sub">
              Score {score} · Best {best}
            </span>
            <span className="lg-over-cta">
              <TbReload /> Press SPACE to retry
            </span>
          </button>
        )}
        {!gameOver && score === 0 && !jumping && (
          <div className="lg-hint" data-testid="lg-hint">
            <TbPlayerPlay /> Tap SPACE to hop
          </div>
        )}
      </div>
    </div>
  );
};

export default LoadingGame;
