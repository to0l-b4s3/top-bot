/**
 * Message Service
 * Handles all message types: buttons, lists, templates, reactions, etc.
 * Fully compatible with Baileys v7 with proto-based interactive messages
 */

const chalk = require('chalk');
const { Browsers, generateWAMessageFromContent, proto } = require('@whiskeysockets/baileys');

class MessageService {
  constructor(socket, generateWAMessageFromContent_optional = null) {
    this.sock = socket;
    // Baileys v7 has generateWAMessageFromContent built-in
    this.generateWAMessageFromContent = generateWAMessageFromContent;
  }

  /**
   * Send Interactive Button Message (Baileys v7 - Proto based)
   * Sends native WhatsApp buttons that work on all devices
   * @param {string} chatId - Recipient chat ID
   * @param {string} bodyText - Body text
   * @param {array} buttons - Array of button objects {text, id}
   * @param {string} footerText - Footer text (optional)
   * @param {string} headerText - Header text (optional)
   */
  async sendButtonMessage(chatId, bodyText, buttons, footerText = '', headerText = '') {
    try {
      // Create proper interactive message using Baileys v7 proto
      const buttonsMessage = {
        text: bodyText,
        footer: footerText || 'Smart Bot',
        buttons: (buttons || []).map((btn, idx) => ({
          buttonId: btn.id || `btn_${idx}`,
          buttonText: { displayText: btn.text || btn.label || `Button ${idx + 1}` },
          type: 1
        })),
        headerType: 1
      };

      // Generate the proto message
      const message = await generateWAMessageFromContent(chatId, {
        interactiveMessage: {
          body: { text: bodyText },
          footer: { text: footerText || 'Smart Bot' },
          nativeFlowMessage: {
            buttons: (buttons || []).map((btn, idx) => ({
              "name": "cta_url",
              "buttonParamsJson": JSON.stringify({
                "display_text": btn.text || btn.label || `Button ${idx + 1}`,
                "url": btn.url || "#",
                "merchant_url": btn.url || "#"
              })
            }))
          }
        }
      }, { quoted: null });

      await this.sock.sendMessage(chatId, message.message);
      return { success: true };
    } catch (error) {
      console.error(chalk.red('❌ Error sending button message:'), error.message);
      // Fallback to numbered text buttons
      try {
        let menuText = (bodyText || '') + '\n\n';
        if (Array.isArray(buttons) && buttons.length > 0) {
          buttons.forEach((btn, idx) => {
            const number = idx + 1;
            const text = btn.text || btn.label || `Button ${number}`;
            menuText += `${number}. ${text}\n`;
          });
        }
        menuText += `\n${footerText || 'Smart Bot'}`;
        await this.sock.sendMessage(chatId, { text: menuText });
        return { success: true };
      } catch (fallbackError) {
        console.error(chalk.red('❌ Fallback failed:'), fallbackError.message);
        return { success: false, error: error.message };
      }
    }
  }

  /**
   * Send Interactive List Message (Baileys v7 - Proto based)
   * @param {string} chatId - Recipient chat ID
   * @param {string} buttonTextOrPayload - Button text or payload object
   * @param {string} bodyText - Body text
   * @param {string} footerText - Footer text
   * @param {array} sections - Array of section objects
   */
  async sendListMessage(chatId, buttonTextOrPayload, bodyText, footerText, sections) {
    try {
      // Handle both old and new call signatures for backward compatibility
      let payload;
      
      if (typeof buttonTextOrPayload === 'object') {
        // New signature: sendListMessage(chatId, { text, sections, footer, buttonText })
        payload = buttonTextOrPayload;
      } else {
        // Old signature: sendListMessage(chatId, buttonText, bodyText, footerText, sections)
        payload = {
          text: bodyText,
          footer: footerText || 'Smart Bot',
          sections: sections || [],
          buttonText: buttonTextOrPayload
        };
      }

      const text = payload.text || bodyText || '';
      const footer = payload.footer || footerText || 'Smart Bot';
      const rows = [];
      
      // Flatten sections into rows
      if (Array.isArray(payload.sections)) {
        payload.sections.forEach(section => {
          if (Array.isArray(section.rows)) {
            section.rows.forEach((row, idx) => {
              rows.push({
                header: section.title || '',
                title: row.title || `Option ${idx + 1}`,
                description: row.description || '',
                id: row.id || `row_${idx}`
              });
            });
          }
        });
      }

      // Generate proto message for interactive list
      const message = await generateWAMessageFromContent(chatId, {
        interactiveMessage: {
          body: { text: text },
          footer: { text: footer },
          nativeFlowMessage: {
            buttons: [{
              "name": "single_select",
              "buttonParamsJson": JSON.stringify({
                "title": payload.buttonText || "Select an option",
                "sections": [{
                  "title": "Options",
                  "highlight_label": "Popular",
                  "rows": rows.map(r => ({
                    header: r.header,
                    title: r.title,
                    description: r.description,
                    id: r.id
                  }))
                }]
              })
            }]
          }
        }
      }, { quoted: null });

      await this.sock.sendMessage(chatId, message.message);
      return { success: true };
    } catch (error) {
      console.error(chalk.red('❌ Error sending list message:'), error.message);
      // Fallback to text list
      try {
        let menuText = (payload?.text || bodyText || '') + '\n\n';
        if (Array.isArray(payload?.sections)) {
          payload.sections.forEach((section, sectionIdx) => {
            if (section.title) {
              menuText += `*${section.title}*\n`;
            }
            if (Array.isArray(section.rows)) {
              section.rows.forEach((row, rowIdx) => {
                const num = (sectionIdx * 10) + rowIdx + 1;
                menuText += `${num}. ${row.title}${row.description ? ' - ' + row.description : ''}\n`;
              });
            }
          });
        }
        menuText += `\n${payload?.footer || footerText || 'Smart Bot'}`;
        await this.sock.sendMessage(chatId, { text: menuText });
        return { success: true };
      } catch (fallbackError) {
        console.error(chalk.red('❌ Fallback failed:'), fallbackError.message);
        return { success: false, error: error.message };
      }
    }
  }

