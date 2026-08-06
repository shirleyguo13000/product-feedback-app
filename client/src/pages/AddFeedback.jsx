import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import newFeedbackIcon from "../assets/icons/icon-new-feedback.svg";
import arrowLeft from "../assets/icons/icon-arrow-left.svg";
import arrowDown from "../assets/icons/icon-arrow-down.svg";
import checkIcon from "../assets/icons/icon-check.svg";
import { FORM_CATEGORIES } from "../constants/categories";
import { addSuggestion } from "../api/suggestions";
import "./AddFeedback.css";

// PRD.md Section 2.2.
function AddFeedback() {
  const navigate = useNavigate();
  const categoryRef = useRef(null);

  const [title, setTitle] = useState("");
  const [category, setCategory] = useState(FORM_CATEGORIES[0]);
  const [description, setDescription] = useState("");
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    function handleOutsideClick(event) {
      if (categoryRef.current && !categoryRef.current.contains(event.target)) {
        setIsCategoryOpen(false);
      }
    }
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  function handleTitleChange(event) {
    setTitle(event.target.value);
    if (errors.title) setErrors((prev) => ({ ...prev, title: undefined }));
  }

  function handleDescriptionChange(event) {
    setDescription(event.target.value);
    if (errors.description) setErrors((prev) => ({ ...prev, description: undefined }));
  }

  async function handleSubmit(event) {
    event.preventDefault();

    const nextErrors = {};
    if (!title.trim()) nextErrors.title = "Can't be empty";
    if (!description.trim()) nextErrors.description = "Can't be empty";
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    setSubmitError("");
    setIsSubmitting(true);
    try {
      await addSuggestion({ title: title.trim(), category, description: description.trim() });
      navigate("/");
    } catch (err) {
      setSubmitError(err.message || "Something went wrong — please try again.");
      setIsSubmitting(false);
    }
  }

  return (
    <div className="add-feedback-page">
      <Link to="/" className="go-back-link">
        <img src={arrowLeft} alt="" aria-hidden="true" /> Go Back
      </Link>

      <form className="add-feedback-card" onSubmit={handleSubmit} noValidate>
        <img src={newFeedbackIcon} alt="" aria-hidden="true" className="add-feedback-icon" />
        <h1>Create New Feedback</h1>

        <div className="form-field">
          <label htmlFor="feedback-title">Feedback Title</label>
          <p className={errors.title ? "form-hint form-hint--error" : "form-hint"}>
            {errors.title || "Add a short, descriptive headline"}
          </p>
          <input
            id="feedback-title"
            type="text"
            value={title}
            onChange={handleTitleChange}
            className={errors.title ? "input-error" : ""}
            aria-invalid={Boolean(errors.title)}
          />
        </div>

        <div className="form-field">
          <span id="category-label">Category</span>
          <p className="form-hint">Choose a category for your feedback</p>
          <div className="category-select" ref={categoryRef}>
            <button
              type="button"
              className="category-select-trigger"
              aria-haspopup="listbox"
              aria-expanded={isCategoryOpen}
              aria-labelledby="category-label"
              onClick={() => setIsCategoryOpen((open) => !open)}
            >
              <span>{category}</span>
              <img
                src={arrowDown}
                alt=""
                aria-hidden="true"
                className={isCategoryOpen ? "category-arrow category-arrow--open" : "category-arrow"}
              />
            </button>

            {isCategoryOpen && (
              <ul className="category-menu" role="listbox">
                {FORM_CATEGORIES.map((option) => (
                  <li key={option} role="option" aria-selected={option === category}>
                    <button
                      type="button"
                      onClick={() => {
                        setCategory(option);
                        setIsCategoryOpen(false);
                      }}
                    >
                      {option}
                      {option === category && <img src={checkIcon} alt="" aria-hidden="true" />}
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        <div className="form-field">
          <label htmlFor="feedback-detail">Feedback Detail</label>
          <p className={errors.description ? "form-hint form-hint--error" : "form-hint"}>
            {errors.description ||
              "Include any specific comments on what should be improved, added, etc."}
          </p>
          <textarea
            id="feedback-detail"
            rows={4}
            value={description}
            onChange={handleDescriptionChange}
            className={errors.description ? "input-error" : ""}
            aria-invalid={Boolean(errors.description)}
          />
        </div>

        {submitError && <p className="form-submit-error">{submitError}</p>}

        <div className="form-actions">
          <button
            type="submit"
            className="pill-button pill-button-purple button-submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Adding…" : "Add Feedback"}
          </button>
          <Link to="/" className="pill-button pill-button-navy button-cancel">
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}

export default AddFeedback;
