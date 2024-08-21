const router = require("express").Router();
const { createUser, getCurrentUser, updateUser } = require("../controllers/users");



router.get('/me', getCurrentUser);
router.patch("/me", updateUser);

// Create
router.post("/", createUser);

module.exports = router;