  /**
   * Send Template Message
   * @param {string} chatId - Recipient chat ID
   * @param {string} templateName - Template name
   * @param {array} parameters - Parameters for template
   */
  async sendTemplateMessage(chatId, templateName, parameters = []) {
    try {
      const templateMessage = {
        text: `Template: ${templateName}`,
        templateButtons: parameters.map((param, idx) => ({
          index: idx,
          urlButton: {
            displayText: param.displayText,
            url: param.url
          }
        }))
      };

      await this.sock.sendMessage(chatId, templateMessage);
      return { success: true };
    } catch (error) {
      console.error(chalk.red('❌ Error sending template message:'), error.message);
      return { success: false, error: error.message };
    }
  }

  /**
   * Send Contact Card (vCard)
   * @param {string} chatId - Recipient chat ID
   * @param {object} contact - Contact object with name, phone, email, organization
   */
  async sendContactCard(chatId, contact) {
    try {
      const vcard = `BEGIN:VCARD
VERSION:3.0
FN:${contact.name || 'Bot Support'}
TEL;type=CELL;type=VOICE;waid=${contact.phone?.replace(/\D/g, '') || ''}:+${contact.phone || ''}
ORG:${contact.organization || 'Smart Bot'}
EMAIL:${contact.email || 'support@bot.com'}
END:VCARD`;

      const contactMessage = {
        contacts: {
          displayName: contact.name || 'Contact',
          contacts: [
            {
              vcard: vcard
            }
          ]
        }
      };

      await this.sock.sendMessage(chatId, contactMessage);
      return { success: true };
    } catch (error) {
      console.error(chalk.red('❌ Error sending contact card:'), error.message);
      return { success: false, error: error.message };
    }
  }

  /**
   * Send Text Message
   * @param {string} chatId - Recipient chat ID
   * @param {string} text - Message text
   * @param {boolean} parseLinks - Whether to parse links
   */
  async sendTextMessage(chatId, text, parseLinks = true) {
    try {
      await this.sock.sendMessage(chatId, { text }, { parseLinks });
      return { success: true };
    } catch (error) {
      console.error(chalk.red('❌ Error sending text message:'), error.message);
      return { success: false, error: error.message };
    }
  }

  /**
   * Send Message with Quote/Reply
   * @param {string} chatId - Recipient chat ID
   * @param {string} text - Message text
   * @param {object} quotedMessage - Message to quote
   */
  async sendReplyMessage(chatId, text, quotedMessage) {
    try {
      await this.sock.sendMessage(chatId, { text }, { quoted: quotedMessage });
      return { success: true };
    } catch (error) {
      console.error(chalk.red('❌ Error sending reply message:'), error.message);
      return { success: false, error: error.message };
    }
  }

  /**
   * React to Message
   * @param {string} chatId - Recipient chat ID
   * @param {string} messageKey - Message key to react to
   * @param {string} emoji - Emoji reaction
   */
  async reactToMessage(chatId, messageKey, emoji) {
    try {
      await this.sock.sendMessage(chatId, {
        react: { text: emoji, key: messageKey }
      });
      return { success: true };
    } catch (error) {
      console.error(chalk.red('❌ Error reacting to message:'), error.message);
      return { success: false, error: error.message };
    }
  }

