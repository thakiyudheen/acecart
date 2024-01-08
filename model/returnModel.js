const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const retutnItemSchema = new Schema({
  userid: { type: Schema.Types.ObjectId },
  orderid: { type: Schema.Types.ObjectId },
  returnReason: {
    type: String,
  },
  description: {
    type: String,
  },
  status:{
    type: String,
  },
});

const returnitems = mongoose.model("returnitem", retutnItemSchema);
module.exports = returnitems;