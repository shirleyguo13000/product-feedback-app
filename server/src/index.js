// Loads server/.env into process.env (DATABASE_URL) for local development.
// On Render this is a no-op - there's no .env file there, DATABASE_URL is
// set directly in the service's Environment settings instead.
import "dotenv/config";
import express from "express";
import cors from "cors";
import suggestionsRouter from "./routes/suggestions.js";

const app = express();

// TODO (security audit milestone): restrict this to the deployed Netlify
// origin once the frontend is live, instead of allowing every origin.
app.use(cors());
app.use(express.json());

app.use(suggestionsRouter);

app.get("/", (req, res) => {
  res.send("Product Feedback API is running.");
});

// Render assigns its own port via process.env.PORT; 3000 is only the local
// dev fallback.
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});
