'use client';

import { Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarHeader, SidebarMenu, SidebarMenuBadge, SidebarMenuButton, SidebarMenuItem } from "../ui/sidebar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "../ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { HugeiconsIcon } from "@hugeicons/react";
import { ClockIcon, CreditCardIcon, LayoutIcon, LogoutIcon, PackageIcon, SettingsIcon, ShoppingCartIcon, TruckIcon, UserIcon, SunIcon, UserGroupIcon, UserMultiple02Icon, UnfoldMoreIcon } from "@hugeicons/core-free-icons";
import { useAuth, useBusiness, useSelectedBranch, useUser } from "@/hooks";
import { useTheme } from "next-themes";

const sidebarItems = {
  home: [
    {
      label: 'Dashboard',
      href: '/dashboard',
      icon: <HugeiconsIcon icon={LayoutIcon} strokeWidth={2} />,
    },
    {
      label: 'Subscripción',
      href: '/dashboard/subscription',
      icon: <HugeiconsIcon icon={CreditCardIcon} strokeWidth={2} />,
    },
    {
      label: 'Configuración',
      href: '/dashboard/settings',
      icon: <HugeiconsIcon icon={SettingsIcon} strokeWidth={2} />,
    },
  ],
  company: [
    {
      label: 'Productos',
      href: '/dashboard/products',
      icon: <HugeiconsIcon icon={PackageIcon} strokeWidth={2} />,
    },
    {
      label: 'Proveedores',
      href: '/dashboard/suppliers',
      icon: <HugeiconsIcon icon={TruckIcon} strokeWidth={2} />,
    },
    {
      label: 'Equipo',
      href: '/dashboard/team',
      icon: <HugeiconsIcon icon={UserMultiple02Icon} strokeWidth={2} />,
    },
    {
      label: 'Pedidos',
      href: '/dashboard/purchases',
      icon: <HugeiconsIcon icon={ShoppingCartIcon} strokeWidth={2} />,
    },
    {
      label: 'Sesiones',
      href: '/dashboard/sessions',
      icon: <HugeiconsIcon icon={ClockIcon} strokeWidth={2} />,
    },
    {
      label: 'Clientes',
      href: '/dashboard/customers',
      icon: <HugeiconsIcon icon={UserGroupIcon} strokeWidth={2} />,
    },
  ]
}

export function DashSidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { business } = useBusiness();
  const { user } = useUser();
  const { signOut } = useAuth();
  const { isOwner } = useSelectedBranch();
  const { theme, setTheme } = useTheme();

  // Helper function to check if a route is active
  const isRouteActive = (href: string) => {
    if (href === '/dashboard') {
      // For dashboard root, only match exactly
      return location.pathname === href;
    }
    // For other routes, check if pathname starts with the href
    return location.pathname === href || location.pathname.startsWith(href + '/');
  };

  return <Sidebar>
    <SidebarHeader>
      <SidebarMenu>
        <SidebarMenuButton size="lg">
          <div className="size-8 rounded-md bg-primary flex items-center justify-center">
            <img src="/iso-light.svg" alt="Ape" width={25} height={36} className="dark:hidden block" />
            <img src="/iso.svg" alt="Ape" width={25} height={36} className="dark:block hidden" />
          </div>
          <div className="grid flex-1 text-left text-sm leading-tight">
            <span className="truncate font-medium">{business?.name}</span>
            <span className="truncate text-xs text-muted-foreground">
              {isOwner ? 'Propietario' : 'Cajero'}
            </span>
          </div>
        </SidebarMenuButton>
      </SidebarMenu>
    </SidebarHeader>
    <SidebarContent>
      <SidebarGroup>
        <SidebarGroupContent>
          <SidebarMenu>
            {sidebarItems.home.map(item => (
              <Link to={item.href} key={item.href}>
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton isActive={isRouteActive(item.href)}>
                    {item.icon}
                    {item.label}
                  </SidebarMenuButton>
                  {item.label === 'Configuración' && (!business?.location || !business?.tax_id) && (
                    <SidebarMenuBadge>
                      Completar
                    </SidebarMenuBadge>
                  )}
                </SidebarMenuItem>
              </Link>
            ))}
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>
      <SidebarGroup>
        <SidebarGroupLabel>Sucursal</SidebarGroupLabel>
        <SidebarGroupContent>
          <SidebarMenu>
            {sidebarItems.company.map(item => (
              <Link to={item.href} key={item.href}>
                <SidebarMenuItem>
                  <SidebarMenuButton isActive={isRouteActive(item.href)}>
                    {item.icon}
                    {item.label}
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </Link>
            ))}
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>
    </SidebarContent>
    <SidebarFooter>
      <SidebarMenu>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton size='lg'>
              <Avatar>
                <AvatarImage src="/avatar.png" />
                <AvatarFallback>
                  {(user?.name || user?.user_metadata?.name || user?.email)?.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">{user?.name || user?.user_metadata?.name || 'Usuario'}</span>
                <span className="truncate text-xs text-muted-foreground">{user?.email}</span>
              </div>
              <HugeiconsIcon icon={UnfoldMoreIcon} className="ml-auto" strokeWidth={2} />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent side="right" align="end">
            <DropdownMenuLabel>
              <div className="flex items-center gap-2">
                <Avatar>
                  <AvatarImage src="/avatar.png" />
                  <AvatarFallback>
                    {(user?.name || user?.user_metadata?.name || user?.email)?.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                  <p className="font-medium text-sm text-foreground">{user?.name || user?.user_metadata?.name || 'Usuario'}</p>
                  <p className="text-muted-foreground text-xs">{user?.email}</p>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => navigate('/dashboard/account')}>
              <HugeiconsIcon icon={UserIcon} strokeWidth={2} />
              Cuenta
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>
              <HugeiconsIcon icon={SunIcon} strokeWidth={2} />
              Apariencia
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => signOut()} variant='destructive'>
              <HugeiconsIcon icon={LogoutIcon} strokeWidth={2} />
              Cerrar sesión
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenu>
    </SidebarFooter>
  </Sidebar>;
}