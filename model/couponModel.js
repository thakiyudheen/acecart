const mongoose = require("mongoose");
const { Schema } = mongoose;

const couponSchema = {
  userid: {
    type: Schema.Types.ObjectId,
  },
  couponCode: String,
  description: String,
  minPurchaseAmount: String,
  discountAmount: String,
  startDate : String,
  expiryDate: String,
  
};

const coupon = mongoose.model("coupon", couponSchema);
module.exports = coupon;