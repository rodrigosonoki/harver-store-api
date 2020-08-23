const router = require("express").Router();
const {
  createNewUserRegister,
  generateLoginToken,
  forgotPassword,
} = require("../controllers/UserController");

router.post("/register", createNewUserRegister);

router.post("/login", generateLoginToken);
router.post("/esqueci-senha", forgotPassword);

module.exports = router;
