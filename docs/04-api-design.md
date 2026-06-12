# API Design

The backend is a pure JSON REST API served by Spring Boot at `http://localhost:8080`. This document describes the conventions and every endpoint as implemented in `spark-api/src/main/java/com/gustaveriksen/spark/controller/`.

## Conventions

* **Format:** all requests and responses are JSON. Dates are ISO strings (`yyyy-MM-dd` for dates, ISO 8601 for timestamps).
* **Authentication:** JWT access and refresh tokens delivered as `httpOnly` cookies (`accessToken`, `refreshToken`). The frontend sends them automatically with `credentials: "include"`; no `Authorization` header is used. All endpoints except `/api/auth/**` require a valid access token.
* **Ownership:** every company and job ad belongs to the authenticated user. Requesting another user's resource (or a non-existent id) is rejected; the service layer raises 404 so resource existence is not leaked.
* **Errors:** error responses have the shape `{ "message": "..." }`. Validation failures return the first field error, e.g. `{ "message": "Title is required" }` with status 400.
* **CORS:** configured for the frontend origin `http://localhost:3000` with credentials enabled.

## Authentication: `/api/auth`

| Method | Path | Description | Success | Errors |
| :--- | :--- | :--- | :--- | :--- |
| POST | `/api/auth/register` | Create an account. Also creates a default `UserPreference` row. | 201 + user | 400 validation, 409 email already exists |
| POST | `/api/auth/login` | Verify credentials and set both auth cookies. | 200 + user | 401 invalid credentials |
| POST | `/api/auth/refresh` | Rotate both tokens using the `refreshToken` cookie. | 204 | 401 missing/invalid/expired token |
| POST | `/api/auth/logout` | Clear both auth cookies. | 204 | |
| GET | `/api/auth/me` | Return the currently authenticated user. | 200 + user | 401 not authenticated |

**Register request:**
```json
{ "firstName": "Gustav", "lastName": "Eriksen", "email": "user@example.com", "password": "..." }
```

**Login request:**
```json
{ "email": "user@example.com", "password": "..." }
```

**User response (register, login, me):**
```json
{ "id": "<uuid>", "firstName": "Gustav", "lastName": "Eriksen", "email": "user@example.com", "createdAt": "2026-06-12T10:00:00" }
```

Token lifetimes and cookie flags are configured in `application-secret.yaml` (defaults: access 15 minutes, refresh 7 days, `SameSite=Lax`).

## Companies (Unsolicited): `/api/companies`

| Method | Path | Description | Success |
| :--- | :--- | :--- | :--- |
| GET | `/api/companies` | List all companies for the logged-in user. | 200 + array |
| POST | `/api/companies` | Create a company. | 201 + company |
| GET | `/api/companies/{id}` | Get one company (owned). | 200 + company |
| PUT | `/api/companies/{id}` | Full update of a company (owned). | 200 + company |
| DELETE | `/api/companies/{id}` | Delete a company (owned). | 204 |

**Request body (POST/PUT):** all fields below except `id`. Required: `name`, `status`.

**Company response:**
```json
{
  "id": "<uuid>",
  "name": "Qonto",
  "description": "Business banking platform...",
  "size": "1000-1500 employees",
  "tags": ["FinTech", "B2B"],
  "address": "18 Rue de Navarin, 75009 Paris",
  "websiteUrl": "https://qonto.com",
  "status": "In Process",
  "priority": 5,
  "relevance": null,
  "salary": "3 800 € per month",
  "interviewDate": "2026-06-22",
  "offerDate": null,
  "followUpDate": null
}
```

* `status` is one of `"Submitted"`, `"In Process"`, `"Pending"`.
* `priority` is an integer 0-5.
* The three dates are null until the corresponding event happens.
* `name` is globally unique.

## Job Ads (Targeted): `/api/job-ads`

| Method | Path | Description | Success |
| :--- | :--- | :--- | :--- |
| GET | `/api/job-ads` | List all job ads for the logged-in user. | 200 + array |
| POST | `/api/job-ads` | Create a job ad. | 201 + job ad |
| GET | `/api/job-ads/{id}` | Get one job ad (owned). | 200 + job ad |
| PUT | `/api/job-ads/{id}` | Full update of a job ad (owned). | 200 + job ad |
| DELETE | `/api/job-ads/{id}` | Delete a job ad (owned). | 204 |

**Request body (POST/PUT):** all fields below except `id`. Required: `title`, `status`.

**Job ad response:**
```json
{
  "id": "<uuid>",
  "title": "Senior Frontend Engineer",
  "companyName": "Stripe",
  "status": "In Process",
  "postDate": "2026-05-15",
  "startDate": "2026-08-01",
  "appliedDate": "2026-05-17",
  "link": "https://stripe.com/jobs",
  "description": "Design and build...",
  "tags": ["React", "TypeScript", "Remote"],
  "priority": "Very High",
  "salary": "120 000 $ per year",
  "applicationFollowUp": "2026-05-24",
  "interviewFollowUp": null,
  "interviewOffer": "2026-06-02",
  "jobOffer": null
}
```

* `status` is one of `"Submitted"`, `"In Process"`, `"Pending"`.
* `priority` is a label: `"Very High"`, `"High"`, `"Medium"`, `"Low"`, `"Very Low"`, or `"None"`.
* The four follow-up/offer dates are null until the corresponding event happens; the UI renders them as a received/not-received timeline.
* `appliedDate` defaults to today in the UI when creating a new job ad.

## Known issue

Errors raised outside controller `@ExceptionHandler`s (such as the service layer's 404 for missing/foreign resources) are currently surfaced as **403** instead of their intended status, because Spring Security blocks the `/error` dispatch. Fix planned in `SecurityConfig` (permit the error dispatch).
