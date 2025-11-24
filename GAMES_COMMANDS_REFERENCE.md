# 🎮 Fun & Games Commands - Quick Reference

## Overview
These commands provide entertainment, games, and interactive experiences. All support 7 prefixes: `!` `#` `.` `$` `/` `~` `^`

---

## Commands

### 🎭 !fun / !games / !entertainment
**Shows the fun and games menu with interactive selection**

- **Aliases:** `games`, `entertainment`
- **Usage:** `!fun`
- **Interactive:** Yes (List menu)
- **Response:** Main fun menu with options to select other games

**Example:**
```
User: !fun
Bot: Shows interactive list with:
     - Random Fact
     - Jokes
     - Inspirational Quotes
     - Trivia Challenge
     - Truth or Dare

User: Clicks on an option
Bot: Executes that command
```

---

### 🧠 !fact / !facts
**Get an interesting random fact**

- **Aliases:** `facts`, `trivia_fact`
- **Usage:** `!fact`
- **Interactive:** No (Direct response)
- **Database:** 15 facts

**Facts Include:**
- Honey never spoils
- Octopuses have three hearts
- Venus rotates clockwise
- And 12 more!

**Example:**
```
User: !fact
Bot: 🧠 DID YOU KNOW?
     Honey never spoils. Archaeologists have found 3,000-year-old honey
     in Egyptian tombs that was still perfectly edible.
     
     Type !fact for another fact!
```

---

### 😂 !jokes / !joke
**Browse and read jokes**

- **Aliases:** `joke`, `laugh`, `humor`
- **Usage:** `!jokes`
- **Interactive:** Yes (List menu to select)
- **Database:** 8 jokes (setup + punchline format)

**Example:**
```
User: !jokes
Bot: Shows interactive menu:
     - Joke 1: Why don't scientists...
     - Joke 2: What do you call a bear...
     - Joke 3: Why don't eggs...
     (more jokes...)

User: Selects "Joke 1"
Bot: 😂 JOKE TIME
     *Why don't scientists trust atoms?*
     _Because they make up everything!_
     😆
```

---

### 💭 !quotes / !quote
**Get inspirational and motivational quotes**

- **Aliases:** `quote`, `motivation`, `inspire`
- **Usage:** `!quotes`
- **Interactive:** No (Direct response)
- **Database:** 10 quotes with authors

**Features:**
- Famous quotes from influential people
- Inspirational themes
- Perfect for motivation boost
- Author attribution

**Example:**
```
User: !quotes
Bot: 💭 INSPIRATIONAL QUOTE
     "The only way to do great work is to love what you do."
     — Steve Jobs
     
Type !quotes for another quote!
```

---

### ❓ !trivia / !quiz
**Play trivia questions with multiple choice**

- **Aliases:** `quiz`, `question`, `triviaquiz`
- **Usage:** `!trivia`
- **Interactive:** Yes (Multiple choice selection)
- **Database:** 5 trivia questions

**Question Categories:**
- Geography
- Science
- History
- Art
- Nature

**Example:**
```
User: !trivia
Bot: ❓ TRIVIA CHALLENGE
     📚 What is the capital of France?
     Category: Geography
     
     Options:
     - A) Paris (User selects)
     - B) Lyon
     - C) Marseille
     - D) Nice

User: Selects "A) Paris"
Bot: ✅ Correct! Great job!
     (Shows explanation)
```

---

### 🎭 !truthordare / !truth / !dare / !tod
**Play the classic Truth or Dare game**

- **Aliases:** `truth`, `dare`, `tod`, `truthordare_game`
- **Usage:** `!truthordare` (then select)
- **Interactive:** Yes (Multi-step flow)
- **Database:** 10 truths + 10 dares

**How It Works:**

**Step 1 - Initial Command:**
```
User: !truthordare
Bot: Shows interactive menu:
     - 🤐 Truth (I'll ask you a truth question)
     - 😎 Dare (I'll give you a challenge)
```

**Step 2A - If selecting Truth:**
```
User: Selects "Truth"
Bot: 🤐 YOUR TRUTH QUESTION
     What is your biggest fear?
     💭 What's your answer?
```

**Step 2B - If selecting Dare:**
```
User: Selects "Dare"
Bot: 😎 YOUR DARE CHALLENGE
     Do 20 pushups right now! 💪
     ✅ Show me proof or claim you failed!
```

**Sample Truth Questions:**
- What's your biggest fear?
- Have you ever lied to your best friend?
- What's the most embarrassing thing you've ever done?
- And 7 more thought-provoking questions!

