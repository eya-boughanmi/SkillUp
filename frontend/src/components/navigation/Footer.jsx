
import { Link } from "react-router";

function Footer() {
  return (
    <footer className="public-footer">
      <div className="footer-container">

        <div className="footer-main">

          {/* Brand */}
          <div className="footer-brand">
            <Link to="/" className="footer-logo">
              Skill<span>Up</span>.
            </Link>

            <p>
              Find your talent. Build your future.
              Connecting people with opportunities
              through smarter recruitment.
            </p>
          </div>

          {/* Platform */}
          <div className="footer-column">
            <h3>Platform</h3>
            <Link to="/">Home</Link>
            <Link to="/about">About Us</Link>
          </div>

          {/* Get Started */}
          <div className="footer-column">
            <h3>Get Started</h3>
            <Link to="/about">Discover SkillUp</Link>
          </div>

          {/* Social Media */}
          <div className="footer-column">
            <h3>Follow Us</h3>

            <a
              href="https://www.linkedin.com/"
              target="_blank"
              rel="noopener noreferrer"
            >
              <span aria-hidden="true">in</span>
              LinkedIn
            </a>

            <a
              href="https://github.com/"
              target="_blank"
              rel="noopener noreferrer"
            >
              <span aria-hidden="true">GH</span>
              GitHub
            </a>
          </div>

        </div>

        {/* Footer Bottom */}
        <div className="footer-bottom">
          <p>
            © {new Date().getFullYear()} SkillUp.
            All rights reserved.
          </p>

          <Link to="/" className="footer-back-top">
            Back to top <span aria-hidden="true">↗</span>
          </Link>
        </div>

      </div>
    </footer>
  );
}

export default Footer;
