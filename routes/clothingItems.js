const router = require('express').Router();

const { createItem, getItems, updateItem, deleteItem, likeItem,
    dislikeItem, } = require('../controllers/clothingItems')

//Crud


//Create

router.post('/', createItem);

//Read

router.get('/', getItems);

//Update

router.put('/:itemId',updateItem )

//delete

router.delete('/:itemId', deleteItem )

//likes

router.put('/:itemId/likes',likeItem);

//dislikes

router.delete('/:itemId/likes',dislikeItem);

module.exports = router