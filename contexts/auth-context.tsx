"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"
import { useLoading } from "@/components/loading-provider"

// Importar el servicio de correo
import { sendVerificationEmail } from "@/lib/email-service"

export interface User {
  id: string
  email: string
  name: string
  role: "admin" | "customer"
  emailVerified?: boolean
  createdAt: Date
}

interface AuthContextType {
  user: User | null
  isLoading: boolean
  login: (email: string, password: string) => Promise<boolean>
  loginWithGoogle: () => Promise<boolean>
  register: (email: string, password: string, name: string) => Promise<boolean>
  logout: () => void
  isAdmin: boolean
  users: User[]
  addUser: (user: Omit<User, "id" | "createdAt">) => void
  updateUser: (id: string, data: Partial<User>) => Promise<boolean>
  deleteUser: (id: string) => void
  sendEmail: (to: string | string[], subject: string, message: string) => Promise<boolean>
  sendPasswordResetEmail: (email: string) => Promise<boolean>
  verifyResetToken: (token: string) => Promise<boolean>
  resetPassword: (token: string, newPassword: string) => Promise<boolean>
  updatePassword: (userId: string, currentPassword: string, newPassword: string) => Promise<boolean>
  verifyEmail: (token: string) => Promise<boolean>
  activities: Activity[]
  addActivity: (activity: Omit<Activity, "id" | "timestamp">) => void
}

export interface Activity {
  id: string
  userId: string
  userName: string
  action: string
  details?: string
  timestamp: Date
}

// Usuario administrador predefinido
const ADMIN_USER: User = {
  id: "admin-1",
  email: "lucashokage25@gmail.com",
  name: "Lucas Admin",
  role: "admin",
  emailVerified: true,
  createdAt: new Date(),
}

// Datos iniciales para usuarios de demostración
const initialUsers: User[] = [
  ADMIN_USER,
  {
    id: "customer-1",
    email: "cliente@ejemplo.com",
    name: "Cliente Demo",
    role: "customer",
    emailVerified: true,
    createdAt: new Date(),
  },
]

