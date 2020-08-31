const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv/config");

//IMPORTING ROUTES
const authRoute = require("./app/routes/auth");
const storeRoute = require("./app/routes/stores");

const app = express();

//MIDDLEWARES
const validateToken = require("./app/middlewares/validateToken");

//OPTS
app.use(cors());
app.use(express.json());

//ROUTES
app.use("/user", authRoute);
app.use("/store", validateToken, storeRoute);

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

app.listen(3001, () => console.log("Listening on PORT 3333"));
