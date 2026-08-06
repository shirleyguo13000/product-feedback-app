-- ============================================================================
-- Product Feedback App — database schema
-- Target: Neon (Postgres 17)
-- Source of truth: PRD.md, Section 3 (Data Model)
-- ============================================================================

-- Closed enumerations backing the category filter chips and status pipeline.
CREATE TYPE suggestion_category AS ENUM ('Feature', 'UI', 'UX', 'Enhancement', 'Bug');
CREATE TYPE suggestion_status AS ENUM ('Suggestion', 'Planned', 'In-Progress', 'Live');

CREATE TABLE suggestions (
    id             SERIAL PRIMARY KEY,
    title          VARCHAR(100) NOT NULL,
    description    TEXT NOT NULL,
    category       suggestion_category NOT NULL,
    status         suggestion_status NOT NULL DEFAULT 'Suggestion',
    upvotes        INTEGER NOT NULL DEFAULT 0,
    comment_count  INTEGER NOT NULL DEFAULT 0,
    created_at     TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============================================================================
-- Seed data
-- 6 rows with status = 'Suggestion' (populate the Home page list, matching
-- the "6 Suggestions" count in the Figma design) + 6 rows spread across
-- Planned/In-Progress/Live (populate the Roadmap summary counts: 2/3/1,
-- also matching the design).
-- ============================================================================

INSERT INTO suggestions (title, description, category, status, upvotes, comment_count, created_at) VALUES
    ('Add tags for solutions',
     'Easier to search for solutions based on a specific stack.',
     'Enhancement', 'Suggestion', 112, 2, '2026-05-14T10:22:00Z'),

    ('Add a dark theme option',
     'It would help people with light sensitivities and who prefer dark mode.',
     'Feature', 'Suggestion', 99, 4, '2026-05-12T09:00:00Z'),

    ('Q&A within the challenge hubs',
     'Challenge-specific Q&A would make for easy reference.',
     'Feature', 'Suggestion', 65, 1, '2026-05-10T14:15:00Z'),

    ('Allow image/video upload',
     'Images and screencasts can enhance comments on solutions.',
     'Enhancement', 'Suggestion', 52, 2, '2026-05-08T11:30:00Z'),

    ('Ability to follow others',
     'Stay updated on comments and solutions other people post.',
     'Feature', 'Suggestion', 42, 3, '2026-05-05T16:45:00Z'),

    ('Preview images not loading',
     'Challenge preview images are missing when you apply a filter.',
     'Bug', 'Suggestion', 3, 0, '2026-06-01T15:40:00Z'),

    -- Roadmap rows (excluded from the main Home list; feed the summary counts)
    ('One-click portfolio generation',
     'Auto-build a shareable portfolio page from completed challenge solutions.',
     'UX', 'Planned', 55, 3, '2026-04-20T12:00:00Z'),

    ('Multiplayer challenges',
     'Pair up with another user to solve a challenge together in real time.',
     'Feature', 'Planned', 30, 1, '2026-04-18T09:20:00Z'),

    ('Bookmark challenges',
     'Save challenges to a personal list to come back to later.',
     'UX', 'In-Progress', 70, 5, '2026-04-15T08:10:00Z'),

    ('Progress bar on solutions',
     'Show a visual indicator of how much of a solution has been reviewed.',
     'UI', 'In-Progress', 45, 2, '2026-04-10T13:50:00Z'),

    ('NPM package for design tokens',
     'Publish the design system''s colors and spacing as an installable package.',
     'Enhancement', 'In-Progress', 25, 0, '2026-04-05T17:05:00Z'),

    ('Dark mode for code snippets',
     'Code blocks should respect the site-wide dark theme once it ships.',
     'UI', 'Live', 88, 6, '2026-03-28T10:40:00Z');