// Actividades iniciales
const initialActivities: Activity[] = [
  {
    id: "activity-1",
    userId: "admin-1",
    userName: "Lucas Admin",
    action: "Inicio de sesión",
    details: "Acceso al panel de administración",
    timestamp: new Date(),
  },
]

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [users, setUsers] = useState<User[]>([])
  const [activities, setActivities] = useState<Activity[]>([])
  const router = useRouter()
  const { toast } = useToast()
  const { setLoading } = useLoading()

  // Cargar usuarios y actividades desde localStorage
  useEffect(() => {
    const loadData = () => {
      try {
        // Cargar usuarios
        const savedUsers = localStorage.getItem("users")
        if (savedUsers) {
          const parsedUsers = JSON.parse(savedUsers)
          setUsers(
            parsedUsers.map((u: any) => ({
              ...u,
              createdAt: new Date(u.createdAt),
            })),
          )
        } else {
          setUsers(initialUsers)
          localStorage.setItem("users", JSON.stringify(initialUsers))
        }

        // Cargar actividades
        const savedActivities = localStorage.getItem("activities")
        if (savedActivities) {
          const parsedActivities = JSON.parse(savedActivities)
          setActivities(
            parsedActivities.map((a: any) => ({
              ...a,
              timestamp: new Date(a.timestamp),
            })),
          )
        } else {
          setActivities(initialActivities)
          localStorage.setItem("activities", JSON.stringify(initialActivities))
        }

        // Verificar sesión actual
        const currentUser = localStorage.getItem("currentUser")
        if (currentUser) {
          try {
            const parsedUser = JSON.parse(currentUser)
            setUser({
              ...parsedUser,
              createdAt: new Date(parsedUser.createdAt),
            })
          } catch (error) {
            console.error("Error parsing current user:", error)
            localStorage.removeItem("currentUser")
          }
        }
      } catch (error) {
        console.error("Error loading auth data:", error)
      } finally {
        setIsLoading(false)
      }
    }

    loadData()
  }, [])

  // Guardar usuarios y actividades cuando cambien
  useEffect(() => {
    if (!isLoading) {
      localStorage.setItem("users", JSON.stringify(users))
    }
  }, [users, isLoading])

  useEffect(() => {
    if (!isLoading) {
      localStorage.setItem("activities", JSON.stringify(activities))
    }
  }, [activities, isLoading])

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      setLoading(true)
      // Simulación de login
      const foundUser = users.find((u) => u.email.toLowerCase() === email.toLowerCase())

      if (!foundUser) {
        toast({
          title: "Error de inicio de sesión",
          description: "Usuario no encontrado",
          variant: "destructive",
        })
        return false
      }

      // En un entorno real, aquí verificaríamos la contraseña con hash
      // Para esta demo, simulamos que la contraseña es "lucas9244" para el admin
      if (foundUser.email === "lucashokage25@gmail.com" && password !== "lucas9244") {
        toast({
          title: "Error de inicio de sesión",
          description: "Contraseña incorrecta",
          variant: "destructive",
        })
        return false
      }

      if (!foundUser.emailVerified) {
        toast({
          title: "Correo no verificado",
          description: "Por favor verifica tu correo electrónico antes de iniciar sesión",
          variant: "destructive",
        })
        return false
      }

      // Simular retraso de red
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Asegurarnos de que el usuario se guarde correctamente
      const userToStore = {
        ...foundUser,
        createdAt: foundUser.createdAt.toISOString(), // Convertir Date a string para almacenamiento
      }

      setUser(foundUser)

      // Guardar en localStorage y en cookies para el middleware
      localStorage.setItem("currentUser", JSON.stringify(userToStore))
      document.cookie = `currentUser=${JSON.stringify(userToStore)}; path=/; max-age=86400; SameSite=Lax`

      // Registrar actividad
      addActivity({
        userId: foundUser.id,
        userName: foundUser.name,
        action: "Inicio de sesión",
        details: `Acceso como ${foundUser.role}`,
      })

      toast({
        title: "Inicio de sesión exitoso",
        description: `Bienvenido, ${foundUser.name}`,
      })

      return true
    } catch (error) {
      console.error("Login error:", error)
      toast({
        title: "Error de inicio de sesión",
        description: "Ocurrió un error al iniciar sesión",
        variant: "destructive",
      })
      return false
    } finally {
      setLoading(false)
    }
  }

  const loginWithGoogle = async (): Promise<boolean> => {
    try {
      setLoading(true)
      // En un entorno real, aquí implementaríamos OAuth con Google
      // Para esta demo, simulamos el proceso

      // Simulación de retraso de red
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Simulación de datos de usuario de Google
      const googleUser = {
        id: `google-${Date.now()}`,
        email: "usuario.google@gmail.com",
        name: "Usuario Google",
        role: "customer" as const,
        emailVerified: true,
        createdAt: new Date(),
      }

      // Verificar si el usuario ya existe
      const existingUser = users.find((u) => u.email.toLowerCase() === googleUser.email.toLowerCase())

      if (existingUser) {
        // Si el usuario ya existe, iniciar sesión con ese usuario
        const userToStore = {
          ...existingUser,
          createdAt: existingUser.createdAt.toISOString(),
        }

        setUser(existingUser)
        localStorage.setItem("currentUser", JSON.stringify(userToStore))
        document.cookie = `currentUser=${JSON.stringify(userToStore)}; path=/; max-age=86400; SameSite=Lax`

        // Registrar actividad
        addActivity({
          userId: existingUser.id,
          userName: existingUser.name,
          action: "Inicio de sesión con Google",
          details: `Acceso como ${existingUser.role}`,
        })

        toast({
          title: "Inicio de sesión exitoso",
          description: `Bienvenido, ${existingUser.name}`,
        })

        return true
      } else {
        // Si el usuario no existe, crearlo
        setUsers((prev) => [...prev, googleUser])

        const userToStore = {
          ...googleUser,
          createdAt: googleUser.createdAt.toISOString(),
        }

        setUser(googleUser)
        localStorage.setItem("currentUser", JSON.stringify(userToStore))
        document.cookie = `currentUser=${JSON.stringify(userToStore)}; path=/; max-age=86400; SameSite=Lax`

        // Registrar actividad
        addActivity({
          userId: googleUser.id,
          userName: googleUser.name,
          action: "Registro con Google",
          details: "Nuevo usuario registrado con Google",
        })

        toast({
          title: "Registro exitoso",
          description: `Bienvenido, ${googleUser.name}`,
        })

        return true
      }
    } catch (error) {
      console.error("Google login error:", error)
      toast({
        title: "Error de inicio de sesión",
        description: "Ocurrió un error al iniciar sesión con Google",
        variant: "destructive",
      })
      return false
    } finally {
      setLoading(false)
    }
  }

  const logout = () => {
    if (user) {
      // Registrar actividad
      addActivity({
        userId: user.id,
        userName: user.name,
        action: "Cierre de sesión",
      })
    }

    setUser(null)
    localStorage.removeItem("currentUser")
    document.cookie = "currentUser=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax"
    router.push("/login")
  }

  const addUser = (userData: Omit<User, "id" | "createdAt">) => {
    const newUser: User = {
      ...userData,
      id: `user-${Date.now()}`,
      createdAt: new Date(),
    }

    setUsers((prev) => [...prev, newUser])

    // Registrar actividad
    if (user) {
      addActivity({
        userId: user.id,
        userName: user.name,
        action: "Creación de usuario",
        details: `Usuario ${newUser.name} (${newUser.email}) creado`,
      })
    }
  }

  const updateUser = async (id: string, data: Partial<User>): Promise<boolean> => {
    try {
      setUsers((prev) => prev.map((u) => (u.id === id ? { ...u, ...data } : u)))

      // Si el usuario actualizado es el actual, actualizar también el estado
      if (user && user.id === id) {
        const updatedUser = { ...user, ...data }
        setUser(updatedUser)

        // Convertir la fecha a string para almacenamiento
        const userToStore = {
          ...updatedUser,
          createdAt: updatedUser.createdAt.toISOString(),
        }

        localStorage.setItem("currentUser", JSON.stringify(userToStore))
      }

      // Registrar actividad
      if (user) {
        addActivity({
          userId: user.id,
          userName: user.name,
          action: "Actualización de usuario",
          details: `Usuario ${id} actualizado`,
        })
      }

      return true
    } catch (error) {
      console.error("Update user error:", error)
      return false
    }
  }

  const deleteUser = (id: string) => {
    // No permitir eliminar al usuario admin principal
    if (id === "admin-1") {
      toast({
        title: "Operación no permitida",
        description: "No se puede eliminar el usuario administrador principal",
        variant: "destructive",
      })
      return
    }

    const userToDelete = users.find((u) => u.id === id)
    if (!userToDelete) return

    setUsers((prev) => prev.filter((u) => u.id !== id))

    // Registrar actividad
    if (user) {
      addActivity({
        userId: user.id,
        userName: user.name,
        action: "Eliminación de usuario",
        details: `Usuario ${userToDelete.name} (${userToDelete.email}) eliminado`,
      })
    }
  }

  // Reemplazar la función sendEmail existente with this:
  const sendEmail = async (to: string | string[], subject: string, message: string): Promise<boolean> => {
    try {
      setLoading(true)

      // Usar el servicio de correo a través de la API route
      const response = await fetch("/api/email/send", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          to,
          subject,
          message,
        }),
      })

      const result = await response.json()

      if (result.success) {
        // Registrar actividad
        if (user) {
          addActivity({
            userId: user.id,
            userName: user.name,
            action: "Envío de correo",
            details: `Asunto: ${subject}`,
          })
        }

        return true
      } else {
        toast({
          title: "Error de envío",
          description: result.error || "No se pudo enviar el correo electrónico",
          variant: "destructive",
        })
        return false
      }
    } catch (error) {
      console.error("Email sending error:", error)
      toast({
        title: "Error de envío",
        description: "No se pudo enviar el correo electrónico",
        variant: "destructive",
      })
      return false
    } finally {
      setLoading(false)
    }
  }

  // Reemplazar la función sendPasswordResetEmail existente with this:
  const sendPasswordResetEmail = async (email: string): Promise<boolean> => {
    try {
      // Verificar si el usuario existe
      const userExists = users.some((u) => u.email.toLowerCase() === email.toLowerCase())
      if (!userExists) {
        toast({
          title: "Error",
          description: "No existe una cuenta con este correo electrónico",
          variant: "destructive",
        })
        return false
      }

      // Generar token de restablecimiento
      const resetToken = `reset-${Date.now()}`
      localStorage.setItem("resetToken", resetToken)
      localStorage.setItem("resetEmail", email)

      // Enviar correo de restablecimiento usando la API
      const response = await fetch("/api/email/reset-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          token: resetToken,
        }),
      })

      const result = await response.json()

      if (result.success) {
        toast({
          title: "Correo enviado",
          description: "Se ha enviado un correo con instrucciones para restablecer tu contraseña",
        })
        return true
      } else {
        toast({
          title: "Error",
          description: result.error || "No se pudo enviar el correo de restablecimiento",
          variant: "destructive",
        })
        return false
      }
    } catch (error) {
      console.error("Password reset email error:", error)
      toast({
        title: "Error",
        description: "No se pudo enviar el correo de restablecimiento",
        variant: "destructive",
      })
      return false
    }
  }

  const verifyResetToken = async (token: string): Promise<boolean> => {
    try {
      // En un entorno real, aquí verificaríamos el token en la base de datos
      // Para esta demo, simulamos la verificación
      const savedToken = localStorage.getItem("resetToken")
      return savedToken === token
    } catch (error) {
      console.error("Token verification error:", error)
      return false
    }
  }

  const resetPassword = async (token: string, newPassword: string): Promise<boolean> => {
    try {
      // Verificar el token
      const isValid = await verifyResetToken(token)
      if (!isValid) return false

      // Obtener el email asociado al token
      const email = localStorage.getItem("resetEmail")
      if (!email) return false

      // Actualizar la contraseña del usuario
      const userIndex = users.findIndex((u) => u.email.toLowerCase() === email.toLowerCase())
      if (userIndex === -1) return false

      // En un entorno real, aquí hashearíamos la contraseña
      // Para esta demo, simplemente actualizamos el usuario
      const updatedUsers = [...users]
      updatedUsers[userIndex] = {
        ...updatedUsers[userIndex],
        emailVerified: true, // Marcar como verificado si no lo estaba
      }

      setUsers(updatedUsers)

      // Limpiar el token
      localStorage.removeItem("resetToken")
      localStorage.removeItem("resetEmail")

      // Registrar actividad
      addActivity({
        userId: updatedUsers[userIndex].id,
        userName: updatedUsers[userIndex].name,
        action: "Restablecimiento de contraseña",
        details: "Contraseña restablecida correctamente",
      })

      toast({
        title: "Contraseña restablecida",
        description: "Tu contraseña ha sido restablecida correctamente",
      })

      return true
    } catch (error) {
      console.error("Password reset error:", error)
      toast({
        title: "Error",
        description: "No se pudo restablecer la contraseña",
        variant: "destructive",
      })
      return false
    }
  }

  const updatePassword = async (userId: string, currentPassword: string, newPassword: string): Promise<boolean> => {
    try {
      // Verificar si el usuario existe
      const userIndex = users.findIndex((u) => u.id === userId)
      if (userIndex === -1) return false

      // En un entorno real, aquí verificaríamos la contraseña actual con hash
      // Para esta demo, simulamos la verificación para el admin
      if (users[userIndex].id === "admin-1" && currentPassword !== "lucas9244") {
        toast({
          title: "Error",
          description: "La contraseña actual es incorrecta",
          variant: "destructive",
        })
        return false
      }

      // En un entorno real, aquí hashearíamos la nueva contraseña
      // Para esta demo, simplemente registramos la actividad

      // Registrar actividad
      addActivity({
        userId,
        userName: users[userIndex].name,
        action: "Cambio de contraseña",
        details: "Contraseña actualizada correctamente",
      })

      toast({
        title: "Contraseña actualizada",
        description: "Tu contraseña ha sido actualizada correctamente",
      })

      return true
    } catch (error) {
      console.error("Password update error:", error)
      toast({
        title: "Error",
        description: "No se pudo actualizar la contraseña",
        variant: "destructive",
      })
      return false
    }
  }

  const verifyEmail = async (token: string): Promise<boolean> => {
    try {
      // En un entorno real, aquí verificaríamos el token
      // Para esta demo, simulamos que cualquier token es válido

      // Buscar usuario por token (simulado)
      const userEmail = localStorage.getItem("pendingVerification")
      if (!userEmail) return false

      // Actualizar usuario
      const userIndex = users.findIndex((u) => u.email.toLowerCase() === userEmail.toLowerCase())
      if (userIndex === -1) return false

      const updatedUsers = [...users]
      updatedUsers[userIndex] = {
        ...updatedUsers[userIndex],
        emailVerified: true,
      }

      setUsers(updatedUsers)
      localStorage.removeItem("pendingVerification")

      // Registrar actividad
      addActivity({
        userId: updatedUsers[userIndex].id,
        userName: updatedUsers[userIndex].name,
        action: "Verificación de correo",
        details: "Correo electrónico verificado correctamente",
      })

      return true
    } catch (error) {
      console.error("Email verification error:", error)
      return false
    }
  }

  const addActivity = (activityData: Omit<Activity, "id" | "timestamp">) => {
    const newActivity: Activity = {
      ...activityData,
      id: `activity-${Date.now()}`,
      timestamp: new Date(),
    }

    setActivities((prev) => [newActivity, ...prev].slice(0, 100)) // Mantener solo las últimas 100 actividades
  }

  const isAdmin = user?.role === "admin"

  // Actualizar la función register para enviar el correo de verificación:
  const register = async (email: string, password: string, name: string): Promise<boolean> => {
    try {
      setLoading(true)

      // Verificar si el usuario ya existe
      if (users.some((u) => u.email.toLowerCase() === email.toLowerCase())) {
        toast({
          title: "Error de registro",
          description: "Este correo electrónico ya está registrado",
          variant: "destructive",
        })
        return false
      }

      // Simular retraso de red
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Crear nuevo usuario
      const newUser: User = {
        id: `user-${Date.now()}`,
        email,
        name,
        role: "customer", // Por defecto, todos los nuevos usuarios son clientes
        emailVerified: false, // Requiere verificación
        createdAt: new Date(),
      }

      setUsers((prev) => [...prev, newUser])

      // Generar token de verificación
      const verificationToken = `verify-${Date.now()}`
      localStorage.setItem("pendingVerification", email)

      // Enviar correo de verificación
      const emailSent = await sendVerificationEmail(email, verificationToken)

      if (!emailSent) {
        toast({
          title: "Advertencia",
          description: "No se pudo enviar el correo de verificación. Verifica tu configuración de correo.",
          variant: "destructive",
        })
      }

      // Registrar actividad
      addActivity({
        userId: newUser.id,
        userName: newUser.name,
        action: "Registro",
        details: "Nuevo usuario registrado",
      })

      toast({
        title: "Registro exitoso",
        description: "Se ha enviado un correo de verificación a tu dirección de email",
      })

      return true
    } catch (error) {
      console.error("Register error:", error)
      toast({
        title: "Error de registro",
        description: "Ocurrió un error al registrar el usuario",
        variant: "destructive",
      })
      return false
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        login,
        loginWithGoogle,
        register,
        logout,
        isAdmin,
        users,
        addUser,
        updateUser,
        deleteUser,
        sendEmail,
        sendPasswordResetEmail,
        verifyResetToken,
        resetPassword,
        updatePassword,
        verifyEmail,
        activities,
        addActivity,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
