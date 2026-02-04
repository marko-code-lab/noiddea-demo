import { Routes, Route, Navigate } from 'react-router-dom'
import { ThemeProvider } from '@/components/providers/theme-provider'
import { QueryProvider } from '@/components/providers/query-provider'
import { ErrorBoundary } from '@/components/error-boundary'
import { Toaster } from '@/components/ui/sonner'

// Route components
import { LoginPage } from '@/pages/login'
import { SessionPage } from '@/pages/session'
import React, { useEffect } from 'react'
import { checkBusinessExists } from './services'

export function App() {
  const [businessExists, setBusinessExists] = React.useState<boolean | null>(null)

  useEffect(() => {
    checkBusinessExists().then((result) => {
      setBusinessExists(result?.exists || result?.hasBusiness)
    }).catch((error) => {
      console.error('Error checking business existence:', error)
    })
  }, [])
  if (businessExists === null) {
    return null
  }

  return (
    <ErrorBoundary>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <QueryProvider>
          <Toaster position="top-center" />
          <Routes>
            <Route path="/" element={<LoginPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/session/*" element={<SessionPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </QueryProvider>
      </ThemeProvider>
    </ErrorBoundary>
  )
}