const mongoose=require("mongoose")
require('dotenv').config();

const Schema = mongoose.Schema;
//category schema
const categoryschema = new Schema(
  {
   
    categoryname: {
      type: String,
    }
  },
  {
    timestamps: true,
  }
);

const categories = mongoose.model("category", categoryschema);
module.exports =categories;