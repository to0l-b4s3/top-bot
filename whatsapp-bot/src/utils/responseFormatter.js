/**
 * Response Formatter Utility
 * Provides consistent, detailed response formatting across all commands
 */

class ResponseFormatter {
  /**
   * Format success response
   */
  static success(title, data, footer = '') {
    let response = `✅ *${title}*\n`;
    response += '═'.repeat(40) + '\n';
    response += data;
    if (footer) {
      response += '\n\n' + footer;
    }
    return response;
  }

  /**
   * Format error response
   */
  static error(title, message, suggestion = '') {
    let response = `❌ *${title}*\n`;
    response += '─'.repeat(40) + '\n';
    response += message;
    if (suggestion) {
      response += '\n\n💡 *Suggestion:*\n' + suggestion;
    }
    return response;
  }

  /**
   * Format info response
   */
  static info(title, content, tips = '') {
    let response = `ℹ️ *${title}*\n`;
    response += '─'.repeat(40) + '\n';
    response += content;
    if (tips) {
      response += '\n\n💡 *Tips:*\n' + tips;
    }
    return response;
  }

  /**
   * Format list response
   */
  static list(title, items, footer = '') {
    let response = `📋 *${title}*\n`;
    response += '─'.repeat(40) + '\n';
    items.forEach((item, idx) => {
      response += `${idx + 1}. ${item}\n`;
    });
    if (footer) {
      response += '\n' + footer;
    }
    return response;
  }

  /**
   * Format table response
   */
  static table(title, headers, rows, footer = '') {
    let response = `📊 *${title}*\n`;
    response += '─'.repeat(40) + '\n';
    
    // Add headers
    response += headers.map(h => `*${h}*`).join(' | ') + '\n';
    response += '─'.repeat(40) + '\n';
    
    // Add rows
    rows.forEach(row => {
      response += row.map(cell => String(cell).padEnd(12)).join(' | ') + '\n';
    });
    
    if (footer) {
      response += '\n' + footer;
    }
    return response;
  }

  /**
   * Format command usage help
   */
  static commandHelp(name, description, usage, examples, aliases = []) {
    let response = `📖 *${name.toUpperCase()}*\n`;
    response += '═'.repeat(40) + '\n';
    response += `📝 Description: ${description}\n`;
    response += `💻 Usage: \`${usage}\`\n`;
    
    if (aliases && aliases.length > 0) {
      response += `⚡ Aliases: ${aliases.map(a => `\`!${a}\``).join(', ')}\n`;
    }
    
    response += '\n*Examples:*\n';
    examples.forEach((ex, idx) => {
      response += `  ${idx + 1}. ${ex}\n`;
    });
    
    return response;
  }

  /**
   * Format product details
   */
  static productDetails(product) {
    let response = `🛍️ *${product.name}*\n`;
    response += '═'.repeat(40) + '\n';
    response += `💰 Price: ZWL ${product.price.toFixed(2)}\n`;
    response += `⭐ Rating: ${product.rating || 'N/A'}/5.0\n`;
    response += `📦 Category: ${product.category || 'General'}\n`;
    response += `👤 Seller: ${product.seller || 'Unknown'}\n`;
    response += `\n📄 ${product.description || 'No description'}\n`;
    
    if (product.inStock !== undefined) {
      response += `\n📍 Stock: ${product.inStock ? '✅ In Stock' : '❌ Out of Stock'}\n`;
    }
    
    return response;
  }

  /**
   * Format order details
   */
  static orderDetails(order) {
    let response = `📦 *ORDER #${order.id}*\n`;
    response += '═'.repeat(40) + '\n';
    response += `📅 Date: ${order.date || 'N/A'}\n`;
    response += `💰 Total: ZWL ${order.total.toFixed(2)}\n`;
    response += `📍 Status: ${order.status.toUpperCase()}\n`;
    response += `🎯 Delivery: ${order.deliveryDate || 'Pending'}\n`;
    response += `\n*Items:*\n`;
    
    (order.items || []).forEach((item, idx) => {
      response += `  ${idx + 1}. ${item.name} x${item.quantity} = ZWL ${(item.price * item.quantity).toFixed(2)}\n`;
    });
    
    return response;
  }

  /**
   * Format cart summary
   */
  static cartSummary(items, total, itemCount) {
    let response = `🛒 *SHOPPING CART*\n`;
    response += '═'.repeat(40) + '\n';
    response += `📦 Items: ${itemCount}\n`;
    response += `💰 Total: ZWL ${total.toFixed(2)}\n`;
    response += '─'.repeat(40) + '\n';
    
    items.forEach((item, idx) => {
      response += `${idx + 1}. ${item.name}\n`;
      response += `   Qty: ${item.quantity} × ZWL ${item.price.toFixed(2)} = ZWL ${(item.quantity * item.price).toFixed(2)}\n`;
    });
    
    return response;
  }

  /**
   * Format user profile
   */
  static userProfile(user) {
    let response = `👤 *YOUR PROFILE*\n`;
    response += '═'.repeat(40) + '\n';
    response += `📱 Phone: ${user.phone || 'N/A'}\n`;
    response += `👤 Name: ${user.name || 'Unknown'}\n`;
    response += `✉️ Email: ${user.email || 'N/A'}\n`;
    response += `📍 Location: ${user.location || 'Not set'}\n`;
    response += `📅 Member Since: ${user.joinDate || 'N/A'}\n`;
    response += `\n*Stats:*\n`;
    response += `  • Total Orders: ${user.totalOrders || 0}\n`;
    response += `  • Total Spent: ZWL ${(user.totalSpent || 0).toFixed(2)}\n`;
    response += `  • Loyalty Points: ${user.loyaltyPoints || 0}\n`;
    
    return response;
  }

  /**
   * Format step-by-step guide
   */
  static guide(title, steps, footer = '') {
    let response = `📖 *${title}*\n`;
    response += '═'.repeat(40) + '\n';
    
    steps.forEach((step, idx) => {
      response += `\n*Step ${idx + 1}: ${step.title}*\n`;
      response += `${step.description}\n`;
      if (step.code) {
        response += `\`${step.code}\`\n`;
      }
    });
    
    if (footer) {
      response += '\n' + footer;
    }
    
    return response;
  }

  /**
   * Format status indicator
   */
  static status(title, isActive) {
    const status = isActive ? '🟢 Active' : '🔴 Inactive';
    return `${status} - ${title}`;
  }

  /**
   * Format warning message
   */
  static warning(title, message) {
    let response = `⚠️ *WARNING: ${title}*\n`;
    response += '─'.repeat(40) + '\n';
    response += message;
    return response;
  }

  /**
   * Format confirmation message
   */
  static confirm(action, details = '') {
    let response = `❓ *CONFIRM ${action.toUpperCase()}*\n`;
    response += '─'.repeat(40) + '\n';
    response += details;
    response += '\n\n👇 Reply with *YES* or *NO*\n';
    return response;
  }
}

module.exports = ResponseFormatter;
