"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { CheckCircle, Mail } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useAuth } from "@/contexts/auth-context"
import { Navigation } from "@/components/navigation"
import { useToast } from "@/components/ui/use-toast"

export default function VerifyEmailPage() {
  const [isVerifying, setIsVerifying] = useState(false)
  const [isVerified, setIsVerified] = useState(false)
  const [token, setToken] = useState<string | null>(null)
  const router = useRouter()
  const { verifyEmail } = useAuth()
  const { toast } = useToast()

  // Usar useEffect para acceder a window solo en el cliente
  useEffect(() => {
    // Acceder a window.location.search solo en el cliente
    const searchParams = new URLSearchParams(window.location.search)
    const tokenParam = searchParams.get("token")
    setToken(tokenParam)

    const verifyToken = async () => {
      if (tokenParam) {
        setIsVerifying(true)
        try {
          // Simulamos un retraso para mostrar el estado de verificación
          await new Promise((resolve) => setTimeout(resolve, 1500))

          const success = await verifyEmail(tokenParam)
          setIsVerified(success)

          if (success) {
            toast({
              title: "Correo verificado",
              description: "Tu correo electrónico ha sido verificado correctamente",
            })
          }
        } catch (error) {
          console.error("Error verifying email:", error)
          setIsVerified(false)

          toast({
            title: "Error de verificación",
            description: "No pudimos verificar tu correo electrónico",
            variant: "destructive",
          })
        } finally {
          setIsVerifying(false)
        }
      }
    }

    verifyToken()
  }, [verifyEmail, toast])

  return (
    <main className="min-h-screen">
      <Navigation />

      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center min-h-[70vh]">
          <Card className="w-full max-w-md shadow-lg">
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl font-bold text-center">Verificación de Correo</CardTitle>
              {token ? (
                <CardDescription className="text-center">
                  {isVerifying
                    ? "Verificando tu correo electrónico..."
                    : isVerified
                      ? "¡Tu correo ha sido verificado correctamente!"
                      : "No pudimos verificar tu correo electrónico."}
                </CardDescription>
              ) : (
                <CardDescription className="text-center">
                  Te hemos enviado un correo electrónico con un enlace de verificación
                </CardDescription>
              )}
            </CardHeader>
            <CardContent className="flex flex-col items-center space-y-4 pt-4">
              {token ? (
                isVerified ? (
                  <CheckCircle className="h-16 w-16 text-green-500" />
                ) : (
                  <Mail className="h-16 w-16 text-primary" />
                )
              ) : (
                <Mail className="h-16 w-16 text-primary" />
              )}

              <p className="text-center text-muted-foreground">
                {token
                  ? isVerified
                    ? "Tu cuenta ha sido verificada correctamente. Ahora puedes iniciar sesión."
                    : "El enlace de verificación no es válido o ha expirado. Por favor, solicita un nuevo enlace."
                  : "Por favor, revisa tu bandeja de entrada y haz clic en el enlace de verificación que te hemos enviado."}
              </p>
            </CardContent>
            <CardFooter className="flex flex-col space-y-4">
              <Button className="w-full bg-[#9D2449] hover:bg-[#7D1D3A]" onClick={() => router.push("/login")}>
                {token && isVerified ? "Iniciar Sesión" : "Volver al Inicio de Sesión"}
              </Button>

              {!token && (
                <div className="text-center text-sm">
                  ¿No recibiste el correo?{" "}
                  <Link href="#" className="text-primary hover:underline">
                    Reenviar correo de verificación
                  </Link>
                </div>
              )}
            </CardFooter>
          </Card>
        </div>
      </div>
    </main>
  )
}
