# Project Context: Spark

## 1. Project Overview

Spark is a modern job application tracker designed to reduce the psychological stress of job hunting. It combines robust data organization with gamification motivation and a planned "Value Matching Algorithm" to help users not just track applications, but find the *right* jobs.

## 2. Tech Stack & Architecture

A decoupled monorepo with two independent applications:

- **Backend:** `spark-api/` (Java 25, Spring Boot 4, Spring Data JPA, Spring Security, Maven, PostgreSQL). A pure JSON REST API with JWT cookie authentication.
- **Frontend:** `spark-web/` (Next.js 16 App Router, React 19, TypeScript, Tailwind CSS 4, shadcn/ui). Talks to the API with cookie credentials; no server-side data layer of its own.
- **Docs:** `docs/` holds the user-story backlog, database schema, API reference, and architecture decision records.

See [05-architecture-decisions.md](05-architecture-decisions.md) for the reasoning behind these choices.

## 3. Core Data Models

The database revolves around these entities (full column reference in [03-database-schema.md](03-database-schema.md)):

- **User:** account with first/last name, email, and BCrypt password hash.
- **UserPreference:** 1-to-1 with User, created automatically on registration. Holds the weekly application goal and the matching weights (salary, commute, company size) for the future Value Matching Algorithm.
- **Company (Unsolicited Applications):** companies the user wants to cold-contact. Name, description, size, industry tags, address, website, status ("Submitted" / "In Process" / "Pending"), priority (0-5), salary, and dates for follow-up, interview, and offer.
- **JobAd (Targeted Applications):** specific job postings. Title, company name, link, full ad description, status, priority label ("Very High" through "None"), tags, salary, post/start/applied dates, and a four-step timeline (application follow-up, interview follow-up, interview offer, job offer).

## 4. Current State

Implemented and working end-to-end:

- Registration, login, logout, and session refresh with JWT httpOnly cookies.
- Full CRUD for both targeted job ads and unsolicited companies, each with a sortable, filterable table and a slide-out drawer for read/edit/delete.
- Dashboard with application stats and activity chart; document pages for resumes, cover letters, and additional files (UI only, uploads pending).
- A standalone job discovery prototype (n8n + Apify scrapers with AI scoring and Telegram delivery) running outside the app, planned for integration.

The full backlog with completion status lives in [02-user-stories.md](02-user-stories.md).

## 5. Key Features to Implement

- **Value Matching Algorithm:** a weighted scoring model in the Java backend that calculates a "Match Percentage" for jobs based on UserPreference weights.
- **File uploads:** attach motivation letters, resumes, and additional files to applications (cloud storage).
- **Gamification & analytics:** weekly goals, streaks, and conversion charts on the dashboard, backed by real data.
- **Job discovery integration:** feed the scraper pipeline's results directly into targeted applications.
- **External APIs:** Google Maps Distance Matrix for commute times; LLM-based salary estimation for ads without a listed salary.

## 6. Workflow Rules

- **Rule 1:** When writing Java code, use standard enterprise patterns (Controllers, Services, Repositories, Entities, DTOs).
- **Rule 2:** Keep the code modular and testable. The Value Matching Algorithm will need JUnit tests.
- **Rule 3:** When adding frontend features, mirror the established patterns: an API client in `src/lib/`, a table component, and a drawer component per domain (see the unsolicited and targeted implementations).
