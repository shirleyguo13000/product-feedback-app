import { FILTER_CATEGORIES } from "../constants/categories";
import "./CategoryFilter.css";

// Single-select category chips. Exactly one is active at a time (PRD.md
// Section 2.1.2).
function CategoryFilter({ activeCategory, onSelect }) {
  return (
    <div className="category-filter">
      {FILTER_CATEGORIES.map((category) => (
        <button
          key={category}
          type="button"
          className={`category-chip${
            category === activeCategory ? " category-chip--active" : ""
          }`}
          aria-pressed={category === activeCategory}
          onClick={() => onSelect(category)}
        >
          {category}
        </button>
      ))}
    </div>
  );
}

export default CategoryFilter;
