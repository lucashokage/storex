"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Eye, EyeOff, Lock, ArrowLeft, CheckCircle, XCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { useAuth } from "@/contexts/auth-context"
import { Navigation } from "@/components/navigation"

export default function ResetPasswordPage() {
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isVerifying, setIsVerifying] = useState(true)
  const [isTokenValid, setIsTokenValid] = useState(false)
  const [isReset, setIsReset] = useState(false)
  const [error, setError] = useState("")
  const [token, setToken] = useState<string | null>(null)
  const router = useRouter()
  const { verifyResetToken, resetPassword } = useAuth()

  // Usar useEffect para acceder a window solo en el cliente
  useEffect(() => {
    // Acceder a window.location.search solo en el cliente
    const searchParams = new URLSearchParams(window.location.search)
    const tokenParam = searchParams.get("token")
    setToken(tokenParam)

    const verifyToken = async () => {
      if (!tokenParam) {
        setIsVerifying(false)
        return
      }

      try {
        const isValid = await verifyResetToken(tokenParam)
        setIsTokenValid(isValid)
      } catch (error) {
        console.error("Error verifying token:", error)
        setIsTokenValid(false)
      } finally {
        setIsVerifying(false)
      }
    }

    verifyToken()
  }, [verifyResetToken])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (password !== confirmPassword) {
      setError("Las contraseñas no coinciden")
      return
    }

    if (password.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres")
      return
    }

    setIsSubmitting(true)

    try {
      if (!token) return

      const success = await resetPassword(token, password)
      if (success) {
        setIsReset(true)
        setTimeout(() => {
          router.push("/login")
        }, 3000)
      } else {
        setError("No se pudo restablecer la contraseña")
      }
    } catch (error) {
      console.error("Error resetting password:", error)
      setError("Ocurrió un error al restablecer la contraseña")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <main className="min-h-screen">
      <Navigation />

      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center min-h-[70vh]">
          <Card className="w-full max-w-md shadow-lg">
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl font-bold text-center">Restablecer Contraseña</CardTitle>
              <CardDescription className="text-center">
                {isVerifying
                  ? "Verificando enlace..."
                  : isReset
                    ? "¡Contraseña restablecida con éxito!"
                    : isTokenValid
                      ? "Crea una nueva contraseña para tu cuenta"
                      : "El enlace no es válido o ha expirado"}
              </CardDescription>
            </CardHeader>

            {isVerifying ? (
              <CardContent className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#9D2449]"></div>
              </CardContent>
            ) : isReset ? (
              <CardContent className="space-y-4 text-center">
                <div className="flex justify-center">
                  <CheckCircle className="h-16 w-16 text-green-500" />
                </div>
                <p>Tu contraseña ha sido restablecida correctamente.</p>
                <p className="text-sm text-muted-foreground">
                  Serás redirigido al inicio de sesión en unos segundos...
                </p>
              </CardContent>
            ) : isTokenValid ? (
              <form onSubmit={handleSubmit}>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="password">Nueva Contraseña</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="••••••••"
                        className="pl-10"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        minLength={6}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4 text-muted-foreground" />
                        ) : (
                          <Eye className="h-4 w-4 text-muted-foreground" />
                        )}
                        <span className="sr-only">{showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}</span>
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirmar Contraseña</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="confirmPassword"
                        type={showPassword ? "text" : "password"}
                        placeholder="••••••••"
                        className="pl-10"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                        minLength={6}
                      />
                    </div>
                  </div>

                  {error && <p className="text-destructive text-sm">{error}</p>}

                  <Button type="submit" className="w-full bg-[#9D2449] hover:bg-[#7D1D3A]" disabled={isSubmitting}>
                    {isSubmitting ? "Restableciendo..." : "Restablecer Contraseña"}
                  </Button>
                </CardContent>
              </form>
            ) : (
              <CardContent className="space-y-4 text-center">
                <div className="flex justify-center">
                  <XCircle className="h-16 w-16 text-red-500" />
                </div>
                <p>El enlace para restablecer la contraseña no es válido o ha expirado.</p>
                <p className="text-sm text-muted-foreground">
                  Por favor, solicita un nuevo enlace para restablecer tu contraseña.
                </p>
              </CardContent>
            )}

            <CardFooter className="flex flex-col space-y-4">
              <div className="text-center text-sm">
                <Link href="/login" className="inline-flex items-center text-primary hover:underline">
                  <ArrowLeft className="mr-1 h-4 w-4" />
                  Volver al inicio de sesión
                </Link>
              </div>
            </CardFooter>
          </Card>
        </div>
      </div>
    </main>
  )
}
