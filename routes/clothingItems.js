const router = require('express').Router();

const {
    createItem, getItems, deleteItem, likeItem,
    dislikeItem,
} = require('../controllers/clothingItems');

const auth = require('../middlewares/auth');

// Read
router.get('/', getItems);

// Authorize
router.use(auth);



// Create

router.post('/', createItem);


// Delete

router.delete('/:itemId', deleteItem);

// Update

// router.put('/:itemId', updateItem);

// Likes

router.put('/:itemId/likes', likeItem);

// Dislikes

router.delete('/:itemId/likes', dislikeItem);

module.exports = router;