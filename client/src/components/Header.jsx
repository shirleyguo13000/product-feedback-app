import hamburgerIcon from "../assets/icons/mobile/icon-hamburger.svg";
import closeIcon from "../assets/icons/mobile/icon-close.svg";
import "./Header.css";

// The "My Company" / "Feedback Board" gradient card. On mobile it also
// hosts the hamburger/close toggle for the CategoryFilter + RoadmapSummary
// overlay (owned by Sidebar, which renders this component).
function Header({ isMobileMenuOpen, onToggleMobileMenu }) {
  return (
    <div className="header-card">
      <div>
        <p className="header-title">My Company</p>
        <p className="header-subtitle">Feedback Board</p>
      </div>
      <button
        type="button"
        className="header-menu-button"
        onClick={onToggleMobileMenu}
        aria-expanded={isMobileMenuOpen}
        aria-controls="sidebar-panels"
        aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
      >
        <img src={isMobileMenuOpen ? closeIcon : hamburgerIcon} alt="" />
      </button>
    </div>
  );
}

export default Header;
