"use client"

import Link from "next/link"
import { useState } from "react"
import { ShoppingBag, Search, Menu, X, Shield, User, LogOut, Settings } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useCart } from "@/contexts/cart-context"
import { useAuth } from "@/contexts/auth-context"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { totalItems } = useCart()
  const { user, logout, isAdmin } = useAuth()

  return (
    <>
      {/* Banner promocional */}
      <div className="bg-[#FFF5F5] text-[#9D2449] py-4 text-center font-medium dark:bg-gray-800 dark:text-pink-300">
        ENVÍO GRATIS A MÉXICO EN PEDIDOS SUPERIORES A MEX$2000
      </div>

      {/* Botón de acceso a administración (escudo) - Solo visible para admins */}
      {isAdmin && (
        <div className="fixed top-4 left-4 z-50">
          <Link href="/admin/dashboard">
            <Button
              variant="outline"
              size="icon"
              className="rounded-full w-10 h-10 flex items-center justify-center bg-white/80 backdrop-blur-sm border-[#9D2449] hover:bg-[#9D2449] hover:text-white transition-all shadow-md dark:bg-gray-800/80 dark:border-gray-700"
              aria-label="Acceso administración"
            >
              <Shield className="h-5 w-5" />
            </Button>
          </Link>
        </div>
      )}

      {/* Navegación */}
      <header className="border-b py-4 relative">
        <div className="container mx-auto px-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" aria-label="Menú" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>

          <Link href="/" className="text-[#9D2449] text-3xl font-playfair font-bold">
            Tienda X
          </Link>

          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" aria-label="Buscar">
              <Search className="h-6 w-6" />
            </Button>

            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" aria-label="Perfil">
                    <User className="h-6 w-6" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>Mi Cuenta</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="flex items-center">
                    <User className="mr-2 h-4 w-4" />
                    <span>{user.name}</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Link href="/profile" className="flex w-full items-center">
                      <Settings className="mr-2 h-4 w-4" />
                      <span>Perfil</span>
                    </Link>
                  </DropdownMenuItem>
                  {isAdmin && (
                    <DropdownMenuItem>
                      <Link href="/admin/dashboard" className="flex w-full items-center">
                        <Shield className="mr-2 h-4 w-4" />
                        <span>Panel de Administración</span>
                      </Link>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={logout} className="text-red-500 focus:text-red-500 cursor-pointer">
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Cerrar Sesión</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link href="/login">
                <Button variant="ghost" size="icon" aria-label="Iniciar Sesión">
                  <User className="h-6 w-6" />
                </Button>
              </Link>
            )}

            <Link href="/cart">
              <Button variant="ghost" size="icon" aria-label="Carrito">
                <div className="relative">
                  <ShoppingBag className="h-6 w-6" />
                  <span className="absolute -top-2 -right-2 bg-[#9D2449] text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                    {totalItems}
                  </span>
                </div>
              </Button>
            </Link>
          </div>
        </div>

        {/* Menú desplegable */}
        {isMenuOpen && (
          <div className="absolute left-0 right-0 top-full bg-white z-40 border-b shadow-md dark:bg-gray-900">
            <nav className="container mx-auto py-4 px-4">
              <ul className="space-y-4">
                <li>
                  <Link
                    href="/category/labios"
                    className="block py-2 hover:text-[#9D2449]"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Labios
                  </Link>
                </li>
                <li>
                  <Link
                    href="/category/rostro"
                    className="block py-2 hover:text-[#9D2449]"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Rostro
                  </Link>
                </li>
                <li>
                  <Link
                    href="/category/ojos"
                    className="block py-2 hover:text-[#9D2449]"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Ojos
                  </Link>
                </li>
                <li>
                  <Link
                    href="/novedades"
                    className="block py-2 hover:text-[#9D2449]"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Novedades
                  </Link>
                </li>
                <li>
                  <Link
                    href="/ofertas"
                    className="block py-2 hover:text-[#9D2449]"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Ofertas
                  </Link>
                </li>
                <li>
                  <Link
                    href="/contacto"
                    className="block py-2 hover:text-[#9D2449]"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Contacto
                  </Link>
                </li>
              </ul>
            </nav>
          </div>
        )}
      </header>
    </>
  )
}
