import React from 'react'
import { useNavigate } from 'react-router-dom'
import LoginForm from "@/components/auth/login-form"
import { Button } from "@/components/ui/button"
import { checkBusinessExists } from "@/services/auth-actions"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from '@/components/ui/empty'
import { HugeiconsIcon } from '@hugeicons/react'
import { Building01Icon } from '@hugeicons/core-free-icons'

export function LoginPage() {
  const navigate = useNavigate()
  const [businessExists, setBusinessExists] = React.useState<boolean | null>(null)
  const [isChecking, setIsChecking] = React.useState(true)

  React.useEffect(() => {
    async function checkBusiness() {
      try {
        await new Promise(resolve => setTimeout(resolve, 0))

        const result = await checkBusinessExists()
        const businessExists = result?.exists || result?.hasBusiness

        if (!businessExists) {
          setBusinessExists(false)
          return
        }

        setIsChecking(false)
      } catch (error: any) {
        console.warn('[LoginRoute] Error checking business:', error?.message || error)
        setIsChecking(false)
      }
    }

    checkBusiness()
  }, [navigate])

  if (businessExists === false) {
    return (
      <div className="w-full h-dvh flex items-center justify-center">
        <Empty>
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <HugeiconsIcon icon={Building01Icon} strokeWidth={2}/>
            </EmptyMedia>
            <EmptyTitle>No existe un negocio</EmptyTitle>
            <EmptyDescription>Por favor, contacta con tu administrador para crear un negocio.</EmptyDescription>
          </EmptyHeader>
        </Empty>
      </div>
    )
  }


  return (
    <div className="w-full h-dvh flex flex-col">
      <header className="w-full px-6 flex items-center justify-between h-16">
        <img src="/iso-light.svg" className="dark:block hidden" alt="ApeDash Logo" width={25} height={20} />
        <img src="/iso.svg" className="block dark:hidden" alt="ApeDash Logo" width={25} height={20} />
        <Dialog>
          <DialogTrigger asChild> 
            <Button variant="outline" size="sm">Conoce más</Button>
          </DialogTrigger>
          <DialogContent showCloseButton={false}>
            <DialogHeader>
              <DialogTitle>Conoce más</DialogTitle>
              <DialogDescription>
                Accede a nuestra página web para conocer más sobre Kapok Preview y Kapok Online.
              </DialogDescription>
            </DialogHeader>
            <div className='flex justify-between items-center'>
              <span>freecloud.pe</span>
              <span>apeinlab.com</span>
            </div>
          </DialogContent>
        </Dialog>
      </header>
      <div className="flex-1 flex items-center justify-center">
        <LoginForm />
      </div>
    </div>
  )
}