**Sample Dare Challenges:**
- Do 20 pushups!
- Send a funny message to a random contact
- Call your crush and say hello in a funny voice
- Sing your favorite song loudly
- And 6 more creative challenges!

---

## 🎯 Tips & Tricks

### Combining Commands
```
User: !truthordare (gets selector)
User: Selects "Truth" (gets truth question)
User: !truthordare (start new game)
User: Selects "Dare" (gets dare challenge)
```

### Using Different Prefixes
All commands work with ANY prefix:
```
!fact     #fact     .fact     $fact     /fact     ~fact     ^fact
!jokes    #jokes    .jokes    $jokes    /jokes    ~jokes    ^jokes
!trivia   #trivia   .trivia   $trivia   /trivia   ~trivia   ^trivia
```

### In Group Chats
```
Group: Hey bot, give us a joke!
User: !jokes
Bot: (in group chat)

Group: Let's play truth or dare!
User: !truthordare
Bot: (everyone can see the menu)
```

---

## 🚀 Command Flow Diagram

```
┌─────────────┐
│   !fun      │
│   !games    │
│   !entertainment
└────┬────────┘
     │ (Interactive Menu)
     ├─→ !fact ──────┐
     │               ├─→ Random Fact (Direct)
     │               │
     ├─→ !jokes ─────┼─→ Joke Menu (Interactive)
     │               │   └─→ Selected Joke (Direct)
     │               │
     ├─→ !quotes ────┼─→ Random Quote (Direct)
     │               │
     ├─→ !trivia ────┼─→ Trivia Menu (Interactive)
     │               │   └─→ Answer (Direct)
     │               │
     └─→ !truthordare┼─→ T/D Menu (Interactive)
                     │   ├─→ !truth ──→ Truth Question (Direct)
                     │   └─→ !dare ──→ Dare Challenge (Direct)
                     │
                     └─→ Enjoy!
```

---

## 📊 Statistics

| Command | Type | Selections | Data Items | Prefixes |
|---------|------|-----------|-----------|----------|
| !fun | Menu | 5 games | N/A | 7 |
| !fact | Direct | N/A | 15 | 7 |
| !jokes | Menu | 8 jokes | 8 | 7 |
| !quotes | Direct | N/A | 10 | 7 |
| !trivia | Menu | 5 options | 5 questions | 7 |
| !truthordare | Multi-step | 2 (T/D) | 10 each | 7 |

**Total Coverage:** 100+ data items across 6 interactive commands

---

## 🔧 Troubleshooting

### Interactive menu isn't showing
- ✅ Make sure you're using WhatsApp Business Account
- ✅ Check that interactive lists are supported in your WhatsApp version
- ✅ Try using a different prefix (!fun vs #fun)

### Command not responding
- ✅ Check spelling: `!truthordare` (not `!truth-or-dare`)
- ✅ Try another prefix
- ✅ Make sure bot is online (check !ping)

### Same question/joke repeating
- ✅ This is normal - database randomly selects items
- ✅ Try command again for different result
- ✅ Larger database planned for future

### Getting "Unknown command" error
- ✅ Verify exact command name
- ✅ Check for typos
- ✅ Use !menu to see all commands

---

## 🎓 For Developers

### Handler Location
`/whatsapp-bot/src/handlers/funAndGamesHandler.js`

### Main Method
```javascript
async handleGameCommand(command, args, from, cleanPhone)
```

### Adding New Content
1. Edit data arrays at top of handler
2. Methods automatically use Math.random() for selection
3. No restart needed for data changes

### Interactive Message Format
```javascript
const menu = {
  text: '...',
  sections: [{
    title: '...',
    rows: [
      { id: 'cmd_id', title: 'Title', description: 'Help text' }
    ]
  }],
  buttonText: 'Select'
};
```

---

## 🎉 Features

✨ **Interactive Menus** - Select from options instead of typing commands  
🎲 **Random Selection** - Different content every time  
📝 **Database-Driven** - Easy to add more content  
🌐 **Multi-Prefix** - Works with 7 different prefixes  
💬 **Group-Friendly** - Works great in group chats  
🚀 **Async Execution** - Smooth, non-blocking responses  
🎯 **Error Handling** - Graceful fallbacks on errors  
📱 **Baileys v7 Compliant** - Modern WhatsApp API support  

---

**Last Updated:** November 24, 2025  
**Bot Version:** 2.0+  
**Status:** ✅ Live & Tested
