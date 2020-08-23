const router = require("express").Router();

const {
  addUserToStore,
  getStoreInfo,
  listUsers,
} = require("../controllers/StoreController");
const {
  createProduct,
  getProducts,
  getProductById,
} = require("../controllers/ProductController");

router.post("/newuser", addUserToStore);
router.post("/createproduct", createProduct);
router.get("/getproducts", getProducts);
router.get("/product/:id", getProductById);
router.get("/info", getStoreInfo);
router.get("/users", listUsers);

module.exports = router;
