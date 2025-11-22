# 🎯 PC Setup & Testing Checklist

> Quick reference checklist for setting up and testing on your local PC

---

## ✅ Pre-Setup Checklist

Before starting, verify you have:

- [ ] **Docker & Docker Compose** installed (`docker -v`, `docker-compose -v`)
- [ ] **Node.js 18+** installed (`node -v`)
- [ ] **npm** installed (`npm -v`)
- [ ] **WhatsApp** on your phone with an active account
- [ ] **Git** installed (optional, for cloning)
- [ ] **Ports available:** 5173, 3000, 3001, 4001, 5432, 6379
- [ ] **Internet connection** (stable, for WhatsApp)
- [ ] **Terminal/Command Prompt** ready

---

## 🚀 Setup Steps (Choose One)

### FASTEST: Automated Setup (2 minutes)

```bash
# 1. Navigate to project
cd /path/to/whatsapp-smart-bot

# 2. Run automated setup
chmod +x quickstart.sh
./quickstart.sh

# 3. Scan QR code with WhatsApp
# (Follow the on-screen instructions)
```

**What happens:**
- ✅ Docker containers start
- ✅ Dependencies installed
- ✅ Web platform starts
- ✅ Bot connects to WhatsApp
- ✅ QR code displayed

---

### MANUAL: Step-by-Step Setup (5 minutes)

#### In Terminal Window 1:

```bash
# 1. Navigate to project
cd /path/to/whatsapp-smart-bot

# 2. Start Docker containers
docker-compose up -d

# 3. Wait 10 seconds, verify all running
docker-compose ps
# Should show: postgres, redis, pgadmin (all "Up")

# 4. Install web platform
npm install

# 5. Start web platform
npm run dev
# Should show: http://localhost:5173
```

**Keep Terminal 1 open**

#### In Terminal Window 2:

```bash
# 1. Navigate to bot folder
cd /path/to/whatsapp-smart-bot/whatsapp-bot

# 2. Install dependencies
npm install

# 3. Start bot
npm start
# Should show: QR code and "Waiting for connection..."

# 4. Scan QR code with WhatsApp
# Open WhatsApp → Settings → Linked Devices → Link a Device
# Point phone camera at QR code in terminal

# 5. Wait for "🚀 Bot Connected!" message
```

**Keep Terminal 2 open**

---

## ✅ Verification Checklist

### After Setup, Verify:

- [ ] Web platform accessible at http://localhost:5173
- [ ] Bot terminal shows "🚀 Bot Connected!"
- [ ] Database running: `docker-compose ps` shows all "Up"
- [ ] Can send message to bot from WhatsApp
- [ ] Terminal shows message received

---

## 🧪 Quick Test (5 minutes)

### Test 1: Help Command
```
Send to bot:
!help

Expected:
📚 AVAILABLE COMMANDS
[list of commands]
```

### Test 2: Self-Test
```
Send to bot:
!test

Expected:
🧪 BOT SELF-TEST STARTED
✅ Command parsing: OK
✅ Intent detection: OK
[more checks...]
```

### Test 3: Full Order Flow
```
Send sequence:
1. !register TestUser
2. !menu
3. !add sadza 1
4. !cart
5. !checkout

Expected:
✅ Welcome message
✅ Menu displayed
✅ Item added
✅ Cart shown
✅ Order placed
```

### Test 4: Natural Language
```
Send:
I want 2 sadza please

Expected:
🛒 Finding products for you...
```

### Test 5: Smart Filtering
```
Send:
hello world random text

Expected:
❌ NO RESPONSE (correct behavior)
```

---

## 🔌 Access Points

| Service | URL | Purpose |
|---------|-----|---------|
| Web Platform | http://localhost:5173 | Dashboard & UI |
| API Health | http://localhost:4001/health | API status |
| PgAdmin | http://localhost:5050 | Database browser |
| Bot Webhook | http://localhost:3001 | Webhook endpoint |

### Database Access

**PgAdmin Credentials:**
- URL: http://localhost:5050
- Email: admin@example.com
- Password: admin

**PostgreSQL Credentials:**
- Host: localhost
- Port: 5432
- User: postgres
- Password: postgres
- Database: whatsapp_bot

**Redis:**
- Host: localhost
- Port: 6379

---

## 📱 WhatsApp Commands Quick Reference

### Most Important Commands

```
!help                  → Show all commands
!register [name]      → Create account
!menu                 → Show products
!add [product] [qty]  → Add to cart
!cart                 → View cart
!checkout             → Place order
!orders-history       → View past orders
!test                 → Run bot tests
```

### Natural Language Examples

```
"I want 2 sadza"           → Bot understands intent
"Show me the menu"         → Bot displays menu
"Check my order"           → Bot asks for order ID
"Hello there"              → Bot greets you
"random text"              → Bot ignores (smart filter)
```

---

## 🐛 Common Issues & Quick Fixes

### Issue: Bot not responding

**Check:**
1. Terminal shows "🚀 Bot Connected!" ?
2. Message starts with `!` or matches intent?
3. WhatsApp hasn't blocked the number?

**Fix:**
```bash
# Kill and restart bot
Ctrl+C
npm start
```

### Issue: "Cannot connect to database"

**Check:**
```bash
docker-compose ps
# All should show "Up"
```

**Fix:**
```bash
docker-compose up -d
docker-compose logs postgres
```

### Issue: "Port already in use"

**Find process:**
```bash
lsof -i :5173  # For web platform
lsof -i :3001  # For bot
```

**Kill it:**
```bash
kill -9 <PID>
```

### Issue: No QR code showing

