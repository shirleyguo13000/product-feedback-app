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

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
