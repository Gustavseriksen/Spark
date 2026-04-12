# Architecture Decision Records (ADR)

This document tracks the core architectural, technological, and design decisions made for the "Spark" project.

## 1. System Architecture: Decoupled Monorepo
* **Decision:** The project is structured as a monorepo (`spark-project`) containing two completely decoupled applications: `spark-api` (backend) and `spark-web` (frontend).
* **Rationale:** This keeps the entire codebase centralized for easy version control and makes it highly presentable for portfolio reviews on GitHub. However, by keeping the applications decoupled, they can be scaled, tested, and deployed independently.

## 2. Backend Stack: Java 25, Spring Boot & PostgreSQL
* **Decision:** The REST API is built using Java 25 and Spring Boot, connected to a PostgreSQL relational database.
* **Rationale:** Spring Boot provides a robust, enterprise-grade foundation. Java's strong typing ensures backend stability, and JPA/Hibernate makes database interactions seamless. PostgreSQL was chosen over NoSQL (like MongoDB) because the core data models (Users, Jobs, Companies) have strict relational dependencies.

## 3. Frontend Stack: Next.js (App Router), React & TypeScript
* **Decision:** The frontend utilizes Next.js (App Router architecture) alongside React and TypeScript.
* **Rationale:** Next.js provides a modern, fast, and SEO-friendly framework. TypeScript was specifically chosen because it creates a perfect bridge to the strict Java backend—frontend interfaces will directly mirror backend DTOs, eliminating type errors and ensuring data integrity across the stack.

## 4. Styling: Tailwind CSS & "Linear-Style" Premium Dark Mode
* **Decision:** UI styling is handled entirely by Tailwind CSS, utilizing a premium "Linear/Vercel" dark-mode aesthetic (deep `zinc-950/900` backgrounds with subtle `zinc-800` 1px borders).
* **Rationale:** Tailwind allows for rapid, utility-first styling without maintaining massive `.css` files. The deep dark mode with subtle borders creates a modern, high-end SaaS (Software as a Service) feel, making the portfolio piece stand out to design-conscious recruiters.

## 5. UI/UX Paradigm: Expanded List Views & Slide-Out Drawers
* **Decision:** Traditional "Kanban Boards" and center-screen modals were abandoned in favor of Tabbed Expanded List Views and right-side "Slide-Out Drawers".
* **Rationale:** Kanban boards become too cluttered when displaying rich data points (like Match %, Salary, and Commute times). A spacious, tabbed list view provides a cleaner cognitive load for the user. Slide-out drawers allow users to edit job details without completely losing context of the background dashboard.