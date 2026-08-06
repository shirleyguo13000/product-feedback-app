// Routes for the `suggestions` resource. See PRD.md Section 4 for the
// full contract each of these endpoints is expected to follow.
import express from "express";
import pool from "../db.js";
import { VALID_CATEGORIES } from "../constants.js";

const router = express.Router();

const SUGGESTION_COLUMNS =
  "id, title, description, category, status, upvotes, comment_count, created_at";

// GET /get-all-suggestions
// Returns every suggestion whose status is 'Suggestion' (i.e. not yet on
// the roadmap), ordered by upvotes descending.
router.get("/get-all-suggestions", async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT ${SUGGESTION_COLUMNS}
       FROM suggestions
       WHERE status = 'Suggestion'
       ORDER BY upvotes DESC`
    );
    res.json(result.rows);
  } catch (err) {
    console.error("GET /get-all-suggestions failed:", err);
    res.status(500).json({ error: "Something went wrong while fetching suggestions." });
  }
});

// GET /get-suggestions-by-category/:category
// Returns 'Suggestion'-status rows matching :category. An unrecognized
// category returns an empty array rather than an error (PRD Section 4) -
// checking against VALID_CATEGORIES first also avoids ever passing an
// invalid value into the category enum column.
router.get("/get-suggestions-by-category/:category", async (req, res) => {
  const { category } = req.params;

  if (!VALID_CATEGORIES.includes(category)) {
    return res.json([]);
  }

  try {
    const result = await pool.query(
      `SELECT ${SUGGESTION_COLUMNS}
       FROM suggestions
       WHERE status = 'Suggestion' AND category = $1
       ORDER BY upvotes DESC`,
      [category]
    );
    res.json(result.rows);
  } catch (err) {
    console.error("GET /get-suggestions-by-category/:category failed:", err);
    res.status(500).json({ error: "Something went wrong while fetching suggestions." });
  }
});

// POST /add-one-suggestion
// Creates a new suggestion from { title, category, description }.
// status/upvotes/comment_count are never accepted from the client - they
// always start at 'Suggestion' / 0 / 0 (PRD Section 4).
router.post("/add-one-suggestion", async (req, res) => {
  const { title, category, description } = req.body ?? {};

  if (typeof title !== "string" || !title.trim()) {
    return res.status(400).json({ error: "title is required" });
  }
  if (typeof description !== "string" || !description.trim()) {
    return res.status(400).json({ error: "description is required" });
  }
  if (typeof category !== "string" || !VALID_CATEGORIES.includes(category)) {
    return res
      .status(400)
      .json({ error: `category must be one of: ${VALID_CATEGORIES.join(", ")}` });
  }

  try {
    const result = await pool.query(
      `INSERT INTO suggestions (title, description, category)
       VALUES ($1, $2, $3)
       RETURNING ${SUGGESTION_COLUMNS}`,
      [title.trim(), description.trim(), category]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error("POST /add-one-suggestion failed:", err);
    res.status(500).json({ error: "Something went wrong while adding the suggestion." });
  }
});

export default router;
