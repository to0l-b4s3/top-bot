# 🚀 Quick Start - Testing the Bot

## Setup (5 minutes)

```bash
# 1. Copy config
cd whatsapp-bot
cp .env.example .env

# 2. Edit .env - set your phone number
# ADMIN_PHONE=263771234567

# 3. Start backend
cd /workspaces/top-bot
npm run api &

# 4. Start frontend  
npm run dev &

# 5. Start bot (in new terminal)
npm run bot:dev
```

---

## Test Commands

Send these to your bot via WhatsApp:

### Basic
- `!help` - Show help menu
- `!menu` - Main shopping menu
- `!commands` - List all commands

### Shopping
- `!search pizza` - Search products
- `!cart` - View your cart
- `!orders` - Your order history

### Group Commands (must use in group)
- `!grouptools` - Group menu
- `!groupinfo` - Group details
- `!memberlist` - List members
- `!groupstats` - Group statistics

### Admin Only (need ADMIN_PHONE set)
- `!kick 263771234567` - Remove member
- `!mute` - Mute group
- `!unmute` - Unmute group
- `!pin Hello` - Pin message
- `!warn 263771234567 reason` - Warn member

---

## Verify API Works

```bash
# Check merchants
curl http://localhost:5173/api/merchants | jq .data

# Check products
curl http://localhost:5173/api/products | jq .data

# Check API format is correct
curl http://localhost:5173/api/merchants | jq
# Should show: { "success": true, "data": {...} }
```

---

## Run Tests

```bash
# Test API response format
node test-commands.js

# Expected output:
# ✅ Merchants API - Format correct
# ✅ Products API - Format correct
# ... (all should pass)
```

---

## Common Issues

| Issue | Fix |
|-------|-----|
| "Unknown command" | Command not registered - check registry |
| "Group commands only in groups" | Use command in actual WhatsApp group |
| "Only admins can..." | Set ADMIN_PHONE in .env to your number |
| Commands timeout | Check backend running: `npm run api` |
| Bot not responding | Check logs in `npm run bot:dev` terminal |

---

## Logs to Check

```
# Bot terminal shows:
📝 Command: menu          ← Command was parsed
✅ Response sent        ← Message sent to WhatsApp
❌ ERROR: ...           ← Error occurred

# Backend terminal shows:
GET /api/merchants      ← API call received
{ success: true, data }  ← Response format
```

---

## Checklist

- [ ] .env.example copied to .env
- [ ] ADMIN_PHONE set in .env
- [ ] Backend running (npm run api)
- [ ] Frontend running (npm run dev)
- [ ] Bot running (npm run bot:dev)
- [ ] First command sent to bot
- [ ] Received response in WhatsApp
- [ ] Group commands tested in group
- [ ] Admin commands verified with ADMIN_PHONE

---

## Next Steps

✅ Commands working? → Test more commands!
❌ Commands failing? → Check logs + run test-commands.js

Questions? Check `CONFIG_SETUP_GUIDE.md` or `SESSION_COMPLETION_SUMMARY.md`
