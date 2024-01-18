const User= require("../model/userModel");
const Address= require("../model/addressModel");
const Product= require("../model/productModel");
const Cart= require("../model/cartModel");
const Order= require("../model/orderModel");
const mongoose = require('mongoose');
const order = require("../model/orderModel");
const Wallet = require("../model/walletModel");
const Return = require("../model/returnModel");
const Wallethistory = require("../model/wallethistoryModel");
const {createOrder} = require('../controller/razorpay-controller')
const crypto = require("crypto");
const { log } = require("console");
// const moment = require('moment');
const pdf=require('../util/getInvoice')
const moment = require('moment-timezone');

module.exports={
  confirmAddress:async (req,res)=>{
    console.log(req.body);
   req.session.confirm=req.body
    if(req.body.paymethod=="cod"){
       
        res.json({method:"cod"})


    }else if(req.body.paymethod=="online"){

      console.log(req.session.confirm.paymethod)
      try{
        const addressId=req.session.confirm.adressId
        const paymethod=req.session.confirm.paymethod
        const totelAmount=req.session.subtotel
        const totelprice=req.session.totelprice
        console.log( totelAmount,totelprice)
        let discountAmount=totelprice-totelAmount
       

     //    find user----------------------------------------
         const user=await User.findOne({email:req.session.email})
        
       
     //    find data address and cart -----------------------
         const[address,cart]= await Promise.all([
             Address.findOne({_id:addressId}),
             Cart.findOne({userid:user._id})
         ])
        

   
            // date setting------------------------------------------
        const currentDate = moment().tz("Asia/Kolkata").format('L LT');

        // delivery date ----------------------------------------
        const deliveryDate = moment().add(4, 'days').tz("Asia/Kolkata").format('L LT');

        console.log("Current Date:", currentDate);
        console.log("Delivery Date:", deliveryDate);

     //   if not coupen code ---------------------------------

       let couponCode = "";
       let couponDiscount = 0;


     //   if coupen code--------------------------------------
       if (req.session.couponDiscount && req.session.couponCode) {
         couponDiscount = req.session.couponDiscount;
         couponCode = req.session.couponCode;
         discountAmount=discountAmount-couponDiscount;
       }  
        console.log("cartttttttttttttttttttt",cart);
     //   add details in database ----------------------------
           let  orderlist=

             
                await Order.create({
                     userid: user._id,
                     products: cart.products,
                     address: {
                     name:address.name,  
                     address: address.address,
                     locality: address.locality,
                     city: address.city,
                     district: address.district,
                     state: address.state,
                     mobile:address?.mobile,
                     pincode: address.pincode,
                     },
                     orderDate: currentDate,
                     expectedDeliveryDate:deliveryDate,
                     paymentMethod: req.session.confirm.paymethod,
                     PaymentStatus: "Pending",
                     orderStatus: "Order Processing",
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
                 for (const ele of products) {
                   const proid = ele.productid;
                   const quantity = ele.quantity;
                   
                   const product = await Product.findOne({ _id: proid });
                   const stock = product.AvailableQuantity;
                   const newstock = stock - quantity;
               
                   product.AvailableQuantity = newstock;
                   await product.save();
                 }                   
                   console.log("realmeeeeeeeeeeeeeeeeeeeeeeeeee",orderlist)
                   createOrder(req,res,orderlist._id+"")
                   console.log(order);
                   
                
                   


     }catch(err){    
         console.log(err)
     }
        
    }else if(req.body.paymethod=="wallet"){
      // start wallet parchase ------------------------------------------------
        const subtotel=req.session.subtotel
        const user= await User.findOne({email:req.session.email})
        const wallet =await Wallet.findOne({userid:user._id})
        if(wallet){
          if(wallet.wallet>=subtotel){
            
            await Wallet.updateOne({userid:user._id},{$inc:{wallet:-subtotel}})

            const addressId=req.session.confirm.adressId
            const paymethod=req.session.confirm.paymethod
            const totelAmount=req.session.subtotel
            const totelprice=req.session.totelprice
            console.log( totelAmount,totelprice)
            let discountAmount=totelprice-totelAmount
         
    
         //    find user----------------------------------------
            //  const user=await User.findOne({email:req.session.email})
            
           
         //    find data address and cart -----------------------
             const[address,cart]= await Promise.all([
                 Address.findOne({_id:addressId}),
                 Cart.findOne({userid:user._id})
             ])
            
    
              // date setting------------------------------------------
              const currentDate = moment().tz("Asia/Kolkata").format('L LT');

              // delivery date ----------------------------------------
              const deliveryDate = moment().add(4, 'days').tz("Asia/Kolkata").format('L LT');
      
              console.log("Current Date:", currentDate);
              console.log("Delivery Date:", deliveryDate);
      
         //   if not coupen code ---------------------------------
    
           let couponCode = "";
           let couponDiscount = 0;
    
    
         //   if coupen code--------------------------------------
           if (req.session.couponDiscount && req.session.couponCode) {
             couponDiscount = req.session.couponDiscount;
             couponCode = req.session.couponCode;
             discountAmount=discountAmount-couponDiscount;
           }  
            console.log("cartttttttttttttttttttt",cart);
         //   add details in database ----------------------------
               let  orderlist=
    
                 
                    await Order.create({
                         userid: user._id,
                         products: cart.products,
                         address: {
                         name:address.name,  
                         address: address.address,
                         locality: address.locality,
                         city: address.city,
                         district: address.district,
                         state: address.state,
                         mobile:address?.mobile,
                         pincode: address.pincode,
                         },
                         orderDate: currentDate,
                         expectedDeliveryDate:deliveryDate,
                         paymentMethod: req.session.confirm.paymethod,
                         PaymentStatus: "Paid",
                         orderStatus: "Order Processing",
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
                     for (const ele of products) {
                       const proid = ele.productid;
                       const quantity = ele.quantity;
                       
                       const product = await Product.findOne({ _id: proid });
                       const stock = product.AvailableQuantity;
                       const newstock = stock - quantity;
                   
                       product.AvailableQuantity = newstock;
                       await product.save();
                     } 
                     const wallethistory = await Wallethistory.findOne({ userid: user._id });
                     if (wallethistory) {
                       
                       const reason = "Product Purchase With Wallet Amount";
                       const type = "debit";
                       const date = new Date();
                       await Wallethistory.updateOne(
                         { userid: user._id },
                         {
                           $push: {
                             refund: {
                               amount:totelAmount,
                               reason: reason,
                               type: type,
                               date: date,
                             },
                           },
                         },
                         { new: true }
                       );
                     } else {
                       
                       const reason = "Product Purchase With Wallet Amount";
                       const type = "debit";
                       const date = new Date();
                       await Wallethistory.create({
                         userid: user._id,
                         refund: [
                           {
                             amount:totelAmount,
                             reason: reason,
                             type: type,
                             date: date,
                           },
                         ],
                       });
                     }
                     res.json({status: true,method:'wallet'})
          }else{
            res.json({err:"inefficient balance in wallet",status:false,method:"wallet"})
          }
        }else{
          res.json({err:"inefficient balance in wallet",status:false,method:"wallet"})
        }
        
    }
},
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
            const currentDate = moment().tz("Asia/Kolkata").format('L LT');

            // delivery date ----------------------------------------
            const deliveryDate = moment().add(4, 'days').tz("Asia/Kolkata").format('L LT');
    
            console.log("Current Date:", currentDate);
            console.log("Delivery Date:", deliveryDate);
    
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
                        name:address.name,  
                        address: address.address,
                        locality: address.locality,
                        city: address.city,
                        district: address.district,
                        state: address.state,
                        mobile:address?.mobile,
                        pincode: address.pincode,
                        },
                        orderDate: currentDate,
                        expectedDeliveryDate:deliveryDate,
                        paymentMethod: "COD",
                        PaymentStatus: "Pending",
                        orderStatus: "Order Processing",
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
                    for (const ele of products) {
                      const proid = ele.productid;
                      const quantity = ele.quantity;
                      
                      const product = await Product.findOne({ _id: proid });
                      const stock = product.AvailableQuantity;
                      const newstock = stock - quantity;
                  
                      product.AvailableQuantity = newstock;
                      await product.save();
                    }
                   
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
        const orders=await Order.find({userid:user._id}).sort({orderDate:-1})
        res.render('user/orderlist',{orders})
      }catch(err){
        console.log(err);
      }
    },
    OrderDetails:async (req,res)=>{
       try{
        const orderData =await Order.find({_id:req.params.orderid}).populate("products.productid")
        console.log(".......>>>>>>>>>>>>>>>>>",orderData[0])
        // Arry.toArray(orderData[0].products)
        
        

       res.render('user/orederdetnew',{orderData,user:req.session.user,email:req.session.email})
       
       }catch(err){
        console.log(err);
       }
    },
    // admin get order----------------------------------------------------
    getOrder:async (req,res)=>{
      try{

        const orders = await Order.aggregate([
          {
              $lookup: {
                  from: 'users',  
                  localField: 'userid',
                  foreignField: '_id',
                  as: 'userName'
              }
          },
          {
              $unwind: '$userName'
          },
          {
              $sort: {
                  orderDate: -1 // Sort by orderDate in descending order
              }
          },
          {
              $project:{username:"$userName.name",
              'userid' : 1,
              'products': 1,                   
              'address': 1,
              'orderDate': 1,
              'expectedDeliveryDate': 1,
              'paymentMethod': 1,
              'PaymentStatus': 1,
              'totalAmount': 1,
              'deliveryDate': 1,
              'orderStatus': 1,
              'couponDiscount': 1,
              'couponCode': 1,
              'discountAmount': 1
              }
          }
      ]);
      res.render('admin/orders',{orders})
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
        if(req.params.status=='Delivered'){
          await Order.updateOne({_id:req.params.orderid.trim()},{$set:{orderStatus:req.params.status.trim(),deliveryDate:currentDate}})
        }else{
          await Order.updateOne({_id:req.params.orderid.trim()},{$set:{orderStatus:req.params.status.trim()}})
        }
         
        

        
      res.json({msg:"status changed successfully!"})
      }catch(err){
        console.log(err);
      }
    },
    rejectOrder:async (req,res)=>{
      try{
        console.log(req.body)
        await Order.updateOne({_id:req.body.orderid},{$set:{orderStatus:"Order Rejected",rejectReason:req.body.rejectReason}})
        res.json({status:true})
        
      }catch(err){
        console.log(err);
      }
    },
    
    cancelOrder: async (req, res) => {
      try {
        const orders = await Order.findOne({ _id: req.params.orderid });
        const user = await User.findOne({ email: req.session.email });
        orders.orderStatus = req.params.status;
        await orders.save();
        
        if (orders.paymentMethod == 'online'&&orders.PaymentStatus=='Paid'||orders.paymentMethod == 'wallet') {
          let walletRecord = await Wallet.findOne({ userid: user._id });
          
          if (walletRecord) {
            
            await Wallet.updateOne({userid:user._id},{$inc:{wallet:orders.totalAmount}})
            await Order.updateOne({userid:user._id},{$set:{orderStatus:"return accepted",PaymentStatus:"refunded"}})
          } else {
            await Wallet.create({
              userid: user._id,
              wallet: orders.totalAmount,
            });
            await Order.updateOne({userid:user._id},{$set:{orderStatus:"return accepted",PaymentStatus:"refunded"}})
          }
          if(orders.paymentMethod =='wallet'||orders.paymentMethod == 'online'&&orders.PaymentStatus=='Paid'){
            const wallethistory = await Wallethistory.findOne({ userid: user._id });
            if (wallethistory) {
              let amount = orders.totalAmount;
              const reason = "Refund for cancelling order";
              const type = "credit";
              const date = new Date();
              await Wallethistory.updateOne(
                { userid: user._id },
                {
                  $push: {
                    refund: {
                      amount: amount,
                      reason: reason,
                      type: type,
                      date: date,
                    },
                  },
                },
                { new: true }
              );
            } else {
              let amount = orders.totalAmount;
              const reason = "Refund for cancelling order";
              const type = "credit";
              const date = new Date();
              await Wallethistory.create({
                userid: user._id,
                refund: [
                  {
                    amount: amount,
                    reason: reason,
                    type: type,
                    date: date,
                  },
                ],
              });
            }
          }
        }
    
        for (const ele of orders.products) {
          const product = await Product.findOne({ _id: ele.productid });
    
          if (product) {
            product.AvailableQuantity += ele.quantity;
            await product.save();
          }
        }
    
        res.json({ msg: "Order canceled successfully" });
      } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Internal Server Error" });
      }
    }
    ,
    // admin get order details----------------------------------------
    getOrderdetails:async (req,res)=>{
      try{
        const orderData =await Order.find({_id:req.params.orderid}).populate("products.productid")
        const user=await User.findOne({_id:orderData[0].userid})

        res.render('admin/orderdetails',{orderData,user:user.name,email:user.email})
      }catch(err){
        console.log(err);
      }
    },
    getorderSuccess:async(req,res)=>{
      try{
       const user=await User.findOne({email:req.session.email})
       const cartDetails = await Cart.deleteOne({userid:user._id});
                   
        res.render('user/ordersuccess')
      }catch(err){

      }
    },
    // verify online payment -------------------------
    verifyPayment:async (req,res)=>{
      try {
        let hmac = crypto.createHmac("sha256", process.env.RAZORPAY_SECRET_KEY);

        hmac.update(
          req.body.payment.razorpay_order_id +
            "|" +
            req.body.payment.razorpay_payment_id
        );
    
        hmac = hmac.digest("hex");
       
        if (hmac == req.body.payment.razorpay_signature) {
          const orderId = req.body.order.receipt;
          
          const orderID = req.body.orderId;
          
          await Order.updateOne({_id:orderId},{$set:{
            PaymentStatus: "Paid",
            paymentMethod: "online",
          }});
          res.json({ success: true });
        } else {
          res.json({ failure: true });
        }
      } catch (error) {
        console.log(error);
      }
      },

      // post return order ----------------------------

      postreturnOrder:async(req,res)=>{
        try{
          const user=await User.findOne({email:req.session.email})
          console.log("wokyyy",req.body);
          await Return.create({
            userid:user._id,
            orderid:req.body.orderid,
            returnReason:req.body.returnReason,
            description:req.body.description,
            status:"pending"
          })

          await Order.updateOne({_id:req.body.orderid},{$set:{orderStatus:"Requested"}})
          res.json({msg:"Return requist send successfully"})
        }catch(err){
          console.log(err);
        }
      },
      getReturnorder:async(req,res)=>{
        try{
          const returns=await Return.findOne({orderid:req.params.orderid})
          console.log(returns);
          res.render('admin/returnRequest',{returns})
        }catch(err){
          console.log(err);
        }
      },
      // return request accept or not ------------------------------------
      returnRequest:async(req,res)=>{
        try{

          if(req.params.type=="accept"){
            const user= await User.findOne({email:req.session.email})
            const order= await Order.findOne({_id:req.params.orderid})
        
           const returns= await Return.findByIdAndUpdate(req.params.returnid,{status:"accepted"})
            
            await Order.updateOne({_id:req.params.orderid},{$set:{orderStatus:"return accepted",PaymentStatus:"refunded"}})
            const wallet= await Wallet.findOne({userid:user._id})
            if(wallet){
              let amount=order.totalAmount;
              console.log("yssssssssssssssss1",order.totalAmount);
              console.log();
              await Wallet.updateOne({userid:user._id},{$inc:{wallet:amount}})

            }else{
              let amount=order.totalAmount;
              console.log("yssssssssssssssss2");
             await Wallet.create({
                userid:user._id,
                wallet:amount
              })
            }
            const wallethistory = await Wallethistory.findOne({ userid: user._id });
            if (wallethistory) {
              let amount = order.totalAmount;
              const reason = "Refund for cancelling order";
              const type = "credit";
              const date = new Date();
              await Wallethistory.updateOne(
                { userid: user._id },
                {
                  $push: {
                    refund: {
                      amount: amount,
                      reason: reason,
                      type: type,
                      date: date,
                    },
                  },
                },
                { new: true }
              );
            } else {
              let amount = order.totalAmount;
              const reason = "Refund for cancelling order";
              const type = "credit";
              const date = new Date();
              await Wallethistory.create({
                userid: user._id,
                refund: [
                  {
                    amount: amount,
                    reason: reason,
                    type: type,
                    date: date,
                  },
                ],
              });
            }
            res.json({ msg: "return accepted", status: true });
                       
          }else{
            await Order.updateOne({_id:req.params.orderid},{$set:{orderStatus:"return rejected"}})
            await Return.updateOne({orderid:req.params.orderid},{$set:{status:"return rejected"}})
            res.json({msg:"return rejcted",status:false})
          }
        }catch(err){

        }
      },

      genarateInvoice:async (req,res)=>{
        try{
          const orderDetails = await Order.find({ _id: req.params.orderid })
          .populate("products.productid");
          console.log("this is reached",orderDetails);
          if (orderDetails) {
            const invoicePath = await pdf.generateInvoice(orderDetails);
      
            res.json({
              success: true,
              message: "Invoice generated successfully",
              invoicePath,
            });
          } else {
            res
              .status(500)
              .json({ success: false, message: "Failed to generate the invoice" });
          }
    
        }catch(err){
          console.log(err);
        }
      },
      downloadInvoice:(req,res)=>{
        try {
          const id = req.params.orderid;
          const filePath = `C:\\aceCart\\public\\pdf\\${id}.pdf`;
          res.download(filePath, `invoice.pdf`);
        } catch (error) {
          console.error("Error in downloading the invoice:", error);
          res
            .status(500)
            .json({ success: false, message: "Error in downloading the invoice" });
        }
      
      }

    
}