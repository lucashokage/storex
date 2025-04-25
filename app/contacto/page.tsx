"use client"

import type React from "react"

import { useState } from "react"
import { Navigation } from "@/components/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { Mail, Phone, MapPin, Send } from "lucide-react"

export default function ContactoPage() {
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulación de envío
    setTimeout(() => {
      toast({
        title: "Mensaje enviado",
        description: "Hemos recibido tu mensaje. Te contactaremos pronto.",
      })
      setFormData({
        name: "",
        email: "",
        subject: "",
        message: "",
      })
      setIsSubmitting(false)
    }, 1500)
  }

  return (
    <main className="min-h-screen">
      <Navigation />

      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8 text-[#9D2449]">Contacto</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Card>
            <CardHeader>
              <CardTitle>Envíanos un mensaje</CardTitle>
              <CardDescription>Completa el formulario y te responderemos a la brevedad</CardDescription>
            </CardHeader>
            <form onSubmit={handleSubmit}>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nombre completo</Label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Tu nombre"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Correo electrónico</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="tu@correo.com"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="subject">Asunto</Label>
                  <Input
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    placeholder="Asunto de tu mensaje"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="message">Mensaje</Label>
                  <Textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Escribe tu mensaje aquí..."
                    className="min-h-32"
                    required
                  />
                </div>
              </CardContent>
              <CardFooter>
                <Button type="submit" className="w-full bg-[#9D2449] hover:bg-[#7D1D3A]" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                      Enviando...
                    </>
                  ) : (
                    <>
                      <Send className="mr-2 h-4 w-4" />
                      Enviar mensaje
                    </>
                  )}
                </Button>
              </CardFooter>
            </form>
          </Card>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Información de contacto</CardTitle>
                <CardDescription>Otras formas de contactarnos</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start gap-3">
                  <Mail className="h-5 w-5 text-[#9D2449] mt-0.5" />
                  <div>
                    <h3 className="font-medium">Correo electrónico</h3>
                    <p className="text-muted-foreground">contacto@tiendax.com</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Phone className="h-5 w-5 text-[#9D2449] mt-0.5" />
                  <div>
                    <h3 className="font-medium">Teléfono</h3>
                    <p className="text-muted-foreground">+52 55 1234 5678</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <MapPin className="h-5 w-5 text-[#9D2449] mt-0.5" />
                  <div>
                    <h3 className="font-medium">Dirección</h3>
                    <p className="text-muted-foreground">
                      Av. Insurgentes Sur 1234, Col. Del Valle
                      <br />
                      Ciudad de México, CP 03100
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Horario de atención</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Lunes a Viernes</span>
                    <span>9:00 - 18:00</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Sábados</span>
                    <span>10:00 - 14:00</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Domingos</span>
                    <span>Cerrado</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </main>
  )
}
