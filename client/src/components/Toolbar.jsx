import { Link } from "react-router-dom";
import lightbulbIcon from "../assets/suggestions/icon-suggestions.svg";
import SortDropdown from "./SortDropdown";
import "./Toolbar.css";

// PRD.md Section 2.1: lightbulb + "N Suggestions" count (visually hidden on
// mobile, per the design - see Toolbar.css), the sort dropdown, and the
// "+ Add Feedback" entry point.
function Toolbar({ count, sortOption, onSortChange }) {
  return (
    <div className="toolbar">
      <div className="toolbar-count">
        <img src={lightbulbIcon} alt="" aria-hidden="true" />
        <span>{count} Suggestions</span>
      </div>

      <SortDropdown value={sortOption} onChange={onSortChange} />

      <Link to="/add-feedback" className="pill-button pill-button-purple">
        + Add Feedback
      </Link>
    </div>
  );
}

export default Toolbar;
