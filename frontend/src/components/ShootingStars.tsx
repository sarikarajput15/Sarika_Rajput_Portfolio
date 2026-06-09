import { useEffect, useRef } from "react";
import "./styles/ShootingStars.css";

type Props = {
  /** Number of shooting stars per ~10s (rough). Default 3. */
  intensity?: number;
  /** Color of the stars. Default white. */
  color?: string;
  /** Optional fixed/absolute. Default fixed. */
  position?: "fixed" | "absolute";
  /** zIndex of the canvas. */
  zIndex?: number;
  /** Mix blend mode. */
  blendMode?: string;
};

type Star = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  tail: number;
  alpha: number;
  dead: boolean;
};

const ShootingStars = ({
  intensity = 3,
  color = "255, 255, 255",
  position = "fixed",
  zIndex = 1,
  blendMode = "screen",
}: Props) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    const resize = () => {
      const w = canvas.parentElement
        ? canvas.parentElement.clientWidth
        : window.innerWidth;
      const h = canvas.parentElement
        ? canvas.parentElement.clientHeight
        : window.innerHeight;
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      canvas.style.width = w + "px";
      canvas.style.height = h + "px";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener("resize", resize);

    const stars: Star[] = [];
    const idleDots: { x: number; y: number; r: number; tw: number }[] = [];

    // sprinkle some faint static stars
    const cssW = () => canvas.clientWidth;
    const cssH = () => canvas.clientHeight;
    const seedIdle = () => {
      idleDots.length = 0;
      const n = Math.floor((cssW() * cssH()) / 22000);
      for (let i = 0; i < n; i++) {
        idleDots.push({
          x: Math.random() * cssW(),
          y: Math.random() * cssH() * 0.85,
          r: Math.random() * 1.1 + 0.2,
          tw: Math.random() * Math.PI * 2,
        });
      }
    };
    seedIdle();
    window.addEventListener("resize", seedIdle);

    const spawn = () => {
      const startFromTop = Math.random() < 0.6;
      const startX = startFromTop
        ? Math.random() * cssW() * 0.7
        : -40;
      const startY = startFromTop ? -20 : Math.random() * cssH() * 0.4;
      const angle = Math.PI / 4 + (Math.random() - 0.5) * 0.4;
      const speed = 7 + Math.random() * 6;
      stars.push({
        x: startX,
        y: startY,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        tail: 90 + Math.random() * 100,
        alpha: 0.9,
        dead: false,
      });
    };

    let last = performance.now();
    let acc = 0;
    let nextSpawn = 800 + Math.random() * (5000 / Math.max(intensity, 0.1));
    let raf = 0;

    const loop = (t: number) => {
      const dt = t - last;
      last = t;
      acc += dt;

      const w = cssW();
      const h = cssH();
      ctx.clearRect(0, 0, w, h);

      // idle twinkles
      for (let i = 0; i < idleDots.length; i++) {
        const d = idleDots[i];
        d.tw += dt * 0.002;
        const a = 0.35 + Math.sin(d.tw) * 0.25;
        ctx.fillStyle = `rgba(${color}, ${Math.max(0, a)})`;
        ctx.beginPath();
        ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2);
        ctx.fill();
      }

      if (acc > nextSpawn) {
        spawn();
        acc = 0;
        nextSpawn = 600 + Math.random() * (4500 / Math.max(intensity, 0.1));
      }

      for (let i = stars.length - 1; i >= 0; i--) {
        const s = stars[i];
        s.x += s.vx;
        s.y += s.vy;

        // tail gradient
        const tx = s.x - (s.vx / Math.hypot(s.vx, s.vy)) * s.tail;
        const ty = s.y - (s.vy / Math.hypot(s.vx, s.vy)) * s.tail;
        const grad = ctx.createLinearGradient(tx, ty, s.x, s.y);
        grad.addColorStop(0, `rgba(${color}, 0)`);
        grad.addColorStop(1, `rgba(${color}, ${s.alpha})`);
        ctx.strokeStyle = grad;
        ctx.lineWidth = 1.6;
        ctx.beginPath();
        ctx.moveTo(tx, ty);
        ctx.lineTo(s.x, s.y);
        ctx.stroke();

        // head
        ctx.fillStyle = `rgba(${color}, ${s.alpha})`;
        ctx.beginPath();
        ctx.arc(s.x, s.y, 1.6, 0, Math.PI * 2);
        ctx.fill();

        if (s.x > w + 60 || s.y > h + 60) {
          stars.splice(i, 1);
        }
      }

      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("resize", seedIdle);
    };
  }, [intensity, color]);

  return (
    <canvas
      ref={canvasRef}
      className="shooting-stars-canvas"
      style={{
        position,
        zIndex,
        mixBlendMode: blendMode as React.CSSProperties["mixBlendMode"],
      }}
      aria-hidden="true"
      data-testid="shooting-stars"
    />
  );
};

export default ShootingStars;
