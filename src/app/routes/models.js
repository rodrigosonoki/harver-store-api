const router = require("express").Router();

const ModelController = require("../controllers/ModelController");

router.post("/create", ModelController.create);
router.get("/all", ModelController.get);

module.exports = router;
