import React from 'react'
import { useNavigate } from 'react-router-dom'
import { SignupForm } from "@/components/auth/signup-form"
import { Button } from "@/components/ui/button"
import { checkBusinessExists } from "@/services/auth-actions"

export function SignupPage() {
  const navigate = useNavigate()
  const [isChecking, setIsChecking] = React.useState(true)

  React.useEffect(() => {
    async function checkBusiness() {
      try {
        const result = await checkBusinessExists()
        const businessExists = result?.exists || result?.hasBusiness
        
        if (businessExists) {
          navigate('/login', { replace: true })
          return
        }
        
        setIsChecking(false)
      } catch (error: any) {
        console.warn('[SignupRoute] Error checking business:', error?.message || error)
        navigate('/login', { replace: true })
      }
    }

    checkBusiness()
  }, [navigate])

  console.log('isChecking:', isChecking)

  if (isChecking) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
        <div>Verificando...</div>
      </div>
    )
  }

  return (
    <div className="h-dvh flex flex-col">
      <header className="w-full px-6 flex items-center justify-between h-16">
        <img src="/iso-light.svg" className="dark:block hidden" alt="ApeDash Logo" width={25} height={20} />
        <img src="/iso.svg" className="block dark:hidden" alt="ApeDash Logo" width={25} height={20} />
        <Button variant="outline" size="sm">Soporte</Button>
      </header>
      <div className="flex-1 flex items-center justify-center">
        <SignupForm />
      </div>
    </div>
  )
}
