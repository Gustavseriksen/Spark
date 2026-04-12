# User Stories & Backlog

## Epic 1: Infrastructure & Setup
- [x] **Task 1.1:** Initialize Spring Boot backend (`spark-api`) with Java 25 and PostgreSQL.
- [x] **Task 1.2:** Initialize Next.js frontend (`spark-web`) with Tailwind CSS.
- [ ] **Task 1.3:** Setup CI/CD pipeline via GitHub Actions for backend tests.
- [ ] **Task 1.4:** Define and implement base database schema (JPA Entities).

## Epic 2: Core Job Tracking (The MVP)
- [ ] **Story 2.1:** As a user, I want to add/edit/delete a Company (Unsolicited) including tags, interview/offer status, and salary, and view details in a slide-out side panel.
- [ ] **Story 2.2:** As a user, I want to add/edit/delete a Job Ad (Targeted) including post/start dates, tags, and interview/offer status, and view details in a slide-out side panel. Date applied should default to today/tomorrow.
- [ ] **Story 2.3:** As a user, I want to save the full text of the Job Ad description and Cover Letter sent so I can review them if I get an interview.
- [ ] **Story 2.4:** **Story 2.4:** As a user, I want a tabbed list view (Wishlist, Applied, Interview, Offer) to easily navigate and manage my applications without screen clutter.

## Epic 3: The Value Matching Engine (Core Feature)
- [ ] **Story 3.1:** As a user, I want to configure my matching algorithm preferences (salary, commute, tags) on my Profile page using interactive sliders and toggles.
- [ ] **Task 3.2:** Implement `MatchEngineService` in backend to calculate the Weighted Scoring Model based on Salary, Commute, Tags, Relevance, and Priority.
- [ ] **Task 3.3:** Write JUnit tests for the matching algorithm to ensure math is perfectly accurate.
- [ ] **Story 3.4:** As a user, I want to see a "Match %" badge on every job and company card.

## Epic 4: 3rd Party Integrations & Storage
- [ ] **Task 4.1:** Integrate Google Maps API to calculate Walk/Bike/Transit/Car commute times automatically.
- [ ] **Task 4.2:** Integrate LLM API to estimate salary ranges based on job descriptions when salary is hidden.
- [ ] **Story 4.3:** As a user, I want to upload and store my PDF resume to a specific job ad (AWS S3 / Supabase Storage).

## Epic 5: Gamification & Analytics
- [ ] **Story 5.1:** As a user, I want to set a weekly application goal (e.g., 10 apps) and see a visual progress bar.
- [ ] **Story 5.2:** As a user, I want to see a "GitHub-style" contribution streak graph visually rewarding consistency.
- [ ] **Story 5.3:** As a user, I want to see an interactive, motivational UI avatar that praises me when I log an application.
- [ ] **Story 5.4:** As a user, I want an analytics dashboard showing: Sent this week/month/year, Total Interviews, Total Offers, and my "High Score" (Highest applications sent in a single day/week/month).

## Epic 6: Browser Extension (Stretch Goal)
- [ ] **Story 6.1:** As a user, I want a Chrome Extension that scrapes Job Title, Company, and Link from LinkedIn/Indeed and pushes it directly to my Spark app.