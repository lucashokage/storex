// Página 404 completamente estática sin componentes del lado del cliente
export default function NotFoundPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center px-4">
      <h1 className="text-6xl font-bold mb-4" style={{ color: "#9D2449" }}>
        404
      </h1>
      <h2 className="text-2xl font-semibold mb-6">Página no encontrada</h2>
      <p className="mb-8 max-w-md">Lo sentimos, la página que estás buscando no existe o ha sido movida.</p>
      <a
        href="/"
        style={{ backgroundColor: "#9D2449", color: "white", padding: "0.5rem 1rem", borderRadius: "0.375rem" }}
      >
        Volver al inicio
      </a>
    </div>
  )
}
