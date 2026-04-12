# Database Schema (PostgreSQL)

## 1. `users` Table
*Stores the core user account.*
| Column | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | UUID | PRIMARY KEY | Unique identifier |
| `first_name` | VARCHAR(100) | NOT NULL | Used for avatar greetings |
| `last_name` | VARCHAR(100) | NOT NULL | User's last name |
| `email` | VARCHAR(255) | UNIQUE, NOT NULL | User's email |
| `password_hash`| VARCHAR(255) | NOT NULL | Encrypted password |
| `created_at` | TIMESTAMP | NOT NULL | Account creation date |

## 2. `user_preferences` Table
*Stores the matching weights and user goals. 1-to-1 with users.*
| Column | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | UUID | PRIMARY KEY | Unique identifier |
| `user_id` | UUID | FOREIGN KEY, UNIQUE | Links to `users` |
| `weekly_goal` | INTEGER | DEFAULT 10 | Target applications per week |
| `weight_salary` | INTEGER | CHECK (1-5) | Importance of salary |
| `weight_commute` | INTEGER | CHECK (1-5) | Importance of commute |
| `weight_size` | INTEGER | CHECK (1-5) | Importance of company size |

## 3. `companies` Table (Unsolicited)
*Companies the user is tracking but might not have a specific ad for.*
| Column | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | UUID | PRIMARY KEY | Unique identifier |
| `user_id` | UUID | FOREIGN KEY | Belongs to a user |
| `name` | VARCHAR(255) | UNIQUE, NOT NULL | Company name |
| `description` | TEXT | | Short info |
| `size` | VARCHAR(50) | | SMALL, MEDIUM, LARGE |
| `tags` | TEXT[] | | Array of strings (e.g., ['Tech', 'Startup']) |
| `address` | VARCHAR(555) | | Physical address for Google Maps API |
| `website_url` | VARCHAR(255) | | Link to company |
| `status` | VARCHAR(50) | NOT NULL | APPLIED, NOT_APPLIED |
| `priority` | INTEGER | CHECK (1-5) | How badly user wants it |
| `relevance` | INTEGER | CHECK (1-5) | Skill match |
| `salary` | VARCHAR(100) | | Expected/Known Salary |
| `has_interview`| BOOLEAN | DEFAULT FALSE | Offered an interview? |
| `has_offer` | BOOLEAN | DEFAULT FALSE | Offered the job? |

## 4. `job_ads` Table (Targeted)
*Specific job postings. Can optionally link to a company.*
| Column | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | UUID | PRIMARY KEY | Unique identifier |
| `user_id` | UUID | FOREIGN KEY | Belongs to a user |
| `company_id` | UUID | FOREIGN KEY (Nullable)| Links to `companies` (optional) |
| `title` | VARCHAR(255) | NOT NULL | Job title |
| `ad_url` | VARCHAR(500) | | Link to posting |
| `ad_description`| TEXT | | Saved text of the job description |
| `application_text`| TEXT | | Saved text of the sent cover letter |
| `resume_url` | VARCHAR(500) | | Link to PDF in Cloud Storage |
| `status` | VARCHAR(50) | NOT NULL | APPLIED, NOT_APPLIED |
| `post_date` | DATE | | When the ad was created |
| `start_date` | DATE | | When the job starts |
| `applied_date` | DATE | DEFAULT CURRENT_DATE| Date applied |
| `tags` | TEXT[] | | Array of strings |
| `priority` | INTEGER | CHECK (1-5) | How badly user wants it |
| `relevance` | INTEGER | CHECK (1-5) | Skill match |
| `salary` | VARCHAR(100) | | Expected/Known Salary |
| `has_interview`| BOOLEAN | DEFAULT FALSE | Offered an interview? |
| `has_offer` | BOOLEAN | DEFAULT FALSE | Offered the job? |
| `match_score` | NUMERIC | | Calculated algorithm % |