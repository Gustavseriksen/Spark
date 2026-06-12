# Database Schema (PostgreSQL)

The schema is managed by Hibernate (`ddl-auto: update`) and derived from the JPA entities in `spark-api/src/main/java/com/gustaveriksen/spark/entity/`. The entities are the source of truth; this document mirrors them.

> **Note on tags:** tags are stored in separate collection tables (`company_tags`, `job_ad_tags`) via JPA `@ElementCollection`, not as PostgreSQL arrays.

## 1. `users` Table
*Stores the core user account.*
| Column | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | UUID | PRIMARY KEY | Unique identifier |
| `first_name` | VARCHAR(100) | NOT NULL | Used for avatar greetings |
| `last_name` | VARCHAR(100) | NOT NULL | User's last name |
| `email` | VARCHAR(255) | UNIQUE, NOT NULL | User's email (login identifier) |
| `password_hash`| VARCHAR(255) | NOT NULL | BCrypt-hashed password |
| `created_at` | TIMESTAMP | NOT NULL | Account creation date (set automatically) |

## 2. `user_preferences` Table
*Stores the matching weights and user goals. 1-to-1 with users, created automatically on registration.*
| Column | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | UUID | PRIMARY KEY | Unique identifier |
| `user_id` | UUID | FOREIGN KEY, UNIQUE, NOT NULL | Links to `users` |
| `weekly_goal` | INTEGER | NOT NULL, default 10 | Target applications per week |
| `weight_salary` | INTEGER | | Importance of salary (intended 1-5) |
| `weight_commute` | INTEGER | | Importance of commute (intended 1-5) |
| `weight_size` | INTEGER | | Importance of company size (intended 1-5) |

## 3. `companies` Table (Unsolicited Applications)
*Companies the user wants to cold-contact, without a specific job ad.*
| Column | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | UUID | PRIMARY KEY | Unique identifier |
| `user_id` | UUID | FOREIGN KEY, NOT NULL | Belongs to a user |
| `name` | VARCHAR(255) | UNIQUE, NOT NULL | Company name |
| `description` | TEXT | | Company description |
| `size` | VARCHAR(50) | | Free text, e.g. "650 employees" |
| `address` | VARCHAR(555) | | Physical address (future commute calculation) |
| `website_url` | VARCHAR(255) | | Link to company website |
| `status` | VARCHAR(50) | NOT NULL | "Submitted", "In Process", or "Pending" |
| `priority` | INTEGER | | How badly the user wants it (0-5, shown as dots) |
| `relevance` | INTEGER | | Skill match (reserved, not in the UI yet) |
| `salary` | VARCHAR(255) | | Expected/known salary, free text |
| `interview_date` | DATE | | Date an interview was received (null = none) |
| `offer_date` | DATE | | Date an offer was received (null = none) |
| `follow_up_date` | DATE | | Date of follow-up (null = none) |

### 3a. `company_tags` Table
| Column | Type | Description |
| :--- | :--- | :--- |
| `company_id` | UUID | FK to `companies` |
| `tag` | VARCHAR(255) | One industry tag, e.g. "FinTech" |

## 4. `job_ads` Table (Targeted Applications)
*Specific job postings the user is applying to.*
| Column | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | UUID | PRIMARY KEY | Unique identifier |
| `user_id` | UUID | FOREIGN KEY, NOT NULL | Belongs to a user |
| `title` | VARCHAR(255) | NOT NULL | Job title |
| `company_name` | VARCHAR(255) | | Company name, free text |
| `status` | VARCHAR(50) | NOT NULL | "Submitted", "In Process", or "Pending" |
| `post_date` | DATE | | When the ad was posted |
| `start_date` | DATE | | When the job starts |
| `applied_date` | DATE | | Date applied (UI defaults to today) |
| `ad_url` | VARCHAR(500) | | Link to the posting (entity field: `link`) |
| `ad_description` | TEXT | | Saved text of the job description (entity field: `description`) |
| `priority_label` | VARCHAR(20) | | "Very High", "High", "Medium", "Low", "Very Low", or "None" |
| `salary` | VARCHAR(255) | | Expected/known salary, free text |
| `application_follow_up` | DATE | | Date the application follow-up happened (null = not yet) |
| `interview_follow_up` | DATE | | Date the interview follow-up happened (null = not yet) |
| `interview_offer` | DATE | | Date an interview was offered (null = not yet) |
| `job_offer` | DATE | | Date a job offer was received (null = not yet) |

### 4a. `job_ad_tags` Table
| Column | Type | Description |
| :--- | :--- | :--- |
| `job_ad_id` | UUID | FK to `job_ads` |
| `tag` | VARCHAR(255) | One tag, e.g. "React" |

> **Legacy columns:** development databases created before Story 3.3 may still contain orphaned `job_ads` columns (`company_id`, `application_text`, `resume_url`, `has_interview`, `has_offer`, `match_score`, `relevance`, and the old integer `priority`). They are no longer mapped by the entity; `ddl-auto: update` adds columns but never drops them. A fresh database will not have them.
