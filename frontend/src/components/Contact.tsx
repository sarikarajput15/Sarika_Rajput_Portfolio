import { MdArrowOutward, MdCopyright } from "react-icons/md";
import "./styles/Contact.css";

const Contact = () => {
  return (
    <div className="contact-section section-container" id="contact">
      <div className="contact-container">
        <h3>Contact</h3>
        <div className="contact-flex">
          <div className="contact-box">
            <h4>Email</h4>
            <p>
              <a
                href="mailto:sarika15rajput@gmail.com"
                data-cursor="disable"
                data-testid="contact-email"
              >
                sarika15rajput@gmail.com
              </a>
            </p>
            <h4>Location</h4>
            <p>Verna, Goa, India</p>
          </div>
          <div className="contact-box">
            <h4>Social</h4>
            <a
              href="https://github.com/sarikarajput15"
              target="_blank"
              rel="noreferrer"
              data-cursor="disable"
              className="contact-social"
              data-testid="contact-github"
            >
              GitHub <MdArrowOutward />
            </a>
            <a
              href="https://linkedin.com/in/sarikarajput"
              target="_blank"
              rel="noreferrer"
              data-cursor="disable"
              className="contact-social"
              data-testid="contact-linkedin"
            >
              LinkedIn <MdArrowOutward />
            </a>
            <a
              href="mailto:sarika15rajput@gmail.com"
              data-cursor="disable"
              className="contact-social"
              data-testid="contact-email-link"
            >
              Email <MdArrowOutward />
            </a>
          </div>
          <div className="contact-box">
            <h2>
              Designed & Developed <br /> by <span>Sarika Rajput</span>
            </h2>
            <h5>
              <MdCopyright /> {new Date().getFullYear()}
            </h5>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
