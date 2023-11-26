const Joi = require('joi');

const name = Joi.string().required();
const listId = Joi.string().required();
const itemName = Joi.string().required();

const createShoppingListSchema = Joi.object({
  name: name
});

const updateShoppingListSchema = Joi.object({
  listId: listId,
  name: name
});

const deleteShoppingListSchema = Joi.object({
  listId: listId
});

const addItemToListSchema = Joi.object({
  listId: listId,
  itemName: itemName
});

const removeItemFromListSchema = Joi.object({
  listId: listId,
  itemId: itemName
});

const shareShoppingListSchema = Joi.object({
  listId: listId,
  userId: itemName
});

const unshareShoppingListSchema = Joi.object({
  listId: listId,
  userId: itemName
});

module.exports = {
  createShoppingListSchema,
  updateShoppingListSchema,
  deleteShoppingListSchema,
  addItemToListSchema,
  removeItemFromListSchema,
  shareShoppingListSchema,
  unshareShoppingListSchema
};
