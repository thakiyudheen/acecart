const mongoose=require("mongoose")
require('dotenv').config();

const Schema = mongoose.Schema;
//otp schema
const otpschema = new Schema(
  {
   
    email: {
      type: String,
    },
    otp: {
      type: String,
    }
  },
  {
    timestamps: true,
  }
);

const otps = mongoose.model("otp", otpschema);
module.exports = otps;