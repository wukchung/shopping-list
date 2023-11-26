const express = require('express');
const shoppingListController = require('../controllers/shoppingListController');
const router = express.Router();

router.post('/', shoppingListController.createShoppingList);
router.put('/', shoppingListController.updateShoppingList);
router.delete('/', shoppingListController.deleteShoppingList);
router.post('/item', shoppingListController.addItemToList);
router.delete('/item', shoppingListController.removeItemFromList);
router.put('/share', shoppingListController.shareShoppingList);
router.delete('/share', shoppingListController.unshareShoppingList);

module.exports = router;
