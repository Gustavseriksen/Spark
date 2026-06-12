"use client"

import { useCallback, useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { AppSidebar } from "@/components/app-sidebar"
import { DataTable } from "@/components/data-table"
import { RequireAuth } from "@/components/require-auth"
import { SiteHeader } from "@/components/site-header"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { listJobAds, type JobAdDto } from "@/lib/job-ads"

export default function Page() {
  const [jobAds, setJobAds] = useState<JobAdDto[]>([])
  const router = useRouter()

  // Loads job ads from the API — redirects to login if the session has expired
  const refresh = useCallback(() => {
    listJobAds()
      .then(setJobAds)
      .catch(() => router.push("/login"))
  }, [router])

  // Fetch job ads on initial page load
  useEffect(() => {
    refresh()
  }, [refresh])

  return (
    <RequireAuth>
      <SidebarProvider
        style={
          {
            "--sidebar-width": "calc(var(--spacing) * 72)",
            "--header-height": "calc(var(--spacing) * 12)",
          } as React.CSSProperties
        }
      >
        <AppSidebar variant="inset" />
        <SidebarInset>
          <SiteHeader />
          <div className="flex flex-1 flex-col">
            <div className="@container/main flex flex-1 flex-col gap-2">
              <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
                <div className="flex flex-col gap-1 px-4 lg:px-6">
                  <h1 className="text-2xl font-semibold tracking-tight">Targeted Applications</h1>
                  <p className="text-muted-foreground">Jobs you&apos;re actively pursuing.</p>
                </div>
                <DataTable data={jobAds} onRefresh={refresh} />
              </div>
            </div>
          </div>
        </SidebarInset>
      </SidebarProvider>
    </RequireAuth>
  )
}