  /**
   * Delete Message (for everyone)
   * @param {string} chatId - Recipient chat ID
   * @param {object} messageKey - Message key to delete
   */
  async deleteMessage(chatId, messageKey) {
    try {
      await this.sock.sendMessage(chatId, { delete: messageKey });
      return { success: true };
    } catch (error) {
      console.error(chalk.red('❌ Error deleting message:'), error.message);
      return { success: false, error: error.message };
    }
  }

  /**
   * Edit Message Text
   * @param {string} chatId - Recipient chat ID
   * @param {string} newText - New message text
   * @param {object} messageKey - Message key to edit
   */
  async editMessage(chatId, newText, messageKey) {
    try {
      await this.sock.sendMessage(chatId, { text: newText, edit: messageKey });
      return { success: true };
    } catch (error) {
      console.error(chalk.red('❌ Error editing message:'), error.message);
      return { success: false, error: error.message };
    }
  }

  /**
   * Forward Message
   * @param {string} toChat - Destination chat ID
   * @param {object} message - Message to forward
   */
  async forwardMessage(toChat, message) {
    try {
      await this.sock.sendMessage(toChat, message);
      return { success: true };
    } catch (error) {
      console.error(chalk.red('❌ Error forwarding message:'), error.message);
      return { success: false, error: error.message };
    }
  }

  /**
   * Send Mention in Group
   * @param {string} chatId - Group chat ID
   * @param {string} text - Message text
   * @param {array} mentions - Array of phone numbers to mention
   */
  async sendMentionMessage(chatId, text, mentions = []) {
    try {
      const mentionedJids = mentions.map(phone => phone.replace(/\D/g, '') + '@s.whatsapp.net');
      await this.sock.sendMessage(chatId, { text, mentions: mentionedJids });
      return { success: true };
    } catch (error) {
      console.error(chalk.red('❌ Error sending mention message:'), error.message);
      return { success: false, error: error.message };
    }
  }

  /**
   * Set Presence (Recording, Typing)
   * @param {string} chatId - Chat ID
   * @param {string} type - 'recording' or 'typing'
   */
  async setPresence(chatId, type = 'typing') {
    try {
      await this.sock.sendPresenceUpdate(type, chatId);
      return { success: true };
    } catch (error) {
      console.error(chalk.red('❌ Error setting presence:'), error.message);
      return { success: false, error: error.message };
    }
  }

  /**
   * Read Receipt
   * @param {string} chatId - Chat ID
   * @param {array} messageKeys - Message keys to mark as read
   */
  async markAsRead(chatId, messageKeys) {
    try {
      for (const key of messageKeys) {
        await this.sock.sendReadReceipt(chatId, undefined, [key]);
      }
      return { success: true };
    } catch (error) {
      console.error(chalk.red('❌ Error marking as read:'), error.message);
      return { success: false, error: error.message };
    }
  }

  /**
   * Archive Chat
   * @param {string} chatId - Chat ID
   */
  async archiveChat(chatId) {
    try {
      await this.sock.chatModify({ archive: true }, chatId);
      return { success: true };
    } catch (error) {
      console.error(chalk.red('❌ Error archiving chat:'), error.message);
      return { success: false, error: error.message };
    }
  }

  /**
   * Mute Chat
   * @param {string} chatId - Chat ID
   * @param {number} duration - Duration in milliseconds
   */
  async muteChat(chatId, duration = 28800000) {
    try {
      await this.sock.chatModify({ mute: duration }, chatId);
      return { success: true };
    } catch (error) {
      console.error(chalk.red('❌ Error muting chat:'), error.message);
      return { success: false, error: error.message };
    }
  }

  /**
   * Pin Chat
   * @param {string} chatId - Chat ID
   * @param {boolean} pin - Whether to pin or unpin
   */
  async pinChat(chatId, pin = true) {
    try {
      await this.sock.chatModify({ pin }, chatId);
      return { success: true };
    } catch (error) {
      console.error(chalk.red('❌ Error pinning chat:'), error.message);
      return { success: false, error: error.message };
    }
  }

  /**
   * Star Message
   * @param {object} message - Message object
   * @param {boolean} star - Whether to star or unstar
   */
  async starMessage(message, star = true) {
    try {
      await this.sock.sendMessage(message.key.remoteJid, {
        star: { key: message.key, starred: star }
      });
      return { success: true };
    } catch (error) {
      console.error(chalk.red('❌ Error starring message:'), error.message);
      return { success: false, error: error.message };
    }
  }

