const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv/config");

const PORT = 3001;

//IMPORTING ROUTES
const authRoute = require("./app/routes/auth");
const storeRoute = require("./app/routes/stores");
const modelRoute = require("./app/routes/models");

const app = express();

//MIDDLEWARES
const TokenHandler = require("./app/middlewares/TokenHandler");

//OPTS
app.use(cors());
app.use(express.json());

//ROUTES
app.use("/user", authRoute);
app.use("/store", TokenHandler.validateToken, storeRoute);
app.use("/models", TokenHandler.isAdmin, modelRoute);

//CONNECT TO MONGODB
mongoose.connect(
  process.env.DB_CONNECT,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  },
  () => console.log(`Connected to MongoDB on ${process.env.ENV} environment.`)
);

app.listen(PORT, () => console.log(`Listening on PORT ${PORT}`));
