import LoginForm from "@/components/auth/login-form"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'

export function LoginPage() {
  return (
    <div className="w-full h-dvh flex flex-col">
      <header className="w-full px-6 flex items-center justify-between h-16">
        <img src="/iso-light.svg" className="dark:block hidden" alt="ApeDash Logo" width={25} height={20} />
        <img src="/iso.svg" className="block dark:hidden" alt="ApeDash Logo" width={25} height={20} />
        <Dialog>
          <DialogTrigger>
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
