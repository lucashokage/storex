"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { X, Plus } from "lucide-react"
import { useProducts } from "@/contexts/product-context"

export default function NewProduct() {
  const router = useRouter()
  const { toast } = useToast()
  const { addProduct } = useProducts()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [colors, setColors] = useState<{ name: string; colorCode: string }[]>([])
  const [newColor, setNewColor] = useState({ name: "", colorCode: "#000000" })

  const handleAddColor = () => {
    if (newColor.name.trim()) {
      setColors([...colors, { ...newColor }])
      setNewColor({ name: "", colorCode: "#000000" })
    }
  }

  const handleRemoveColor = (index: number) => {
    setColors(colors.filter((_, i) => i !== index))
  }

  // Modificar la función handleSubmit para usar la carga de imágenes
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const formData = new FormData(e.currentTarget)

      const name = formData.get("name") as string
      const description = formData.get("description") as string
      const price = Number.parseFloat(formData.get("price") as string)
      const category = formData.get("category") as string
      const shade = (formData.get("shade") as string) || undefined
      let imageUrl = formData.get("imageUrl") as string
      const discount = formData.get("discount") ? Number.parseFloat(formData.get("discount") as string) : undefined

      // Verificar si hay un archivo de imagen para subir
      const imageFile = formData.get("imageFile") as File
      if (imageFile && imageFile.size > 0) {
        // Crear un FormData para la carga de archivos
        const uploadFormData = new FormData()
        uploadFormData.append("file", imageFile)

        // Enviar la solicitud de carga
        const response = await fetch("/api/upload", {
          method: "POST",
          body: uploadFormData,
        })

        const result = await response.json()

        if (result.success) {
          imageUrl = result.url
        } else {
          throw new Error(result.error || "Error al subir la imagen")
        }
      }

      // Crear IDs para los colores
      const colorsWithIds = colors.map((color, index) => ({
        id: Date.now() + index,
        name: color.name,
        colorCode: color.colorCode,
      }))

      // Añadir el producto a la base de datos
      await addProduct({
        name,
        description,
        price,
        category,
        shade,
        imageUrl,
        discount,
        colors: colorsWithIds,
      })

      toast({
        title: "Producto creado",
        description: "El producto ha sido creado exitosamente",
      })

      router.push("/admin/products")
    } catch (error) {
      console.error("Error al crear producto:", error)
      toast({
        title: "Error",
        description: "Ocurrió un error al crear el producto",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Nuevo Producto</h1>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Información Básica</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nombre del Producto</Label>
                <Input id="name" name="name" placeholder="Nombre del producto" required />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Descripción</Label>
                <Textarea
                  id="description"
                  name="description"
                  placeholder="Descripción del producto"
                  className="min-h-32"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="price">Precio (MXN)</Label>
                  <Input id="price" name="price" type="number" min="0" step="0.01" placeholder="0.00" required />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="category">Categoría</Label>
                  <Select name="category" required>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar categoría" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="labios">Labios</SelectItem>
                      <SelectItem value="rostro">Rostro</SelectItem>
                      <SelectItem value="ojos">Ojos</SelectItem>
                      <SelectItem value="accesorios">Accesorios</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="shade">Tono (opcional)</Label>
                <Input id="shade" name="shade" placeholder="Nombre del tono" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="discount">Descuento % (opcional)</Label>
                <Input id="discount" name="discount" type="number" min="0" max="100" step="1" placeholder="0" />
              </div>

              {/* Añadir el campo de carga de imágenes en el formulario */}
              <div className="space-y-2">
                <Label htmlFor="imageFile">Imagen del Producto</Label>
                <Input id="imageFile" name="imageFile" type="file" accept="image/*" className="cursor-pointer" />
                <p className="text-xs text-muted-foreground">
                  Sube una imagen para el producto (JPG, PNG, WebP, máx. 5MB)
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="imageUrl">URL de la Imagen (alternativa)</Label>
                <Input
                  id="imageUrl"
                  name="imageUrl"
                  placeholder="https://ejemplo.com/imagen.jpg"
                  defaultValue="/placeholder.svg?height=600&width=400"
                />
                <p className="text-xs text-muted-foreground">Si no subes una imagen, puedes proporcionar una URL</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Colores Disponibles</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-end gap-2">
                <div className="flex-1 space-y-2">
                  <Label htmlFor="colorName">Nombre del Color</Label>
                  <Input
                    id="colorName"
                    value={newColor.name}
                    onChange={(e) => setNewColor({ ...newColor, name: e.target.value })}
                    placeholder="Rojo Intenso"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="colorCode">Código de Color</Label>
                  <Input
                    id="colorCode"
                    type="color"
                    value={newColor.colorCode}
                    onChange={(e) => setNewColor({ ...newColor, colorCode: e.target.value })}
                    className="w-16 h-10 p-1"
                  />
                </div>
                <Button type="button" onClick={handleAddColor} className="mb-0.5">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>

              <div className="space-y-2">
                <Label>Colores Agregados</Label>
                <div className="border rounded-md p-4 min-h-20">
                  {colors.length === 0 ? (
                    <p className="text-sm text-muted-foreground text-center py-2">No hay colores agregados</p>
                  ) : (
                    <div className="flex flex-wrap gap-2">
                      {colors.map((color, index) => (
                        <div key={index} className="flex items-center gap-2 bg-muted/50 rounded-full pl-2 pr-1 py-1">
                          <div className="w-4 h-4 rounded-full" style={{ backgroundColor: color.colorCode }}></div>
                          <span className="text-sm">{color.name}</span>
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6"
                            onClick={() => handleRemoveColor(index)}
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between border-t pt-6">
              <Button variant="outline" type="button" onClick={() => router.back()}>
                Cancelar
              </Button>
              <Button type="submit" className="bg-[#9D2449] hover:bg-[#7D1D3A]" disabled={isSubmitting}>
                {isSubmitting ? "Guardando..." : "Guardar Producto"}
              </Button>
            </CardFooter>
          </Card>
        </div>
      </form>
    </div>
  )
}
