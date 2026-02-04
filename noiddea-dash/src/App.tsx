import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { ThemeProvider } from '@/components/providers/theme-provider'
import { QueryProvider } from '@/components/providers/query-provider'
import { ErrorBoundary } from '@/components/error-boundary'
import { Toaster } from '@/components/ui/sonner'
import { checkBusinessExists } from '@/services/auth-actions'

import { SignupPage } from '@/pages/signup'
import { LoginPage } from '@/pages/login'
import { DashboardLayout } from '@/pages/dashboard/layout'

import { DashboardPage as DashboardIndex } from '@/pages/dashboard/index'
import { TeamPage as DashboardTeam } from '@/pages/dashboard/team'
import { ProductsPage as DashboardProducts } from '@/pages/dashboard/products'
import { CustomersPage as DashboardCustomers } from '@/pages/dashboard/customers'
import { SessionsPage as DashboardSessions } from '@/pages/dashboard/sessions'
import { SuppliersPage as DashboardSuppliers } from '@/pages/dashboard/suppliers'
import { SettingsPage as DashboardSettings } from '@/pages/dashboard/settings'
import { SubscriptionPage as DashboardSubscription } from '@/pages/dashboard/subscription'
import { PurchasesPage as DashboardPurchases } from '@/pages/dashboard/purchases/index'
import { CreatePurchasePage as DashboardPurchasesCreate } from '@/pages/dashboard/purchases/create'
import { AccountPage } from '@/pages/dashboard/account'

export function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <QueryProvider>
          <Toaster position="top-center" />
          <Routes>
            <Route path="/" element={<IndexRedirect />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/dashboard" element={<DashboardLayout />}>
              <Route index element={<DashboardIndex />} />
              <Route path="team" element={<DashboardTeam />} />
              <Route path="products" element={<DashboardProducts />} />
              <Route path="customers" element={<DashboardCustomers />} />
              <Route path="sessions" element={<DashboardSessions />} />
              <Route path="suppliers" element={<DashboardSuppliers />} />
              <Route path="settings" element={<DashboardSettings />} />
              <Route path="subscription" element={<DashboardSubscription />} />
              <Route path="account" element={<AccountPage />} />
              <Route path="purchases">
                <Route index element={<DashboardPurchases />} />
                <Route path="create" element={<DashboardPurchasesCreate />} />
              </Route>
            </Route>
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </QueryProvider>
      </ThemeProvider>
    </ErrorBoundary>
  )
}

function IndexRedirect() {
  const [checking, setChecking] = React.useState(true)
  const [businessExists, setBusinessExists] = React.useState<boolean | null>(null)

  React.useEffect(() => {
    checkBusinessExists()
      .then((result) => {
        const businessExists = result?.exists || result?.hasBusiness
        // Will be handled by Navigate component below
        setBusinessExists(businessExists)
        setChecking(false)
      })
      .catch(() => {
        setChecking(false)
      })
  }, [])

  if (checking) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
        <div>Cargando...</div>
      </div>
    )
  }
  if (businessExists) {
    return <Navigate to="/login" replace />
  }

  return <Navigate to="/signup" replace />
}
