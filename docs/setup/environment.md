# Environment Configuration

## Environment Variables

The application uses environment variables for configuration. Create a `.env` file in the project root.

## Required Variables

### N8N Integration (Contact Form)
```bash
# N8N webhook URL for contact form submissions
N8N_WEBHOOK_URL=https://n8n.moura.ar/webhook-test/moura-contact-form

# JWT secret for N8N authentication (keep secure!)
N8N_JWT_SECRET=your-secure-jwt-secret-phrase
```

⚠️ **Security Note**: Never commit the actual JWT secret to version control. Use a strong, unique secret for production.

## Optional Variables

### Analytics
```bash
# Enable/disable analytics tracking
PUBLIC_ENABLE_ANALYTICS=false
```

### Development
```bash
# Development server port (default: 4321)
PORT=4321

# Enable debug logging in development
DEBUG=true
```

## Environment Setup by Stage

### Development Environment
```bash
# .env (for local development)
N8N_WEBHOOK_URL=https://n8n.moura.ar/webhook-test/moura-contact-form
N8N_JWT_SECRET=dev-secret-change-me
PUBLIC_ENABLE_ANALYTICS=false
DEBUG=true
```

### Production Environment
```bash
# Production environment variables
N8N_WEBHOOK_URL=https://n8n.moura.ar/webhook/moura-contact-form
N8N_JWT_SECRET=your-production-secure-secret
PUBLIC_ENABLE_ANALYTICS=true
```

## Platform-Specific Configuration

### Coolify Deployment

1. Navigate to your Coolify project
2. Go to **Environment Variables** section
3. Add these variables:

```bash
N8N_WEBHOOK_URL=https://n8n.moura.ar/webhook/moura-contact-form
N8N_JWT_SECRET=your-production-secret  # Mark as "sensitive"
PUBLIC_ENABLE_ANALYTICS=true
```

4. Mark `N8N_JWT_SECRET` as **sensitive** to hide its value

### Vercel Deployment

```bash
# Using Vercel CLI
vercel env add N8N_WEBHOOK_URL
vercel env add N8N_JWT_SECRET
vercel env add PUBLIC_ENABLE_ANALYTICS
```

### Netlify Deployment

Add in **Site settings → Environment variables**:
```bash
N8N_WEBHOOK_URL=https://n8n.moura.ar/webhook/moura-contact-form
N8N_JWT_SECRET=your-production-secret
PUBLIC_ENABLE_ANALYTICS=true
```

## N8N Workflow Setup

### Webhook Configuration

1. **Create N8N Workflow**
   - Add **Webhook** trigger node
   - Set **Authentication** to `Header Auth`
   - Use header name: `Authorization`
   - Set expected value: `Bearer [JWT_TOKEN]`

2. **JWT Validation**
   The application automatically generates JWT tokens with:
   ```json
   {
     "form": "contact",
     "timestamp": "2025-07-31T10:30:00.000Z",
     "source": "moura.ar"
   }
   ```

3. **Data Processing**
   - Add **Google Sheets** node for data storage
   - Add **Email** node for notifications (optional)
   - Process UTM parameters and metadata

### Example N8N Workflow Structure
```
Webhook (JWT Auth) → Validate Data → Google Sheets → Email Notification
```

## Environment Validation

### Check Configuration
```bash
# Verify environment variables are loaded
bun run dev

# Check specific variables
echo $N8N_WEBHOOK_URL
echo $PUBLIC_ENABLE_ANALYTICS
```

### Test Contact Form
```bash
# Health check
curl http://localhost:4321/api/health

# Test contact form submission
curl -X POST http://localhost:4321/api/contact \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "message": "Test message"
  }'
```

## Security Best Practices

### JWT Secret Security
- **Use strong secrets**: Minimum 32 characters, random
- **Rotate regularly**: Change production secrets periodically
- **Environment isolation**: Different secrets for dev/staging/production
- **Secure storage**: Use platform-specific secret management

### Example Strong Secret Generation
```bash
# Generate secure JWT secret
openssl rand -base64 32

# Or use Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

### Environment File Security
```bash
# Add .env to .gitignore (already included)
echo ".env" >> .gitignore

# Never commit actual secrets
git status  # Verify .env is not tracked
```

## Troubleshooting

### Common Issues

#### Contact Form Not Working
1. Check N8N webhook URL is correct
2. Verify JWT secret matches N8N configuration
3. Test N8N webhook independently

#### Environment Variables Not Loading
```bash
# Check .env file exists and is readable
ls -la .env
cat .env

# Verify Astro is loading environment variables
bun run dev
# Check console output for environment detection
```

#### JWT Authentication Errors
1. Verify JWT secret is identical in both .env and N8N
2. Check N8N webhook authentication settings
3. Test JWT generation:
   ```bash
   # Test JWT creation
   node -e "
   const jwt = require('jsonwebtoken');
   const token = jwt.sign({test: true}, 'your-secret');
   console.log(token);
   "
   ```

### Debug Mode

Enable debug logging to troubleshoot issues:
```bash
# Add to .env
DEBUG=true

# Restart development server
bun run dev
```

This will show additional logging for:
- Environment variable loading
- JWT token generation
- N8N webhook requests
- Error details

## Next Steps

After configuring your environment:

1. **[Test the setup](../usage/commands.md#testing)** - Verify everything works
2. **[Learn available commands](../usage/commands.md)** - Development workflow
3. **[Understand the architecture](../development/architecture.md)** - How it all fits together

## Need Help?

- Check [installation guide](./installation.md) for setup issues
- Review [API documentation](../api/contact-form.md) for contact form details
- See [troubleshooting section](#troubleshooting) above