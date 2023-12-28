const mongoose = require("mongoose");
const Schema = mongoose.Schema;

//brand schema
const brandSchema = new Schema({
  brandname: {
    type: String,
  },
  timeStamp: {
    type: Date,
  },
});

const brand = mongoose.model("brand", brandSchema);
module.exports = brand;