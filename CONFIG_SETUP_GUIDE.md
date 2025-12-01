# 🔧 Configuration Setup Guide

## Quick Overview

The bot uses **environment variables** to manage all configuration. No need to create separate config files—just use the `.env` file.

---

## Setup Instructions

### 1. **Copy the Example File**
```bash
cd whatsapp-bot
cp .env.example .env
```

### 2. **Key Configuration Values**

Edit `.env` and set these critical values:

```bash
# Your bot's owner/admin phone number (WhatsApp Business number)
ADMIN_PHONE=263771234567              # Your phone without + or 00

# Bot prefix - what users type before commands
BOT_PREFIX=!                            # Users type: !menu, !help, etc.

# API connection
API_BASE_URL=http://localhost:5173     # Your backend server
API_TIMEOUT=5000                       # 5 seconds

# Environment
NODE_ENV=development                   # or 'production'
```

### 3. **Authorization System**

The bot automatically reads `ADMIN_PHONE` from `.env` and uses it for:
- ✅ Admin-only commands: `!kick`, `!mute`, `!pin`, `!warn`, etc.
- ✅ Dashboard management access
- ✅ User permission checks

**How it works:**
```javascript
// In constants.js
IS_OWNER(phoneNumber)  // True if phone matches ADMIN_PHONE
IS_ADMIN(phoneNumber)  // True if phone is in ADMIN_PHONES
```

### 4. **Testing Configuration**

Once `.env` is set up:

```bash
# Terminal 1: Backend API
npm run api

# Terminal 2: Frontend dev
npm run dev

# Terminal 3: Bot with your config
npm run bot:dev
```

Send a command to your bot: `!menu`, `!help`, etc.

---

## Group Management Commands

These require **admin/owner status** (verified against `ADMIN_PHONE`):

| Command | Usage | Permission |
|---------|-------|-----------|
| `!grouptools` / `!groupmenu` | Main group menu | Any user (group only) |
| `!groupinfo` | Show group details | Any user (group only) |
| `!memberlist` | List all members | Any user (group only) |
| `!groupstats` | Show group statistics | Any user (group only) |
| `!kick <phone>` | Remove member | Admin/Owner only |
| `!mute [duration]` | Mute notifications | Admin/Owner only |
| `!unmute` | Restore notifications | Admin/Owner only |
| `!pin <text>` | Pin message | Admin/Owner only |
| `!unpin` | Remove pinned messages | Admin/Owner only |
| `!warn <phone> [reason]` | Warn member | Admin/Owner only |

---

## Environment Variables Explained

### Core Bot
```bash
BOT_PREFIX=!                # Command prefix (users type !help, #help, etc.)
BOT_PORT=3001              # Bot server port (dev mode)
ADMIN_PHONE=263771234567   # Bot owner's WhatsApp number
NODE_ENV=development       # development or production
```

### API Connection
```bash
API_BASE_URL=http://localhost:5173   # Backend server URL
API_TIMEOUT=5000                     # Request timeout in ms
```

### Database (Optional - for production)
```bash
DATABASE_URL=postgresql://user:password@localhost:5432/smartbot
# Or Supabase:
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=your-supabase-api-key
```

### Features (Enable/Disable)
```bash
ENABLE_BROADCAST=true         # Users can broadcast messages
ENABLE_IMAGE_UPLOAD=true      # Users can upload images
ENABLE_MEDIA_DOWNLOAD=true    # Bot can download media
```

### Rate Limiting
```bash
RATE_LIMIT_ENABLED=true
RATE_LIMIT_WINDOW=900000     # 15 minutes in ms
RATE_LIMIT_MAX_REQUESTS=100  # Max requests per window
```

### Caching (TTL in seconds)
```bash
CACHE_SESSION_TTL=3600       # 1 hour
CACHE_CART_TTL=7200          # 2 hours
CACHE_MERCHANT_TTL=1800      # 30 minutes
CACHE_PRODUCT_TTL=900        # 15 minutes
```

---

## Multi-Prefix Support

The bot supports **7 prefixes** by default:
- `!` (exclamation)
- `#` (hash)
- `.` (dot)
- `$` (dollar)
- `/` (slash)
- `~` (tilde)
- `^` (caret)

Users can switch: `!prefix #` → Now they use `#menu`, `#help`, etc.

---

## Common Issues

### ❌ "Unknown command"
1. Check command is in registry: `grep "mycommand" whatsapp-bot/src/registry/commandRegistry.js`
2. Check routing in `index.js`: `grep "case 'mycommand'" whatsapp-bot/src/index.js`
3. Check handler method exists: `grep "handleMyCommand" whatsapp-bot/src/handlers/`
4. Restart bot after `.env` changes: `npm run bot:dev`

### ❌ "Only admins can use..."
1. Verify `ADMIN_PHONE` in `.env` matches your WhatsApp number
2. Restart bot: `npm run bot:dev`
3. Test with owner number from WhatsApp

### ❌ Commands not responding
1. Check API running: `curl http://localhost:5173/api/merchants`
2. Check API_BASE_URL in `.env` is correct
3. Check logs: `npm run bot:dev` shows detailed output
4. Verify backend data exists: `data/merchants.json`, `data/products.json`

---

## Production Deployment

Before deploying to production:

1. ✅ Update `.env`:
   ```bash
   NODE_ENV=production
   API_BASE_URL=https://your-production-server.com
   DATABASE_URL=<your-postgres-url>
   ```

2. ✅ Database migration:
   ```bash
   npm run db:migrate
   ```

3. ✅ Verify all commands work in test group

4. ✅ Enable rate limiting:
   ```bash
   RATE_LIMIT_ENABLED=true
   DAILY_COMMAND_LIMIT=1000
   ```

5. ✅ Set up logging:
   ```bash
   LOG_LEVEL=info
   LOG_FILE=logs/bot.log
   ```

---

## Quick Reference

**To add a new admin:**
```bash
# In .env
ADMIN_PHONES=263771234567,263773456789

# Or just single admin:
ADMIN_PHONE=263771234567
```

**To change command prefix:**
```bash
# In .env
BOT_PREFIX=#

# Users now type: #menu, #help, etc.
# (Original 7 prefixes still work too)
```

**To enable/disable features:**
```bash
# In .env
ENABLE_BROADCAST=false      # No broadcasting
ENABLE_IMAGE_UPLOAD=false   # No image uploads
ENABLE_MEDIA_DOWNLOAD=true  # Still allow downloads
```

---

**Last Updated:** November 24, 2025  
**Status:** ✅ Configuration system fully implemented  
**Next:** Test all 80+ commands with fixed API format
