# 📘 Product Feedback API Documentation

Base URL: `https://product-feedback-api.onrender.com`

> Not deployed to Render yet — see [PRD.md](PRD.md) Section 5. Until then, run the server locally (`npm start` in `server/`) and use `http://localhost:3000` as the base URL instead. Update this line with the real Render URL once deployed, and keep it in sync with `PRD.md` Section 4.

## Overview

| Resource         | Method | Endpoint                                 | Description                                                          |
|------------------|--------|-------------------------------------------|-----------------------------------------------------------------------|
| `suggestions`    | GET    | /get-all-suggestions                      | Retrieves all suggestions with status `Suggestion`, sorted by upvotes descending. |
| `suggestions`    | GET    | /get-suggestions-by-category/:category    | Retrieves `Suggestion`-status suggestions in a given category.        |
| `suggestions`    | POST   | /add-one-suggestion                       | Adds a new suggestion to the database.                                |

---

### 🔹 GET `/get-all-suggestions`

**Description:** Retrieves every suggestion whose `status` is `Suggestion` (i.e. not yet on the roadmap), ordered by `upvotes` descending.

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

Returns an empty array (`[]`) if there are no suggestions with status `Suggestion` yet.

---

### 🔹 GET `/get-suggestions-by-category/:category`

**Description:** Retrieves `Suggestion`-status suggestions matching `:category`. `:category` must exactly match one of `Feature`, `UI`, `UX`, `Enhancement`, `Bug` (case-sensitive). If `:category` doesn't match any of those five values, or matches one with no suggestions in it, the response is an empty array — **not** an error.

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

---

### 🔹 POST `/add-one-suggestion`

**Description:** Adds a new suggestion. `status` is always set to `Suggestion` and `upvotes`/`comment_count` always start at `0` on the server — none of the three can be set from the request body. `title` and `description` are required (non-empty after trimming whitespace); `category` is required and must be one of `Feature`, `UI`, `UX`, `Enhancement`, `Bug`. Any missing/invalid field returns a `400` with an `{ "error": "..." }` body instead of creating a row.

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

**Example Response:** (`201 Created`)

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

**Example Error Response:** (`400 Bad Request` — one of several possible validation failures)

```json
{
  "error": "title is required"
}
```

Other validation error messages: `"description is required"` and `"category must be one of: Feature, UI, UX, Enhancement, Bug"`.

---
