"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { useLoading } from "@/components/loading-provider"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { CheckCircle, Info, Send } from "lucide-react"
import type { EmailConfig } from "@/lib/email-config"

export default function EmailConfigPage() {
  const { toast } = useToast()
  const { setLoading } = useLoading()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isTesting, setIsTesting] = useState(false)
  const [emailConfig, setEmailConfig] = useState<EmailConfig>({
    mail_host: null,
    mail_port: null,
    mail_username: null,
    mail_password: null,
    mail_encryption: null,
    mail_from_address: null,
    mail_from_name: null,
    mail_mailer: null,
    api_key: null,
  })
  const [configExists, setConfigExists] = useState(false)
  const [testStatus, setTestStatus] = useState<"idle" | "testing" | "success" | "error">("idle")
  const [testEmail, setTestEmail] = useState("")
  const [showTestEmailInput, setShowTestEmailInput] = useState(false)

  // Cargar la configuración guardada al iniciar
  useEffect(() => {
    const loadConfig = async () => {
      try {
        // Instead of directly calling the server action, use an API route
        const response = await fetch("/api/email/config")
        if (response.ok) {
          const config = await response.json()
          setEmailConfig(config)
          setConfigExists(Object.values(config).some((value) => value !== null))
        }
      } catch (error) {
        console.error("Error loading email config:", error)
        // Use default config if loading fails
        setEmailConfig({
          mail_host: null,
          mail_port: null,
          mail_username: null,
          mail_password: null,
          mail_encryption: null,
          mail_from_address: null,
          mail_from_name: null,
          mail_mailer: null,
          api_key: null,
        })
      }
    }

    loadConfig()
  }, [])

  const handleChange = async (field: keyof EmailConfig, value: any) => {
    setEmailConfig((prev) => ({ ...prev, [field]: value }))

    // Si cambia el mailer, actualizar los valores predeterminados
    if (field === "mail_mailer") {
      try {
        const response = await fetch(`/api/email/preset?name=${value}`)
        if (response.ok) {
          const preset = await response.json()
          setEmailConfig((prev) => ({
            ...prev,
            ...preset,
          }))
        }
      } catch (error) {
        console.error("Error loading preset:", error)
      }
    }

    // Detectar si es Brevo por el host
    if (field === "mail_host") {
      const isBrevo = value?.toLowerCase().includes("brevo") || value?.toLowerCase().includes("sendinblue")

      if (isBrevo && emailConfig.mail_mailer !== "brevo") {
        try {
          const response = await fetch(`/api/email/preset?name=brevo`)
          if (response.ok) {
            const preset = await response.json()
            setEmailConfig((prev) => ({
              ...prev,
              ...preset,
            }))
          }
        } catch (error) {
          console.error("Error loading preset:", error)
        }
      }
    }
  }

  // Update the handleSaveConfig function to properly save to localStorage
  const handleSaveConfig = async () => {
    setIsSubmitting(true)
    setLoading(true)

    try {
      // Validar la configuración
      const errors: string[] = []

      // Validar campos requeridos
      if (!emailConfig.mail_host) {
        errors.push("El host del servidor de correo es obligatorio")
      }

      if (!emailConfig.mail_port) {
        errors.push("El puerto del servidor de correo es obligatorio")
      }

      if (!emailConfig.mail_username) {
        errors.push("El nombre de usuario es obligatorio")
      }

      if (!emailConfig.mail_from_address) {
        errors.push("La dirección de correo del remitente es obligatoria")
      }

      // Validar que se proporcione contraseña o API key para Brevo
      const isBrevo =
        emailConfig.mail_mailer === "brevo" ||
        emailConfig.mail_host?.toLowerCase().includes("brevo") ||
        emailConfig.mail_host?.toLowerCase().includes("sendinblue")

      if (isBrevo) {
        if (!emailConfig.api_key && !emailConfig.mail_password) {
          errors.push("Debes proporcionar una API key o una contraseña para Brevo")
        }
      } else if (!emailConfig.mail_password) {
        errors.push("La contraseña del servidor de correo es obligatoria")
      }

      if (errors.length > 0) {
        toast({
          title: "Error de validación",
          description: errors.join(". "),
          variant: "destructive",
        })
        setIsSubmitting(false)
        setLoading(false)
        return
      }

      // Save directly to localStorage
      localStorage.setItem("emailConfig", JSON.stringify(emailConfig))
      console.log("Email config saved to localStorage:", emailConfig)

      // Also try to save through API route as a backup
      try {
        const response = await fetch("/api/email/config", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(emailConfig),
        })
      } catch (apiError) {
        console.error("Error saving through API (non-critical):", apiError)
      }

      setConfigExists(true)
      toast({
        title: "Configuración guardada",
        description: "La configuración de correo ha sido guardada correctamente",
      })
    } catch (error) {
      console.error("Error saving email config:", error)
      toast({
        title: "Error",
        description: "Ocurrió un error al guardar la configuración",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
      setLoading(false)
    }
  }

  // Replace the direct email testing with API route
  const handleTestConnection = async () => {
    if (showTestEmailInput) {
      // Validar el correo de prueba
      if (!testEmail || !testEmail.includes("@")) {
        toast({
          title: "Error",
          description: "Por favor, introduce un correo electrónico válido",
          variant: "destructive",
        })
        return
      }

      setIsTesting(true)
      setLoading(true)
      setTestStatus("testing")

      try {
        // Enviar correo de prueba a través de la API
        const response = await fetch("/api/email/test", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: testEmail,
          }),
        })

        const result = await response.json()

        if (result.success) {
          setTestStatus("success")
          toast({
            title: "Correo enviado",
            description: `Se ha enviado un correo de prueba a ${testEmail}`,
          })
        } else {
          setTestStatus("error")
          toast({
            title: "Error",
            description: "No se pudo enviar el correo de prueba. Verifica tu configuración.",
            variant: "destructive",
          })
        }
      } catch (error) {
        console.error("Test connection error:", error)
        setTestStatus("error")
        toast({
          title: "Error de conexión",
          description: "No se pudo establecer conexión con el servidor SMTP",
          variant: "destructive",
        })
      } finally {
        setIsTesting(false)
        setLoading(false)
        setShowTestEmailInput(false)
      }
    } else {
      setShowTestEmailInput(true)
    }
  }

  const isBrevo =
    emailConfig.mail_mailer === "brevo" ||
    emailConfig.mail_host?.toLowerCase().includes("brevo") ||
    emailConfig.mail_host?.toLowerCase().includes("sendinblue")

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Configuración de Correo</h1>
      </div>

      <Card className="bg-[#121212] border-gray-800">
        <CardHeader>
          <CardTitle className="text-white">Configuración de Correo</CardTitle>
          <CardDescription className="text-gray-400">
            Configura los parámetros para el envío de correos electrónicos
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {testStatus === "success" && (
            <Alert className="bg-green-900/20 border-green-800 text-green-400">
              <CheckCircle className="h-4 w-4" />
              <AlertTitle>Conexión exitosa</AlertTitle>
              <AlertDescription>La conexión con el servidor SMTP se ha establecido correctamente.</AlertDescription>
            </Alert>
          )}

          {testStatus === "error" && (
            <Alert className="bg-red-900/20 border-red-800 text-red-400" variant="destructive">
              <Info className="h-4 w-4" />
              <AlertTitle>Error de conexión</AlertTitle>
              <AlertDescription>
                No se pudo establecer conexión con el servidor SMTP. Verifica tus credenciales e inténtalo de nuevo.
              </AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <Label htmlFor="mail_mailer" className="text-white">
              Servicio de correo
            </Label>
            <Select value={emailConfig.mail_mailer || ""} onValueChange={(value) => handleChange("mail_mailer", value)}>
              <SelectTrigger className="bg-[#1e1e1e] border-gray-700 text-white">
                <SelectValue placeholder="Selecciona un servicio" />
              </SelectTrigger>
              <SelectContent className="bg-[#1e1e1e] border-gray-700">
                <SelectItem value="brevo">Brevo (Sendinblue)</SelectItem>
                <SelectItem value="smtp">SMTP Genérico</SelectItem>
                <SelectItem value="gmail">Gmail</SelectItem>
                <SelectItem value="outlook">Outlook</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-xs text-gray-400">El servicio que utilizarás para enviar correos electrónicos</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="mail_host" className="text-white">
              Host del correo <span className="text-red-500">*</span>
            </Label>
            <Input
              id="mail_host"
              className="bg-[#1e1e1e] border-gray-700 text-white"
              placeholder="smtp.ejemplo.com"
              value={emailConfig.mail_host || ""}
              onChange={(e) => handleChange("mail_host", e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="mail_port" className="text-white">
              Puerto del correo <span className="text-red-500">*</span>
            </Label>
            <Input
              id="mail_port"
              className="bg-[#1e1e1e] border-gray-700 text-white"
              placeholder="465"
              type="number"
              value={emailConfig.mail_port || ""}
              onChange={(e) => handleChange("mail_port", Number.parseInt(e.target.value) || null)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="mail_username" className="text-white">
              Nombre de usuario del correo <span className="text-red-500">*</span>
            </Label>
            <Input
              id="mail_username"
              className="bg-[#1e1e1e] border-gray-700 text-white"
              placeholder="usuario@ejemplo.com"
              value={emailConfig.mail_username || ""}
              onChange={(e) => handleChange("mail_username", e.target.value)}
              required
            />
          </div>

          {isBrevo ? (
            <div className="space-y-2">
              <Label htmlFor="api_key" className="text-white">
                API Key de Brevo <span className="text-red-500">*</span>
              </Label>
              <Input
                id="api_key"
                type="password"
                className="bg-[#1e1e1e] border-gray-700 text-white"
                placeholder="xkeysib-..."
                value={emailConfig.api_key || ""}
                onChange={(e) => handleChange("api_key", e.target.value)}
                required
              />
              <p className="text-xs text-gray-400">
                La API Key de Brevo se utiliza para autenticar las solicitudes de envío de correo
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              <Label htmlFor="mail_password" className="text-white">
                Contraseña de correo <span className="text-red-500">*</span>
              </Label>
              <Input
                id="mail_password"
                type="password"
                className="bg-[#1e1e1e] border-gray-700 text-white"
                placeholder="••••••••••"
                value={emailConfig.mail_password || ""}
                onChange={(e) => handleChange("mail_password", e.target.value)}
                required
              />
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="mail_encryption" className="text-white">
              Cifrado de correo
            </Label>
            <Select
              value={emailConfig.mail_encryption || ""}
              onValueChange={(value) => handleChange("mail_encryption", value === "null" ? null : value)}
            >
              <SelectTrigger className="bg-[#1e1e1e] border-gray-700 text-white">
                <SelectValue placeholder="Selecciona un cifrado" />
              </SelectTrigger>
              <SelectContent className="bg-[#1e1e1e] border-gray-700">
                <SelectItem value="null">Ninguno</SelectItem>
                <SelectItem value="tls">TLS</SelectItem>
                <SelectItem value="ssl">SSL</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="mail_from_address" className="text-white">
              Dirección del correo <span className="text-red-500">*</span>
            </Label>
            <Input
              id="mail_from_address"
              type="email"
              className="bg-[#1e1e1e] border-gray-700 text-white"
              placeholder="noreply@ejemplo.com"
              value={emailConfig.mail_from_address || ""}
              onChange={(e) => handleChange("mail_from_address", e.target.value)}
              required
            />
            <p className="text-xs text-gray-400">Dirección de correo que aparecerá como remitente</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="mail_from_name" className="text-white">
              Nombre del correo
            </Label>
            <Input
              id="mail_from_name"
              className="bg-[#1e1e1e] border-gray-700 text-white"
              placeholder="Tienda X"
              value={emailConfig.mail_from_name || ""}
              onChange={(e) => handleChange("mail_from_name", e.target.value)}
            />
            <p className="text-xs text-gray-400">Nombre que aparecerá como remitente</p>
          </div>

          {showTestEmailInput && (
            <div className="space-y-2 mt-4 p-4 border border-gray-700 rounded-md">
              <Label htmlFor="test_email" className="text-white">
                Correo para prueba <span className="text-red-500">*</span>
              </Label>
              <div className="flex gap-2">
                <Input
                  id="test_email"
                  type="email"
                  className="bg-[#1e1e1e] border-gray-700 text-white"
                  placeholder="tu@correo.com"
                  value={testEmail}
                  onChange={(e) => setTestEmail(e.target.value)}
                  required
                />
                <Button onClick={handleTestConnection} disabled={isTesting} className="bg-[#9D2449] hover:bg-[#7D1D3A]">
                  {isTesting ? (
                    <>
                      <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                      Enviando...
                    </>
                  ) : (
                    <>
                      <Send className="mr-2 h-4 w-4" />
                      Enviar
                    </>
                  )}
                </Button>
              </div>
              <p className="text-xs text-gray-400">Se enviará un correo de prueba a esta dirección</p>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button
            variant="outline"
            onClick={handleTestConnection}
            disabled={isSubmitting || isTesting || showTestEmailInput}
            className="border-gray-700 text-gray-300 hover:bg-gray-800 hover:text-white"
          >
            {showTestEmailInput ? "Cancelar" : "Probar conexión"}
          </Button>
          <Button
            onClick={handleSaveConfig}
            className="bg-[#9D2449] hover:bg-[#7D1D3A]"
            disabled={isSubmitting || isTesting}
          >
            {isSubmitting ? "Guardando..." : "Guardar Configuración"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
