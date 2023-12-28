const User= require("../model/userModel");
const Product= require("../model/productModel");
const Cart= require("../model/cartModel");
const {sendEmail}=require('../auth/nodemailer')
const {getSignupOtp, generateOTP}=require('../util/generateotp')
const mongoose = require('mongoose');




module.exports={
    getCart:(req,res)=>{
        try {


         User.findOne({email:req.session.email}).then(async(user)=>{
            if(user){
       
        const products = await Cart.aggregate([
            {
                $match: {
                    userid: user._id
                }
            },
            {
                $unwind: '$products'
            },
            {
                $lookup: {
                    from: 'products',
                    localField: 'products.productid',
                    foreignField: '_id',
                    as: 'product'
                }
        
             },
            {
                $project: {
                    productid: '$products.productid',
                    quantity: '$products.quantity',
                    product: { $arrayElemAt: ['$product', 0] }
                }
            }
        ]);

            // find the document sub totel ---------------------------
            let subtotel=0;
            let totelqty=0;
            let toteldiscount=0;
            let  totelprice=0;
            if(products!=null){
                products.forEach((ele)=>{
                  totelprice+=ele.product.Price*ele.quantity
                  subtotel+= ele.product.DiscountAmount*ele.quantity
                  toteldiscount=totelprice-subtotel
                  totelqty+= ele.quantity

                })

                
            }
            //   data store in session -------------------------------
                req.session.subtotel=subtotel
                req.session.totelprice= totelprice
              console.log(products)
               res.render('user/cart',{products,user:req.session.user,subtotel,totelqty,toteldiscount,totelprice})
            }
         })
        
        }catch(err){
            console.log(err);
        }
    },
    addTocart:async (req,res)=>{
        console.log("okk aan mone")
        console.log(req.session.email)
        try{
             const user=await  User.findOne({email:req.session.email})
            if(user){
                const cart = await Cart.findOne({userid:user._id})
            

                if(cart){
   
                  await Cart.findOne({userid:user._id,'products.productid':req.params.id}).then(async (dta)=>{
                       if(dta){
                           await Cart.updateOne({
                            userid:user.id,'products.productid':req.params.id 
                        },
                        {
                            $inc:
                            {
                                'products.$.quantity':1
                            }
                        })
                           
                       }else{
   
                           console.log(Cart)
                           await Cart.updateOne({
                            userid:user.id
                        },
                        {
                            $push:
                            {
                                products:
                                {
                                    productid:req.params.id,quantity:1
                                }
                            }
                        })
                       }
                   })
                       
                   }else{
                  console.log("sndd ")
                   const data={
                       userid:user._id,
                       products:[
                           {
                               productid:req.params.id,
                               quantity:1
                           }
                       ]
                   }
                    await Cart.create(data)
                   }
                   res.json({msg:true})
        
            }else{
                res.json({msg:false})
            }
            
                   
        } catch(err){
            console.log(err);
        }
    },
    updateCart:async(req,res)=>{
        try{
           
          

           if(req.params.qty==1&&req.params.no==-1){
            
            await Cart.updateOne({
                _id:req.params.cartid
            },
            {
                $pull:
                {
                    products:
                    {
                        productid: req.params.proid.trim()
                    }
                }
            })
             res.json({msg:"succes"})
           

           }else{
            
            await Cart.updateOne({
                _id:req.params.cartid,'products.productid':req.params.proid.trim()
            },
            {
                $inc:
                {
                    'products.$.quantity':req.params.no
                }
            })



            res.json({msg:"success "})
           }


        }catch(err){
            console.log(err);
        }
        

    },
    removeCart:async (req,res)=>{
        await Cart.updateOne({
            _id:req.params.cartid
        },
        {
            $pull:
            {
                products:
                {
                    productid: req.params.proid.trim()
                }
            }
        })
        res.json({msg:true})
    }
}