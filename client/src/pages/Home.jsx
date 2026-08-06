import { useEffect, useMemo, useState } from "react";
import Sidebar from "../components/Sidebar";
import Toolbar from "../components/Toolbar";
import SuggestionCard from "../components/SuggestionCard";
import EmptyState from "../components/EmptyState";
import { getAllSuggestions, getSuggestionsByCategory } from "../api/suggestions";
import "./Home.css";

// Static placeholder until a status-summary endpoint exists - the current
// API only ever returns status='Suggestion' rows (PRD.md Section 7, "Full
// Roadmap page" is out of scope). Matches the seed counts in
// database-schema.sql exactly.
const ROADMAP_COUNTS = { Planned: 2, "In-Progress": 3, Live: 1 };

function sortSuggestions(suggestions, sortOption) {
  const sorted = [...suggestions];
  switch (sortOption) {
    case "Least Upvotes":
      return sorted.sort((a, b) => a.upvotes - b.upvotes);
    case "Most Comments":
      return sorted.sort((a, b) => b.comment_count - a.comment_count);
    case "Least Comments":
      return sorted.sort((a, b) => a.comment_count - b.comment_count);
    case "Most Upvotes":
    default:
      return sorted.sort((a, b) => b.upvotes - a.upvotes);
  }
}

function Home() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [sortOption, setSortOption] = useState("Most Upvotes");
  const [suggestions, setSuggestions] = useState([]);
  const [status, setStatus] = useState("loading"); // loading | error | ready
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let ignore = false;
    setStatus("loading");

    const request =
      activeCategory === "All"
        ? getAllSuggestions()
        : getSuggestionsByCategory(activeCategory);

    request
      .then((data) => {
        if (ignore) return;
        setSuggestions(data);
        setStatus("ready");
      })
      .catch(() => {
        if (ignore) return;
        setStatus("error");
      });

    return () => {
      ignore = true;
    };
  }, [activeCategory, reloadKey]);

  const sortedSuggestions = useMemo(
    () => sortSuggestions(suggestions, sortOption),
    [suggestions, sortOption]
  );

  return (
    <div className="home-layout">
      <Sidebar
        activeCategory={activeCategory}
        onCategoryChange={setActiveCategory}
        roadmapCounts={ROADMAP_COUNTS}
      />

      <main className="home-main">
        <Toolbar
          count={sortedSuggestions.length}
          sortOption={sortOption}
          onSortChange={setSortOption}
        />

        {status === "loading" && <p className="home-status">Loading suggestions…</p>}

        {status === "error" && (
          <div className="home-status home-status--error">
            <p>Something went wrong loading suggestions.</p>
            <button type="button" onClick={() => setReloadKey((key) => key + 1)}>
              Retry
            </button>
          </div>
        )}

        {status === "ready" && sortedSuggestions.length === 0 && <EmptyState />}

        {status === "ready" && sortedSuggestions.length > 0 && (
          <div className="suggestion-list">
            {sortedSuggestions.map((suggestion) => (
              <SuggestionCard key={suggestion.id} suggestion={suggestion} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

export default Home;
