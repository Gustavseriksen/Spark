# Project Context: Spark

## 1. Project Overview

Spark is a modern job application tracker designed to reduce the psychological stress of job hunting. It combines robust data organization with gamification motivation, and a unique "Value Matching Algorithm" to help users not just track applications, but find the *right* jobs.

## 2. Tech Stack & Architecture

We are using a decoupled Monorepo architecture. 

- **Workspace Root:** `spark-project/`
- **Backend:** `spark-api/` (Java 25, Spring Boot, Spring Data JPA, Maven, PostgreSQL). Acts as a pure REST API.
- **Frontend:** `spark-web/` (Next.js, React, Tailwind CSS). Will be created later.

## 3. Core Data Models (The MVP)

The database will revolve around these core entities:

- **Company (Unsolicited Applications):** Companies the user wants to cold-contact.
  - Fields: Name (unique), Description, Size (Small/Med/Large), Tags, Address, Website, Status (APPLIED/NOT_APPLIED), Priority (1-5), Relevance (1-5), Job Offer (boolean), Job Interview (boolean), Salary.
- **Job Ad (Targeted Applications):** Specific job postings.
  - Fields: Ad Title, Link, Status (APPLIED/NOT_APPLIED), Post Date, Start Date, Company (Relationship), Tags, Priority (1-5), Relevance (1-5), Offer (boolean), Interview (boolean), Salary.
- **User Preferences:** Weights (1-5) defining how much the user cares about specific factors (e.g., Commute Time, Salary, Company Size).

## 4. Key Features to Implement

- **Value Matching Algorithm:** A weighted scoring model in the Java backend that calculates a "Match Percentage" for jobs based on User Preferences.
- **Gamification:** Weekly application goals, streak counters, and a UI avatar that motivates the user.
- **Data Visualization:** Analytics dashboard (charts for applications sent, interview conversion rates) and a drag-and-drop Kanban board for job statuses.
- **External APIs:** * Google Maps Distance Matrix API (to calculate commute times based on user address and company address).
  - LLM API (to estimate salary ranges based on job descriptions).

## 5. Current State & Workflow Rules

- I have just initialized the Spring Boot project inside the `spark-api` folder.
- **Rule 1:** When writing Java code, use standard enterprise patterns (Controllers, Services, Repositories, Entities, DTOs).
- **Rule 2:** Keep the code modular and testable. We will need JUnit tests for the Value Matching Algorithm.
- **Rule 3:** Do not write frontend code until I explicitly ask to start the Next.js setup. We are focusing purely on the Spring Boot REST API and PostgreSQL setup first.

