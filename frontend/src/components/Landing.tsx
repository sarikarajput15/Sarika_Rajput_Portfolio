import { PropsWithChildren } from "react";
import "./styles/Landing.css";
import ShootingStars from "./ShootingStars";

const Landing = ({ children }: PropsWithChildren) => {
  return (
    <>
      <div className="landing-section" id="landingDiv">
        <ShootingStars
          intensity={2.5}
          color="194, 164, 255"
          position="absolute"
          zIndex={0}
          blendMode="screen"
        />
        <div className="landing-container">
          <div className="landing-intro">
            <h2>Hello! I'm</h2>
            <h1>
              SARIKA
              <br />
              <span>RAJPUT</span>
            </h1>
          </div>
          <div className="landing-info">
            <h3>Electronics &</h3>
            <h2 className="landing-info-h2">
              <div className="landing-h2-1">Computer</div>
              <div className="landing-h2-2">Engineer</div>
            </h2>
            <h2>
              <div className="landing-h2-info">Engineer</div>
              <div className="landing-h2-info-1">Computer</div>
            </h2>
          </div>
        </div>
        {children}
      </div>
    </>
  );
};

export default Landing;
