const User= require("../model/userModel");
const Product= require("../model/productModel");
const Address= require("../model/addressModel");
const {sendEmail}=require('../auth/nodemailer')
const Otp = require("../model/otpModel");
const Wishlist= require("../model/wishlistModel");
const {getSignupOtp, generateOTP}=require('../util/generateotp')
const { hashData,verifyHashedData}=require('../util/bcrypt')

module.exports={
    getWishlist:async (req,res)=>{
        try{
            const user=await User.findOne({email:req.session.email})
             const wishlist=await Wishlist.find({userid:user._id}).populate("products.productid")
             if(wishlist){
                res.render('user/wishlist',{wishlist1:wishlist[0]?.products,wishid:wishlist[0]?._id})
             }else{
                res.render('user/wishlist')
             }
         
            
        }catch(err){
            console.log(err);
        }
    },
    addTowishlist:async(req,res)=>{
        try{
            console.log(">>>>>>>>>>>>>>>>>>>>>>>>>",req.params.proid)
            const user=await User.findOne({email:req.session.email})
            if(user){
                const wishlist=await Wishlist.findOne({userid:user._id})
                if(wishlist){
                    Wishlist.findOne({userid:user._id,'products.productid':req.params.proid}).then(async (data)=>{
                        if(data){
                            res.json({proexist:true,user:true})
                        }else{
                            await Wishlist.updateOne(
                                {
                                    userid:user._id
                                },
                                {
                                    $push:
                                    {
                                        products:
                                        {
                                            productid:req.params.proid
                                        }
                                    }
                                }
                                )
                                res.json({proexist:false,user:true})
                        }
                    })
                }else{
                    const datas={
                        userid:user.id,
                        products:[
                            {
                                productid:req.params.proid

                            }
                        ]
                    }
                    await Wishlist.create(datas)
                    res.json({proexist:false,user:true})
                    
                }
                
            }else{
                res.json(false)
            }
        }catch(err){
            console.log(err);
        }
    },
    removeWishlist:async(req,res)=>{
        try{

            console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>",req.params.proid,req.params.vishid);
            await Wishlist.updateOne({
                _id:req.params.wishid
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
        }catch(err){
            console.log(err);
        }
    }
}