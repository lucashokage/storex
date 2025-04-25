export default function Custom404() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center px-4">
      <h1 className="text-6xl font-bold text-[#9D2449] mb-4">404</h1>
      <h2 className="text-2xl font-semibold mb-6">Página no encontrada</h2>
      <p className="text-muted-foreground mb-8 max-w-md">
        Lo sentimos, la página que estás buscando no existe o ha sido movida.
      </p>
      <a href="/" className="bg-[#9D2449] hover:bg-[#7D1D3A] text-white px-4 py-2 rounded-md">
        Volver al inicio
      </a>
    </div>
  )
}
