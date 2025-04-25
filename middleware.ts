import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

// Rutas que no requieren autenticación
const publicRoutes = ["/login", "/register", "/forgot-password", "/reset-password", "/verify-email"]
// Rutas que requieren ser administrador
const adminRoutes = ["/admin"]

export function middleware(request: NextRequest) {
  const currentUser = request.cookies.get("currentUser")?.value
  const path = request.nextUrl.pathname

  // No aplicar middleware a recursos estáticos o API
  if (
    path === "/404" ||
    path === "/_not-found" ||
    path.startsWith("/_next") ||
    path.startsWith("/api") ||
    path.includes(".") // Para archivos estáticos como .js, .css, etc.
  ) {
    return NextResponse.next()
  }

  // Verificar si la ruta es pública
  const isPublicRoute = publicRoutes.some((route) => path.startsWith(route))

  // Verificar si la ruta es de administración
  const isAdminRoute = adminRoutes.some((route) => path.startsWith(route))

  // Si no hay usuario y la ruta no es pública, redirigir a login
  if (!currentUser && !isPublicRoute) {
    console.log(`Redirecting to login from ${path}`)
    const url = new URL("/login", request.url)
    // Guardar la URL original para redirigir después del login
    url.searchParams.set("callbackUrl", encodeURIComponent(request.url))
    return NextResponse.redirect(url)
  }

  // Si hay usuario y es una ruta pública, redirigir a la página principal
  // Excepto para verify-email que siempre debe ser accesible
  if (currentUser && isPublicRoute && path !== "/verify-email") {
    console.log(`User already logged in, redirecting from ${path} to /`)
    return NextResponse.redirect(new URL("/", request.url))
  }

  // Si es una ruta de administración, verificar si el usuario es administrador
  if (isAdminRoute && currentUser) {
    try {
      const user = JSON.parse(currentUser)
      if (user.role !== "admin") {
        console.log(`User is not admin, redirecting from ${path} to /`)
        return NextResponse.redirect(new URL("/", request.url))
      }
    } catch (error) {
      console.error("Error parsing user data:", error)
      // Si hay un error al parsear el usuario, redirigir a login
      const url = new URL("/login", request.url)
      url.searchParams.set("callbackUrl", encodeURIComponent(request.url))
      return NextResponse.redirect(url)
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.svg).*)"],
}
