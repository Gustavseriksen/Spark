const BASE = "http://localhost:8080/api/job-ads"

// Shape of a job ad returned from the API (always includes server-assigned id)
export interface JobAdDto {
  id: string
  title: string
  companyName: string | null
  status: string
  postDate: string | null
  startDate: string | null
  appliedDate: string | null
  link: string | null
  description: string | null
  tags: string[]
  priority: string | null
  salary: string | null
  applicationFollowUp: string | null
  interviewFollowUp: string | null
  interviewOffer: string | null
  jobOffer: string | null
}

// Shape of a job ad sent to the API (no id — the server assigns it)
export interface JobAdPayload {
  title: string
  companyName: string | null
  status: string
  postDate: string | null
  startDate: string | null
  appliedDate: string | null
  link: string | null
  description: string | null
  tags: string[]
  priority: string | null
  salary: string | null
  applicationFollowUp: string | null
  interviewFollowUp: string | null
  interviewOffer: string | null
  jobOffer: string | null
}

// Shared fetch wrapper: attaches auth cookie, sets JSON headers, and throws on error
async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    ...init,
    credentials: "include",
    headers: { "Content-Type": "application/json", ...init?.headers },
  })
  if (!res.ok) {
    const body = await res.json().catch(() => ({}))
    throw new Error(body.message ?? `Request failed: ${res.status}`)
  }
  return res.status === 204 ? (undefined as T) : res.json()
}

// Fetches all job ads for the logged-in user
export function listJobAds(): Promise<JobAdDto[]> {
  return request<JobAdDto[]>("")
}

// Creates a new job ad and returns the saved record
export function createJobAd(payload: JobAdPayload): Promise<JobAdDto> {
  return request<JobAdDto>("", { method: "POST", body: JSON.stringify(payload) })
}

// Updates an existing job ad by ID
export function updateJobAd(id: string, payload: JobAdPayload): Promise<JobAdDto> {
  return request<JobAdDto>(`/${id}`, { method: "PUT", body: JSON.stringify(payload) })
}

// Deletes a job ad by ID
export function deleteJobAd(id: string): Promise<void> {
  return request<void>(`/${id}`, { method: "DELETE" })
}
