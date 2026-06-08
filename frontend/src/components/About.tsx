import "./styles/About.css";

const About = () => {
  return (
    <div className="about-section" id="about">
      <div className="about-me">
        <h3 className="title">About Me</h3>
        <p className="para">
          Hi, I'm Sarika Rajput — an Electronics and Computer Engineer based in
          Verna, Goa. I love living at the intersection of hardware and software:
          one day I'm wiring up ESP32 sensors and training ML models for
          aquaculture farms, the next I'm shipping a full-stack web app or
          writing Verilog for an FPGA. I build with curiosity, care, and a
          slightly obsessive eye for clean systems — and yes, I think in chess
          moves more often than I should.
        </p>
      </div>
    </div>
  );
};

export default About;