**Fix:**
```bash
cd whatsapp-bot
npm update
npm start
```

### Issue: "Module not found" errors

**Fix:**
```bash
npm cache clean --force
npm install
npm start
```

---

## 📊 Testing Checklist

### Basic Functionality
- [ ] Bot starts without errors
- [ ] QR code displays
- [ ] QR code scans successfully
- [ ] "Bot Connected!" message appears
- [ ] Messages appear in terminal

### Commands
- [ ] !help works
- [ ] !register works
- [ ] !menu works
- [ ] !add works
- [ ] !cart works
- [ ] !checkout works
- [ ] !test works

### Natural Language
- [ ] "I want X" understood
- [ ] "Show menu" understood
- [ ] "Check order" understood
- [ ] "Hi" triggers greeting
- [ ] Random text ignored

### Group Chat
- [ ] Bot joins group
- [ ] Commands work in group
- [ ] Each user has own cart

### API
- [ ] http://localhost:4001/health responds
- [ ] GET /api/products works
- [ ] POST /api/cart/add works

### Database
- [ ] Orders appear in PgAdmin
- [ ] Users saved in database
- [ ] Cart persists

---

## 🎯 Performance Targets

| Metric | Target | Acceptable |
|--------|--------|-----------|
| Message Response Time | < 2 sec | < 3 sec |
| Command Processing | Immediate | < 1 sec |
| Cart Display | < 1 sec | < 2 sec |
| Order Creation | < 1 sec | < 2 sec |
| Session Load | Instant | < 500ms |

---

## 📚 Documentation Structure

**For Setup:**
- ✅ This document (you are here)
- README.md - Full overview
- LOCAL_SETUP_GUIDE.md - Detailed setup

**For Testing:**
- ✅ TESTING_GUIDE.md - Comprehensive tests
- QUICK_REFERENCE.md - Command lookup
- BOT_FEATURES.md - All features

**For Development:**
- API_DOCUMENTATION.md - API reference
- IMPLEMENTATION_SUMMARY.md - What was built
- PRODUCTION_DEPLOYMENT.md - Deploy guide

**Quick Start:**
- Start here → README.md → TESTING_GUIDE.md → PRODUCTION_DEPLOYMENT.md

---

## 🎓 Learning Path

### 30 Minutes
1. Read this checklist (2 min)
2. Run setup (5 min)
3. Run !test command (3 min)
4. Try 5 quick commands (10 min)
5. Review README.md (10 min)

### 1 Hour (Add to above)
1. Complete full order flow (15 min)
2. Test natural language (10 min)
3. Review code structure (15 min)
4. Check database in PgAdmin (5 min)

### 2 Hours (Add to above)
1. Follow TESTING_GUIDE.md scenarios (30 min)
2. Test API endpoints (10 min)
3. Test error handling (10 min)
4. Review bot code (10 min)
5. Plan customizations (10 min)

---

## 🚦 Status Indicators

### What You Should See

**Bot Running:**
```
✨ Enhanced Smart WhatsApp Ordering Bot
✅ Webhook server running on port 3001
🚀 Bot Connected!
```

**Web Platform:**
```
VITE v5.0.0  ready
➜  Local: http://localhost:5173
```

**Docker Containers:**
```
NAME       STATUS
postgres   Up 5 minutes
redis      Up 5 minutes
pgadmin    Up 5 minutes
```

### What Means Problem

- ❌ "Connection refused"
- ❌ "Port already in use"
- ❌ "Module not found"
- ❌ "Bot disconnected"
- ❌ Docker container "Exited"

**→ See Troubleshooting section above**

---

## 💾 Data & Backups

### Local Data Location

**Bot Auth:**
```
whatsapp-bot/auth_info_baileys/
```

**Docker Volumes:**
```
docker volume ls
# Shows: whatsapp-smart-bot_postgres_data
```

### Backup Before Testing

```bash
# Backup bot auth
cp -r whatsapp-bot/auth_info_baileys whatsapp-bot/auth_info_baileys.backup

# Backup database (via PgAdmin)
# Right-click database → Backup
```

### Reset Everything

```bash
# Stop all containers
docker-compose down -v

# Remove bot auth
rm -rf whatsapp-bot/auth_info_baileys

# Start fresh
docker-compose up -d
npm start  # Will show new QR code
```

---

## 🎉 Ready to Start?

### Quick Command Reference

```bash
# Start everything (Automated)
./quickstart.sh

# Start everything (Manual - Terminal 1)
docker-compose up -d
npm install
npm run dev

# Start bot (Manual - Terminal 2)
cd whatsapp-bot
npm install
npm start

# Run tests
Send: !test

# View database
Visit: http://localhost:5050

# View API
Visit: http://localhost:4001/health
```

---

## 📞 Quick Support

| Problem | Solution |
|---------|----------|
| Bot disconnected | Restart with `npm start` |
| No QR code | Kill and restart bot |
| Port in use | Kill process with `lsof -i :port` |
| Database error | Check `docker-compose ps` |
| API not responding | Start with `node api-server.js` |
| Permission denied | Use `chmod +x` on script |
| Module errors | Run `npm install` again |

---

## ✨ Success Checklist

You're ready when:

- [ ] All Docker containers running
- [ ] Web platform accessible
- [ ] Bot shows "Connected!" message
- [ ] Can send messages to bot
- [ ] !test command passes
- [ ] Full order flow completes
- [ ] Natural language works
- [ ] Group chat works
- [ ] Database saves data
- [ ] API endpoints respond

---

**🎉 Start now:** `./quickstart.sh`

**Need help?** Check README.md or TESTING_GUIDE.md

**Happy Testing!** ✅
