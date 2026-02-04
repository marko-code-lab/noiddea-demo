"use client";

import { HugeiconsIcon } from "@hugeicons/react";
import { Button } from "../ui/button";
import { Sidebar, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "../ui/sidebar";
import { Logout01Icon, ShoppingCart01Icon, TransactionHistoryIcon } from "@hugeicons/core-free-icons";
import { useUser } from "../providers/user-provider";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { cn } from "@/lib/utils";
import { SessionCart } from "./session-sidebar-cart";
import { SessionDetails } from "./session-sidebar-details";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogMedia, AlertDialogTitle, AlertDialogTrigger } from "../ui/alert-dialog";
import { signOut } from "@/services/auth";
import { isNative } from "@/lib/native";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { closeUserSessionClient } from "@/lib/db/client-actions";
import { useBranch } from "../providers/branch-provider";
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";
import { formatCurrency } from "@/lib/currency";

export function SessionSidebar() {
  const { user } = useUser();
  const { branch } = useBranch();
  const navigate = useNavigate();
  const [tab, setTab] = useState<"cart" | "history">("cart");

  const handleLogout = async () => {
    try {
      // En modo Electron, cerrar la sesión de trabajo primero usando la función cliente
      if (typeof window !== 'undefined' && isNative() && user && branch) {
        try {
          const closeResult = await closeUserSessionClient(user.id, branch.id);
          if (!closeResult.success) {
            console.warn('[handleLogout] No se pudo cerrar sesión de trabajo:', closeResult.error);
          }
        } catch (e) {
          console.warn('[handleLogout] Error al cerrar sesión de trabajo:', e);
          // No bloquear el logout si falla el cierre de sesión
        }
      }

      // Limpiar localStorage en modo Electron antes de cerrar sesión
      if (typeof window !== 'undefined' && isNative()) {
        try {
          localStorage.removeItem('kapok-session-token');
          localStorage.removeItem('kapok-session-user');
        } catch (e) {
          console.warn('[handleLogout] No se pudo limpiar localStorage:', e);
        }
      }

      // Esperar un momento para asegurar que la sesión se cerró antes de signOut
      await new Promise(resolve => setTimeout(resolve, 100));

      const result = await signOut();
      if (result?.shouldRedirect && result?.redirectTo) {
        toast.success("Sesión cerrada exitosamente");
        navigate(result.redirectTo, { replace: true });
      } else {
        toast.success("Sesión cerrada exitosamente");
        navigate("/login", { replace: true });
      }
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
      toast.error("Error al cerrar sesión");
      // Limpiar localStorage de todos modos
      if (typeof window !== 'undefined' && isNative()) {
        try {
          localStorage.removeItem('kapok-session-token');
          localStorage.removeItem('kapok-session-user');
        } catch (e) {
          // Ignorar error
        }
      }
      // Intentar redirigir de todos modos
      navigate("/login", { replace: true });
    }
  };

  return (
    <Sidebar>
      <Tabs className={cn("h-full overflow-hidden")} value={tab} onChange={() => setTab}>
        <SidebarHeader>
          <SidebarMenu className="flex flex-row! items-center justify-between">
            <Dialog>
              <DialogTrigger asChild>
                <SidebarMenuItem className="flex-1">
                  <SidebarMenuButton size="lg" className="w-min">
                    <Avatar>
                      <AvatarImage src="/avatar.png" className="grayscale" />
                      <AvatarFallback>
                        {user?.name?.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                      <span className="text-sm font-medium">{user?.name}</span>
                      <span className="text-xs text-muted-foreground">{user?.email}</span>
                    </div>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </DialogTrigger>
              <DialogContent showCloseButton={false}>
                <DialogHeader>
                  <DialogTitle>Cuenta</DialogTitle>
                </DialogHeader>
                <Avatar className="mx-auto size-34">
                  <AvatarImage src="/avatar.png" />
                  <AvatarFallback>{user?.name?.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="flex flex-col gap-2">
                  <div className="flex justify-between items-center">
                    <span>Nombre</span>
                    <span className="text-muted-foreground">{user?.name}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Email</span>
                    <span className="text-muted-foreground">{user?.email}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Teléfono</span>
                    <span className="text-muted-foreground">+51 {user?.phone}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Bonificaciones</span>
                    <span className="text-muted-foreground">{user?.benefit ? formatCurrency(user.benefit) : formatCurrency(0)}</span>
                  </div>
                </div>
                <DialogFooter>
                  <DialogClose asChild>
                    <Button variant="outline">Cerrar</Button>
                  </DialogClose>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="destructive">
                        Finalizar sesión
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent size="sm">
                      <AlertDialogHeader>
                        <AlertDialogMedia className="bg-destructive/10 text-destructive dark:bg-destructive/20 dark:text-destructive">
                          <HugeiconsIcon icon={Logout01Icon} strokeWidth={2} />
                        </AlertDialogMedia>
                        <AlertDialogTitle>Confirmar cierre de sesión</AlertDialogTitle>
                        <AlertDialogDescription>Verifique sus ventas y bonificaciones antes de confirmar</AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction variant="destructive" onClick={handleLogout}>Confirmar</AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </DialogFooter>
              </DialogContent>
            </Dialog>
            <SidebarMenuItem>
              <TabsList>
                <TabsTrigger value="cart" onClick={() => setTab('cart')}>
                  <HugeiconsIcon icon={ShoppingCart01Icon} strokeWidth={2} />
                  Carrito
                </TabsTrigger>
                <TabsTrigger value="history" onClick={() => setTab('history')}>
                  <HugeiconsIcon icon={TransactionHistoryIcon} strokeWidth={2} />
                  Historial
                </TabsTrigger>
              </TabsList>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarHeader>
        <TabsContent value="cart" className="h-full">
          <SessionCart />
        </TabsContent>
        <TabsContent value="history" className="h-full">
          <SessionDetails />
        </TabsContent>
      </Tabs>
    </Sidebar>
  );
}