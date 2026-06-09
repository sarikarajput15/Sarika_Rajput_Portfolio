import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useLoading } from "../../context/LoadingProvider";
import { setProgress } from "../Loading";
import { setAllTimeline } from "../utils/GsapScroll";
import "./styles/CharacterImageScene.css";

gsap.registerPlugin(ScrollTrigger);

const FRONT_SRC = "/images/character-front.png";
const LAPTOP_SRC = "/images/character-laptop.png";

function preload(src: string): Promise<void> {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve();
    img.onerror = () => resolve();
    img.src = src;
  });
}

const CharacterImageScene = () => {
  const stageRef = useRef<HTMLDivElement | null>(null);
  const frontRef = useRef<HTMLImageElement | null>(null);
  const laptopRef = useRef<HTMLImageElement | null>(null);
  const tiltLayerRef = useRef<HTMLDivElement | null>(null);
  const { setLoading } = useLoading();

  // Preload + signal loading complete
  useEffect(() => {
    const progress = setProgress((v) => setLoading(v));
    Promise.all([preload(FRONT_SRC), preload(LAPTOP_SRC)]).then(() => {
      progress.loaded();
    });
  }, [setLoading]);

  // Mouse parallax tilt (subtle, max 6° X / 8° Y)
  useEffect(() => {
    const layer = tiltLayerRef.current;
    if (!layer) return;

    let targetX = 0;
    let targetY = 0;
    let currentX = 0;
    let currentY = 0;
    let rafId = 0;

    const onMouseMove = (e: MouseEvent) => {
      const x = e.clientX / window.innerWidth - 0.5; // -0.5 .. 0.5
      const y = e.clientY / window.innerHeight - 0.5;
      targetX = -y * 6; // rotateX
      targetY = x * 8; // rotateY
    };

    const loop = () => {
      currentX += (targetX - currentX) * 0.08;
      currentY += (targetY - currentY) * 0.08;
      layer.style.transform = `perspective(1200px) rotateX(${currentX.toFixed(2)}deg) rotateY(${currentY.toFixed(2)}deg)`;
      rafId = requestAnimationFrame(loop);
    };
    rafId = requestAnimationFrame(loop);

    window.addEventListener("mousemove", onMouseMove);
    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("mousemove", onMouseMove);
    };
  }, []);

  // Scroll-driven scene timeline (mimics original 3D character scroll feel)
  useEffect(() => {
    const front = frontRef.current;
    const laptop = laptopRef.current;
    if (!front || !laptop) return;

    // Initial pose
    gsap.set(front, { autoAlpha: 1, scale: 1, x: 0, y: 0, rotate: 0 });
    gsap.set(laptop, { autoAlpha: 0, scale: 0.7, x: "10%", y: "20%", rotate: 8 });
    gsap.set(".character-rim", { opacity: 0 });

    // Fire entry effect
    gsap.fromTo(
      ".character-rim",
      { opacity: 0, scale: 0.6 },
      {
        opacity: 1,
        scale: 1.4,
        duration: 1.6,
        ease: "power2.out",
        delay: 0.3,
      }
    );

    const isDesktop = window.innerWidth > 1024;

    const tl1 = gsap.timeline({
      scrollTrigger: {
        trigger: ".landing-section",
        start: "top top",
        end: "bottom top",
        scrub: true,
        invalidateOnRefresh: true,
      },
    });

    if (isDesktop) {
      tl1
        .to(front, { x: "-18%", scale: 0.96, rotate: -3, duration: 1 }, 0)
        .to(".landing-container", { opacity: 0, duration: 0.4 }, 0)
        .to(".landing-container", { y: "40%", duration: 0.8 }, 0)
        .fromTo(".about-me", { y: "-50%" }, { y: "0%" }, 0);
    } else {
      tl1
        .to(front, { scale: 0.9, duration: 1 }, 0)
        .to(".landing-container", { opacity: 0, duration: 0.4 }, 0);
    }

    const tl2 = gsap.timeline({
      scrollTrigger: {
        trigger: ".about-section",
        start: "center 55%",
        end: "bottom top",
        scrub: true,
        invalidateOnRefresh: true,
      },
    });

    if (isDesktop) {
      tl2
        .to(".about-section", { y: "30%", duration: 6 }, 0)
        .to(".about-section", { opacity: 0, delay: 3, duration: 2 }, 0)
        // crossfade: front shrinks/rotates out, laptop fades in on the LEFT
        .to(
          front,
          { autoAlpha: 0, scale: 0.7, rotate: -8, x: "-25%", duration: 4, delay: 2 },
          0
        )
        .to(
          laptop,
          {
            autoAlpha: 1,
            scale: 0.8,
            rotate: 0,
            x: "-30%",
            y: "5%",
            duration: 5,
            delay: 2.5,
            ease: "power2.out",
          },
          0
        )
        .fromTo(
          ".what-box-in",
          { display: "none" },
          { display: "flex", duration: 0.1, delay: 6 },
          0
        )
        .fromTo(
          ".character-rim",
          { opacity: 1, scale: 1.4 },
          { opacity: 0, scale: 0, y: "-70%", duration: 5, delay: 2 },
          0.3
        );
    } else {
      // mobile: simpler crossfade, no big section translations
      tl2
        .to(front, { autoAlpha: 0, scale: 0.8, duration: 3 }, 0)
        .to(laptop, { autoAlpha: 1, scale: 0.9, y: 0, x: 0, duration: 3, delay: 0.5 }, 0);
    }

    const tl3 = gsap.timeline({
      scrollTrigger: {
        trigger: ".whatIDO",
        start: "top top",
        end: "bottom top",
        scrub: true,
        invalidateOnRefresh: true,
      },
    });

    if (isDesktop) {
      tl3
        .to(
          laptop,
          {
            y: "-80%",
            x: "-50%",
            scale: 0.55,
            autoAlpha: 0,
            duration: 4,
            ease: "power2.in",
          },
          0
        )
        .fromTo(".whatIDO", { y: 0 }, { y: "15%", duration: 2 }, 0);
    } else {
      tl3.to(laptop, { y: "-40%", autoAlpha: 0, duration: 4 }, 0);
    }

    // career section timeline (used to live inside loadCharacter callback)
    setAllTimeline();

    // Reveal "What I Do" card content when entering that section.
    // (Original template did this via CSS keyframe + display toggle, but with
    // parent display:none the animation gets lost; explicit ST is reliable.)
    gsap.set(".what-content-in", { opacity: 0 });
    const cardsReveal = gsap.to(".what-content-in", {
      opacity: 1,
      stagger: 0.15,
      duration: 0.6,
      ease: "power2.out",
      scrollTrigger: {
        trigger: ".whatIDO",
        start: "top 75%",
        toggleActions: "play none none reverse",
      },
    });

    // floating idle animation on whichever image is visible
    const float = gsap.to([front, laptop], {
      y: "+=10",
      duration: 2.8,
      ease: "sine.inOut",
      yoyo: true,
      repeat: -1,
    });

    return () => {
      tl1.kill();
      tl2.kill();
      tl3.kill();
      float.kill();
      cardsReveal.kill();
    };
  }, []);

  return (
    <div className="character-container" data-testid="character-scene">
      <div className="character-model" ref={stageRef}>
        <div className="character-rim"></div>
        <div className="character-depth character-depth-1"></div>
        <div className="character-depth character-depth-2"></div>
        <div className="character-particles" aria-hidden="true">
          {Array.from({ length: 18 }).map((_, i) => (
            <span
              key={i}
              style={{
                left: `${(i * 53) % 100}%`,
                top: `${(i * 37) % 100}%`,
                animationDelay: `${(i % 6) * 0.5}s`,
                animationDuration: `${4 + (i % 4)}s`,
              }}
            />
          ))}
        </div>
        <div className="character-tilt-layer" ref={tiltLayerRef}>
          <img
            ref={frontRef}
            src={FRONT_SRC}
            alt="Sarika — illustrated portrait"
            className="character-img character-img-front"
            draggable={false}
            data-testid="character-front-img"
          />
          <img
            ref={laptopRef}
            src={LAPTOP_SRC}
            alt="Sarika working at her laptop"
            className="character-img character-img-laptop"
            loading="lazy"
            draggable={false}
            data-testid="character-laptop-img"
          />
        </div>
        <div className="character-floor"></div>
      </div>
    </div>
  );
};

export default CharacterImageScene;
