
import { useState } from "react";
import { Link, NavLink } from "react-router";
import { Menu, X, ArrowRight } from "lucide-react";

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "About Us", path: "/about" },
  ];

  const closeMenu = () => setIsOpen(false);

  return (
    <header className="public-navbar">
      <nav className="navbar-container">

        {/* LOGO */}
        <Link to="/" className="navbar-logo" onClick={closeMenu}>
          Skill<span>Up</span>
          <div className="navbar-logo-dot" />
        </Link>

        {/* DESKTOP NAVIGATION */}
        <div className="navbar-links">
          {navLinks.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              end={link.path === "/"}
              className={({ isActive }) =>
                `navbar-link ${isActive ? "active" : ""}`
              }
            >
              {link.name}
            </NavLink>
          ))}
        </div>

        {/* DESKTOP ACTIONS */}
        <div className="navbar-actions">

          <Link to="/login" className="navbar-login">
            Login
          </Link>

          <Link to="/register" className="navbar-cta">
            Create Account
            <ArrowRight size={16} />
          </Link>

        </div>

        {/* MOBILE TOGGLE */}
        <button
          className="navbar-menu-toggle"
          onClick={() => setIsOpen(!isOpen)}
          aria-label={isOpen ? "Fermer le menu" : "Ouvrir le menu"}
          aria-expanded={isOpen}
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

      </nav>

      {/* MOBILE NAVIGATION */}
      <div className={`mobile-menu ${isOpen ? "open" : ""}`}>

        {navLinks.map((link) => (
          <NavLink
            key={link.path}
            to={link.path}
            end={link.path === "/"}
            onClick={closeMenu}
            className={({ isActive }) =>
              `mobile-menu-link ${isActive ? "active" : ""}`
            }
          >
            {link.name}
          </NavLink>
        ))}

        <Link
          to="/login"
          className="mobile-menu-link"
          onClick={closeMenu}
        >
          Login
        </Link>

        <Link
          to="/about"
          className="mobile-menu-cta"
          onClick={closeMenu}
        >
          Get Started <ArrowRight size={16} />
        </Link>
        <Link
          to="/register"
          className="mobile-menu-cta"
          onClick={closeMenu}
        >
          Create Account <ArrowRight size={16} />
        </Link>

      </div>
    </header>
  );
}

export default Navbar;
