const router = require('express').Router();

const {
    createItem,
    getItems,
    deleteItem,
    likeItem,
    dislikeItem,
} = require('../controllers/clothingItems');

const auth = require('../middlewares/auth');

const { validateClothingItem,
    validateId } = require('../middlewares/validation')

// Read
router.get('/', getItems);

// Authorize
router.use(auth);



// Create

router.post('/', validateClothingItem, createItem);


// Delete

router.delete('/:itemId', validateId, deleteItem);

// Update

// router.put('/:itemId', updateItem);

// Likes

router.put('/:itemId/likes', validateId, likeItem);

// Dislikes

router.delete('/:itemId/likes', validateId, dislikeItem);

module.exports = router;