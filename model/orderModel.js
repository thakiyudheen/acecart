const { ObjectId } = require("mongodb");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const orderSchema=new Schema({
    userid:{
        type:Schema.Types.ObjectId,
    },
    products:[
        {
            productid:{type: Schema.Types.ObjectId,ref:'product'},
            quantity: { type: Number },
            status:{type:String,default:'active'},
        },
    ],
    address: {
        name:String,
        address: String,
        locality: String,
        city: String,
        district: String,
        state: String,
        pincode: String,
        mobile:Number,
      },
      orderDate: {
        type: Date,
        required: true,
      },
      expectedDeliveryDate: Date,
      paymentMethod: String,
      PaymentStatus: String,
      totalAmount: Number,
      deliveryDate: Date,
      orderStatus: String,
      couponDiscount:Number,
      couponCode: String,
      discountAmount: Number,
      rejectReason:String,
})
const order = mongoose.model("order", orderSchema);
module.exports = order;
