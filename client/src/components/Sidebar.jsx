import { useState } from "react";
import Header from "./Header";
import CategoryFilter from "./CategoryFilter";
import RoadmapSummary from "./RoadmapSummary";
import "./Sidebar.css";

// Composes Header + CategoryFilter + RoadmapSummary. On mobile widths,
// CategoryFilter/RoadmapSummary are hidden until the hamburger is tapped,
// then shown as an overlay with a dismissible backdrop (PRD.md Section
// 2.1.8). On tablet/desktop the CSS always shows them inline regardless of
// this open/closed state.
function Sidebar({ activeCategory, onCategoryChange, roadmapCounts }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  function handleSelectCategory(category) {
    onCategoryChange(category);
    setIsMobileMenuOpen(false);
  }

  return (
    <div className="sidebar">
      <Header
        isMobileMenuOpen={isMobileMenuOpen}
        onToggleMobileMenu={() => setIsMobileMenuOpen((open) => !open)}
      />

      <div
        id="sidebar-panels"
        className={`sidebar-panels${isMobileMenuOpen ? " sidebar-panels--open" : ""}`}
      >
        <CategoryFilter activeCategory={activeCategory} onSelect={handleSelectCategory} />
        <RoadmapSummary counts={roadmapCounts} />
      </div>

      {isMobileMenuOpen && (
        <button
          type="button"
          className="sidebar-backdrop"
          aria-label="Close menu"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
    </div>
  );
}

export default Sidebar;
