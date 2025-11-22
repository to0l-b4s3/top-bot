# 🧪 Complete Testing Guide for PC

> Comprehensive guide for testing the Smart WhatsApp Bot on your local PC

---

## 📋 Table of Contents

1. [Initial Setup & Verification](#initial-setup--verification)
2. [Quick Tests (5 min each)](#quick-tests-5-min-each)
3. [Full Scenario Tests](#full-scenario-tests)
4. [Group Chat Testing](#group-chat-testing)
5. [API Testing](#api-testing)
6. [Performance Testing](#performance-testing)
7. [Error Scenarios](#error-scenarios)
8. [Logging & Debugging](#logging--debugging)

---

## Initial Setup & Verification

### Pre-Test Checklist

Before starting tests, verify everything is running:

```bash
# Check Docker containers
docker-compose ps

# Expected output:
# NAME       COMMAND                  SERVICE    STATUS
# postgres   docker-entrypoint.sh     postgres   Up X minutes
# redis      redis-server             redis      Up X minutes
# pgadmin    /entrypoint.sh           pgadmin    Up X minutes
```

### Verify All Services

| Service | Command | Expected |
|---------|---------|----------|
| Web Platform | http://localhost:5173 | Shows login page |
| Bot API | http://localhost:4001/health | JSON response |
| PgAdmin | http://localhost:5050 | Login page |
| PostgreSQL | Port 5432 | Docker shows "Up" |
| Redis | Port 6379 | Docker shows "Up" |

---

## Quick Tests (5 min each)

### Test Q1: Bot Connection Verification

**Objective:** Verify bot is connected to WhatsApp

**Steps:**

1. Check bot terminal shows:
```
🚀 Bot Connected!
📞 Number: +2634xxxxxxxxx@s.whatsapp.net
```

2. Send any message to the bot from WhatsApp
3. Terminal should show:
```
📨 [+263xxxxxxxxx]: [your message]
```

**Pass Criteria:** ✅ Both terminal messages appear

---

### Test Q2: Command Prefix Recognition

**Objective:** Bot recognizes commands starting with `!`

**Send from WhatsApp:**
```
!help
```

**Expected Response:**
```
📚 AVAILABLE COMMANDS

👥 CUSTOMER:
!register [name] - Create account
!login <email> <password> - Login
!menu / !m - View products
[... more commands ...]
```

**Pass Criteria:** ✅ Receives complete help text

---

### Test Q3: Smart Message Filtering

**Objective:** Bot ignores random text (smart filtering)

**Send from WhatsApp:**
```
hello how are you doing today
```

**Expected Result:**
- ❌ No response from bot
- Terminal shows:
```
⏭️  Ignored non-command/non-intent message: "hello how are you doing today"
```

**Pass Criteria:** ✅ No response (correct behavior)

---

### Test Q4: Intent Detection (Natural Language)

**Objective:** Bot detects natural language intents

**Send from WhatsApp:**
```
I want to order 2 sadza
```

**Expected Response:**
```
🛒 Finding products for you...
Found request for 2 item(s). Type !menu to see products or !add [product] 2
```

**Terminal shows:**
```
🎯 Intent detected: order
```

**Pass Criteria:** ✅ Intent detected and handled

---

### Test Q5: Registration Flow

**Objective:** User registration works

**Send:**
```
!register Alice Smith
```

**Expected Response:**
```
✅ Welcome Alice Smith! 🎉

You're now registered! 👤
Type !menu to start shopping 🛍️
```

**Pass Criteria:** ✅ Registration confirmed

---

## Full Scenario Tests

### Scenario S1: Complete Purchase (20 minutes)

**Goal:** Complete a full order from registration to checkout

#### Step 1: Register (2 min)

**Send:**
```
!register TestCustomer
```

**Expected:**
```
✅ Welcome TestCustomer! 🎉
You're now registered! 👤
Type !menu to start shopping 🛍️
```

**Verify:**
- ✅ Account created
- ✅ Response contains welcome message

#### Step 2: View Menu (2 min)

**Send:**
```
!menu
```

**Expected:**
```
🍽️ OUR MENU

[Category 1]
• Product 1 - USD X.XX
• Product 2 - USD X.XX

[Category 2]
• Product 3 - USD X.XX

Type: !add [product name] [qty]
```

**Verify:**
- ✅ Menu displays
- ✅ At least 3 products shown
- ✅ Prices displayed

#### Step 3: Search Products (2 min)

**Send:**
```
!search chicken
```

**Expected:**
```
Found X product(s):

• Chicken Rice - USD 5.00
• Chicken Stew - USD 6.00
```

**Verify:**
- ✅ Search works
- ✅ Relevant products returned

#### Step 4: Add to Cart (3 min)

**Send:**
```
!add sadza 2
```

**Expected:**
```
✅ Added 2x sadza to cart!
Type !cart to review or !checkout to order.
```

**Send:**
```
!add chicken 1
```

**Expected:**
```
✅ Added 1x chicken to cart!
```

**Verify:**
- ✅ Items added
- ✅ Confirmation messages

#### Step 5: View Cart (3 min)

**Send:**
```
!cart
```

**Expected:**
```
🛒 YOUR CART
═══════════════════

2x Sadza
   USD 5.00
1x Chicken
   USD 5.00

───────────────────
📊 Summary:
Items: 3
Subtotal: USD 10.00
Tax: USD 0.00

Total: USD 10.00
═══════════════════

✅ !checkout to order
➕ !add [product] to add more
❌ !remove [product] to remove
🗑️  !clear to empty cart
```

**Verify:**
- ✅ All items listed
- ✅ Correct quantities
- ✅ Correct totals
- ✅ Action buttons shown

#### Step 6: Modify Cart (2 min)

**Send:**
```
!remove sadza
```

**Expected:**
```
✅ Item removed from cart.
```

**Verify:**
- ✅ Item removed
- ✅ Confirmation shown

#### Step 7: Checkout (3 min)

**Send:**
```
!checkout
```

**Expected:**
```
✅ Order placed!
Order ID: abc123def456
Total: USD 5.00

You'll receive payment details shortly.
```

**Verify:**
- ✅ Order created
- ✅ Order ID provided
- ✅ Total amount shown

#### Step 8: View Order History (2 min)

**Send:**
```
!orders-history
```

**Expected:**
```
📋 YOUR ORDER HISTORY

🆔 abc123de...
📅 11/22/2025
Status: pending
💰 USD 5.00

[... more orders ...]

Type: !status <order-id> for details
```

**Verify:**
- ✅ Order appears in history
- ✅ Correct date
- ✅ Correct total

#### Scenario S1 Result
**Pass if:** ✅ All 8 steps completed successfully

---

### Scenario S2: Login Flow (10 minutes)

**Goal:** Test user login with existing account

#### Step 1: Register with Email

**Send:**
```
!register John Doe
```

**Wait for confirmation**

#### Step 2: Login

**Send:**
```
!login john@example.com password123
```

**Expected:**
```
✅ Welcome back John Doe! 👋
Role: customer

Type !menu to shop or !help for all commands
```

**Verify:**
- ✅ Login successful
- ✅ User name shown
- ✅ Role displayed

#### Scenario S2 Result
**Pass if:** ✅ Login works with credentials

---

### Scenario S3: Natural Language Conversation (10 minutes)

**Goal:** Test bot understands natural language without commands

#### Send Messages (one at a time)

**Message 1:** "I want to buy 2 portions of sadza"
- Expected: Recognizes intent "order"
- Bot offers help adding to cart

**Message 2:** "Show me what you have"
- Expected: Recognizes intent "browse"
- Bot shows menu

**Message 3:** "What's in my cart right now"
- Expected: Recognizes intent "cart"
- Bot shows cart contents

**Message 4:** "How do I check my order"
- Expected: Recognizes intent "help" or "status"
- Bot provides guidance

**Message 5:** "Hi there, nice to meet you"
- Expected: Recognizes intent "greet"
- Bot responds with greeting

**Message 6:** "xyz abc 123 random text"
- Expected: ❌ No intent detected
- ❌ No response (correct!)

**Scenario S3 Result**
**Pass if:** ✅ 5 intents recognized, 1 correctly ignored

---

## Group Chat Testing

### Test G1: Add Bot to Group

**Setup:**
1. Create WhatsApp group with 2-3 people
2. Add your bot account to the group
3. Send commands in group

**Send in Group:**
```
!menu
```

**Expected:**
- Bot responds with menu in group chat
- Response visible to all group members

**Pass Criteria:** ✅ Bot responds in group

---

### Test G2: Individual vs Group Carts

**Setup:**
- Bot in group with 2+ people
- Each person sends commands

**Person 1 sends:**
```
!add sadza 2
```

**Person 2 sends:**
```
!cart
```

**Expected:**
- Person 2 sees empty cart (not Person 1's items)
- Each user has individual cart

**Pass Criteria:** ✅ Carts are isolated per user

---

### Test G3: Group Commands

**Send in Group:**

**User 1:**
```
!register User1
!add sadza 1
```

**User 2:**
```
!register User2
!add chicken 2
```

**User 1:**
```
!checkout
```

**User 2:**
```
!checkout
```

**Expected:**
- Two separate orders created
- Each with correct items
- Responses are personal to each user

**Pass Criteria:** ✅ Independent order flows in group

---

## API Testing

### Test A1: Products API

**URL:**
```
GET http://localhost:4001/api/products
```

**Using curl:**
```bash
curl http://localhost:4001/api/products
```

**Expected Response:**
```json
{
  "success": true,
  "products": {
    "Meals": [
      {"id": "1", "name": "Sadza", "price": 2.50, "currency": "USD"},
      {"id": "2", "name": "Chicken", "price": 5.00, "currency": "USD"}
    ]
  }
}
```

**Pass Criteria:** ✅ Returns product list

---

### Test A2: Cart API

**Add to Cart:**
```bash
curl -X POST http://localhost:4001/api/cart/add \
  -H "Content-Type: application/json" \
  -d '{
    "customer_phone": "+263123456789",
    "merchant_id": "default-merchant-id",
    "product_id": "1",
    "quantity": 2
  }'
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Added to cart"
}
```

**Get Cart:**
```bash
curl http://localhost:4001/api/cart/+263123456789
```

**Expected Response:**
```json
{
  "success": true,
  "cart": {
    "items": [...],
    "total": 5.00,
    "currency": "USD"
  }
}
```

**Pass Criteria:** ✅ Both endpoints work

---

### Test A3: Orders API

**Create Order:**
```bash
curl -X POST http://localhost:4001/api/orders \
  -H "Content-Type: application/json" \
  -d '{
    "merchant_id": "default-merchant-id",
    "customer_phone": "+263123456789",
    "items": [{"product_id": "1", "quantity": 2}],
    "total_amount": 5.00,
    "currency": "USD"
  }'
```

**Expected Response:**
```json
{
  "success": true,
  "order_id": "ord_abc123"
}
```

**Pass Criteria:** ✅ Order created with ID

---

## Performance Testing

### Test P1: Response Time

**Objective:** Bot responds in reasonable time

**Send:**
```
!menu
```

**Measure:** Time from send to receive response

**Expected:** < 3 seconds

**Pass Criteria:** ✅ Response time acceptable

---

### Test P2: Multiple Sequential Commands

**Send rapidly:**
```
!menu
!search sadza
!add sadza 1
!cart
!remove sadza
!clear
```

**Expected:**
- All commands process
- No errors
- No slowdown

**Pass Criteria:** ✅ Handles multiple commands

---

### Test P3: Session Persistence

**Send at T=0:**
```
!menu
!add sadza 2
```

**Wait 5 minutes**

**Send at T=5min:**
```
!cart
```

**Expected:**
- Cart still shows items added 5 minutes ago
- Session maintained

**Pass Criteria:** ✅ Session persists 24 hours

---

## Error Scenarios

### Test E1: Invalid Command

**Send:**
```
!invalidcommand
```

**Expected:**
```
❓ Unknown command: invalidcommand. Type !help for available commands.
```

**Pass Criteria:** ✅ Helpful error message

---

### Test E2: Missing Arguments

**Send:**
```
!add
```

**Expected:**
```
Usage: !add [product name] [qty]
```

**Pass Criteria:** ✅ Usage hint provided

---

### Test E3: Product Not Found

**Send:**
```
!add nonexistentproduct 1
```

**Expected:**
```
Product not found: nonexistentproduct
```

**Pass Criteria:** ✅ Clear error message

---

### Test E4: Empty Cart Checkout

**Send:**
```
!clear
!checkout
```

**Expected:**
```
🛒 Your cart is empty.
```

**Pass Criteria:** ✅ Prevents empty checkout

---

### Test E5: Missing Login Credentials

**Send:**
```
!login
```

**Expected:**
```
Usage: !login <email> <password>

Or use !register to create new account
```

**Pass Criteria:** ✅ Clear instructions

---

## Logging & Debugging

### View Bot Logs

**Terminal showing bot output shows:**

```
✨ Enhanced Smart WhatsApp Ordering Bot
✅ Webhook server running on port 3001

📨 [+263123456789]: !menu
🎯 Command: menu
✅ Sent: 🍽️ OUR MENU...
```

### Log Levels

- ✅ Green = Success
- ⏭️ Gray = Ignored
- ⚠️ Yellow = Warning  
- ❌ Red = Error
- 🎯 Blue = Command/Intent

### Debug Environment Variables

```bash
# Set debug mode
export DEBUG=*

# Run bot
npm start
```

### Check Database

**PgAdmin (Web Interface):**

1. Open http://localhost:5050
2. Login: admin / admin
3. Expand "Servers" → "LocalHost"
4. Browse tables:
   - `users` - Registered users
   - `products` - Menu items
   - `orders` - All orders
   - `carts` - Active carts

### Monitor Redis

```bash
# Connect to Redis CLI
docker exec -it whatsapp-smart-bot-redis-1 redis-cli

# View all keys
keys *

# Check a key
get user:+263123456789

# Quit
exit
```

---

## Testing Checklist

Use this to track your testing progress:

```
BASIC SETUP
☐ Docker containers running
☐ Web platform accessible (5173)
☐ Bot connected to WhatsApp
☐ Terminal shows "Bot Connected!"

COMMANDS
☐ !help works
☐ !register works
☐ !menu works
☐ !search works
☐ !add works
☐ !cart works
☐ !checkout works
☐ !orders-history works
☐ !profile works
☐ !preferences works

NATURAL LANGUAGE
☐ "I want X" detected
☐ "Show menu" detected
☐ "Check order" detected
☐ "Hi" triggers greeting
☐ Random text ignored

GROUP CHAT
☐ Bot joins group
☐ Commands work in group
☐ Carts are individual

ERROR HANDLING
☐ Invalid command handled
☐ Missing args handled
☐ Product not found handled
☐ Empty cart handled

API
☐ GET /api/products works
☐ POST /api/cart/add works
☐ GET /api/cart/:phone works
☐ POST /api/orders works
☐ GET /api/orders/:phone works

PERFORMANCE
☐ Response time < 3 sec
☐ Multiple commands work
☐ Session persists

DATABASE
☐ Orders saved
☐ Users saved
☐ Can view in PgAdmin
```

---

## Quick Troubleshooting During Tests

| Symptom | Cause | Fix |
|---------|-------|-----|
| Bot not responding | Not connected | Check terminal for "Bot Connected!" |
| Command not recognized | Typo in command | Use !help to see exact syntax |
| Empty response | API error | Check bot terminal for error messages |
| Cart shows nothing | Didn't add items | Send !add first |
| Database error | Docker not running | Run `docker-compose up -d` |
| Port in use | Another process | Kill process or use different port |
| QR code issues | Terminal problem | Restart bot with `npm start` |

---

## Success Criteria

**All tests pass when:**

✅ Self-test command completes  
✅ Complete order flow works  
✅ Natural language understood  
✅ Group chat works  
✅ API endpoints respond  
✅ Error handling is user-friendly  
✅ Database saves data  
✅ Response times acceptable  

---

## Next Steps After Testing

1. **Document any issues** encountered
2. **Review the code** - Understand how bot works
3. **Customize for your use case** - Edit products, commands
4. **Deploy to production** - Use PRODUCTION_DEPLOYMENT.md
5. **Monitor in production** - Set up health checks

---

**Happy Testing! 🎉**
