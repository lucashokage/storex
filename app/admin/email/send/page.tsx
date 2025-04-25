"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { useLoading } from "@/components/loading-provider"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Info, Send, X } from "lucide-react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { sendEmail } from "@/lib/email-service"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

export default function SendEmailPage() {
  const { toast } = useToast()
  const { setLoading } = useLoading()
  const router = useRouter()
  const { users } = useAuth()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [emailConfig, setEmailConfig] = useState<any>(null)
  const [emailData, setEmailData] = useState({
    to: "",
    subject: "",
    message: "",
  })
  const [selectedRecipients, setSelectedRecipients] = useState<Array<{ email: string; name: string }>>([])
  const [open, setOpen] = useState(false)
  const [configExists, setConfigExists] = useState(false)

  // Cargar la configuración guardada al iniciar
  useEffect(() => {
    const loadConfig = async () => {
      try {
        // First try to load from localStorage
        const savedConfig = localStorage.getItem("emailConfig")
        if (savedConfig) {
          const config = JSON.parse(savedConfig)
          setEmailConfig(config)
          setConfigExists(true)
          console.log("Email config loaded from localStorage:", config)
          return
        }

        // If not in localStorage, try the API route
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

  const handleChange = (field: string, value: string) => {
    setEmailData((prev) => ({ ...prev, [field]: value }))
  }

  const handleAddRecipient = (user: { id: string; email: string; name: string }) => {
    setSelectedRecipients((prev) => {
      // Verificar si ya existe
      if (prev.some((r) => r.email === user.email)) {
        return prev
      }
      return [...prev, { email: user.email, name: user.name }]
    })
    setOpen(false)
  }

  const handleRemoveRecipient = (email: string) => {
    setSelectedRecipients((prev) => prev.filter((r) => r.email !== email))
  }

  const handleManualRecipient = () => {
    if (!emailData.to || !emailData.to.includes("@")) {
      toast({
        title: "Error",
        description: "Por favor, introduce un correo electrónico válido",
        variant: "destructive",
      })
      return
    }

    setSelectedRecipients((prev) => {
      // Verificar si ya existe
      if (prev.some((r) => r.email === emailData.to)) {
        return prev
      }
      return [...prev, { email: emailData.to, name: emailData.to.split("@")[0] }]
    })
    setEmailData((prev) => ({ ...prev, to: "" }))
  }

  const handleSendEmail = async () => {
    if (!emailConfig) {
      toast({
        title: "Error",
        description: "No hay configuración de correo. Por favor, configura el correo primero.",
        variant: "destructive",
      })
      router.push("/admin/email/config")
      return
    }

    if (selectedRecipients.length === 0) {
      toast({
        title: "Error",
        description: "Por favor, selecciona al menos un destinatario",
        variant: "destructive",
      })
      return
    }

    if (!emailData.subject || !emailData.message) {
      toast({
        title: "Error",
        description: "Por favor completa todos los campos",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)
    setLoading(true)

    try {
      // Enviar correo usando la función del servicio de correo
      const recipientEmails = selectedRecipients.map((r) => r.email)
      const success = await sendEmail({
        to: recipientEmails,
        subject: emailData.subject,
        message: emailData.message,
      })

      if (success) {
        toast({
          title: "Correo enviado",
          description: `El correo electrónico ha sido enviado correctamente a ${recipientEmails.length} destinatarios`,
        })

        // Limpiar formulario
        setEmailData({
          to: "",
          subject: "",
          message: "",
        })
        setSelectedRecipients([])
      } else {
        throw new Error("No se pudo enviar el correo")
      }
    } catch (error) {
      console.error("Error sending email:", error)
      toast({
        title: "Error",
        description: "Ocurrió un error al enviar el correo",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Enviar Correo</h1>
      </div>

      {!emailConfig ? (
        <Card className="bg-[#121212] border-gray-800">
          <CardHeader>
            <CardTitle className="text-white">Configuración requerida</CardTitle>
            <CardDescription className="text-gray-400">
              Necesitas configurar el correo antes de poder enviar mensajes
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Alert className="bg-amber-900/20 border-amber-800 text-amber-400">
              <Info className="h-4 w-4" />
              <AlertTitle>Configuración pendiente</AlertTitle>
              <AlertDescription>
                No se ha encontrado configuración de correo. Por favor, configura el correo antes de continuar.
              </AlertDescription>
            </Alert>
          </CardContent>
          <CardFooter>
            <Button onClick={() => router.push("/admin/email/config")} className="bg-[#9D2449] hover:bg-[#7D1D3A]">
              Ir a configuración
            </Button>
          </CardFooter>
        </Card>
      ) : (
        <Card className="bg-[#121212] border-gray-800">
          <CardHeader>
            <CardTitle className="text-white">Enviar correo electrónico</CardTitle>
            <CardDescription className="text-gray-400">
              Completa el formulario para enviar un correo electrónico
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="from" className="text-gray-300">
                De
              </Label>
              <Input
                id="from"
                className="bg-[#1e1e1e] border-gray-700 text-gray-300"
                value={`${emailConfig.mail_from_name || emailConfig.mail_from_address} <${emailConfig.mail_from_address}>`}
                disabled
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="to" className="text-gray-300">
                Para
              </Label>
              <div className="flex flex-wrap gap-2 mb-2">
                {selectedRecipients.map((recipient) => (
                  <div
                    key={recipient.email}
                    className="flex items-center gap-1 bg-[#2a2a2a] text-white px-2 py-1 rounded-md"
                  >
                    <span>
                      {recipient.name} ({recipient.email})
                    </span>
                    <button
                      type="button"
                      onClick={() => handleRemoveRecipient(recipient.email)}
                      className="text-gray-400 hover:text-white"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
              <div className="flex gap-2">
                <div className="flex-1">
                  <Popover open={open} onOpenChange={setOpen}>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full justify-start bg-[#1e1e1e] border-gray-700 text-gray-300"
                      >
                        Seleccionar destinatario...
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="p-0 bg-[#1e1e1e] border-gray-700">
                      <Command>
                        <CommandInput placeholder="Buscar usuario..." className="text-gray-300" />
                        <CommandList>
                          <CommandEmpty>No se encontraron usuarios</CommandEmpty>
                          <CommandGroup>
                            {users.map((user) => (
                              <CommandItem
                                key={user.id}
                                onSelect={() => handleAddRecipient(user)}
                                className="text-gray-300 hover:bg-gray-800"
                              >
                                {user.name} ({user.email})
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                </div>
                <div className="text-center">o</div>
                <div className="flex-1 flex gap-2">
                  <Input
                    id="to"
                    type="email"
                    className="bg-[#1e1e1e] border-gray-700 text-gray-300"
                    placeholder="correo@ejemplo.com"
                    value={emailData.to}
                    onChange={(e) => handleChange("to", e.target.value)}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    className="border-gray-700 text-gray-300"
                    onClick={handleManualRecipient}
                  >
                    Añadir
                  </Button>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="subject" className="text-gray-300">
                Asunto
              </Label>
              <Input
                id="subject"
                className="bg-[#1e1e1e] border-gray-700 text-gray-300"
                placeholder="Asunto del correo"
                value={emailData.subject}
                onChange={(e) => handleChange("subject", e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="message" className="text-gray-300">
                Mensaje
              </Label>
              <Textarea
                id="message"
                className="bg-[#1e1e1e] border-gray-700 text-gray-300 min-h-[200px]"
                placeholder="Escribe tu mensaje aquí..."
                value={emailData.message}
                onChange={(e) => handleChange("message", e.target.value)}
                required
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button
              onClick={handleSendEmail}
              className="bg-[#9D2449] hover:bg-[#7D1D3A] ml-auto"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                  Enviando...
                </>
              ) : (
                <>
                  <Send className="mr-2 h-4 w-4" />
                  Enviar correo
                </>
              )}
            </Button>
          </CardFooter>
        </Card>
      )}
    </div>
  )
}
