# API Documentation - Moura.ar v3

## Contact Form API

### Endpoint: `/api/contact`

The contact form API provides a secure, rate-limited endpoint for processing contact form submissions with advanced bot detection and N8N webhook integration.

### HTTP Methods

#### POST `/api/contact`

Submit a contact form with project inquiry details.

**Headers**

```http
Content-Type: multipart/form-data
Origin: https://moura.ar (required for CORS)
```

**Request Body (FormData)**
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `name` | string | ✅ | Contact person's name (2-100 chars) |
| `email` | string | ✅ | Valid email address |
| `message` | string | ✅ | Project description (10-5000 chars) |
| `project-type` | string[] | ✅ | Project types (can be multiple) |
| `budget` | string | ❌ | Budget range selection |
| `utm_source` | string | ❌ | Traffic source tracking |
| `utm_medium` | string | ❌ | Marketing medium |
| `utm_campaign` | string | ❌ | Campaign name |
| `utm_term` | string | ❌ | Search keywords |
| `utm_content` | string | ❌ | Ad content variant |

**Honeypot Fields** (leave empty)
| Field | Purpose |
|-------|---------|
| `website` | Bot trap |
| `email_confirm` | Bot trap |
| `phone` | Bot trap |
| `url` | Bot trap |
| `company` | Bot trap |

**Project Type Options**

- `"Landing Page"`
- `"Web App"`
- `"E-commerce"`
- `"Mobile App"`
- `"API/Backend"`
- `"Otro"`

**Budget Options**

- `"< $1,000"`
- `"$1,000 - $5,000"`
- `"$5,000 - $10,000"`
- `"$10,000 - $25,000"`
- `"> $25,000"`

**Success Response**

```json
{
  "success": true,
  "message": "Mensaje enviado correctamente. Te responderemos en menos de 24 horas."
}
```

**Error Responses**

_400 Bad Request - Validation Error_

```json
{
  "success": false,
  "errors": {
    "name": "El nombre debe tener entre 2 y 100 caracteres",
    "email": "Por favor, ingresá un email válido",
    "message": "El mensaje debe tener al menos 10 caracteres"
  },
  "message": "Por favor, corregí los errores en el formulario."
}
```

_403 Forbidden - Invalid Origin_

```json
{
  "success": false,
  "error": "Invalid origin"
}
```

_429 Too Many Requests - Rate Limited_

```json
{
  "success": false,
  "error": "Too many requests. Please try again later."
}
```

**Headers**: `X-RateLimit-Limit`, `X-RateLimit-Remaining`, `X-RateLimit-Reset`

_500 Internal Server Error_

```json
{
  "success": false,
  "error": "Error interno del servidor. Por favor, intentá nuevamente."
}
```

#### GET/PUT/DELETE/PATCH `/api/contact`

**Response**: 405 Method Not Allowed

```json
{
  "error": "Método no permitido. Solo se permiten requests POST."
}
```

### Security Features

#### Rate Limiting

- **Limit**: 5 requests per hour per IP
- **Window**: 1 hour sliding window
- **Headers**: Rate limit status included in responses

#### Bot Detection

- **Honeypot Fields**: Hidden fields that bots typically fill
- **Response**: Returns fake success to confuse bots
- **Logging**: Bot attempts are logged for analysis

#### Spam Detection

- **Keyword Filtering**: Common spam patterns blocked
- **Pattern Detection**: URLs, repeated characters, suspicious formats
- **Response**: Returns fake success while logging attempt

#### Input Sanitization

- **XSS Prevention**: All inputs sanitized for JSON
- **Length Limits**: Enforced on all fields
- **Type Validation**: Strict schema validation with Zod

#### CORS Protection

- **Origin Validation**: Only accepts requests from allowed origins
- **Secure Headers**: Security headers added to all responses

### N8N Integration

#### JWT Authentication

The API generates JWT tokens for authenticating with N8N webhooks.

**Token Structure**

```javascript
{
  iat: timestamp,      // Issued at
  exp: timestamp,      // Expires (5 minutes)
  iss: "moura.ar",    // Issuer
  sub: "contact-form", // Subject
  aud: "n8n-webhook"   // Audience
}
```

#### Webhook Payload

Data sent to N8N webhook endpoint:

