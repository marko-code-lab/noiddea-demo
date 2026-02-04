import { SessionGuard } from "@/components/session/session-guard"
import { Providers } from "@/components/providers"
import { Routes, Route } from "react-router-dom"
import { SessionIndex } from "./session/index"

export function SessionPage() {
  return (
    <Providers>
      <SessionGuard>  
        <Routes>
          <Route index element={<SessionIndex />} />
        </Routes>
      </SessionGuard>
    </Providers>
  )
}
