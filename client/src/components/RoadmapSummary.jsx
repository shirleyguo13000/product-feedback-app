import "./RoadmapSummary.css";

const STATUSES = [
  { key: "Planned", colorVar: "--color-orange" },
  { key: "In-Progress", colorVar: "--color-purple" },
  { key: "Live", colorVar: "--color-lightblue" },
];

// Static counts panel. There is currently no endpoint that returns
// non-'Suggestion'-status rows (see PRD.md Section 7 - the full Roadmap
// page is out of scope), so `counts` is a hardcoded placeholder passed in
// from Home.jsx rather than fetched. The "View" link is present per the
// design but intentionally inert (PRD.md Section 2.1.5).
function RoadmapSummary({ counts }) {
  return (
    <div className="roadmap-summary">
      <div className="roadmap-summary-header">
        <h4>Roadmap</h4>
        <span className="roadmap-view-link" aria-disabled="true">
          View
        </span>
      </div>
      <ul className="roadmap-list">
        {STATUSES.map(({ key, colorVar }) => (
          <li key={key}>
            <span
              className="roadmap-dot"
              style={{ backgroundColor: `var(${colorVar})` }}
              aria-hidden="true"
            />
            <span className="roadmap-label">{key}</span>
            <span className="roadmap-count">{counts[key] ?? 0}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default RoadmapSummary;
