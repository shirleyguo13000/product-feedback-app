import { Link } from "react-router-dom";
import illustration from "../assets/suggestions/illustration-empty.svg";
import "./EmptyState.css";

// PRD.md Section 2.1.6.
function EmptyState() {
  return (
    <div className="empty-state">
      <img src={illustration} alt="" aria-hidden="true" />
      <h2>There is no feedback yet.</h2>
      <p>
        Got a suggestion? Found a bug that needs to be squashed? We love hearing about new
        ideas to improve our app.
      </p>
      <Link to="/add-feedback" className="pill-button pill-button-purple">
        + Add Feedback
      </Link>
    </div>
  );
}

export default EmptyState;
