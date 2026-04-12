#  Spark | Full-Stack Job Application Tracker

![Next.js](https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js)
![React](https://img.shields.io/badge/React-19-blue?style=for-the-badge&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=for-the-badge&logo=typescript)
![Java](https://img.shields.io/badge/Java-25-orange?style=for-the-badge&logo=openjdk)
![Spring Boot](https://img.shields.io/badge/Spring_Boot-3-brightgreen?style=for-the-badge&logo=spring-boot)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-blue?style=for-the-badge&logo=postgresql)

> **Status:** Currently in active development (2026).

Spark is a premium, full-stack platform designed to streamline and gamify the job search process. Instead of throwing applications into the void, Spark utilizes a **Custom Value-Matching Algorithm** to score job compatibility based on personal preferences like salary, commute time, and remote flexibility.

##  Visual Preview

*(Currently implementing the frontend based on these UI/UX wireframes)*

### Authentication
![Login Preview](./docs/assets/login.png)

### The Dashboard & Analytics
![Spark Dashboard Preview](./docs/assets/dashboard.png)

### Targeted Applications
![Targeted Applications Preview](./docs/assets/targeted.png)

### Profile & Preferences
![Profile Preview](./docs/assets/profile.png)


##  Key Features

* **Value-Matching Engine:** A custom Java algorithm that weighs user preferences (commute, salary, tech stack) against job descriptions to generate a personalized Match Score (%).
* **Gamification:** Weekly application goals, streak tracking, and interactive progress rings to keep the job hunt motivating.
* **Premium UX/UI:** Designed with a "Linear-style" aesthetic—deep dark mode, subtle borders, and expanded list views utilizing Next.js and Tailwind CSS.
* **Decoupled Architecture:** Built as a scalable Monorepo separating the robust Spring Boot REST API from the React frontend.

##  Architecture & Tech Stack

This project is structured as a Monorepo containing two decoupled applications:

* **Frontend (`/spark-web`):** Next.js (App Router), React, TypeScript, Tailwind CSS.
* **Backend (`/spark-api`):** Java 25, Spring Boot 3, Spring Data JPA, Spring Security.
* **Database:** PostgreSQL.
* **Documentation:** View the full [Architecture Decision Records (ADR)](./05-architecture-decisions.md) for deeper technical insights.

##  Local Development Setup

To run this application locally, you will need Java 25, Node.js, and a running PostgreSQL instance.

**1. Clone the repository:**
```bash
git clone [https://github.com/Gustavseriksen/Spark.git](https://github.com/Gustavseriksen/Spark.git)
cd Spark