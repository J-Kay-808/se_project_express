const router = require('express').Router();

const { createItem, getItems, updateItem, deleteItem } = require('../controllers/clothingItems')

//Crud


//Create

router.post('/', createItem);

//reaD

router.get('/', getItems);

//Update

router.put('/:itemId',updateItem )

//delete

router.delete('/:itemId', deleteItem )


module.exports = router