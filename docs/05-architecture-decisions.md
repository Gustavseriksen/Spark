# Architecture Decision Records (ADR)

This document tracks the core architectural, technological, and design decisions made for the "Spark" project.

## 1. System Architecture: Decoupled Monorepo
* **Decision:** The project is structured as a monorepo (`spark-project`) containing two completely decoupled applications: `spark-api` (backend) and `spark-web` (frontend).
* **Rationale:** This keeps the entire codebase centralized for easy version control, while the applications remain decoupled so they can be scaled, tested, and deployed independently.

## 2. Backend Stack: Java 25, Spring Boot & PostgreSQL
* **Decision:** The REST API is built using Java 25 and Spring Boot, connected to a PostgreSQL relational database.
* **Rationale:** Spring Boot provides a robust, enterprise-grade foundation. Java's strong typing ensures backend stability, and JPA/Hibernate makes database interactions seamless. PostgreSQL was chosen over NoSQL (like MongoDB) because the core data models (Users, Jobs, Companies) have strict relational dependencies.

## 3. Frontend Stack: Next.js (App Router), React & TypeScript
* **Decision:** The frontend utilizes Next.js (App Router architecture) alongside React and TypeScript.
* **Rationale:** Next.js provides a modern, fast, and SEO-friendly framework. TypeScript was specifically chosen because it creates a perfect bridge to the strict Java backend: frontend interfaces will directly mirror backend DTOs, eliminating type errors and ensuring data integrity across the stack.

## 4. Styling: Tailwind CSS & shadcn
* **Decision:** UI styling is handled by Tailwind CSS, with component primitives built using shadcn/ui.
* **Rationale:** Tailwind allows for rapid, utility-first styling without maintaining massive `.css`  files, and `shadcn/ui` provides accessible, customizable components that fit the design system without locking the project into a heavy UI framework.

## 5. UI/UX Paradigm: Expanded List Views & Slide-Out Drawers
* **Decision:** Traditional "Kanban Boards" and center-screen modals were abandoned in favor of Tabbed Expanded List Views and right-side "Slide-Out Drawers".
* **Rationale:** Kanban boards become too cluttered when displaying rich data points (like Match %, Salary, and Commute times). A spacious, tabbed list view provides a cleaner cognitive load for the user. Slide-out drawers allow users to edit job details without completely losing context of the background dashboard.

## 6. Authentication: JWT in httpOnly Cookies
* **Decision:** Authentication uses short-lived JWT access tokens (15 min) and longer-lived refresh tokens (7 days), both delivered as `httpOnly` cookies rather than stored in `localStorage` or sent as `Authorization` headers.
* **Rationale:** `httpOnly` cookies are invisible to JavaScript, which protects the tokens from XSS attacks. The browser attaches them automatically (`credentials: "include"`), so the frontend needs no token-handling code. A `/api/auth/refresh` endpoint rotates both tokens, keeping sessions alive without long-lived access tokens.

## 7. Authorization: Ownership Checks in the Service Layer
* **Decision:** Every company and job ad belongs to a user. Each service resolves the resource and verifies the owner matches the authenticated user, raising 404 (not 403) on mismatch.
* **Rationale:** Checking ownership centrally in the service layer means no endpoint can forget it. Returning 404 instead of 403 avoids leaking whether a resource id exists at all.

## 8. API Vocabulary Mirrors the UI
* **Decision:** Status and priority are stored and transferred as the same display strings the UI shows ("Submitted", "In Process", "Pending"; "Very High" through "None") rather than as enums or numeric codes with a mapping layer.
* **Rationale:** The frontend was designed first, and the MVP has exactly one consumer of the API. Skipping a translation layer keeps DTOs, entities, and UI components trivially aligned. The cost (renaming a label requires a data migration) is acceptable at this stage and can be revisited if the API gains other consumers.

## 9. Schema Management: Hibernate `ddl-auto: update` During Development
* **Decision:** The database schema is generated and evolved directly from the JPA entities (`ddl-auto: update`) instead of versioned migration files.
* **Rationale:** During solo MVP development the entities change frequently, and letting Hibernate sync the schema removes friction. Known tradeoffs are accepted: columns are added but never dropped or retyped (the legacy `job_ads` columns from before Story 3.3 remain orphaned in older databases, and the reworked `priority` needed a new `priority_label` column). Before any shared or production deployment, the plan is to switch to versioned migrations (e.g. Flyway) generated from the then-final schema.