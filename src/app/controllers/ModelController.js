const Model = require("../models/Type");

exports.create = async (req, res) => {
  const { type, category } = req.body;

  const isCreated = async () => {
    const productType = await Model.findOne({
      type,
    });

    if (!productType) return false;
    return true;
  };

  const alreadyExists = await isCreated();

  if (alreadyExists)
    return res.status(400).json({ msg: "O modelo já existe." });

  try {
    const productType = new Model(req.body);
    productType.save();
    return res.status(200).json({
      msg: `O produto ${type} da categoria ${category} foi criado com sucesso!`,
    });
  } catch (err) {
    return res.status(400).json({ err });
  }
};

exports.get = async (req, res) => {
  const models = await Model.find(
    {},
    {
      _id: 0,
      __v: 0,
    }
  );
  return res.status(200).json({ models });
};
