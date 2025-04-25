"use client"

import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { PlusCircle, Pencil, Trash2 } from "lucide-react"
import { useProducts } from "@/contexts/product-context"
import { useToast } from "@/hooks/use-toast"

export default function AdminProducts() {
  const { products, deleteProduct } = useProducts()
  const { toast } = useToast()

  const handleDeleteProduct = (id: number, name: string) => {
    if (confirm(`¿Estás seguro de que deseas eliminar el producto "${name}"?`)) {
      deleteProduct(id)
      toast({
        title: "Producto eliminado",
        description: `El producto "${name}" ha sido eliminado correctamente.`,
      })
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Productos</h1>
        <Link href="/admin/products/new">
          <Button className="bg-[#9D2449] hover:bg-[#7D1D3A]">
            <PlusCircle className="h-4 w-4 mr-2" />
            Nuevo Producto
          </Button>
        </Link>
      </div>

      <div className="border rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-muted/50">
                <th className="text-left py-3 px-4 font-medium">Imagen</th>
                <th className="text-left py-3 px-4 font-medium">Nombre</th>
                <th className="text-left py-3 px-4 font-medium">Categoría</th>
                <th className="text-left py-3 px-4 font-medium">Precio</th>
                <th className="text-left py-3 px-4 font-medium">Descuento</th>
                <th className="text-left py-3 px-4 font-medium">Vistas</th>
                <th className="text-left py-3 px-4 font-medium">Colores</th>
                <th className="text-right py-3 px-4 font-medium">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.id} className="border-t">
                  <td className="py-3 px-4">
                    <div className="w-12 h-12 relative rounded overflow-hidden">
                      <Image
                        src={product.imageUrl || "/placeholder.svg"}
                        alt={product.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                  </td>
                  <td className="py-3 px-4 font-medium">{product.name}</td>
                  <td className="py-3 px-4 capitalize">{product.category}</td>
                  <td className="py-3 px-4">${product.price.toFixed(2)}</td>
                  <td className="py-3 px-4">{product.discount ? `${product.discount}%` : "-"}</td>
                  <td className="py-3 px-4">{product.views || 0}</td>
                  <td className="py-3 px-4">
                    <div className="flex gap-1">
                      {product.colors && product.colors.length > 0 ? (
                        product.colors
                          .slice(0, 3)
                          .map((color) => (
                            <div
                              key={color.id}
                              className="w-6 h-6 rounded-full border"
                              style={{ backgroundColor: color.colorCode }}
                              title={color.name}
                            />
                          ))
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                      {product.colors && product.colors.length > 3 && (
                        <div className="w-6 h-6 rounded-full bg-muted flex items-center justify-center text-xs">
                          +{product.colors.length - 3}
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link href={`/admin/products/edit/${product.id}`}>
                        <Button variant="outline" size="icon">
                          <Pencil className="h-4 w-4" />
                          <span className="sr-only">Editar</span>
                        </Button>
                      </Link>
                      <Button
                        variant="outline"
                        size="icon"
                        className="text-destructive"
                        onClick={() => handleDeleteProduct(product.id, product.name)}
                      >
                        <Trash2 className="h-4 w-4" />
                        <span className="sr-only">Eliminar</span>
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
