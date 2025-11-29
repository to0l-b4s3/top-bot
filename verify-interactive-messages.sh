#!/bin/bash

# 🔍 Interactive Messages Fix - Verification Script
# Checks all components are properly updated for v7 support

echo "════════════════════════════════════════════════════════════════"
echo "  🤖 Interactive Messages Fix - Verification Script"
echo "════════════════════════════════════════════════════════════════"
echo ""

# Color codes
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

check_count=0
pass_count=0
fail_count=0

# Function to check file content
check_content() {
  local file=$1
  local search=$2
  local description=$3
  
  check_count=$((check_count + 1))
  echo -n "[$check_count] Checking: $description... "
  
  if grep -q "$search" "$file" 2>/dev/null; then
    echo -e "${GREEN}✓ PASS${NC}"
    pass_count=$((pass_count + 1))
  else
    echo -e "${RED}✗ FAIL${NC}"
    fail_count=$((fail_count + 1))
  fi
}

# Function to check file exists
check_file_exists() {
  local file=$1
  local description=$2
  
  check_count=$((check_count + 1))
  echo -n "[$check_count] Checking: $description... "
  
  if [ -f "$file" ]; then
    echo -e "${GREEN}✓ PASS${NC}"
    pass_count=$((pass_count + 1))
  else
    echo -e "${RED}✗ FAIL${NC}"
    fail_count=$((fail_count + 1))
  fi
}

echo -e "${BLUE}1. BAILEYS VERSION${NC}"
echo "───────────────────────────────────────────────────────────────"
check_content "/workspaces/top-bot/whatsapp-bot/package.json" '"@whiskeysockets/baileys": "7.0.0-rc.9"' "Baileys v7.0.0-rc.9 in package.json"
echo ""

echo -e "${BLUE}2. MESSAGE SERVICE${NC}"
echo "───────────────────────────────────────────────────────────────"
check_content "/workspaces/top-bot/whatsapp-bot/src/services/messageService.js" "generateWAMessageFromContent" "MessageService imports generateWAMessageFromContent"
check_content "/workspaces/top-bot/whatsapp-bot/src/services/messageService.js" "sock.relayMessage" "MessageService uses relayMessage API"
check_content "/workspaces/top-bot/whatsapp-bot/src/services/messageService.js" "sendInteractiveMessage" "MessageService has sendInteractiveMessage method"
check_content "/workspaces/top-bot/whatsapp-bot/src/services/messageService.js" "sendButtonMessage" "MessageService has sendButtonMessage method"
check_content "/workspaces/top-bot/whatsapp-bot/src/services/messageService.js" "sendListMessage" "MessageService has sendListMessage method"
echo ""

echo -e "${BLUE}3. INTERACTIVE MESSAGE BUILDER${NC}"
echo "───────────────────────────────────────────────────────────────"
check_content "/workspaces/top-bot/whatsapp-bot/src/utils/interactiveMessageBuilder.js" "static buttonPayload" "InteractiveMessageBuilder has buttonPayload method"
check_content "/workspaces/top-bot/whatsapp-bot/src/utils/interactiveMessageBuilder.js" "static listPayload" "InteractiveMessageBuilder has listPayload method"
check_content "/workspaces/top-bot/whatsapp-bot/src/utils/interactiveMessageBuilder.js" "static productMenu" "InteractiveMessageBuilder has productMenu method"
check_content "/workspaces/top-bot/whatsapp-bot/src/utils/interactiveMessageBuilder.js" "static cartMenu" "InteractiveMessageBuilder has cartMenu method"
check_content "/workspaces/top-bot/whatsapp-bot/src/utils/interactiveMessageBuilder.js" "static selectMenu" "InteractiveMessageBuilder has selectMenu method"
check_content "/workspaces/top-bot/whatsapp-bot/src/utils/interactiveMessageBuilder.js" "static categoryMenu" "InteractiveMessageBuilder has categoryMenu method"
check_content "/workspaces/top-bot/whatsapp-bot/src/utils/interactiveMessageBuilder.js" "static ordersMenu" "InteractiveMessageBuilder has ordersMenu method"
check_content "/workspaces/top-bot/whatsapp-bot/src/utils/interactiveMessageBuilder.js" "static quickActions" "InteractiveMessageBuilder has quickActions method"
echo ""

echo -e "${BLUE}4. BOT INTEGRATION${NC}"
echo "───────────────────────────────────────────────────────────────"
check_content "/workspaces/top-bot/whatsapp-bot/src/index.js" "generateWAMessageFromContent" "Bot index.js imports generateWAMessageFromContent"
check_content "/workspaces/top-bot/whatsapp-bot/src/index.js" "new MessageService(this.sock, generateWAMessageFromContent)" "Bot passes generateWAMessageFromContent to MessageService"
echo ""

echo -e "${BLUE}5. DOCUMENTATION${NC}"
echo "───────────────────────────────────────────────────────────────"
check_file_exists "/workspaces/top-bot/TEST_INTERACTIVE_MESSAGES_FIX.md" "Test and fix guide exists"
check_file_exists "/workspaces/top-bot/INTERACTIVE_MESSAGES_EXAMPLES.js" "Usage examples file exists"
check_file_exists "/workspaces/top-bot/INTERACTIVE_MESSAGES_QUICK_REFERENCE.md" "Quick reference guide exists"
echo ""

echo -e "${BLUE}6. FALLBACK SUPPORT${NC}"
echo "───────────────────────────────────────────────────────────────"
check_content "/workspaces/top-bot/whatsapp-bot/src/services/messageService.js" "catch" "Error handling (fallback) implemented"
check_content "/workspaces/top-bot/whatsapp-bot/src/services/messageService.js" "sendTextMessage" "Text fallback available"
echo ""

# Summary
echo "════════════════════════════════════════════════════════════════"
echo -e "${BLUE}VERIFICATION SUMMARY${NC}"
echo "════════════════════════════════════════════════════════════════"
echo "Total Checks: $check_count"
echo -e "Passed: ${GREEN}$pass_count${NC}"
echo -e "Failed: ${RED}$fail_count${NC}"
echo ""

if [ $fail_count -eq 0 ]; then
  echo -e "${GREEN}✅ ALL CHECKS PASSED - System Ready!${NC}"
  echo ""
  echo "Next steps:"
  echo "  1. Restart the bot: npm run bot:dev"
  echo "  2. Scan the QR code"
  echo "  3. Send: !menu"
  echo "  4. Verify interactive list appears"
  exit 0
else
  echo -e "${RED}❌ SOME CHECKS FAILED - Review errors above${NC}"
  exit 1
fi
