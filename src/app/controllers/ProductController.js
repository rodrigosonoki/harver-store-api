const Product = require("../models/Product");
const Store = require("../models/Store");
const Sku = require("../models/Sku");

const createProduct = async (req, res) => {
  const { name, description, images, price } = req.body;

  const store = await Store.findOne({
    users: req.user.id,
  });

  if (!store) return res.status(400).json({ msg: "Loja não encontrada." });

  const skus = [{ size: "S" }, { size: "M" }, { size: "L" }, { size: "XL" }];

  try {
    //CREATE & SAVE PRODUCT
    const product = await new Product({
      name,
      description,
      images,
      price,
      store,
    });
    product.save();

    //CREATE & SAVE SKU
    skus.forEach(async function (i) {
      const sku = await new Sku({
        product: product._id,
        size: i.size,
      });
      sku.save();
    });

    res.status(200).json({ msg: `${name} foi criado com sucesso` });
  } catch (err) {
    res.status(400).json(err);
  }
};

const getProducts = async (req, res) => {
  const store = await Store.findOne({
    users: req.user.id,
  });

  const products = await Product.find({
    store: store.id,
  });

  try {
    return res.status(200).json(products);
  } catch (err) {
    return res.status(400).json(err);
  }
};

const getProductById = async (req, res) => {
  const id = req.params.id;
  const product = await Product.findById(id);

  if (!product) return res.status(404).json({ msg: "Produto não encontrado" });

  return res.status(200).json(product);
};

module.exports = {
  createProduct,
  getProducts,
  getProductById,
};
