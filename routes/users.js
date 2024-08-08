const router = require("express").Router();
const { getUsers, getUser, createUser } = require("../controllers/users");

// Read
router.get("/", getUsers);

// Update
router.get("/:userId", getUser);

// Create
router.post("/", createUser);

module.exports = router;