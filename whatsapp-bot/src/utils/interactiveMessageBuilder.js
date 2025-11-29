/**
 * Interactive Message Builder
 * Builds structured interactive messages with buttons, lists, footers
 * Fully compatible with Baileys v7 proto-based messages
 */

class InteractiveMessageBuilder {
  /**
   * Build button message payload for sendButtonMessage
   * @param {string} bodyText - Body text
   * @param {array} buttons - Array of buttons [{text, id, url}]
   * @param {string} footerText - Footer text (optional)
   */
  static buttonPayload(bodyText, buttons = [], footerText = '') {
    return {
      buttonMessage: {
        text: bodyText,
        footer: footerText || '━━━━━━━━━━━━━━━',
        buttons: buttons.map((btn, idx) => ({
          text: btn.text || btn.label || `Button ${idx + 1}`,
          id: btn.id || `btn_${idx}`,
          url: btn.url || '#',
          label: btn.text || btn.label || `Button ${idx + 1}`
        }))
      }
    };
  }

  /**
   * Build list message payload for sendListMessage
   * @param {string} bodyText - Body text
   * @param {array} sections - Array of sections [{title, rows: [{title, description, id}]}]
   * @param {string} buttonText - Button text to show (e.g., "Select an option")
   * @param {string} footerText - Footer text (optional)
   */
  static listPayload(bodyText, sections = [], buttonText = 'Select an option', footerText = '') {
    return {
      listMessage: {
        text: bodyText,
        footer: footerText || '━━━━━━━━━━━━━━━',
        buttonText: buttonText,
        sections: sections.map(section => ({
          title: section.title || 'Options',
          rows: (section.rows || []).map((row, idx) => ({
            rowId: row.id || `row_${idx}`,
            title: row.title || `Option ${idx + 1}`,
            description: row.description || '',
            rowImage: row.image || null
          }))
        }))
      }
    };
  }

  /**
   * Build button message (backward compatibility)
   * @deprecated Use buttonPayload instead
   */
  static buttonMessage(header, body, buttons = [], footer = '') {
    return {
      type: 'button',
      header,
      body,
      buttons: buttons.map((btn, idx) => ({
        buttonId: btn.id || `btn_${idx}`,
        buttonText: { displayText: btn.text || btn.label || `Button ${idx + 1}` },
        type: 1
      })),
      footer: footer || '━━━━━━━━━━━━━━━'
    };
  }

  /**
   * Build list message (backward compatibility)
   * @deprecated Use listPayload instead
   */
  static listMessage(header, body, sections = [], footer = '') {
    return {
      type: 'list',
      header,
      body,
      footer: footer || '━━━━━━━━━━━━━━━',
      sections: sections.map(section => ({
        title: section.title || 'Options',
        rows: (section.rows || []).map((row, idx) => ({
          rowId: row.id || `row_${idx}`,
          title: row.title || `Option ${idx + 1}`,
          description: row.description || '',
          rowImage: row.image || null
        }))
      }))
    };
  }

  /**
   * Create a menu-style message with sections
   * @param {string} title - Menu title
   * @param {string} description - Menu description
   * @param {array} menuItems - Menu items [{emoji, title, description, id}]
   * @param {string} footer - Footer text
   */
  static createMenu(title, description, menuItems = [], footer = '') {
    return this.listPayload(
      `*${title}*\n${description}`,
      [{
        title: 'Options',
        rows: menuItems.map((item, idx) => ({
          id: item.id || `menu_${idx}`,
          title: `${item.emoji || '•'} ${item.title}`,
          description: item.description || item.subtitle || '',
          image: item.image || null
        }))
      }],
      'Select an option',
      footer || 'Choose from the options above'
    );
  }

  /**
   * Create a simple select menu
   * @param {string} text - Menu text
   * @param {array} options - Options [{text, id, description}]
   * @param {string} footer - Footer
   */
  static selectMenu(text, options = [], footer = '') {
    return this.listPayload(
      text,
      [{
        title: 'Select',
        rows: options.map((opt, idx) => ({
          id: opt.id || `opt_${idx}`,
          title: opt.text || `Option ${idx + 1}`,
          description: opt.description || ''
        }))
      }],
      'Choose an option',
      footer
    );
  }

  /**
   * Create product menu from products array
   * @param {array} products - Products [{id, name, price, image}]
   * @param {string} header - Header text
   */
  static productMenu(products = [], header = 'Available Products') {
    return this.listPayload(
      header,
      [{
        title: 'Products',
        rows: (products || []).slice(0, 10).map((product, idx) => ({
          id: product.id || `prod_${idx}`,
          title: product.name || `Product ${idx + 1}`,
          description: `$${product.price || 0}${product.category ? ' • ' + product.category : ''}`,
          image: product.image_url || product.image || null
        }))
      }],
      'Select Product',
      `Showing ${Math.min(10, (products || []).length)} products`
    );
  }

  /**
   * Create category menu
   * @param {array} categories - Categories array
   */
  static categoryMenu(categories = []) {
    return this.listPayload(
      '🛍️ *Select Category*\nChoose a category to browse',
      [{
        title: 'Categories',
        rows: categories.map((cat, idx) => ({
          id: cat.id || `cat_${idx}`,
          title: `${cat.emoji || '📦'} ${cat.name}`,
          description: `${cat.count || 0} items`,
          image: cat.image || null
        }))
      }],
      'Browse Category',
      'Categories'
    );
  }

  /**
   * Create cart menu
   * @param {array} items - Cart items [{name, quantity, price}]
   * @param {number} total - Total price
   */
  static cartMenu(items = [], total = 0) {
    const itemText = items.map((item, idx) => 
      `${idx + 1}. ${item.name} (x${item.quantity}) - $${(item.price * item.quantity).toFixed(2)}`
    ).join('\n');

    return this.selectMenu(
      `🛒 *Your Cart*\n\n${itemText || 'Your cart is empty'}\n\n*Total: $${total.toFixed(2)}*`,
      [
        { id: 'checkout', text: '✅ Checkout', description: 'Proceed to payment' },
        { id: 'continue_shopping', text: '🛍️ Continue Shopping', description: 'Back to menu' },
        { id: 'clear_cart', text: '🗑️ Clear Cart', description: 'Remove all items' }
      ],
      'What would you like to do?'
    );
  }

  /**
   * Create quick actions menu
   * @param {array} actions - Actions [{text, id, emoji, description}]
   */
  static quickActions(actions = []) {
    return this.selectMenu(
      '⚡ *Quick Actions*\nChoose an action:',
      actions.map((action, idx) => ({
        id: action.id || `action_${idx}`,
        text: `${action.emoji || '•'} ${action.text}`,
        description: action.description || ''
      })),
      'Select an action'
    );
  }

  /**
   * Create order status menu
   * @param {array} orders - Orders [{id, status, date, total}]
   */
  static ordersMenu(orders = []) {
    return this.selectMenu(
      '📦 *Your Orders*\nSelect an order to view details:',
      (orders || []).slice(0, 10).map((order, idx) => ({
        id: order.id || `order_${idx}`,
        text: `Order #${order.id?.slice(-4) || idx + 1}`,
        description: `${order.status} • $${order.total?.toFixed(2) || '0.00'} • ${order.date || 'Recent'}`
      })),
      'View Details'
    );
  }
}

module.exports = InteractiveMessageBuilder;
