"use client"

import type React from "react"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { useToast } from "@/hooks/use-toast"

interface AuthGuardProps {
  children: React.ReactNode
  requireAdmin?: boolean
}

export function AuthGuard({ children, requireAdmin = false }: AuthGuardProps) {
  const { user, isLoading, isAdmin } = useAuth()
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    if (!isLoading) {
      if (!user) {
        toast({
          title: "Acceso denegado",
          description: "Debes iniciar sesión para acceder a esta página",
          variant: "destructive",
        })
        router.push("/login")
      } else if (requireAdmin && !isAdmin) {
        toast({
          title: "Acceso denegado",
          description: "No tienes permisos para acceder a esta página",
          variant: "destructive",
        })
        router.push("/")
      }
    }
  }, [user, isLoading, isAdmin, requireAdmin, router, toast])

  if (isLoading) {
    return <div className="flex items-center justify-center min-h-screen">Cargando...</div>
  }

  if (!user || (requireAdmin && !isAdmin)) {
    return null
  }

  return <>{children}</>
}