```json
{
  "name": "Juan Pérez",
  "email": "juan@example.com",
  "message": "Necesito una landing page para mi negocio...",
  "projectType": "Landing Page, Web App",
  "budget": "$5,000 - $10,000",
  "utm": {
    "utm_source": "google",
    "utm_medium": "cpc",
    "utm_campaign": "portfolio-2024",
    "utm_term": "desarrollo web",
    "utm_content": "anuncio-a",
    "referrer": "https://google.com/search"
  },
  "metadata": {
    "timestamp": "2025-07-31T10:30:00.000Z",
    "source": "moura.ar",
    "userAgent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)...",
    "ip": "192.168.1.100",
    "origin": "https://moura.ar"
  }
}
```

### Testing

#### cURL Examples

**Basic Contact Form Submission**

```bash
curl -X POST https://moura.ar/api/contact \
  -H "Content-Type: multipart/form-data" \
  -F "name=Juan Pérez" \
  -F "email=juan@example.com" \
  -F "message=Necesito una landing page para mi negocio de ventas online" \
  -F "project-type=Landing Page" \
  -F "project-type=E-commerce" \
  -F "budget=$5,000 - $10,000" \
  -F "utm_source=google" \
  -F "utm_medium=cpc"
```

**With UTM Parameters**

```bash
curl -X POST https://moura.ar/api/contact \
  -H "Content-Type: multipart/form-data" \
  -F "name=Test User" \
  -F "email=test@example.com" \
  -F "message=This is a test message for the contact form" \
  -F "project-type=Web App" \
  -F "utm_source=linkedin" \
  -F "utm_medium=social" \
  -F "utm_campaign=developer-outreach"
```

#### JavaScript Example

```javascript
const formData = new FormData();
formData.append('name', 'Juan Pérez');
formData.append('email', 'juan@example.com');
formData.append('message', 'Necesito desarrollar una aplicación web...');
formData.append('project-type', 'Web App');
formData.append('project-type', 'API/Backend');
formData.append('budget', '$10,000 - $25,000');

// Add UTM parameters if available
const urlParams = new URLSearchParams(window.location.search);
['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content'].forEach((param) => {
  const value = urlParams.get(param);
  if (value) formData.append(param, value);
});

const response = await fetch('/api/contact', {
  method: 'POST',
  body: formData,
});

const result = await response.json();
if (result.success) {
  console.log('Form submitted successfully');
} else {
  console.error('Form errors:', result.errors);
}
```

### Error Handling

#### Client-Side Error Handling

```javascript
try {
  const response = await fetch('/api/contact', {
    method: 'POST',
    body: formData,
  });

  const result = await response.json();

  if (!response.ok) {
    switch (response.status) {
      case 400:
        // Validation errors
        Object.entries(result.errors).forEach(([field, message]) => {
          console.error(`${field}: ${message}`);
        });
        break;
      case 429:
        // Rate limited
        console.error('Too many requests. Please wait before trying again.');
        break;
      case 500:
        // Server error
        console.error('Server error. Please try again later.');
        break;
    }
  }
} catch (error) {
  console.error('Network error:', error);
}
```

### Monitoring & Analytics

The API integrates with Umami Analytics to track:

- Form submission attempts
- Success/failure rates
- Validation error patterns
- UTM parameter effectiveness
- Conversion funnel metrics

### Troubleshooting

#### Common Issues

**"Invalid origin" Error**

- Ensure requests are made from the correct domain
- Check CORS configuration in production

**Rate Limit Exceeded**

- Wait for the time specified in `X-RateLimit-Reset` header
- Implement client-side rate limiting

**Validation Errors**

- Check field requirements and character limits
- Ensure email format is valid
- Project type must be from allowed values

**N8N Webhook Failures**

- Verify `N8N_WEBHOOK_URL` environment variable
- Check JWT secret configuration
- Ensure N8N webhook expects Bearer token

### Environment Configuration

**Required Variables**

```bash
N8N_WEBHOOK_URL=https://n8n.moura.ar/webhook-test/moura-contact-form
N8N_JWT_SECRET=your-secure-jwt-secret
```

**Security Best Practices**

- Use a strong, random JWT secret (32+ characters)
- Rotate JWT secret periodically
- Monitor rate limit violations
- Review spam detection logs regularly

---

**API Version**: 2.0
**Last Updated**: 2025-07-31
