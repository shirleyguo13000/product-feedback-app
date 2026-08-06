import arrowUp from "../assets/icons/icon-arrow-up.svg";
import commentsIcon from "../assets/icons/icon-comments.svg";
import "./SuggestionCard.css";

// PRD.md Section 2.1.4: upvote pill is display-only (no onClick - it is
// not wired up to anything in this phase), title/description are static,
// one category tag, comment count on the right.
function SuggestionCard({ suggestion }) {
  const { title, description, category, upvotes, comment_count: commentCount } = suggestion;

  return (
    <article className="suggestion-card">
      <div className="suggestion-upvotes" aria-label={`${upvotes} upvotes`}>
        <img src={arrowUp} alt="" aria-hidden="true" />
        <span aria-hidden="true">{upvotes}</span>
      </div>

      <div className="suggestion-body">
        <h3 className="suggestion-title">{title}</h3>
        <p className="suggestion-description">{description}</p>
        <span className="suggestion-tag">{category}</span>
      </div>

      <div className="suggestion-comments" aria-label={`${commentCount} comments`}>
        <img src={commentsIcon} alt="" aria-hidden="true" />
        <span aria-hidden="true">{commentCount}</span>
      </div>
    </article>
  );
}

export default SuggestionCard;
