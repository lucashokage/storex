/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  // Configuración para evitar problemas con módulos de Node.js
  webpack: (config, { isServer }) => {
    if (!isServer) {
      // No intentar resolver módulos específicos del servidor en el cliente
      config.resolve.fallback = {
        fs: false,
        path: false,
        crypto: false,
        net: false,
        tls: false,
        dns: false,
        child_process: false,
        sqlite3: false,
        'better-sqlite3': false,
      }
    }
    return config
  },
  // Configuración para la página 404
  experimental: {
    // Deshabilitar la generación estática de la página 404
    disableStaticPages404: true,
  }
}

export default nextConfig
