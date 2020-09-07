const router = require("express").Router();

const StoreController = require("../controllers/StoreController");
const ProductController = require("../controllers/ProductController");

router.post("/products/add", ProductController.create);
router.get("/products/get", ProductController.get);
router.get("/products/:id", ProductController.getById);
router.post("/users/add", StoreController.addUser);
router.get("/get", StoreController.get);
router.get("/users/get", StoreController.getUsers);

module.exports = router;
