"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { Mail, ArrowLeft, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { useAuth } from "@/contexts/auth-context"
import { Navigation } from "@/components/navigation"

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const { sendPasswordResetEmail } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      await sendPasswordResetEmail(email)
      setIsSubmitted(true)
    } catch (error) {
      console.error("Error sending reset email:", error)
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
              <CardTitle className="text-2xl font-bold text-center">Recuperar Contraseña</CardTitle>
              <CardDescription className="text-center">
                {isSubmitted
                  ? "Te hemos enviado un correo con instrucciones para recuperar tu contraseña"
                  : "Ingresa tu correo electrónico para recuperar tu contraseña"}
              </CardDescription>
            </CardHeader>

            {!isSubmitted ? (
              <form onSubmit={handleSubmit}>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Correo Electrónico</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="email"
                        type="email"
                        placeholder="tu@correo.com"
                        className="pl-10"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                  <Button type="submit" className="w-full bg-[#9D2449] hover:bg-[#7D1D3A]" disabled={isSubmitting}>
                    {isSubmitting ? "Enviando..." : "Enviar Instrucciones"}
                  </Button>
                </CardContent>
              </form>
            ) : (
              <CardContent className="space-y-4 text-center">
                <div className="flex justify-center">
                  <CheckCircle className="h-16 w-16 text-green-500" />
                </div>
                <p>
                  Hemos enviado un correo electrónico a <strong>{email}</strong> con instrucciones para restablecer tu
                  contraseña.
                </p>
                <p className="text-sm text-muted-foreground">
                  Si no recibes el correo en unos minutos, revisa tu carpeta de spam o correo no deseado.
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
