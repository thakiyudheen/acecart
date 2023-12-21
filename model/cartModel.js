const  mongoose=require('mongoose')
require('dotenv').config();
const Schema = mongoose.Schema;

const cartSchema= new Schema({
    userid:{type:Schema.Types.ObjectId},
    products:[
        {
        productid:{type: Schema.Types.ObjectId},
        quantity: { type: Number },
        }
    ]
    
})

const cart = mongoose.model("carts", cartSchema);
module.exports =cart ;