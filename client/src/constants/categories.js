// The five closed category values, matching the suggestion_category enum in
// database-schema.sql. Kept in one place because the Home page filter chips
// and the AddFeedback category dropdown use two *different* display orders
// (verified against the Figma screenshots), both derived from this list.

// Order used by the Home page filter chips: All, UI, UX, Enhancement, Bug, Feature
export const FILTER_CATEGORIES = ["All", "UI", "UX", "Enhancement", "Bug", "Feature"];

// Order used by the AddFeedback category dropdown: Feature (default), UI, UX, Enhancement, Bug
export const FORM_CATEGORIES = ["Feature", "UI", "UX", "Enhancement", "Bug"];
