// const  mongoose=require('mongoose')
// require('dotenv').config();
// const Schema = mongoose.Schema;

// const cartSchema= new Schema({
//     userid:{type:Schema.Types.ObjectId},
//     products:[
//         {
//         productid:{type: Schema.Types.ObjectId},
//         quantity: { type: Number },
//         }
//     ]
    
// })

// const cart = mongoose.model("carts", cartSchema);
// module.exports =cart ;
const mongoose = require('mongoose');
require('dotenv').config();
const Schema = mongoose.Schema;

const cartSchema = new Schema({
    userid: { type: Schema.Types.ObjectId, ref: 'User' }, // Assuming you have a User model
    products: [
        {
            productid: { type: Schema.Types.ObjectId, ref: 'product' }, // Reference to the Product model
            quantity: { type: Number, required: true },
        }
    ]
}, {
    timestamps: true
});

const Cart = mongoose.model("Cart", cartSchema);
module.exports = Cart;
