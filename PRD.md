# Product Requirements Document: Product Feedback App


---

## 1. Overview

"My Company" is a startup that wants a lightweight way for customers to tell them how to make their product better. This PRD covers the **Product Feedback App**: a web app where customers can browse suggestions other customers have submitted, filter them by category, and submit their own feedback.

**Who it's for:**
- **Customers / end users** — the primary audience. They visit the feedback board to see what others have suggested and to add their own ideas (bug reports, feature requests, UI/UX complaints, etc.).
- **My Company's product team** — the indirect audience. They read the board to prioritize what to build next. (A dedicated internal/admin view is not part of this phase — see [Out of Scope](#7-out-of-scope).)

**What it does:**
- Displays a list of feedback "suggestions" submitted by customers, each with a title, description, category tag, upvote count, and comment count.
- Lets customers filter suggestions by category and sort them.
- Lets customers submit new feedback via a simple form.

This is a two-page MVP: a **Home** page (browse/filter/sort) and an **Add Feedback** page (submit new feedback). Everything else visible in the Figma file (comments, upvoting persistence, editing, the full Roadmap page) is explicitly out of scope for this phase — see Section 7.

---

## 2. Pages & User Flows

### 2.1 Home Page (`/`)

The Home page is the main feedback board. Layout is a two-column desktop layout (sidebar + content) that collapses responsively (see [Section 6](#6-design-reference--responsive-behavior)).

**Layout components:**

| Region | Contents |
|---|---|
| Header card | "My Company" / "Feedback Board" gradient card (static branding, top-left) |
| Category panel | Filter chips: `All`, `UI`, `UX`, `Enhancement`, `Bug`, `Feature` |
| Roadmap summary panel | Counts of suggestions by status: `Planned`, `In-Progress`, `Live`, each with a colored dot (orange/purple/blue respectively) |
| Toolbar (dark bar) | Lightbulb icon + "`N` Suggestions" count, "Sort by" dropdown, "+ Add Feedback" button |
| Suggestion list | One card per suggestion, or an empty state if none match the current filter |

**Interactions, spelled out:**

1. **Initial load**
   - On mount, the page calls `GET /get-all-suggestions` (see [Section 4](#4-api-endpoints)).
   - While loading, show a lightweight loading indicator in place of the list (spinner or skeleton cards) — no specific design was provided for this state, so any unobtrusive treatment is acceptable.
   - If the request fails, show an inline error message in the list area with a "Retry" action. No specific design was provided for this state either.

2. **Category filtering**
   - Chips: `All` (default, selected on load), `UI`, `UX`, `Enhancement`, `Bug`, `Feature`. Exactly one chip is active at a time (single-select).
   - Clicking `All` calls `GET /get-all-suggestions` and shows every suggestion.
   - Clicking any other chip calls `GET /get-suggestions-by-category/{category}` and replaces the list with only that category's suggestions.
   - The active chip is visually highlighted (solid indigo fill per design system); inactive chips use the light lavender fill.
   - The suggestion count in the toolbar ("`N` Suggestions") always reflects the count of the **currently filtered** list, not the total.
   - Switching filters resets any active sort back to applying against the new list (see below) — the selected sort order is preserved across filter changes.

3. **Sorting**
   - "Sort by" dropdown in the toolbar, default value **Most Upvotes**. Options: `Most Upvotes`, `Least Upvotes`, `Most Comments`, `Least Comments`.
   - Clicking the dropdown toggles it open (chevron flips from down to up); clicking a menu item selects it, closes the menu, and re-sorts the currently displayed list. A checkmark marks the active option.
   - Sorting is done client-side against whatever list is currently loaded (there is no dedicated sort endpoint — see [Section 4](#4-api-endpoints)):
     - `Most Upvotes` — descending by `upvotes`
     - `Least Upvotes` — ascending by `upvotes`
     - `Most Comments` — descending by `comment_count`
     - `Least Comments` — ascending by `comment_count`
   - Clicking outside an open dropdown closes it without changing the selection.

4. **Suggestion cards**
   - Each card shows: upvote count in a pill button (with a chevron-up icon above the number), title (bold), description (one or two lines), one category tag (pill, lavender background), and a comment-count indicator (speech-bubble icon + number) on the right.
   - The upvote pill is **display-only in this phase** — see [Section 7](#7-out-of-scope). It is not clickable/does not increment.
   - Clicking anywhere on a card's title/description (outside the upvote pill) is **out of scope in this phase** — there is no Feedback Detail page to navigate to yet (see Section 7). Cards are static/read-only content in v1.
   - Cards render in the order returned by the current sort; no pagination — all suggestions in the active filter load at once.

5. **Roadmap summary panel**
   - Displays static counts of how many suggestions currently have status `Planned`, `In-Progress`, and `Live`, computed client-side from the full suggestion set (i.e., from `GET /get-all-suggestions`, independent of the active category filter).
   - The "View" link next to "Roadmap" is present per the design but **does not navigate anywhere in this phase** — the full Roadmap page is out of scope (Section 7). Render it as a disabled/inert link, or omit the link and keep only the "Roadmap" label with counts — either is acceptable.
   - Suggestions with status other than `Suggestion` (i.e., `Planned`, `In-Progress`, `Live`) are **excluded from the main suggestion list** (both the "`N` Suggestions" count and the cards shown) — the main list only shows suggestions whose `status` is `Suggestion`. This matches the design's roadmap-count vs. suggestion-count split.

6. **Empty state**
   - Shown when the currently filtered/sorted list has zero items (e.g., a category with no suggestions, or no suggestions at all).
   - Replaces the card list with: a detective illustration, heading "There is no feedback yet.", body copy "Got a suggestion? Found a bug that needs to be squashed? We love hearing about new ideas to improve our app.", and a centered "+ Add Feedback" button.
   - The toolbar above still shows "0 Suggestions" and the sort dropdown (functionally inert with zero items).

7. **Add Feedback entry points**
   - "+ Add Feedback" button in the toolbar (top-right, always visible) and the button inside the empty state both navigate to `/add-feedback` (see 2.2). Neither submits anything on their own — they're pure navigation.

8. **Responsive / mobile navigation**
   - On mobile widths, the category panel and roadmap panel are hidden from the main layout and replaced by a hamburger icon (☰) in the header card.
   - Tapping the hamburger opens a full-screen overlay containing the category chips panel and roadmap panel (stacked), with an "✕" to dismiss. Selecting a category chip inside the overlay applies the filter and can either auto-close the overlay or leave it open — either is acceptable, but the underlying list must update immediately.
   - On tablet widths, the category panel and roadmap panel sit side-by-side above the toolbar instead of in a left sidebar (see Section 6 for exact breakpoints).

### 2.2 Add Feedback Page (`/add-feedback`)

A single-column form for submitting one new suggestion.

**Fields:**

| Field | Input type | Label / helper text | Required | Default |
|---|---|---|---|---|
| Feedback Title | single-line text input | "Feedback Title" / "Add a short, descriptive headline" | Yes | empty |
| Category | select/dropdown | "Category" / "Choose a category for your feedback" | Yes | `Feature` |
| Feedback Detail | multi-line textarea | "Feedback Detail" / "Include any specific comments on what should be improved, added, etc." | Yes | empty |

Category dropdown options, in order: `Feature` (default), `UI`, `UX`, `Enhancement`, `Bug`. The active value has a checkmark in the open menu; selecting a value closes the menu and updates the field.

**Validation rules:**
- Both **Feedback Title** and **Feedback Detail** must be non-empty (after trimming whitespace) to submit. Category always has a value because it defaults to `Feature` and is a closed list, so it can never be "empty."
- Validation runs on submit attempt (clicking "Add Feedback"). Any invalid field gets:
  - A red (error-colored) border on the input/textarea.
  - Red helper text reading **"Can't be empty"** immediately below the field, replacing the normal helper text.
- Errors clear for a field as soon as it becomes non-empty; the user does not need to resubmit to clear an individual field's error.
- No client-side max-length is specified in the design; use reasonable sane limits (e.g., 100 chars for title, 500 for detail) if the backend requires column limits, but do not block typing beyond that in the UI unless a limit is explicitly agreed with the client.

**Buttons & navigation:**
- **"Go Back"** (top-left, chevron + text): navigates back to the Home page, discarding any unsaved input, no confirmation dialog.
- **"Cancel"** (bottom, dark button): same behavior as "Go Back" — returns to Home without saving.
- **"Add Feedback"** (bottom, purple/gradient button, primary action):
  - If validation fails, shows inline errors per above and does **not** submit or navigate.
  - If validation passes, calls `POST /add-one-suggestion` with `{ title, category, description }`.
  - On success: navigate back to the Home page. The new suggestion should appear in the list (its `status` is `Suggestion`, `upvotes` is `0`, `comment_count` is `0`, so it will show up under the currently selected category filter/sort if applicable — most naturally visible immediately when the "All" filter + "Most Upvotes" or "Least Upvotes" sort puts new/zero-vote items at a predictable position).
  - On failure (network/server error): stay on the form, show a non-blocking inline error near the submit button (e.g., "Something went wrong — please try again."), and preserve the user's entered values so nothing is lost.
- On mobile, the field layout is identical (single column, full-width inputs); button order/stacking follows the Figma mobile frame (Add Feedback button above Cancel, both full-width).

**Out of scope for this page:** category-specific validation messages, character counters (a counter appears in the Figma comments/detail UI elsewhere in the file, but not on this form's fields per the reviewed frames), and the "Editing" variant of this form (status dropdown + Delete button) — that belongs to the Edit Feedback flow, which is out of scope (Section 7).

---

## 3. Data Model

One core entity for this phase: **Suggestion**.

### `suggestions` table

| Field | Type | Constraints / Notes |
|---|---|---|
| `id` | `SERIAL` / integer | Primary key, auto-increment |
| `title` | `VARCHAR(100)` | Required, not null |
| `description` | `TEXT` | Required, not null. Maps to "Feedback Detail" in the UI |
| `category` | `VARCHAR(20)` (or Postgres `ENUM`) | Required, not null. One of: `Feature`, `UI`, `UX`, `Enhancement`, `Bug` |
| `status` | `VARCHAR(20)` (or Postgres `ENUM`) | Required, not null, default `'Suggestion'`. One of: `Suggestion`, `Planned`, `In-Progress`, `Live`. Only `Suggestion`-status rows appear in the main Home list; the others feed the Roadmap summary counts |
| `upvotes` | `INTEGER` | Not null, default `0` |
| `comment_count` | `INTEGER` | Not null, default `0` (no comment CRUD exists yet in this phase — this field exists purely so cards can render a count; it stays `0` for anything created through the app in v1) |
| `created_at` | `TIMESTAMPTZ` | Not null, default `now()` |

**Notes:**
- `category` and `status` are modeled as small closed enumerations. Using a native Postgres `ENUM` type (or a `CHECK` constraint) is preferred over a free-text column to prevent invalid values, since both lists are fixed and drive UI filter chips / dropdown options directly.
- No `user_id` / author field exists in this phase — there is no auth system yet, so suggestions are anonymous (see Section 7).
- Seed data: to make the Home page demonstrable, seed the table with a mix of `Suggestion`-status rows (to populate the main list) and a few `Planned` / `In-Progress` / `Live` rows (so the Roadmap summary counts aren't all zero), matching the counts in the design (6 visible suggestions; 2 Planned, 3 In-Progress, 1 Live).

---

## 4. API Endpoints

Modeled after the [Countries API Documentation](https://github.com/AnnieCannons/countries-app-instructions/blob/main/version-3/api-documentation.md) format. Base URL is a placeholder pending the Render deployment:

**Base URL:** `https://product-feedback-api.onrender.com`

### Overview

| Resource | Method | Endpoint | Description |
|---|---|---|---|
| suggestions | GET | `/get-all-suggestions` | Retrieves all suggestions with status `Suggestion`, ordered by upvotes descending. |
| suggestions | GET | `/get-suggestions-by-category/:category` | Retrieves all `Suggestion`-status suggestions in a given category. |
| suggestions | POST | `/add-one-suggestion` | Adds a new suggestion to the database. |

### Suggestions

#### 🔹 GET `/get-all-suggestions`

**Description:** Retrieves every suggestion whose `status` is `Suggestion`, ordered by `upvotes` descending (client applies any further re-sort by "Most/Least Comments" itself).

**Example Request URL:**
```
GET https://product-feedback-api.onrender.com/get-all-suggestions
```

**Example Response:**
```json
[
  {
    "id": 1,
    "title": "Add tags for solutions",
    "description": "Easier to search for solutions based on a specific stack.",
    "category": "Enhancement",
    "status": "Suggestion",
    "upvotes": 112,
    "comment_count": 2,
    "created_at": "2026-05-14T10:22:00.000Z"
  },
  {
    "id": 2,
    "title": "Add a dark theme option",
    "description": "It would help people with light sensitivities and who prefer dark mode.",
    "category": "Feature",
    "status": "Suggestion",
    "upvotes": 99,
    "comment_count": 4,
    "created_at": "2026-05-12T09:00:00.000Z"
  }
]
```

#### 🔹 GET `/get-suggestions-by-category/:category`

**Description:** Retrieves all `Suggestion`-status suggestions matching the given category. `:category` must be one of `Feature`, `UI`, `UX`, `Enhancement`, `Bug` (case-sensitive match to the stored value). If the category is unrecognized or has no matches, returns an empty array (not an error).

**Example Request URL:**
```
GET https://product-feedback-api.onrender.com/get-suggestions-by-category/Bug
```

**Example Response:**
```json
[
  {
    "id": 6,
    "title": "Preview images not loading",
    "description": "Challenge preview images are missing when you apply a filter.",
    "category": "Bug",
    "status": "Suggestion",
    "upvotes": 3,
    "comment_count": 0,
    "created_at": "2026-06-01T15:40:00.000Z"
  }
]
```

#### 🔹 POST `/add-one-suggestion`

**Description:** Adds a new suggestion. `status` is always set server-side to `Suggestion`, and `upvotes`/`comment_count` are always initialized to `0` — none of the three are accepted from the client.

**Example Request URL:**
```
POST https://product-feedback-api.onrender.com/add-one-suggestion
```

**Example Request Body:**
```json
{
  "title": "Add a dark theme option",
  "category": "Feature",
  "description": "It would help people with light sensitivities and who prefer dark mode."
}
```

**Example Response:**
```json
{
  "id": 13,
  "title": "Add a dark theme option",
  "description": "It would help people with light sensitivities and who prefer dark mode.",
  "category": "Feature",
  "status": "Suggestion",
  "upvotes": 0,
  "comment_count": 0,
  "created_at": "2026-08-06T18:05:00.000Z"
}
```

**Validation errors:** if `title`, `category`, or `description` is missing/empty, or `category` is not one of the five valid values, respond `400` with a body like:
```json
{
  "error": "title is required"
}
```

> **Note on response shape:** unlike the Countries API's plain "Success!" string responses for its POST endpoints, `/add-one-suggestion` returns the full created record (including the server-generated `id` and `created_at`). This is so the frontend can render the new card immediately on returning to the Home page without an extra fetch. Flag this to the client if a simpler "Success!" string response is preferred for consistency with their other services.

---

## 5. Tech Stack & Deployment Targets

| Layer | Choice | Notes |
|---|---|---|
| Database | **Neon** (managed Postgres) | Hosts the `suggestions` table described in Section 3. Connection string stored as an environment variable on Render, never committed to source control. |
| Backend API | Node.js + Express (REST) | Implements the three endpoints in Section 4. |
| Backend hosting | **Render** | Web Service deployed from the backend repo/folder; environment variables (Neon connection string, `PORT`, `CORS`-allowed origin) configured in Render's dashboard. Free-tier services spin down when idle — first request after inactivity will be slow; acceptable for this phase. |
| Frontend | React (or the client's preferred SPA framework — confirm before starting) | Implements the Home and Add Feedback pages per Section 2, styled per the design system in Section 6. |
| Frontend hosting | **Netlify** | Deployed from the frontend repo/folder; build command and publish directory configured in `netlify.toml`. The API base URL is injected via a Netlify environment variable (e.g., `VITE_API_BASE_URL`) so it can point at the Render backend without a code change. |

**CORS:** the Render backend must allow requests from the Netlify frontend's deployed origin (and `localhost` during development).

---

## 6. Design Reference & Responsive Behavior

**Figma file:** [Product Feedback App Design](https://www.figma.com/design/vxjX8SdBOt21DCD14mrBM9/Product-Feedback-App-Design?node-id=0-1&t=OH1BSnaLrvNeWMlQ-1)

Screens reviewed (from the exported Figma assets) covering all three breakpoints: Suggestions/Home (default, active-sort, empty state), New/Add Feedback (default and category-dropdown-open states), plus Feedback Detail, Edit Feedback, and Roadmap — the latter three informed the Out of Scope list below but are not built in this phase. A shared Design System frame documents colors, typography, buttons, and form-element states.

**Breakpoints** (derived from the Figma frame dimensions — confirm exact values with the client before building):
- **Mobile:** ~375px and up. Sidebar content (categories + roadmap) collapses into a hamburger-triggered full-screen overlay (Section 2.1.8). Suggestion cards, header, and toolbar all go full-width and stack vertically (header → toolbar → cards).
- **Tablet:** ~768px and up. Header card, category panel, and roadmap panel sit in a single row above the toolbar (three cards side by side), full sidebar is no longer a left column. Toolbar and card list remain full-width below.
- **Desktop:** ~1440px and up. Two-column layout: fixed-width left sidebar (header card + category panel + roadmap panel, stacked) and a wider right column (toolbar + suggestion cards).

**Visual design system** (from the Figma "Design System" frame):
- **Typeface:** Jost, for both headings and body copy (weights: Bold for headings/labels, Regular/SemiBold for body text).
- **Color palette:** primary purple `#AD1FEA` (CTAs like "Add Feedback"), primary blue `#4661E6` (secondary actions, links, active states), dark navy `#3A4374` (toolbar background, "Go Back"/dark buttons), a light lavender family (`#F2F4FF`, `#F7F8FD`) for chip/tag backgrounds, slate `#647196` for helper text, and status accent colors: orange `#F49F85` (Planned), purple `#AD1FEA` (In-Progress), blue `#62BCFA` (Live).
- **Form elements:** default/filled/active/error states for text inputs (error = red border + red helper text below, exactly as specified in Section 2.2), and default/active states for the category dropdown (active = focus ring, open menu with checkmark on the selected item).
- **Buttons:** solid-fill default state with a lighter-tint hover state, consistent corner radius across all button variants (primary purple, secondary blue/navy, and the text-only "Go Back" link with chevron).

If a question about exact spacing, sizing, or a state not described above comes up during implementation, treat the Figma file as the source of truth and ask the client for screenshots/clarification rather than guessing.

---

## 7. Out of Scope

To keep this phase focused on the Home and Add Feedback pages, the following are explicitly **not** being built yet, even though they appear in the Figma file:

- **Feedback Detail page** — clicking into a suggestion to see its full detail view.
- **Comments & replies** — the comment thread UI, "Reply," "Post Reply," and "Add Comment" flows shown on the Feedback Detail frame. `comment_count` is stored as a static integer only; there is no comment data model or endpoints in this phase.
- **Upvoting interactivity** — the upvote pill is display-only; clicking it does not increment the count or call an API. There is no `PATCH`/vote endpoint in Section 4.
- **Edit Feedback page** — editing an existing suggestion's title/category/detail, or changing its status via the "Update Status" dropdown, or deleting a suggestion ("Delete" button). No update/delete endpoints exist yet.
- **Full Roadmap page** — the Kanban-style Planned / In-Progress / Live board reached via the "View" link. Only the numeric summary (counts) on the Home page sidebar is in scope.
- **Authentication / user accounts** — there's no login, no per-user identity, no avatars. All suggestions are anonymous; the `users`/profile UI shown in some Figma comment avatars is not part of this app's data model.
- **Pagination / infinite scroll** — the full filtered list always loads at once.
- **Real-time updates** — no live/websocket updates if another user submits feedback while you're viewing the board; a manual refresh (page reload) picks up new data.
- **Search** — there is no keyword search box in the reviewed frames; only category filtering and sorting.

Anything in this list can become a follow-up phase once the client confirms priority.
