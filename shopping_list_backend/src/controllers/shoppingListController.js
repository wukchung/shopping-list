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
const ShoppingList= require('../models/ShoppingList');
const {logger} = require("../middlewares/logger");

const ownerId = `owner-${Math.random().toString(36).substr(2, 9)}`;
exports.ownerId = ownerId;

exports.getAllShoppingLists = async (req, res) => {
  try {
    const shoppingLists = await ShoppingList.find({});
    const modifiedLists = shoppingLists.map(list => {
      return {
        listId: list._id,
        name: list.name,
        ownerId: list.ownerId,
        items: list.items,
        sharedWith: list.sharedWith,
      };
    });
    res.status(200).json(modifiedLists);
  } catch (err) {
    logger.error(`Error fetching shopping lists: ${err}`);
    res.status(500).json({ error: { code: errorCodes.SERVER_ERROR, message: "Internal Server Error" } });
  }
};

exports.createShoppingList = async (req, res) => {
  const { error, value } = createShoppingListSchema.validate(req.body);
  console.log(req.body)
  if (error) {
    return res.status(400).json({ error: { code: errorCodes.INVALID_INPUT, message: error.details[0].message } });
  }

  const { name } = value;


  const shoppingList = new ShoppingList({ name, ownerId });
  const savedList = await shoppingList.save();

  logger.info(`Shopping list created: ${savedList._id}`);

  res.status(201).json({ listId: savedList._id, name, createdAt: savedList.createdAt, ownerId });
};

exports.updateShoppingList = async (req, res) => {
  // Assuming isOwner and isAdmin functions to be defined according to your auth logic
  if (!isOwner(req.user, req.params.listId) && !isAdmin(req.user)) {
    return res.status(403).json({ error: { code: errorCodes.FORBIDDEN, message: "Forbidden" } });
  }

  const { error, value } = updateShoppingListSchema.validate({...req.body, ...req.params});
  if (error) {
    return res.status(400).json({ error: { code: errorCodes.INVALID_INPUT, message: error.details[0].message } });
  }

  const { listId, name } = value;

  try {
    const updatedList = await ShoppingList.findByIdAndUpdate(listId, { name }, { new: true });
    if (!updatedList) {
      return res.status(404).json({ error: { code: errorCodes.NOT_FOUND, message: "List not found" } });
    }

    logger.info(`Shopping list updated: ${updatedList._id}`);
    res.status(200).json({ listId: updatedList._id, name: updatedList.name, updatedAt: updatedList.updatedAt });
  } catch (err) {
    logger.error(`Error updating shopping list: ${err}`);
    res.status(500).json({ error: { code: errorCodes.SERVER_ERROR, message: "Internal Server Error" } });
  }
};

exports.deleteShoppingList = async (req, res) => {
  if (!isOwner(req.user, req.params.listId) && !isAdmin(req.user)) {
    return res.status(403).json({ error: { code: errorCodes.FORBIDDEN, message: "Forbidden" } });
  }

  const { error, value } = deleteShoppingListSchema.validate(req.params);
  if (error) {
    return res.status(400).json({ error: { code: errorCodes.INVALID_INPUT, message: error.details[0].message } });
  }

  const { listId } = value;

  try {
    const deletedList = await ShoppingList.findByIdAndDelete(listId);
    if (!deletedList) {
      return res.status(404).json({ error: { code: errorCodes.NOT_FOUND, message: "List not found" } });
    }

    logger.info(`Shopping list deleted: ${deletedList._id}`);
    res.status(200).json({ listId: deletedList._id, deletedAt: new Date().toISOString() });
  } catch (err) {
    logger.error(`Error deleting shopping list: ${err}`);
    res.status(500).json({ error: { code: errorCodes.SERVER_ERROR, message: "Internal Server Error" } });
  }
};

exports.getShoppingListItems = async (req, res) => {
  const { listId } = req.params; // Assuming you're getting the list ID from the route parameter
  try {
    const shoppingList = await ShoppingList.findById(listId);
    if (!shoppingList) {
      return res.status(404).json({ error: { code: errorCodes.NOT_FOUND, message: "Shopping list not found" } });
    }

    res.status(200).json(shoppingList.items);
  } catch (err) {
    logger.error(`Error fetching items from shopping list: ${err}`);
    res.status(500).json({ error: { code: errorCodes.SERVER_ERROR, message: "Internal Server Error" } });
  }
};

