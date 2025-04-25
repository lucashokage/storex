"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useAuth } from "@/contexts/auth-context"
import { useToast } from "@/hooks/use-toast"
import { Checkbox } from "@/components/ui/checkbox"
import { useLoading } from "@/components/loading-provider"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

// Interfaz para la configuración de correo
interface EmailConfig {
  service: string
  host: string
  port: string
  username: string
  password: string
  encryption: string
  fromAddress: string
  fromName: string
  apiKey?: string
}

export default function EmailPage() {
  const { users, sendEmail } = useAuth()
  const { toast } = useToast()
  const { setLoading } = useLoading()
  const [activeTab, setActiveTab] = useState("config")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [emailConfig, setEmailConfig] = useState<EmailConfig>({
    service: "brevo", // Default to Brevo
    host: "smtp-relay.brevo.com",
    port: "587",
    username: "",
    password: "",
    encryption: "TLS",
    fromAddress: "",
    fromName: "",
    apiKey: "",
  })
  const [singleEmail, setSingleEmail] = useState({
    recipient: "",
    subject: "",
    message: "",
  })
  const [bulkEmail, setBulkEmail] = useState({
    subject: "",
    message: "",
    selectedUsers: [] as string[],
    selectAll: false,
  })
  const [configExists, setConfigExists] = useState(false)
  const [useApiKey, setUseApiKey] = useState(true)

  // Usar useEffect para acceder a window solo en el cliente
  useEffect(() => {
    // Acceder a window.location.search solo en el cliente
    const searchParams = new URLSearchParams(window.location.search)
    const tabParam = searchParams.get("tab")
    if (tabParam) {
      setActiveTab(tabParam)
    }

    // Cargar la configuración de correo al iniciar
    const savedConfig = localStorage.getItem("emailConfig")
    if (savedConfig) {
      try {
        const parsedConfig = JSON.parse(savedConfig)

        // Convert to our UI format
        setEmailConfig({
          service: parsedConfig.mail_mailer || "brevo",
          host: parsedConfig.mail_host || "smtp-relay.brevo.com",
          port: parsedConfig.mail_port?.toString() || "587",
          username: parsedConfig.mail_username || "",
          password: parsedConfig.mail_password || "",
          encryption: parsedConfig.mail_encryption?.toUpperCase() || "TLS",
          fromAddress: parsedConfig.mail_from_address || "",
          fromName: parsedConfig.mail_from_name || "",
          apiKey: parsedConfig.api_key || "",
        })

        setUseApiKey(!!parsedConfig.api_key)
        setConfigExists(true)
      } catch (error) {
        console.error("Error parsing email config:", error)
      }
    }
  }, [])

  const handleSaveConfig = async () => {
    setIsSubmitting(true)
    setLoading(true)

    try {
      // Validar que los campos requeridos estén completos
      if (
        !emailConfig.host ||
        !emailConfig.username ||
        (!emailConfig.password && !emailConfig.apiKey) ||
        !emailConfig.fromAddress
      ) {
        toast({
          title: "Error",
          description: "Por favor completa todos los campos requeridos",
          variant: "destructive",
        })
        setIsSubmitting(false)
        setLoading(false)
        return
      }

      // Simular una petición a la API
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Convert to storage format
      const configToSave = {
        mail_host: emailConfig.host,
        mail_port: Number.parseInt(emailConfig.port),
        mail_username: emailConfig.username,
        mail_password: useApiKey ? "" : emailConfig.password,
        mail_encryption: emailConfig.encryption.toLowerCase() as "tls" | "ssl",
        mail_from_address: emailConfig.fromAddress,
        mail_from_name: emailConfig.fromName,
        mail_mailer: emailConfig.service,
        api_key: useApiKey ? emailConfig.apiKey : null,
      }

      // Guardar la configuración en localStorage
      localStorage.setItem("emailConfig", JSON.stringify(configToSave))
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

  const handleSendSingleEmail = async () => {
    if (!singleEmail.recipient || !singleEmail.subject || !singleEmail.message) {
      toast({
        title: "Error",
        description: "Todos los campos son obligatorios",
        variant: "destructive",
      })
      return
    }

    // Verificar si hay configuración de correo
    if (!configExists) {
      toast({
        title: "Error",
        description: "Por favor configura primero los datos de correo",
        variant: "destructive",
      })
      setActiveTab("config")
      return
    }

    setIsSubmitting(true)
    setLoading(true)

    try {
      const success = await sendEmail(singleEmail.recipient, singleEmail.subject, singleEmail.message)
      if (success) {
        setSingleEmail({
          recipient: "",
          subject: "",
          message: "",
        })

        toast({
          title: "Correo enviado",
          description: "El mensaje ha sido enviado correctamente",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo enviar el correo electrónico",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
      setLoading(false)
    }
  }

  const handleSendBulkEmail = async () => {
    if (!bulkEmail.subject || !bulkEmail.message || bulkEmail.selectedUsers.length === 0) {
      toast({
        title: "Error",
        description: "Debes completar todos los campos y seleccionar al menos un destinatario",
        variant: "destructive",
      })
      return
    }

    // Verificar si hay configuración de correo
    if (!configExists) {
      toast({
        title: "Error",
        description: "Por favor configura primero los datos de correo",
        variant: "destructive",
      })
      setActiveTab("config")
      return
    }

    setIsSubmitting(true)
    setLoading(true)

    try {
      // Obtener los correos de los usuarios seleccionados
      const recipients = users.filter((user) => bulkEmail.selectedUsers.includes(user.id)).map((user) => user.email)

      const success = await sendEmail(recipients, bulkEmail.subject, bulkEmail.message)
      if (success) {
        setBulkEmail({
          subject: "",
          message: "",
          selectedUsers: [],
          selectAll: false,
        })

        toast({
          title: "Correos enviados",
          description: `Se han enviado ${recipients.length} correos correctamente`,
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudieron enviar los correos electrónicos",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
      setLoading(false)
    }
  }

  const toggleSelectAll = (checked: boolean) => {
    setBulkEmail({
      ...bulkEmail,
      selectAll: checked,
      selectedUsers: checked ? users.map((user) => user.id) : [],
    })
  }

  const toggleUserSelection = (userId: string, checked: boolean) => {
    setBulkEmail({
      ...bulkEmail,
      selectedUsers: checked
        ? [...bulkEmail.selectedUsers, userId]
        : bulkEmail.selectedUsers.filter((id) => id !== userId),
      selectAll: checked && bulkEmail.selectedUsers.length + 1 === users.length,
    })
  }

  const handleServiceChange = (value: string) => {
    let newConfig = { ...emailConfig, service: value }

    // Set default values based on service
    if (value === "brevo") {
      newConfig = {
        ...newConfig,
        host: "smtp-relay.brevo.com",
        port: "587",
        encryption: "TLS",
      }
      setUseApiKey(true)
    } else if (value === "gmail") {
      newConfig = {
        ...newConfig,
        host: "smtp.gmail.com",
        port: "465",
        encryption: "SSL",
      }
      setUseApiKey(false)
    } else if (value === "outlook") {
      newConfig = {
        ...newConfig,
        host: "smtp-mail.outlook.com",
        port: "587",
        encryption: "TLS",
      }
      setUseApiKey(false)
    }

    setEmailConfig(newConfig)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Envío de Correos</h1>
      </div>

      {!configExists && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Configuración requerida</AlertTitle>
          <AlertDescription>
            Debes configurar los datos de correo antes de poder enviar correos. Por favor, completa la configuración en
            la pestaña "Configuración".
          </AlertDescription>
        </Alert>
      )}

      <Tabs defaultValue={activeTab} value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3 lg:w-auto">
          <TabsTrigger value="config" className="relative">
            Configuración
            {!configExists && (
              <span className="absolute -top-1 -right-1 flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
              </span>
            )}
          </TabsTrigger>
          <TabsTrigger value="single">Correo Individual</TabsTrigger>
          <TabsTrigger value="bulk">Correo Masivo</TabsTrigger>
        </TabsList>

        <TabsContent value="config" className="mt-6">
          <Card className="bg-[#121212] border-gray-800">
            <CardHeader>
              <CardTitle className="text-white">Configuración de Correo</CardTitle>
              <CardDescription className="text-gray-400">
                Configura los parámetros para el envío de correos electrónicos
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="service" className="text-white">
                  Servicio de correo
                </Label>
                <Select value={emailConfig.service} onValueChange={handleServiceChange}>
                  <SelectTrigger className="bg-[#1e1e1e] border-gray-700 text-white">
                    <SelectValue placeholder="Selecciona un servicio" />
                  </SelectTrigger>
                  <SelectContent className="bg-[#1e1e1e] border-gray-700">
                    <SelectItem value="brevo">Brevo (Sendinblue)</SelectItem>
                    <SelectItem value="gmail">Gmail</SelectItem>
                    <SelectItem value="outlook">Outlook</SelectItem>
                    <SelectItem value="smtp">SMTP Personalizado</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-gray-400">El servicio que utilizarás para enviar correos electrónicos</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="host" className="text-white">
                  Host del correo <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="host"
                  placeholder="smtp.ejemplo.com"
                  value={emailConfig.host}
                  onChange={(e) => setEmailConfig({ ...emailConfig, host: e.target.value })}
                  className="bg-[#1e1e1e] border-gray-700 text-white"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="port" className="text-white">
                  Puerto del correo <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="port"
                  placeholder="587"
                  value={emailConfig.port}
                  onChange={(e) => setEmailConfig({ ...emailConfig, port: e.target.value })}
                  className="bg-[#1e1e1e] border-gray-700 text-white"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="username" className="text-white">
                  Nombre de usuario del correo <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="username"
                  placeholder="usuario@ejemplo.com"
                  value={emailConfig.username}
                  onChange={(e) => setEmailConfig({ ...emailConfig, username: e.target.value })}
                  className="bg-[#1e1e1e] border-gray-700 text-white"
                  required
                />
              </div>

              {emailConfig.service === "brevo" ? (
                <div className="space-y-2">
                  <Label htmlFor="apiKey" className="text-white">
                    API Key de Brevo <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="apiKey"
                    type="password"
                    placeholder="••••••••••"
                    value={emailConfig.apiKey || ""}
                    onChange={(e) => setEmailConfig({ ...emailConfig, apiKey: e.target.value })}
                    className="bg-[#1e1e1e] border-gray-700 text-white"
                    required
                  />
                  <p className="text-xs text-gray-400">
                    Puedes encontrar tu API Key en tu cuenta de Brevo bajo SMTP & API
                  </p>
                </div>
              ) : (
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-white">
                    Contraseña de correo <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••••"
                    value={emailConfig.password}
                    onChange={(e) => setEmailConfig({ ...emailConfig, password: e.target.value })}
                    className="bg-[#1e1e1e] border-gray-700 text-white"
                    required
                  />
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="encryption" className="text-white">
                  Cifrado de correo
                </Label>
                <Select
                  value={emailConfig.encryption}
                  onValueChange={(value) => setEmailConfig({ ...emailConfig, encryption: value })}
                >
                  <SelectTrigger className="bg-[#1e1e1e] border-gray-700 text-white">
                    <SelectValue placeholder="Selecciona un cifrado" />
                  </SelectTrigger>
                  <SelectContent className="bg-[#1e1e1e] border-gray-700">
                    <SelectItem value="SSL">SSL</SelectItem>
                    <SelectItem value="TLS">TLS</SelectItem>
                    <SelectItem value="STARTTLS">STARTTLS</SelectItem>
                    <SelectItem value="none">Ninguno</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="fromAddress" className="text-white">
                  Dirección del correo <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="fromAddress"
                  placeholder="noreply@ejemplo.com"
                  value={emailConfig.fromAddress}
                  onChange={(e) => setEmailConfig({ ...emailConfig, fromAddress: e.target.value })}
                  className="bg-[#1e1e1e] border-gray-700 text-white"
                  required
                />
                <p className="text-xs text-gray-400">Dirección de correo que aparecerá como remitente</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="fromName" className="text-white">
                  Nombre del correo
                </Label>
                <Input
                  id="fromName"
                  placeholder="Tienda X"
                  value={emailConfig.fromName}
                  onChange={(e) => setEmailConfig({ ...emailConfig, fromName: e.target.value })}
                  className="bg-[#1e1e1e] border-gray-700 text-white"
                />
                <p className="text-xs text-gray-400">Nombre que aparecerá como remitente</p>
              </div>
            </CardContent>
            <CardFooter>
              <Button
                onClick={handleSaveConfig}
                className="ml-auto bg-[#9D2449] hover:bg-[#7D1D3A]"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Guardando..." : "Guardar Configuración"}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="single" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Enviar Correo Individual</CardTitle>
              <CardDescription>Envía un correo electrónico a un destinatario específico</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {!configExists && (
                <Alert variant="destructive" className="mb-4">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    Debes configurar los datos de correo antes de poder enviar correos.
                  </AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <Label htmlFor="recipient">Destinatario</Label>
                <Input
                  id="recipient"
                  type="email"
                  placeholder="correo@ejemplo.com"
                  value={singleEmail.recipient}
                  onChange={(e) => setSingleEmail({ ...singleEmail, recipient: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="subject">Asunto</Label>
                <Input
                  id="subject"
                  placeholder="Asunto del correo"
                  value={singleEmail.subject}
                  onChange={(e) => setSingleEmail({ ...singleEmail, subject: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="message">Mensaje</Label>
                <Textarea
                  id="message"
                  placeholder="Escribe tu mensaje aquí..."
                  className="min-h-32"
                  value={singleEmail.message}
                  onChange={(e) => setSingleEmail({ ...singleEmail, message: e.target.value })}
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button
                onClick={handleSendSingleEmail}
                className="ml-auto bg-[#9D2449] hover:bg-[#7D1D3A]"
                disabled={isSubmitting || !configExists}
              >
                {isSubmitting ? "Enviando..." : "Enviar Correo"}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="bulk" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Envío Masivo</CardTitle>
              <CardDescription>Envía un correo electrónico a múltiples destinatarios</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {!configExists && (
                <Alert variant="destructive" className="mb-4">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    Debes configurar los datos de correo antes de poder enviar correos.
                  </AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <Label htmlFor="bulk-subject">Asunto</Label>
                <Input
                  id="bulk-subject"
                  placeholder="Asunto del correo"
                  value={bulkEmail.subject}
                  onChange={(e) => setBulkEmail({ ...bulkEmail, subject: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="bulk-message">Mensaje</Label>
                <Textarea
                  id="bulk-message"
                  placeholder="Escribe tu mensaje aquí..."
                  className="min-h-32"
                  value={bulkEmail.message}
                  onChange={(e) => setBulkEmail({ ...bulkEmail, message: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center space-x-2 mb-4">
                  <Checkbox
                    id="select-all"
                    checked={bulkEmail.selectAll}
                    onCheckedChange={(checked) => toggleSelectAll(checked === true)}
                  />
                  <Label htmlFor="select-all">Seleccionar todos</Label>
                </div>

                <div className="border rounded-md p-4 max-h-60 overflow-y-auto">
                  <div className="space-y-2">
                    {users.map((user) => (
                      <div key={user.id} className="flex items-center space-x-2">
                        <Checkbox
                          id={`user-${user.id}`}
                          checked={bulkEmail.selectedUsers.includes(user.id)}
                          onCheckedChange={(checked) => toggleUserSelection(user.id, checked === true)}
                        />
                        <Label htmlFor={`user-${user.id}`} className="flex-1">
                          {user.name} ({user.email})
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button
                onClick={handleSendBulkEmail}
                className="ml-auto bg-[#9D2449] hover:bg-[#7D1D3A]"
                disabled={isSubmitting || !configExists}
              >
                {isSubmitting ? "Enviando..." : `Enviar a ${bulkEmail.selectedUsers.length} destinatarios`}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
