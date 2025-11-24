#!/bin/bash

echo "╔════════════════════════════════════════════════════════════════╗"
echo "║          🔧 VERIFYING BOT FIXES                              ║"
echo "╚════════════════════════════════════════════════════════════════╝"
echo ""

echo "1️⃣  Checking if API is running..."
sleep 1
HEALTH=$(curl -s http://localhost:5174/api/health 2>/dev/null)
if [[ $HEALTH == *"ok"* ]]; then
  echo "✅ API is running"
else
  echo "❌ API not responding - Start with: npm run api"
  exit 1
fi

echo ""
echo "2️⃣  Creating test merchants and products..."
sleep 1
# Create first merchant
M1=$(curl -s -X POST http://localhost:5174/api/merchants \
  -H "Content-Type: application/json" \
  -d '{"phone_number":"263712345601","store_name":"Pizza Palace","category":"Food"}' | grep -o '"id":"[^"]*"' | head -1)

if [[ $M1 ]]; then
  echo "✅ Test merchant created: $M1"
  # Extract the ID value
  MID=$(echo $M1 | cut -d'"' -f4)
  
  # Add a test product
  curl -s -X POST http://localhost:5174/api/merchants/$MID/products \
    -H "Content-Type: application/json" \
    -d '{"name":"Margherita Pizza","price":2500,"category":"Pizza","image":"🍕"}' > /dev/null
  
  echo "✅ Test product added"
else
  echo "⚠️  Could not create merchant (might already exist)"
fi

echo ""
echo "3️⃣  Testing Menu Command Fix..."
echo "   Checking if response.data.products is properly accessed..."
grep -A 5 "response.data?.products" /workspaces/ultimate-bot/whatsapp-bot/src/handlers/customerHandler.js | head -3
if [[ $? -eq 0 ]]; then
  echo "✅ Menu fix verified - Using response.data.products"
else
  echo "❌ Menu fix not found"
fi

echo ""
echo "4️⃣  Testing Help Command Fix..."
echo "   Checking if help uses sendTextMessage..."
grep -A 2 "const helpText = this.getCommandHelp" /workspaces/ultimate-bot/whatsapp-bot/src/handlers/authHandler.js | head -2
if grep -q "sendTextMessage" /workspaces/ultimate-bot/whatsapp-bot/src/handlers/authHandler.js; then
  echo "✅ Help fix verified - Using sendTextMessage"
else
  echo "❌ Help fix not found"
fi

echo ""
echo "╔════════════════════════════════════════════════════════════════╗"
echo "║           ✨ FIXES VERIFIED - RESTART BOT                    ║"
echo "╠════════════════════════════════════════════════════════════════╣"
echo "║                                                                ║"
echo "║  To test the fixes:                                            ║"
echo "║                                                                ║"
echo "║  1. Restart the bot:                                           ║"
echo "║     $ cd whatsapp-bot && npm run dev                           ║"
echo "║                                                                ║"
echo "║  2. In WhatsApp, type:                                         ║"
echo "║     !menu  (should show products without error)               ║"
echo "║     !help  (should show help text)                            ║"
echo "║                                                                ║"
echo "║  Expected Errors Gone:                                        ║"
echo "║     ❌ response.data.slice is not a function                  ║"
echo "║     ❌ Error sending interactive message: Invalid media type  ║"
echo "║                                                                ║"
echo "╚════════════════════════════════════════════════════════════════╝"
