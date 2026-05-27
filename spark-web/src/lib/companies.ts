const BASE = "http://localhost:8080/api/companies"

// Shape of a company returned from the API (always includes server-assigned id)
export interface CompanyDto {
  id: string
  name: string
  description: string | null
  size: string | null
  tags: string[]
  address: string | null
  websiteUrl: string | null
  status: string
  priority: number | null
  relevance: number | null
  salary: string | null
  interviewDate: string | null
  offerDate: string | null
  followUpDate: string | null
}

// Shape of a company sent to the API (no id — the server assigns it)
export interface CompanyPayload {
  name: string
  description: string | null
  size: string | null
  tags: string[]
  address: string | null
  websiteUrl: string | null
  status: string
  priority: number | null
  relevance: number | null
  salary: string | null
  interviewDate: string | null
  offerDate: string | null
  followUpDate: string | null
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

// Fetches all companies for the logged-in user
export function listCompanies(): Promise<CompanyDto[]> {
  return request<CompanyDto[]>("")
}

// Creates a new company and returns the saved record
export function createCompany(payload: CompanyPayload): Promise<CompanyDto> {
  return request<CompanyDto>("", { method: "POST", body: JSON.stringify(payload) })
}

// Updates an existing company by ID
export function updateCompany(id: string, payload: CompanyPayload): Promise<CompanyDto> {
  return request<CompanyDto>(`/${id}`, { method: "PUT", body: JSON.stringify(payload) })
}

// Deletes a company by ID
export function deleteCompany(id: string): Promise<void> {
  return request<void>(`/${id}`, { method: "DELETE" })
}