  /**
   * Send Rich Text Message with External Ad Reply
   * Mimics the CypherX bot style with title, body, and external link preview
   * @param {string} chatId - Chat ID
   * @param {string} text - Message text
   * @param {object} options - Options object
   *   - title: External link title
   *   - description: External link description
   *   - thumbnail: Thumbnail image URL or Buffer
   *   - sourceUrl: URL to open when clicked
   *   - mediaType: 1 (image), 2 (video), etc.
   *   - mentions: Array of phone numbers to mention
   */
  async sendRichMessage(chatId, text, options = {}) {
    try {
      const message = {
        text: text,
        contextInfo: {}
      };

      // Add mentions if provided
      if (options.mentions && options.mentions.length > 0) {
        message.contextInfo.mentionedJid = options.mentions;
      }

      // Add external ad reply (link preview)
      if (options.title || options.sourceUrl) {
        message.contextInfo.externalAdReply = {
          title: options.title || 'Smart Bot',
          body: options.description || '',
          thumbnail: options.thumbnail || null,
          sourceUrl: options.sourceUrl || 'https://github.com',
          mediaType: options.mediaType || 1,
          renderLargerThumbnail: true
        };
      }

      await this.sock.sendMessage(chatId, message);
      return { success: true };
    } catch (error) {
      console.error(chalk.red('❌ Error sending rich message:'), error.message);
      return { success: false, error: error.message };
    }
  }

  /**
   * Send Interactive Message (Baileys v7 - Proto based)
   * Supports buttons, lists, quick replies with native WhatsApp rendering
   */
  async sendInteractiveMessage(chatId, messagePayload) {
    try {
      console.log('🎯 DEBUG: sendInteractiveMessage called with chatId:', chatId, 'payload keys:', Object.keys(messagePayload));
      let interactiveMsg;

      if (messagePayload.listMessage) {
        console.log('🎯 DEBUG: Processing listMessage');
        const listMsg = messagePayload.listMessage;
        
        const rows = [];
        if (Array.isArray(listMsg.sections)) {
          listMsg.sections.forEach(section => {
            if (Array.isArray(section.rows)) {
              section.rows.forEach((row, idx) => {
                rows.push({
                  header: section.title || '',
                  title: row.title || `Option ${idx + 1}`,
                  description: row.description || '',
                  id: row.id || `row_${idx}`
                });
              });
            }
          });
        }

        console.log('🎯 DEBUG: Built rows array, length:', rows.length);

        // Build interactive message for list - send directly to sendMessage
        interactiveMsg = {
          interactiveMessage: {
            body: { text: listMsg.text || '' },
            footer: { text: listMsg.footer || 'Smart Bot' },
            nativeFlowMessage: {
              buttons: [{
                "name": "single_select",
                "buttonParamsJson": JSON.stringify({
                  "title": listMsg.buttonText || "Select an option",
                  "sections": [{
                    "title": "Options",
                    "rows": rows
                  }]
                })
              }]
            }
          }
        };
        console.log('🎯 DEBUG: Built interactive message for list');
      } else if (messagePayload.buttonMessage) {
        console.log('🎯 DEBUG: Processing buttonMessage');
        const btnMsg = messagePayload.buttonMessage;
        
        // Build interactive message for buttons
        interactiveMsg = {
          interactiveMessage: {
            body: { text: btnMsg.text || '' },
            footer: { text: btnMsg.footer || 'Smart Bot' },
            nativeFlowMessage: {
              buttons: (btnMsg.buttons || []).map((btn, idx) => ({
                "name": "cta_url",
                "buttonParamsJson": JSON.stringify({
                  "display_text": btn.text || btn.label || `Button ${idx + 1}`,
                  "url": btn.url || "#",
                  "merchant_url": btn.url || "#"
                })
              }))
            }
          }
        };
        console.log('🎯 DEBUG: Built interactive message for buttons');
      } else {
        // Generic interactive message
        interactiveMsg = {
          interactiveMessage: messagePayload.interactive || {
            body: { text: messagePayload.text || 'Message' }
          }
        };
        console.log('🎯 DEBUG: Built generic interactive message');
      }

      console.log('🎯 DEBUG: About to call sendMessage with interactiveMessage');
      await this.sock.sendMessage(chatId, interactiveMsg);
      console.log('🎯 DEBUG: sendMessage succeeded');
      return { success: true };
    } catch (error) {
      console.error(chalk.red('❌ Error sending interactive message:'), error.message);
      console.error('🎯 DEBUG: Error stack:', error.stack);
      
      // Fallback to text message
      try {
        const fallbackText = messagePayload.listMessage?.text || 
                            messagePayload.buttonMessage?.text || 
                            messagePayload.text || 
                            'Menu';
        console.log('🎯 DEBUG: Trying fallback with text:', fallbackText.substring(0, 50));
        await this.sock.sendMessage(chatId, { text: fallbackText });
        console.log('🎯 DEBUG: Fallback succeeded');
        return { success: true };
      } catch (fallbackError) {
        console.error(chalk.red('❌ Fallback failed:'), fallbackError.message);
        console.error('🎯 DEBUG: Fallback error stack:', fallbackError.stack);
        return { success: false, error: error.message };
      }
    }
  }
}

module.exports = MessageService;
