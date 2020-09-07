const mongoose = require("mongoose");

const typeSchema = new mongoose.Schema(
  {
    type: String,
    category: String,
    price: Number,
  },
  { collection: "types" }
);

module.exports = mongoose.model("Type", typeSchema);
