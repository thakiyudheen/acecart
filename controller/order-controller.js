const User= require("../model/userModel");
const Address= require("../model/addressModel");
const Product= require("../model/productModel");
const Cart= require("../model/cartModel");
const Order= require("../model/orderModel");
const mongoose = require('mongoose');
const order = require("../model/orderModel");

module.exports={
    cashOndelivery:async (req,res)=>{
        
        try{
           const addressId=req.session.confirm.adressId
           const paymethod=req.session.confirm.paymethod
           const totelAmount=req.session.subtotel
           const totelprice=req.session.totelprice
           console.log( totelAmount,totelprice)
           let discountAmount=totelprice-totelAmount
          

        //    find user----------------------------------------
            const user=await User.findOne({email:req.session.email})
           
           console.log("okkk aan ithhh");
        //    find data address and cart -----------------------
            const[address,cart]= await Promise.all([
                Address.findOne({_id:addressId}),
                Cart.findOne({userid:user._id})
            ])
           

        // date setting------------------------------------------
        const currentDate=new Date().toLocaleString("en-US", {
            timeZone: "Asia/Kolkata",
          });
         
        // delivery date ----------------------------------------  
        const deliveryDate= new Date(
            Date.now() + 4 * 24 * 60 * 60 * 1000
          ).toLocaleString("en-US", { timeZone: "Asia/Kolkata" });  

        //   if not coupen code ---------------------------------

          let couponCode = "";
          let couponDiscount = 0;


        //   if coupen code--------------------------------------
          if (req.session.couponDiscount && req.session.couponCode) {
            couponDiscount = req.session.couponDiscount;
            couponCode = req.session.couponCode;
            discountAmount=discountAmount-couponDiscount;
          }  

        //   add details in database ----------------------------
              let  orderlist=
                
                   await Order.create({
                        userid: user._id,
                        products: cart.products,
                        address: {
                        address: address.address,
                        locality: address.locality,
                        city: address.city,
                        district: address.district,
                        state: address.state,
                        pincode: address.pincode,
                        },
                        orderDate: currentDate,
                        expectedDeliveryDate:deliveryDate,
                        paymentMethod: "COD",
                        PaymentStatus: "Pending",
                        orderStatus: "Order Processed",
                        couponCode: couponCode,
                        couponDiscount: couponDiscount,
                        totalAmount: totelAmount,
                        discountAmount: discountAmount,
                    })

                    // coupen cosde reset ------------------------------
                    req.session.couponCode = "";
                    req.session.couponDiscount = 0;

                    const products=cart.products;

                    // to change qty ------------------------------------
                    products.forEach(async ele=>{
                      proid=ele.productid;
                      quantity=ele.quantity;
                      const product=await Product.findOne({_id:proid})
                      stock=product.AvailableQuantity;
                      newstock=stock-quantity;
                      await Product.updateOne(
                      {
                        _id:proid
                      },
                        {
                          $set:
                          {
                            AvailableQuantity:newstock
                          }
                        }
                      )
                    })
                      // orderid:orderlist._id
                      const cartDetails = await Cart.findByIdAndDelete(cart._id);
                  
                      res.render('user/ordersuccess',{user:req.session.user})


        }catch(err){    
            console.log(err)
        }
    },
    OrderList:async (req,res)=>{
      try{
        const user= await User.findOne({email:req.session.email})
        const orders=await Order.find({userid:user._id})
        res.render('user/orderlist',{orders})
      }catch(err){
        console.log(err);
      }
    },
    OrderDetails:async (req,res)=>{
       try{
        const orderData =await Order.find({_id:req.params.orderid}).populate("products.productid")
        console.log(".......>>>>>>>>>>>>>>>>>",orderData[0].products)
        // Arry.toArray(orderData[0].products)
        

       res.render('user/orderdetails',{orderData,user:req.session.user,email:req.session.email})
       
       }catch(err){
        console.log(err);
       }
    },
    // admin get order----------------------------------------------------
    getOrder:async (req,res)=>{
      try{

        const orderData=await Order.find()
      res.render('admin/orders',{orderData})
      }catch(err){
        console.log(err);
      }
    },
    updateOrderstatus:async (req,res)=>{
      try{
        console.log(req.params.status)
        console.log(req.params.orderid)
        const currentDate=new Date().toLocaleString("en-US", {
          timeZone: "Asia/Kolkata",
        });
         await Order.updateOne({_id:req.params.orderid.trim()},{$set:{orderStatus:req.params.status.trim(),deliveryDate:currentDate}})
        

        console.log("its mmmmmmmmmmmmmmmmmmmmmmmm")
      res.json({msg:"status changed successfully!"})
      }catch(err){
        console.log(err);
      }
    },
    cancelOrder:async(req,res)=>{
      try{
        const orders=await Order.findOne({_id:req.params.orderid})
        orders.orderStatus=req.params.status
        await orders.save();


        orders.products.forEach(async ele=>{
        const product=await Product.findOne({_id:ele.productid})
        if(product){
          product.AvailableQuantity+=ele.quantity;
          await product.save()
        }
        })

        res.json({msg:"order canceled successfully"})
      }catch(err){
        console.log(err);
      }
    },
    // admin get order details----------------------------------------
    getOrderdetails:async (req,res)=>{
      try{
        const orderData =await Order.find({_id:req.params.orderid}).populate("products.productid")
        const user=await User.findOne({_id:orderData[0].userid})

        res.render('admin/orderdetails',{orderData,user:user.name,email:user.email})
      }catch(err){
        console.log(err);
      }
    }
}