exports.addItemToList = async (req, res) => {
  if (!isOwner(req.user, req.body.params) && !isAdmin(req.user)) {
    return res.status(403).json({ error: { code: errorCodes.FORBIDDEN, message: "Forbidden" } });
  }

  const { error, value } = addItemToListSchema.validate({...req.body, ...req.params});
  if (error) {
    return res.status(400).json({ error: { code: errorCodes.INVALID_INPUT, message: error.details[0].message } });
  }

  const { itemName, listId } = value;

  try {
    const updatedList = await ShoppingList.findByIdAndUpdate(
      listId,
      { $push: { items: { itemName } } },
      { new: true }
    );

    if (!updatedList) {
      return res.status(404).json({ error: { code: errorCodes.NOT_FOUND, message: "List not found" } });
    }

    const addedItem = updatedList.items[updatedList.items.length - 1];
    logger.info(`Item added to shopping list: ${listId}`);
    res.status(201).json({ itemId: addedItem._id, itemName: addedItem.itemName, addedAt: addedItem.addedAt });
  } catch (err) {
    logger.error(`Error adding item to shopping list: ${err}`);
    res.status(500).json({ error: { code: errorCodes.SERVER_ERROR, message: "Internal Server Error" } });
  }
};

exports.removeItemFromList = async (req, res) => {
  if (!isOwner(req.user, req.params.listId) && !isAdmin(req.user)) {
    return res.status(403).json({ error: { code: errorCodes.FORBIDDEN, message: "Forbidden" } });
  }

  const { error, value } = removeItemFromListSchema.validate({...req.body, ...req.params});
  if (error) {
    return res.status(400).json({ error: { code: errorCodes.INVALID_INPUT, message: error.details[0].message } });
  }

  const { listId, itemId } = value;

  try {
    const updatedList = await ShoppingList.findByIdAndUpdate(
      listId,
      { $pull: { items: { _id: itemId } } },
      { new: true }
    );

    if (!updatedList) {
      return res.status(404).json({ error: { code: errorCodes.NOT_FOUND, message: "List not found" } });
    }

    logger.info(`Item removed from shopping list: ${listId}`);
    res.status(200).json({ itemId, removedAt: new Date().toISOString() });
  } catch (err) {
    logger.error(`Error removing item from shopping list: ${err}`);
    res.status(500).json({ error: { code: errorCodes.SERVER_ERROR, message: "Internal Server Error" } });
  }
};

exports.shareShoppingList = async (req, res) => {
  const { error, value } = shareShoppingListSchema.validate({...req.body, ...req.params});
  if (error) {
    return res.status(400).json({ error: { code: errorCodes.INVALID_INPUT, message: error.details[0].message } });
  }

  const { listId, userId } = value;

  // TODO: check for userID existence

  try {
    const updatedList = await ShoppingList.findByIdAndUpdate(
      listId,
      { $addToSet: { sharedWith: userId } }, // $addToSet prevents duplicate entries
      { new: true }
    );

    if (!updatedList) {
      return res.status(404).json({ error: { code: errorCodes.NOT_FOUND, message: "List not found" } });
    }

    logger.info(`Shopping list shared: ${listId} with user: ${userId}`);
    res.status(200).json({ listId, userId, sharedAt: new Date().toISOString() });
  } catch (err) {
    logger.error(`Error sharing shopping list: ${err}`);
    res.status(500).json({ error: { code: errorCodes.SERVER_ERROR, message: "Internal Server Error" } });
  }
};

exports.unshareShoppingList = async (req, res) => {
  const { error, value } = unshareShoppingListSchema.validate({...req.body, ...req.params});
  if (error) {
    return res.status(400).json({ error: { code: errorCodes.INVALID_INPUT, message: error.details[0].message } });
  }

  const { listId, userId } = value;

  try {
    const updatedList = await ShoppingList.findByIdAndUpdate(
      listId,
      { $pull: { sharedWith: userId } },
      { new: true }
    );

    if (!updatedList) {
      return res.status(404).json({ error: { code: errorCodes.NOT_FOUND, message: "List not found" } });
    }

    logger.info(`Shopping list unshared: ${listId} with user: ${userId}`);
    res.status(200).json({ listId, userId, unsharedAt: new Date().toISOString() });
  } catch (err) {
    logger.error(`Error unsharing shopping list: ${err}`);
    res.status(500).json({ error: { code: errorCodes.SERVER_ERROR, message: "Internal Server Error" } });
  }
};
