import { useState, useMemo } from "react";
import { TbChessKnight, TbRefresh } from "react-icons/tb";
import { gkFacts, dailyQuote } from "../data/gkFacts";
import "./styles/GKFacts.css";

const GKFacts = () => {
  const initialIndex = useMemo(() => {
    const day = Math.floor(Date.now() / (1000 * 60 * 60 * 24));
    return day % gkFacts.length;
  }, []);
  const [index, setIndex] = useState(initialIndex);

  const next = () => {
    setIndex((prev) => (prev + 1) % gkFacts.length);
  };

  const current = gkFacts[index];

  return (
    <section className="gk-section section-container" data-testid="gk-facts-section">
      <div className="gk-grid">
        <div className="gk-quote">
          <TbChessKnight className="gk-knight" />
          <p className="gk-quote-text" data-testid="gk-quote">
            {dailyQuote}
          </p>
        </div>
        <div className="gk-card" data-testid="gk-card">
          <div className="gk-card-head">
            <span className="gk-card-label">Daily GK Fact</span>
            <span className="gk-card-tag" data-testid="gk-category">
              {current.category}
            </span>
          </div>
          <p className="gk-card-fact" data-testid="gk-fact-text">
            {current.fact}
          </p>
          <button
            className="gk-card-btn"
            onClick={next}
            data-cursor="disable"
            data-testid="gk-next-btn"
            type="button"
          >
            <TbRefresh /> Another fact
          </button>
        </div>
      </div>
    </section>
  );
};

export default GKFacts;
