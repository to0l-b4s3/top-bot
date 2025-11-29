#!/bin/bash

# 🚀 Interactive Messages - Startup Script
# Prepares and starts the bot with the new interactive message system

echo "═══════════════════════════════════════════════════════════════"
echo "  🤖 Smart WhatsApp Bot - Startup with Interactive Messages"
echo "═══════════════════════════════════════════════════════════════"
echo ""

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Check if already in whatsapp-bot directory
if [ ! -f "package.json" ]; then
  echo "📁 Changing to bot directory..."
  cd /workspaces/top-bot/whatsapp-bot || {
    echo "❌ Error: Could not find bot directory"
    exit 1
  }
fi

echo -e "${BLUE}Step 1: Verifying Baileys v7 Installation${NC}"
echo "───────────────────────────────────────────────────────────────"

if grep -q '"@whiskeysockets/baileys": "7.0.0-rc.9"' package.json; then
  echo -e "${GREEN}✓${NC} Baileys v7.0.0-rc.9 configured"
  
  # Check if node_modules has it
  if [ -d "node_modules/@whiskeysockets/baileys" ]; then
    echo -e "${GREEN}✓${NC} Baileys v7 already installed in node_modules"
  else
    echo -e "${YELLOW}⚠${NC} Baileys not in node_modules, installing..."
    echo ""
    npm install @whiskeysockets/baileys@7.0.0-rc.9 --save --force
    echo ""
  fi
else
  echo -e "${YELLOW}⚠${NC} Baileys version mismatch, updating..."
  npm install @whiskeysockets/baileys@7.0.0-rc.9 --save --force
  echo ""
fi

echo ""
echo -e "${BLUE}Step 2: Running Verification Checks${NC}"
echo "───────────────────────────────────────────────────────────────"

# Check for main fixes
checks=0
passes=0

check_fix() {
  checks=$((checks + 1))
  if grep -q "$2" "$1" 2>/dev/null; then
    echo -e "  ${GREEN}✓${NC} $3"
    passes=$((passes + 1))
  else
    echo -e "  ${YELLOW}✗${NC} $3"
  fi
}

check_fix "src/services/messageService.js" "sendInteractiveMessage" "MessageService has interactive support"
check_fix "src/utils/interactiveMessageBuilder.js" "static selectMenu" "InteractiveMessageBuilder has selectMenu"
check_fix "src/utils/interactiveMessageBuilder.js" "static productMenu" "InteractiveMessageBuilder has productMenu"
check_fix "src/index.js" "generateWAMessageFromContent" "Bot has proto function integration"

echo ""
if [ $passes -eq $checks ]; then
  echo -e "${GREEN}✅ All fixes verified ($passes/$checks)${NC}"
else
  echo -e "${YELLOW}⚠${NC} Some fixes may be missing ($passes/$checks)"
fi

echo ""
echo -e "${BLUE}Step 3: Starting Bot${NC}"
echo "───────────────────────────────────────────────────────────────"
echo ""
echo "📱 The bot will now start. You will see a QR code:"
echo ""
echo "  1. Open WhatsApp on your phone"
echo "  2. Go to Settings → Linked Devices"
echo "  3. Scan the QR code that appears below"
echo "  4. Once connected, type commands:"
echo ""
echo "     !menu        - See interactive product list"
echo "     !categories  - Choose a category"
echo "     !help        - Show available commands"
echo ""
echo "───────────────────────────────────────────────────────────────"
echo ""

# Start the bot
npm start

