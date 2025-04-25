"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Eye, EyeOff, Mail, User, Lock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useAuth } from "@/contexts/auth-context"
import { Navigation } from "@/components/navigation"
import { AuthGuard } from "@/components/auth-guard"
import { useToast } from "@/hooks/use-toast"

export default function ProfilePage() {
  const { user, updateUser, updatePassword } = useAuth()
  const { toast } = useToast()
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const [profileData, setProfileData] = useState({
    name: user?.name || "",
    email: user?.email || "",
  })

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  })

  const [errors, setErrors] = useState({
    profile: "",
    password: "",
  })

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrors({ ...errors, profile: "" })

    if (!profileData.name || !profileData.email) {
      setErrors({ ...errors, profile: "Todos los campos son obligatorios" })
      return
    }

    setIsSubmitting(true)

    try {
      if (!user) return

      await updateUser(user.id, {
        name: profileData.name,
        email: profileData.email,
      })

      toast({
        title: "Perfil actualizado",
        description: "Tu información ha sido actualizada correctamente",
      })
    } catch (error) {
      console.error("Error updating profile:", error)
      setErrors({ ...errors, profile: "Ocurrió un error al actualizar el perfil" })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handlePasswordUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrors({ ...errors, password: "" })

    if (!passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword) {
      setErrors({ ...errors, password: "Todos los campos son obligatorios" })
      return
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setErrors({ ...errors, password: "Las contraseñas no coinciden" })
      return
    }

    if (passwordData.newPassword.length < 6) {
      setErrors({ ...errors, password: "La contraseña debe tener al menos 6 caracteres" })
      return
    }

    setIsSubmitting(true)

    try {
      if (!user) return

      const success = await updatePassword(user.id, passwordData.currentPassword, passwordData.newPassword)

      if (success) {
        toast({
          title: "Contraseña actualizada",
          description: "Tu contraseña ha sido actualizada correctamente",
        })

        setPasswordData({
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        })
      } else {
        setErrors({ ...errors, password: "La contraseña actual es incorrecta" })
      }
    } catch (error) {
      console.error("Error updating password:", error)
      setErrors({ ...errors, password: "Ocurrió un error al actualizar la contraseña" })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <AuthGuard>
      <main className="min-h-screen">
        <Navigation />

        <div className="container mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold mb-8">Mi Perfil</h1>

          <Tabs defaultValue="profile" className="max-w-3xl mx-auto">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="profile">Información Personal</TabsTrigger>
              <TabsTrigger value="security">Seguridad</TabsTrigger>
            </TabsList>

            <TabsContent value="profile">
              <Card>
                <CardHeader>
                  <CardTitle>Información Personal</CardTitle>
                  <CardDescription>Actualiza tu información personal</CardDescription>
                </CardHeader>
                <form onSubmit={handleProfileUpdate}>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Nombre</Label>
                      <div className="relative">
                        <User className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="name"
                          placeholder="Tu nombre"
                          className="pl-10"
                          value={profileData.name}
                          onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email">Correo Electrónico</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="email"
                          type="email"
                          placeholder="tu@correo.com"
                          className="pl-10"
                          value={profileData.email}
                          onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                          required
                          disabled={user?.id === "admin-1"} // No permitir cambiar el email del admin principal
                        />
                      </div>
                    </div>

                    {errors.profile && <p className="text-destructive text-sm">{errors.profile}</p>}
                  </CardContent>
                  <CardFooter>
                    <Button type="submit" className="ml-auto bg-[#9D2449] hover:bg-[#7D1D3A]" disabled={isSubmitting}>
                      {isSubmitting ? "Guardando..." : "Guardar Cambios"}
                    </Button>
                  </CardFooter>
                </form>
              </Card>
            </TabsContent>

            <TabsContent value="security">
              <Card>
                <CardHeader>
                  <CardTitle>Cambiar Contraseña</CardTitle>
                  <CardDescription>Actualiza tu contraseña para mantener tu cuenta segura</CardDescription>
                </CardHeader>
                <form onSubmit={handlePasswordUpdate}>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="currentPassword">Contraseña Actual</Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="currentPassword"
                          type={showPassword ? "text" : "password"}
                          placeholder="••••••••"
                          className="pl-10"
                          value={passwordData.currentPassword}
                          onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                          required
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
                      <Label htmlFor="newPassword">Nueva Contraseña</Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="newPassword"
                          type={showPassword ? "text" : "password"}
                          placeholder="••••••••"
                          className="pl-10"
                          value={passwordData.newPassword}
                          onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                          required
                          minLength={6}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword">Confirmar Nueva Contraseña</Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="confirmPassword"
                          type={showPassword ? "text" : "password"}
                          placeholder="••••••••"
                          className="pl-10"
                          value={passwordData.confirmPassword}
                          onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                          required
                          minLength={6}
                        />
                      </div>
                    </div>

                    {errors.password && <p className="text-destructive text-sm">{errors.password}</p>}
                  </CardContent>
                  <CardFooter>
                    <Button type="submit" className="ml-auto bg-[#9D2449] hover:bg-[#7D1D3A]" disabled={isSubmitting}>
                      {isSubmitting ? "Actualizando..." : "Actualizar Contraseña"}
                    </Button>
                  </CardFooter>
                </form>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </AuthGuard>
  )
}
