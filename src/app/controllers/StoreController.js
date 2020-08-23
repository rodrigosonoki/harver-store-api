const Store = require("../models/Store");
const User = require("../models/User");
const crypto = require("crypto");
const bcrypt = require("bcrypt");

const addUserToStore = async (req, res) => {
  const { email, password } = req.body;

  //FIND STORE
  const store = await Store.findOne({
    users: req.user.id,
  });

  /* 
  CREATE USER
  */

  //CHECK IF EMAIL ALREADY EXISTS
  const isRegistered = await User.findOne({
    email,
  });

  if (isRegistered)
    return res.status(400).json({ error: "E-mail já cadastrado." });

  //HASH PASSWORD
  const salt = await bcrypt.genSalt(10);
  const encryptedPassword = await bcrypt.hash(password, salt);

  //CREATE TOKEN FOR VERIFICATION (isVerified field)
  const token = crypto.randomBytes(20).toString("hex");

  //CREATE & SAVE NEW USER
  const user = await new User({
    email,
    verificationToken: token,
    password: encryptedPassword,
  });
  await user.save();

  /* 
  PUSH USER INTO STORE
  */
  try {
    store.users.push(user);
    store.save();
    return res.status(200).json({ msg: "Usuário criado com sucesso!" });
  } catch (err) {
    return res.status(400).json(err);
  }
};

const getStoreInfo = async (req, res) => {
  const store = await Store.findOne(
    {
      users: req.user.id,
    },
    {
      __v: 0,
    }
  );

  if (!store) return res.status(404).json({ msg: "Loja não encontrada" });
  return res.status(200).json(store);
};

const listUsers = async (req, res) => {
  const store = await Store.findOne(
    {
      users: req.user.id,
    },
    {
      products: 0,
      createdAt: 0,
      _id: 0,
      __v: 0,
      name: 0,
    }
  ).populate({
    path: "users",
    select: "-createdAt -avatar -isVerified -_id -password -__v",
  });

  return res.status(200).json(store);
};

module.exports = {
  addUserToStore,
  getStoreInfo,
  listUsers,
};
