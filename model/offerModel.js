const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const offerSchema = new Schema({
    Category : String,
    discount : Number,
    expiryDate : Date,
})

const offer = mongoose.model('offer',offerSchema);
module.exports = offer;