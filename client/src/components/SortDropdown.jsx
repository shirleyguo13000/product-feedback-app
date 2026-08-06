import { useEffect, useRef, useState } from "react";
import arrowDown from "../assets/icons/icon-arrow-down.svg";
import checkIcon from "../assets/icons/icon-check.svg";
import "./SortDropdown.css";

const SORT_OPTIONS = ["Most Upvotes", "Least Upvotes", "Most Comments", "Least Comments"];

// PRD.md Section 2.1.3: toggles open/closed, chevron flips, checkmark on
// the active option, closes on an outside click without changing selection.
function SortDropdown({ value, onChange }) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    function handleOutsideClick(event) {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  function handleSelect(option) {
    onChange(option);
    setIsOpen(false);
  }

  return (
    <div className="sort-dropdown" ref={containerRef}>
      <button
        type="button"
        className="sort-dropdown-trigger"
        onClick={() => setIsOpen((open) => !open)}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        <span>
          Sort by : <strong>{value}</strong>
        </span>
        <img
          src={arrowDown}
          alt=""
          className={isOpen ? "sort-dropdown-arrow sort-dropdown-arrow--open" : "sort-dropdown-arrow"}
        />
      </button>

      {isOpen && (
        <ul className="sort-dropdown-menu" role="listbox">
          {SORT_OPTIONS.map((option) => (
            <li key={option} role="option" aria-selected={option === value}>
              <button type="button" onClick={() => handleSelect(option)}>
                {option}
                {option === value && <img src={checkIcon} alt="" />}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default SortDropdown;
