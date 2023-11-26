const {
  createShoppingListSchema,
  updateShoppingListSchema,
  deleteShoppingListSchema,
  addItemToListSchema,
  removeItemFromListSchema,
  shareShoppingListSchema,
  unshareShoppingListSchema
} = require('../validations/shoppingListValidation');
const errorCodes = require('../constants/errorCodes');
const {isOwner, isAdmin, isShared} = require("../models/AuthZ");

const mockDatabase = {}; // Mock database

exports.createShoppingList = (req, res) => {
  const { error, value } = createShoppingListSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ error: { code: errorCodes.INVALID_INPUT, message: error.details[0].message } });
  }

  const { name } = value;
  const listId = `list-${Math.random().toString(36).substr(2, 9)}`;
  const ownerId = `owner-${Math.random().toString(36).substr(2, 9)}`;

  mockDatabase[listId] = { name, createdAt: new Date().toISOString(), ownerId, items: [] };

  res.status(201).json({ listId, name, createdAt: mockDatabase[listId].createdAt, ownerId });
};

exports.updateShoppingList = (req, res) => {
  if (!isOwner(1,1) && !isAdmin()) {
    return res.status(403).json({ error: { code: errorCodes.FORBIDDEN, message: "Forbidden" } });
  }

  const { error, value } = updateShoppingListSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ error: { code: errorCodes.INVALID_INPUT, message: error.details[0].message } });
  }

  const { listId, name } = value;

  if (!mockDatabase[listId]) {
    return res.status(404).json({ error: { code: errorCodes.NOT_FOUND, message: "List not found" } });
  }

  mockDatabase[listId].name = name;
  mockDatabase[listId].updatedAt = new Date().toISOString();

  res.status(200).json({ listId, name: mockDatabase[listId].name, updatedAt: mockDatabase[listId].updatedAt });
};

exports.deleteShoppingList = (req, res) => {
  if (!isOwner(1,1) && !isAdmin()) {
    return res.status(403).json({ error: { code: errorCodes.FORBIDDEN, message: "Forbidden" } });
  }

  const { error, value } = deleteShoppingListSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ error: { code: errorCodes.INVALID_INPUT, message: error.details[0].message } });
  }

  const { listId } = value;

  if (!mockDatabase[listId]) {
    return res.status(404).json({ error: { code: errorCodes.NOT_FOUND, message: "List not found" } });
  }

  const deletedAt = new Date().toISOString();
  delete mockDatabase[listId];

  res.status(200).json({ listId, deletedAt });
};

exports.addItemToList = (req, res) => {
  if (!isOwner(1,1) && !isAdmin() && !isShared(1,[1])) {
    return res.status(403).json({ error: { code: errorCodes.FORBIDDEN, message: "Forbidden" } });
  }

  const { error, value } = addItemToListSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ error: { code: errorCodes.INVALID_INPUT, message: error.details[0].message } });
  }

  const { listId, itemName } = value;

  if (!mockDatabase[listId]) {
    return res.status(404).json({ error: { code: errorCodes.NOT_FOUND, message: "List not found" } });
  }

  const itemId = `item-${Math.random().toString(36).substr(2, 9)}`;
  const addedAt = new Date().toISOString();

  mockDatabase[listId].items.push({ itemId, itemName, addedAt });

  res.status(201).json({ itemId, itemName, addedAt });
};

exports.removeItemFromList = (req, res) => {
  if (!isOwner(1,1) && !isAdmin() && !isShared(1,[1])) {
    return res.status(403).json({ error: { code: errorCodes.FORBIDDEN, message: "Forbidden" } });
  }
  const { error, value } = removeItemFromListSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ error: { code: errorCodes.INVALID_INPUT, message: error.details[0].message } });
  }

  const { listId, itemId } = value;

  if (!mockDatabase[listId]) {
    return res.status(404).json({ error: { code: errorCodes.NOT_FOUND, message: "List not found" } });
  }

  const itemIndex = mockDatabase[listId].items.findIndex(item => item.itemId === itemId);
  if (itemIndex === -1) {
    return res.status(404).json({ error: { code: errorCodes.NOT_FOUND, message: "Item not found" } });
  }

  mockDatabase[listId].items.splice(itemIndex, 1);
  const removedAt = new Date().toISOString();

  res.status(200).json({ itemId, removedAt });
};

exports.shareShoppingList = (req, res) => {
  if (!isOwner(1,1) && !isAdmin() && !isShared(1,[1])) {
    return res.status(403).json({ error: { code: errorCodes.FORBIDDEN, message: "Forbidden" } });
  }
  const { error, value } = shareShoppingListSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ error: { code: errorCodes.INVALID_INPUT, message: error.details[0].message } });
  }

  const { listId, userId } = value;

  if (!mockDatabase[listId]) {
    return res.status(404).json({ error: { code: errorCodes.NOT_FOUND, message: "List not found" } });
  }

  // Simulate sharing logic
  const sharedAt = new Date().toISOString();

  res.status(200).json({ listId, userId, sharedAt });
};

exports.unshareShoppingList = (req, res) => {
  if (!isOwner(1,1) && !isAdmin()) {
    return res.status(403).json({ error: { code: errorCodes.FORBIDDEN, message: "Forbidden" } });
  }
  const { error, value } = unshareShoppingListSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ error: { code: errorCodes.INVALID_INPUT, message: error.details[0].message } });
  }

  const { listId, userId } = value;

  if (!mockDatabase[listId]) {
    return res.status(404).json({ error: { code: errorCodes.NOT_FOUND, message: "List not found" } });
  }

  // Simulate unsharing logic
  const unsharedAt = new Date().toISOString();

  res.status(200).json({ listId, userId, unsharedAt });
};
