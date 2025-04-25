"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { X, Plus } from "lucide-react"
import { useProducts, type ProductColor } from "@/contexts/product-context"
import Image from "next/image"

export default function EditProduct({ params }: { params: { id: string } }) {
  const router = useRouter()
  const { toast } = useToast()
  const { products, updateProduct } = useProducts()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [colors, setColors] = useState<ProductColor[]>([])
  const [newColor, setNewColor] = useState({ name: "", colorCode: "#000000" })

  const productId = Number.parseInt(params.id)
  const product = products.find((p) => p.id === productId)

  useEffect(() => {
    if (product) {
      setColors(product.colors || [])
    }
  }, [product])

  if (!product) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold">Producto no encontrado</h2>
        <p className="text-muted-foreground mt-2">El producto que buscas no existe o ha sido eliminado</p>
        <Button className="mt-4" onClick={() => router.push("/admin/products")}>
          Volver a Productos
        </Button>
      </div>
    )
  }

  const handleAddColor = () => {
    if (newColor.name.trim()) {
      const newId = colors.length > 0 ? Math.max(...colors.map((c) => c.id)) + 1 : 1

      setColors([...colors, { id: newId, ...newColor }])
      setNewColor({ name: "", colorCode: "#000000" })
    }
  }

  const handleRemoveColor = (id: number) => {
    setColors(colors.filter((color) => color.id !== id))
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

      // Actualizar el producto
      await updateProduct(productId, {
        name,
        description,
        price,
        category,
        shade,
        imageUrl,
        discount,
        colors,
      })

      toast({
        title: "Producto actualizado",
        description: "El producto ha sido actualizado exitosamente",
      })

      router.push("/admin/products")
    } catch (error) {
      console.error("Error al actualizar producto:", error)
      toast({
        title: "Error",
        description: "Ocurrió un error al actualizar el producto",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Editar Producto</h1>
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
                <Input id="name" name="name" defaultValue={product.name} placeholder="Nombre del producto" required />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Descripción</Label>
                <Textarea
                  id="description"
                  name="description"
                  defaultValue={product.description}
                  placeholder="Descripción del producto"
                  className="min-h-32"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="price">Precio (MXN)</Label>
                  <Input
                    id="price"
                    name="price"
                    type="number"
                    min="0"
                    step="0.01"
                    defaultValue={product.price}
                    placeholder="0.00"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="category">Categoría</Label>
                  <Select name="category" defaultValue={product.category} required>
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
                <Input id="shade" name="shade" defaultValue={product.shade || ""} placeholder="Nombre del tono" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="discount">Descuento % (opcional)</Label>
                <Input
                  id="discount"
                  name="discount"
                  type="number"
                  min="0"
                  max="100"
                  step="1"
                  defaultValue={product.discount || ""}
                  placeholder="0"
                />
              </div>

              {/* Añadir el campo de carga de imágenes en el formulario */}
              <div className="space-y-2">
                <Label htmlFor="imageFile">Imagen del Producto</Label>
                <Input id="imageFile" name="imageFile" type="file" accept="image/*" className="cursor-pointer" />
                <p className="text-xs text-muted-foreground">
                  Sube una nueva imagen para el producto (JPG, PNG, WebP, máx. 5MB)
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="imageUrl">URL de la Imagen</Label>
                <Input
                  id="imageUrl"
                  name="imageUrl"
                  defaultValue={product.imageUrl}
                  placeholder="https://ejemplo.com/imagen.jpg"
                  required
                />
                {product.imageUrl && (
                  <div className="mt-2 relative w-20 h-20 rounded overflow-hidden border">
                    <Image
                      src={product.imageUrl || "/placeholder.svg"}
                      alt="Vista previa"
                      fill
                      className="object-cover"
                    />
                  </div>
                )}
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
                      {colors.map((color) => (
                        <div key={color.id} className="flex items-center gap-2 bg-muted/50 rounded-full pl-2 pr-1 py-1">
                          <div className="w-4 h-4 rounded-full" style={{ backgroundColor: color.colorCode }}></div>
                          <span className="text-sm">{color.name}</span>
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6"
                            onClick={() => handleRemoveColor(color.id)}
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
                {isSubmitting ? "Guardando..." : "Guardar Cambios"}
              </Button>
            </CardFooter>
          </Card>
        </div>
      </form>
    </div>
  )
}
