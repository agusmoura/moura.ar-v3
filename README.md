# Moura.ar v3 🚀

Portfolio personal y formulario de contacto con integración N8N.

## 🛠️ Stack Tecnológico

- **Astro v5** - Framework web moderno
- **Tailwind CSS v4** - Estilos utilitarios
- **TypeScript** - Tipado estático
- **N8N + JWT** - Automatización de formularios
- **Bun** - Runtime y package manager

## 🚀 Inicio Rápido

```bash
# Instalar dependencias
bun install

# Ejecutar en desarrollo
bun run dev
```

## 🔧 Variables de Entorno

```bash
# N8N Configuration (requeridas)
N8N_WEBHOOK_URL=https://n8n.moura.ar/webhook-test/moura-contact-form
N8N_JWT_SECRET=your-jwt-secret-phrase

# Analytics (opcional)
PUBLIC_ENABLE_ANALYTICS=false
```

## 📊 Formulario de Contacto

El formulario captura automáticamente:

- **Datos básicos**: nombre, email, mensaje, tipo de proyecto, presupuesto
- **UTM tracking**: utm_source, utm_medium, utm_campaign, utm_term, utm_content
- **Metadata**: timestamp, IP, user agent, referrer, origen

### Datos enviados a N8N:

```json
{
  "name": "Juan Pérez",
  "email": "juan@example.com",
  "message": "Necesito una web app...",
  "projectType": "Web App, E-commerce",
  "budget": "$5,000 - $10,000",
  "utm": {
    "utm_source": "google",
    "utm_medium": "cpc",
    "utm_campaign": "portfolio-2024",
    "referrer": "https://google.com/search"
  },
  "metadata": {
    "timestamp": "2025-06-27T16:48:22.000Z",
    "source": "moura.ar",
    "userAgent": "Mozilla/5.0...",
    "ip": "192.168.1.100",
    "origin": "https://moura.ar"
  }
}
```

## 🔒 JWT Authentication

El sistema genera automáticamente JWTs para autenticar requests con N8N usando el patrón Bearer token recomendado por [N8N](https://docs.n8n.io/integrations/builtin/core-nodes/n8n-nodes-base.webhook/).

## 🧪 Testing

```bash
# Verificar configuración
bun run test:health

# Ver respuesta
curl http://localhost:4321/api/health
```

## 📈 UTM Tracking

Soporte completo para UTM parameters siguiendo [mejores prácticas de Google Analytics](https://support.google.com/analytics/answer/1033863):

- `utm_source`: Fuente del tráfico (google, facebook, newsletter)
- `utm_medium`: Tipo de campaña (email, social, cpc, organic)
- `utm_campaign`: Nombre específico de campaña
- `utm_term`: Palabras clave (para SEM)
- `utm_content`: Variación del anuncio (A/B testing)

**Ejemplo de URL con UTMs:**

```
https://moura.ar?utm_source=google&utm_medium=cpc&utm_campaign=portfolio-2024&utm_term=desarrollo+web&utm_content=anuncio-principal
```

## 🏗️ Deployment

### Variables en Coolify

1. `N8N_WEBHOOK_URL=https://n8n.moura.ar/webhook-test/moura-contact-form`
2. `N8N_JWT_SECRET=your-secure-secret-phrase` (marcar como sensitive)

### N8N Workflow Setup

1. **Webhook Trigger** con JWT authentication
2. **Google Sheets** para almacenamiento
3. **Email notification** (opcional)

## 📋 Comandos Útiles

```bash
bun run dev          # Desarrollo
bun run build        # Build producción
bun run preview      # Preview build
bun run test:health  # Health check
```

---

**Versión simplificada** - Sin rate limiting, logging complejo ni dependencias innecesarias. Solo lo esencial para un formulario de contacto robusto con N8N.
