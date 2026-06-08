import "./styles/Career.css";

const Career = () => {
  return (
    <div className="career-section section-container">
      <div className="career-container">
        <h2>
          My career <span>&</span>
          <br /> experience
        </h2>
        <div className="career-info">
          <div className="career-timeline">
            <div className="career-dot"></div>
          </div>
          <div className="career-info-box">
            <div className="career-info-in">
              <div className="career-role">
                <h4>VLSI / FPGA Intern</h4>
                <h5>SprintM Technologies Pvt Ltd, Goa</h5>
              </div>
              <h3>2025</h3>
            </div>
            <p>
              Designed and implemented digital logic modules in Verilog/VHDL for
              FPGA platforms using modular, OOP-equivalent hardware design
              principles. Built image-processing hardware blocks and ran
              end-to-end simulation, debugging, and hardware verification —
              cutting simulation-error cycles through iterative modular test
              cases.
            </p>
          </div>
          <div className="career-info-box">
            <div className="career-info-in">
              <div className="career-role">
                <h4>Process Planning Intern — IIoT & Edge Analytics</h4>
                <h5>Siemens Ltd, MV2 Plant, Verna, Goa</h5>
              </div>
              <h3>2025</h3>
            </div>
            <p>
              Deployed AI-based predictive maintenance using Siemens neural
              network models (FRA & DTA) on RMU assembly lines to flag
              anomalies. Built MQTT industrial data pipelines in Node-RED across
              edge devices and shipped a Grafana ENMS dashboard mapping 15+ live
              energy KPIs onto the factory floor plan for ISO 50001 audit
              compliance.
            </p>
          </div>
          <div className="career-info-box">
            <div className="career-info-in">
              <div className="career-role">
                <h4>Capstone Researcher & Freelance Developer</h4>
                <h5>Independent · Goa, India</h5>
              </div>
              <h3>NOW</h3>
            </div>
            <p>
              Currently leading a GIS-based Smart Aquaculture Management System
              capstone (ESP32 + ML + Firebase + GIS dashboard) and shipping
              freelance full-stack web platforms for college departments and
              student communities. Always tinkering — hardware, software, and
              the occasional chess opening.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Career;
