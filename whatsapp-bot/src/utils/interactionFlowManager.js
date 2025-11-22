/**
 * Interaction Flow Manager
 * Manages multi-step command flows with buttons and templates
 */

const cache = require('../database/cache');
const Logger = require('../config/logger');

const logger = new Logger('InteractionFlow');

class InteractionFlowManager {
  constructor() {
    this.flows = {};
  }

  /**
   * Start a new flow for a user
   */
  async startFlow(phoneNumber, flowType, data = {}) {
    const flowId = `${phoneNumber}_${flowType}_${Date.now()}`;
    
    this.flows[flowId] = {
      phoneNumber,
      flowType,
      flowId,
      step: 1,
      data,
      createdAt: new Date(),
      expiresAt: new Date(Date.now() + 15 * 60000), // 15 min timeout
    };

    await cache.setUserFlow(phoneNumber, flowId, this.flows[flowId]);
    logger.debug(`Flow started: ${flowType} for ${phoneNumber}`);

    return flowId;
  }

  /**
   * Get user's active flow
   */
  async getActiveFlow(phoneNumber) {
    const flowId = await cache.getUserActiveFlow(phoneNumber);
    if (!flowId) return null;
    
    const flow = this.flows[flowId];
    if (!flow) return null;

    // Check expiry
    if (new Date() > flow.expiresAt) {
      await cache.deleteUserFlow(phoneNumber, flowId);
      delete this.flows[flowId];
      return null;
    }

    return flow;
  }

  /**
   * Update flow data
   */
  async updateFlow(flowId, data) {
    if (this.flows[flowId]) {
      this.flows[flowId].data = { ...this.flows[flowId].data, ...data };
      this.flows[flowId].step += 1;
      await cache.setUserFlow(this.flows[flowId].phoneNumber, flowId, this.flows[flowId]);
    }
  }

  /**
   * End flow
   */
  async endFlow(phoneNumber, flowId) {
    if (this.flows[flowId]) {
      delete this.flows[flowId];
    }
    await cache.deleteUserFlow(phoneNumber, flowId);
    logger.debug(`Flow ended: ${flowId}`);
  }
}

module.exports = new InteractionFlowManager();
