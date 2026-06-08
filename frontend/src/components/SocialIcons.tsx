import { FaGithub, FaLinkedinIn, FaEnvelope } from "react-icons/fa6";
import "./styles/SocialIcons.css";
import { TbChessKnight } from "react-icons/tb";
import { useEffect } from "react";
import HoverLinks from "./HoverLinks";

const SocialIcons = () => {
  useEffect(() => {
    const social = document.getElementById("social") as HTMLElement;

    social.querySelectorAll("span").forEach((item) => {
      const elem = item as HTMLElement;
      const link = elem.querySelector("a") as HTMLElement;

      const rect = elem.getBoundingClientRect();
      let mouseX = rect.width / 2;
      let mouseY = rect.height / 2;
      let currentX = 0;
      let currentY = 0;

      const updatePosition = () => {
        currentX += (mouseX - currentX) * 0.1;
        currentY += (mouseY - currentY) * 0.1;

        link.style.setProperty("--siLeft", `${currentX}px`);
        link.style.setProperty("--siTop", `${currentY}px`);

        requestAnimationFrame(updatePosition);
      };

      const onMouseMove = (e: MouseEvent) => {
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        if (x < 40 && x > 10 && y < 40 && y > 5) {
          mouseX = x;
          mouseY = y;
        } else {
          mouseX = rect.width / 2;
          mouseY = rect.height / 2;
        }
      };

      document.addEventListener("mousemove", onMouseMove);

      updatePosition();

      return () => {
        elem.removeEventListener("mousemove", onMouseMove);
      };
    });
  }, []);

  const openChess = () => {
    const evt = new CustomEvent("open-chess-game");
    window.dispatchEvent(evt);
  };

  return (
    <div className="icons-section">
      <div className="social-icons" data-cursor="icons" id="social">
        <span>
          <a
            href="https://github.com/sarikarajput15"
            target="_blank"
            rel="noreferrer"
            data-testid="social-github"
          >
            <FaGithub />
          </a>
        </span>
        <span>
          <a
            href="https://linkedin.com/in/sarikarajput"
            target="_blank"
            rel="noreferrer"
            data-testid="social-linkedin"
          >
            <FaLinkedinIn />
          </a>
        </span>
        <span>
          <a href="mailto:sarika15rajput@gmail.com" data-testid="social-email">
            <FaEnvelope />
          </a>
        </span>
      </div>
      <button
        className="resume-button"
        onClick={openChess}
        data-cursor="disable"
        data-testid="open-chess-btn"
        type="button"
      >
        <HoverLinks text="PLAY CHESS" />
        <span>
          <TbChessKnight />
        </span>
      </button>
    </div>
  );
};

export default SocialIcons;
