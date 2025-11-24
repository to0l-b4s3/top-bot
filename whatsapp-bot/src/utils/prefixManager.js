/**
 * Prefix Manager
 * Handles multiple prefix support with per-user customization
 */

const cache = require('../database/cache');

class PrefixManager {
  constructor() {
    // Default prefixes
    this.defaultPrefixes = ['!', '#', '.', '$', '/', '~', '^'];
    this.globalPrefix = '!';
  }

  /**
   * Check if text starts with valid prefix
   */
  isCommand(text, userPhone = null) {
    if (!text || text.length < 2) return false;

    const firstChar = text[0];
    
    // Check if first character is a valid prefix
    return this.defaultPrefixes.includes(firstChar);
  }

  /**
   * Parse command from text
   * Returns { prefix, command, args } or null
   */
  parseCommand(text, userPhone = null) {
    if (!this.isCommand(text)) return null;

    const prefix = text[0];
    const rest = text.slice(1).trim();
    
    if (!rest) return null;

    const parts = rest.split(/\s+/);
    const command = parts[0].toLowerCase();
    const args = parts.slice(1);

    return {
      prefix,
      command,
      args,
      raw: text
    };
  }

  /**
   * Get all valid prefixes
   */
  getPrefixes() {
    return this.defaultPrefixes;
  }

  /**
   * Set user's preferred prefix
   */
  async setUserPrefix(userPhone, prefix) {
    if (!this.defaultPrefixes.includes(prefix)) {
      return { success: false, error: 'Invalid prefix' };
    }

    await cache.setUserData(userPhone, { prefix });
    return { success: true, message: `Prefix changed to: ${prefix}` };
  }

  /**
   * Get user's preferred prefix
   */
  async getUserPrefix(userPhone) {
    const userData = await cache.getUserData(userPhone);
    return userData?.prefix || this.globalPrefix;
  }

  /**
   * Get prefix info message
   */
  getPrefixInfoMessage() {
    return `🔤 *PREFIX SETTINGS*

Available prefixes:
${this.defaultPrefixes.map((p, i) => `${i + 1}. ${p}`).join('\n')}

Current: ${this.globalPrefix}

Change with: !prefix <symbol>
Example: !prefix # (then use #menu)

All prefixes work the same way!`;
  }
}

module.exports = new PrefixManager();
