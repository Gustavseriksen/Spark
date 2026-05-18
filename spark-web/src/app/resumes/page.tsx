import { AppSidebar } from "@/components/app-sidebar"
import { FileCard } from "@/components/file-card"
import { RequireAuth } from "@/components/require-auth"
import { SiteHeader } from "@/components/site-header"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"

import data from "./data.json"

export default function Page() {
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
                  <h1 className="text-2xl font-semibold tracking-tight">Resumes</h1>
                  <p className="text-muted-foreground">Manage and organize your resumes.</p>
                </div>
                <div className="flex flex-wrap gap-6 px-4 lg:px-6">
                  {data.map((file) => (
                    <FileCard
                      key={file.id}
                      formatFile={file.format as "pdf" | "doc" | "txt" | "md"}
                      name={file.name}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </SidebarInset>
      </SidebarProvider>
    </RequireAuth>
  )
}
