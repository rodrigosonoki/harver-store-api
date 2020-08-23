const User = require("../models/User");
const Store = require("../models/Store");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const Queue = require("../lib/Queue");

const createNewUserRegister = async (req, res) => {
  const { email, password } = req.body;

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

  try {
    //CREATE & SAVE NEW USER
    const user = await new User({
      email,
      verificationToken: token,
      password: encryptedPassword,
    });
    await user.save();

    //CREATE & SAVE NEW STORE
    const store = await new Store({
      users: user._id,
    });
    await store.save();

    //SEND EMAIL
    await Queue.add("RegistrationMail", { user });

    return res.status(200).json({ msg: "Conta criada com sucesso!" });
  } catch (err) {
    return res.status(400).json({ err });
  }
};

const generateLoginToken = async (req, res) => {
  const { email, password } = req.body;

  //FIND USER
  const user = await User.findOne({ email });

  //HANDLE ERROR: USER NOT FOUND
  if (!user) return res.status(400).json({ msg: "Usuário não encontrado." });

  //COMPARE PASSWORD
  const isPasswordValid = await bcrypt.compare(password, user.password);

  //IF USER NOT FOUND OR INVALID PASSWORD RETURN GENERIC ERROR MESSAGE
  if (!user || !isPasswordValid)
    return res.status(400).json({ error: "Credenciais inválidas." });

  const token = jwt.sign(
    {
      email: user.email,
      id: user._id,
    },
    process.env.SECRET_TOKEN
  );

  return res.header("auth-token", token).json({
    token,
  });
};

const forgotPassword = async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });

  if (!user)
    return res.status(200).json({
      msg:
        "Se encontrarmos uma conta com esse e-mail, vamos enviar o link para resetar a senha!",
    });

  const token = crypto.randomBytes(20).toString("hex");
  const url = `www.harver.com.brand${token}`;

  //SETTING EXPIRATION TIME IN 1 HOUR
  const now = new Date();
  now.setHours(now.getHours() + 1);

  const content = {
    token,
    url,
    email,
  };

  try {
    await User.findByIdAndUpdate(
      user.id,
      {
        $set: {
          passwordResetToken: token,
          passwordResetExpires: now,
        },
      },
      {
        useFindAndModify: false,
      }
    );

    //SEND EMAIL
    await Queue.add("ForgotPasswordMail", { content });

    return res.status(200).send();
  } catch (err) {
    return res.status(400).json(err);
  }
};

module.exports = {
  createNewUserRegister,
  generateLoginToken,
  forgotPassword,
};
