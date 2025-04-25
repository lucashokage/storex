"use server"

// Define types in a separate namespace or use type-only exports
// Type-only exports don't count as "exports" for the "use server" directive
export type EmailConfig = {
  mail_host: string | null
  mail_port: number | null
  mail_username: string | null
  mail_password: string | null
  mail_encryption: "tls" | "ssl" | null
  mail_from_address: string | null
  mail_from_name: string | null
  mail_mailer: string | null
  api_key?: string | null // Para servicios como Brevo que usan API keys
}

// Función para cargar la configuración
export async function loadEmailConfig(): Promise<EmailConfig> {
  // Try to load from localStorage first (client-side)
  if (typeof window !== "undefined") {
    try {
      const savedConfig = localStorage.getItem("emailConfig")
      if (savedConfig) {
        return JSON.parse(savedConfig)
      }
    } catch (error) {
      console.error("Error loading email config from localStorage:", error)
    }
  }

  // Fallback to default config
  return {
    mail_host: process.env.MAIL_HOST || "smtp.example.com",
    mail_port: process.env.MAIL_PORT ? Number.parseInt(process.env.MAIL_PORT) : 587,
    mail_username: process.env.MAIL_USERNAME || "user@example.com",
    mail_password: process.env.MAIL_PASSWORD || "password",
    mail_encryption: (process.env.MAIL_ENCRYPTION as "tls" | "ssl") || "tls",
    mail_from_address: process.env.MAIL_FROM_ADDRESS || "noreply@example.com",
    mail_from_name: process.env.MAIL_FROM_NAME || "Tienda X",
    mail_mailer: process.env.MAIL_MAILER || "smtp",
    api_key: process.env.MAIL_API_KEY || null,
  }
}

// Función para obtener la configuración predeterminada
export async function getDefaultEmailConfig(): Promise<EmailConfig> {
  return {
    mail_host: null,
    mail_port: null,
    mail_username: null,
    mail_password: null,
    mail_encryption: null,
    mail_from_address: null,
    mail_from_name: null,
    mail_mailer: null,
    api_key: null,
  }
}

// Función para obtener presets de configuración
export async function getEmailPreset(preset: string): Promise<Partial<EmailConfig>> {
  const presets: Record<string, Partial<EmailConfig>> = {
    brevo: {
      mail_host: "smtp-relay.brevo.com",
      mail_port: 587, // Brevo uses port 587
      mail_encryption: "tls",
      mail_mailer: "brevo",
    },
    gmail: {
      mail_host: "smtp.gmail.com",
      mail_port: 465,
      mail_encryption: "ssl",
      mail_mailer: "smtp",
    },
    outlook: {
      mail_host: "smtp-mail.outlook.com",
      mail_port: 587,
      mail_encryption: "tls",
      mail_mailer: "smtp",
    },
    smtp: {
      mail_host: "",
      mail_port: 25,
      mail_encryption: null,
      mail_mailer: "smtp",
    },
  }

  return presets[preset] || {}
}

// Función para guardar la configuración
export async function saveEmailConfig(config: EmailConfig): Promise<void> {
  // Save to localStorage (client-side)
  if (typeof window !== "undefined") {
    try {
      localStorage.setItem("emailConfig", JSON.stringify(config))
      console.log("Email config saved to localStorage:", config)
    } catch (error) {
      console.error("Error saving email config to localStorage:", error)
    }
  }
}

// Función para detectar si es Brevo basado en la configuración
export async function isBrevoConfig(config: EmailConfig): Promise<boolean> {
  return (
    config.mail_mailer === "brevo" ||
    config.mail_host?.toLowerCase().includes("brevo") ||
    false ||
    config.mail_host?.toLowerCase().includes("sendinblue") ||
    false
  )
}
