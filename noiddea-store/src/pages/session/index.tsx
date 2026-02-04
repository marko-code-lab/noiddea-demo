import { SessionList, SessionSidebar } from "@/components/session"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { StoreProvider } from "@/components/providers"

export function SessionIndex() {
  return (
    <StoreProvider>
      <SidebarProvider style={{ "--sidebar-width": "450px" } as React.CSSProperties}>
        <SessionSidebar/>
        <SidebarInset className="overflow-hidden">
          <SessionList />
        </SidebarInset>
      </SidebarProvider>
    </StoreProvider>
  )
}
