const router = require("express").Router();
const { getCurrentUser, updateUser } = require("../controllers/users");
const auth = require('../middlewares/auth');
const { validateUpdateBody } = require("../middlewares/validation");

router.use(auth);

router.get('/me', getCurrentUser);
router.patch("/me", validateUpdateBody, updateUser);



module.exports = router;