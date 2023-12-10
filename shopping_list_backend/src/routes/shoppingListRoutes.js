const express = require('express');
const shoppingListController = require('../controllers/shoppingListController');
const router = express.Router();

// shoppingList routes
router.get('/', shoppingListController.getAllShoppingLists);
router.post('/', shoppingListController.createShoppingList);
router.put('/:listId', shoppingListController.updateShoppingList);
router.delete('/:listId', shoppingListController.deleteShoppingList);
router.get('/:listId', shoppingListController.getShoppingListItems);

// item routes
router.post('/:listId/item', shoppingListController.addItemToList);
router.delete('/:listId/item/:itemId', shoppingListController.removeItemFromList);

// share routes
router.put('/:listId/share', shoppingListController.shareShoppingList);
router.delete('/:listId/share', shoppingListController.unshareShoppingList);

module.exports = router;
