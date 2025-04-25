"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Package, Eye, Users } from "lucide-react"
import { useProducts } from "@/contexts/product-context"
import { useAuth } from "@/contexts/auth-context"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function AdminDashboard() {
  const { products, getMostViewed } = useProducts()
  const { users } = useAuth()

  // Obtener los productos más vistos
  const mostViewedProducts = getMostViewed(5).filter((product) => product.views && product.views > 0)

  // Si no hay productos con vistas, mostrar los primeros 5 productos
  const productsToShow = mostViewedProducts.length > 0 ? mostViewedProducts : products.slice(0, 5)

  // Total de productos
  const totalProducts = products.length

  // Total de usuarios
  const totalUsers = users.length

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">Bienvenido al panel de administración</p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Total de Productos</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalProducts}</div>
            <Link href="/admin/products">
              <Button variant="link" className="p-0 h-auto text-sm">
                Ver todos los productos
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Total de Usuarios</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalUsers}</div>
            <Link href="/admin/users">
              <Button variant="link" className="p-0 h-auto text-sm">
                Ver todos los usuarios
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Configuración de Correo</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-md font-medium">Brevo API</div>
            <Link href="/admin/email?tab=config">
              <Button variant="link" className="p-0 h-auto text-sm">
                Configurar API de Brevo
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Productos Más Consultados</CardTitle>
          <CardDescription>Los productos más vistos por los clientes</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {productsToShow.length > 0 ? (
              productsToShow.map((product) => (
                <div key={product.id} className="flex items-center gap-4 border-b pb-4 last:border-0 last:pb-0">
                  <div className="w-12 h-12 relative rounded overflow-hidden">
                    <Image
                      src={product.imageUrl || "/placeholder.svg"}
                      alt={product.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <Link href={`/admin/products/edit/${product.id}`} className="font-medium hover:underline">
                      {product.name}
                    </Link>
                    <p className="text-sm text-muted-foreground capitalize">{product.category}</p>
                  </div>
                  <div className="flex items-center gap-1">
                    <Eye className="h-4 w-4 text-muted-foreground" />
                    <span>{product.views || 0}</span>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center text-muted-foreground py-4">No hay datos de productos consultados aún</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
