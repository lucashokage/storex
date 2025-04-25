"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import Link from "next/link"
import {
  LayoutDashboard,
  Package,
  PlusCircle,
  Settings,
  ShoppingBag,
  LogOut,
  ChevronRight,
  Moon,
  Sun,
  MenuIcon,
  X,
  Users,
  Mail,
  Activity,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { useTheme } from "next-themes"
import { cn } from "@/lib/utils"
import { useAuth } from "@/contexts/auth-context"

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const router = useRouter()
  const pathname = usePathname()
  const { toast } = useToast()
  const { theme, setTheme } = useTheme()
  const { user, isAdmin, logout } = useAuth()

  useEffect(() => {
    // Verificar autenticación
    if (!user || !isAdmin) {
      router.push("/login")
      toast({
        title: "Acceso denegado",
        description: "Necesitas ser administrador para acceder a esta sección",
        variant: "destructive",
      })
    }
  }, [user, isAdmin, router, toast])

  const handleLogout = () => {
    logout()
    toast({
      title: "Sesión cerrada",
      description: "Has cerrado sesión correctamente",
    })
  }

  // Si no es admin, no mostrar nada
  if (!user || !isAdmin) {
    return null
  }

  const menuItems = [
    {
      title: "Dashboard",
      icon: <LayoutDashboard className="h-5 w-5" />,
      href: "/admin/dashboard",
    },
    {
      title: "Productos",
      icon: <Package className="h-5 w-5" />,
      href: "/admin/products",
    },
    {
      title: "Nuevo Producto",
      icon: <PlusCircle className="h-5 w-5" />,
      href: "/admin/products/new",
    },
    {
      title: "Usuarios",
      icon: <Users className="h-5 w-5" />,
      href: "/admin/users",
    },
    {
      title: "Enviar Correos",
      icon: <Mail className="h-5 w-5" />,
      href: "/admin/email",
    },
    {
      title: "Actividades",
      icon: <Activity className="h-5 w-5" />,
      href: "/admin/activities",
    },
    {
      title: "Configuración",
      icon: <Settings className="h-5 w-5" />,
      href: "/admin/settings",
    },
  ]

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar para desktop */}
      <aside className="hidden md:flex flex-col w-64 border-r bg-card">
        <div className="p-6 border-b">
          <Link href="/admin/dashboard" className="flex items-center gap-2">
            <ShoppingBag className="h-6 w-6 text-[#9D2449]" />
            <span className="font-bold text-xl">Tienda X Admin</span>
          </Link>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {menuItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-md transition-colors",
                pathname === item.href
                  ? "bg-[#9D2449] text-white"
                  : "hover:bg-muted text-muted-foreground hover:text-foreground",
              )}
            >
              {item.icon}
              <span>{item.title}</span>
              {pathname === item.href && <ChevronRight className="ml-auto h-4 w-4" />}
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Modo</span>
            <Button
              variant="outline"
              size="icon"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="ml-auto"
            >
              {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              <span className="sr-only">Cambiar tema</span>
            </Button>
          </div>

          <Button
            variant="outline"
            className="w-full flex items-center gap-2 text-muted-foreground"
            onClick={handleLogout}
          >
            <LogOut className="h-4 w-4" />
            Cerrar sesión
          </Button>
        </div>
      </aside>

      {/* Contenido principal */}
      <div className="flex-1 flex flex-col">
        {/* Header móvil */}
        <header className="md:hidden flex items-center justify-between p-4 border-b">
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={() => setIsMobileMenuOpen(true)}>
              <MenuIcon className="h-6 w-6" />
            </Button>
            <span className="font-bold">Tienda X Admin</span>
          </div>

          <Button
            variant="outline"
            size="icon"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="ml-auto"
          >
            {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            <span className="sr-only">Cambiar tema</span>
          </Button>
        </header>

        {/* Menú móvil */}
        {isMobileMenuOpen && (
          <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm md:hidden">
            <div className="fixed inset-y-0 left-0 w-3/4 max-w-xs bg-card shadow-lg p-6 flex flex-col">
              <div className="flex items-center justify-between mb-6">
                <Link href="/admin/dashboard" className="flex items-center gap-2">
                  <ShoppingBag className="h-6 w-6 text-[#9D2449]" />
                  <span className="font-bold text-xl">Tienda X Admin</span>
                </Link>
                <Button variant="ghost" size="icon" onClick={() => setIsMobileMenuOpen(false)}>
                  <X className="h-6 w-6" />
                </Button>
              </div>

              <nav className="flex-1 space-y-1">
                {menuItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "flex items-center gap-3 px-3 py-2 rounded-md transition-colors",
                      pathname === item.href
                        ? "bg-[#9D2449] text-white"
                        : "hover:bg-muted text-muted-foreground hover:text-foreground",
                    )}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {item.icon}
                    <span>{item.title}</span>
                    {pathname === item.href && <ChevronRight className="ml-auto h-4 w-4" />}
                  </Link>
                ))}
              </nav>

              <Button
                variant="outline"
                className="mt-6 w-full flex items-center gap-2 text-muted-foreground"
                onClick={handleLogout}
              >
                <LogOut className="h-4 w-4" />
                Cerrar sesión
              </Button>
            </div>
          </div>
        )}

        {/* Contenido de la página */}
        <main className="flex-1 p-4 md:p-6 overflow-auto">{children}</main>
      </div>
    </div>
  )
}
