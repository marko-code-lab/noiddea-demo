import { Outlet } from 'react-router-dom'
import { DashSidebar } from "@/components/dashboard/dash-sidebar"
import { DashboardGuard } from "@/components/dashboard/dashboard-guard"
import { Providers, StoreProvider } from "@/components/providers"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"

export function DashboardLayout() {
  return (
    <Providers>
      <StoreProvider>
        <DashboardGuard>
          <SidebarProvider>
            <DashSidebar/>
            <SidebarInset className="overflow-hidden h-dvh">
              <Outlet />
            </SidebarInset>
          </SidebarProvider>
        </DashboardGuard>
      </StoreProvider>
    </Providers>
  )
}
