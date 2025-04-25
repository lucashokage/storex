"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/hooks/use-toast"

export default function AdminSettings() {
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSaveSettings = () => {
    setIsSubmitting(true)

    // Simulación de guardado
    setTimeout(() => {
      setIsSubmitting(false)
      toast({
        title: "Configuración guardada",
        description: "Los cambios han sido guardados correctamente",
      })
    }, 1000)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Configuración</h1>
      </div>

      <Tabs defaultValue="general">
        <TabsList className="grid w-full grid-cols-3 lg:w-auto">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="shipping">Envíos</TabsTrigger>
          <TabsTrigger value="notifications">Notificaciones</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Configuración General</CardTitle>
              <CardDescription>Configura los ajustes básicos de tu tienda</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="storeName">Nombre de la Tienda</Label>
                <Input id="storeName" defaultValue="Store X" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="storeDescription">Descripción de la Tienda</Label>
                <Textarea
                  id="storeDescription"
                  defaultValue="Tu destino para productos de belleza premium"
                  className="min-h-20"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="contactEmail">Email de Contacto</Label>
                <Input id="contactEmail" type="email" defaultValue="contacto@storex.com" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phoneNumber">Teléfono de Contacto</Label>
                <Input id="phoneNumber" defaultValue="+52 55 1234 5678" />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="maintenance">Modo Mantenimiento</Label>
                  <p className="text-sm text-muted-foreground">
                    Activa el modo mantenimiento para cerrar temporalmente la tienda
                  </p>
                </div>
                <Switch id="maintenance" />
              </div>
            </CardContent>
            <CardFooter>
              <Button
                onClick={handleSaveSettings}
                className="ml-auto bg-[#9D2449] hover:bg-[#7D1D3A]"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Guardando..." : "Guardar Cambios"}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="shipping" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Configuración de Envíos</CardTitle>
              <CardDescription>Configura las opciones de envío para tu tienda</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="freeShippingThreshold">Umbral para Envío Gratis (MXN)</Label>
                <Input id="freeShippingThreshold" type="number" defaultValue="2000" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="defaultShippingCost">Costo de Envío Estándar (MXN)</Label>
                <Input id="defaultShippingCost" type="number" defaultValue="150" />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="internationalShipping">Envíos Internacionales</Label>
                  <p className="text-sm text-muted-foreground">Habilitar envíos fuera de México</p>
                </div>
                <Switch id="internationalShipping" />
              </div>
            </CardContent>
            <CardFooter>
              <Button
                onClick={handleSaveSettings}
                className="ml-auto bg-[#9D2449] hover:bg-[#7D1D3A]"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Guardando..." : "Guardar Cambios"}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Configuración de Notificaciones</CardTitle>
              <CardDescription>Configura cómo y cuándo recibir notificaciones</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="orderNotifications">Notificaciones de Pedidos</Label>
                  <p className="text-sm text-muted-foreground">
                    Recibir notificaciones cuando se realice un nuevo pedido
                  </p>
                </div>
                <Switch id="orderNotifications" defaultChecked />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="lowStockNotifications">Notificaciones de Stock Bajo</Label>
                  <p className="text-sm text-muted-foreground">Recibir alertas cuando un producto tenga poco stock</p>
                </div>
                <Switch id="lowStockNotifications" defaultChecked />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="customerMessages">Mensajes de Clientes</Label>
                  <p className="text-sm text-muted-foreground">Recibir notificaciones de mensajes de clientes</p>
                </div>
                <Switch id="customerMessages" defaultChecked />
              </div>

              <div className="space-y-2">
                <Label htmlFor="notificationEmail">Email para Notificaciones</Label>
                <Input id="notificationEmail" type="email" defaultValue="admin@storex.com" />
              </div>
            </CardContent>
            <CardFooter>
              <Button
                onClick={handleSaveSettings}
                className="ml-auto bg-[#9D2449] hover:bg-[#7D1D3A]"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Guardando..." : "Guardar Cambios"}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
