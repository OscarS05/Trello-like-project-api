const { v4: uuidv4 } = require('uuid');

const CardName = require('../value-objects/cardName');
const CardDescription = require('../value-objects/cardDescription');

class CardEntity {
  constructor({ name, description, listId, createdAt }) {
    this.id = uuidv4();
    this.name = new CardName(name).value;
    this.description = description
      ? new CardDescription(description).value
      : null;
    this.listId = listId;
    this.createdAt = createdAt || new Date().toISOString();
  }
}

module.exports = CardEntity;
