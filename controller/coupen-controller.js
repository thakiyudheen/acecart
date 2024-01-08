const ADMIN= require('../model/adminModel');
const User= require("../model/userModel");
const Category= require("../model/categoryModel");
const Product= require("../model/productModel");
const Coupon= require("../model/couponModel");

module.exports={
    getCoupen:async (req,res)=>{
        try{
            const coupon=await Coupon.find()
            res.render('admin/coupen',{coupon})
        }catch(err){
            console.log(err);
        }
    },
    postAddcoupon:async (req,res)=>{
        try{
            console.log(req.body);
            const coupon=await Coupon.findOne({couponCode:req.body.cuponCode})
            if(coupon){
                res.json(false)
            }else{
                await Coupon.create(req.body)
                res.json({msg:"okk"})
            }

        }catch(err){
            console.log(err);
        }
        
    },
    getCouponedit:async(req,res)=>{
        try{
            console.log("okkkk",req.params.cid);
            const coupon= await Coupon.findOne({_id :req.params.cid})
            res.render('admin/editcoupon',{coupon})
        }catch(err){
            console.log(err);
        }

    },
    putEditcoupon:async (req,res)=>{
        try{
            await Coupon.updateOne({_id:req.body.id},{$set:req.body})
            res.json({msg:"successfully edited"})
        }catch(err){
            console.log(err);
        }
    },
    removeCoupon:async(req,res)=>{
        try{
             await Coupon.deleteOne({_id:req.params.couponid})  
             res.json({msg:"Coupon deleted success"})

        }catch(err){
            console.log(err);
        }
    },
    checkCoupon:async (req,res)=>{
        try{
            console.log('Okkkkkkkkkkkkkkkk',req.body.couponCode);
          let subtotel= req.session.subtotel
          let date=new Date()
        
         const coupon=await Coupon.findOne({couponCode:req.body.couponCode})
         const parsedExpiryDate = new Date(coupon?.expiryDate);
         
         if(coupon&&parsedExpiryDate>=date&&subtotel>=coupon?.minPurchaseAmount){
          
            req.session.subtotel=subtotel-coupon.discountAmount;
            req.session.couponDiscount=coupon.discountAmount;
            req.session.couponCode=coupon.couponCode;
            console.log("yaaaaaa", req.session.couponCode);
            res.json({coupondiscount:coupon.discountAmount,subtotel:req.session.subtotel,msg:"coupen applied succesfullh!!",status:true})
            
         }else{
            res.json({status:false,msg:"coupon not exist!!"})
         }
        }catch(err){
            console.log(err);
        }
    },
    getCoupons:async (req,res)=>{
        try{
            const coupons=await Coupon.find()
            res.render('user/coupons',{coupons})
        }catch(err){
            console.log(err);
        }
    }
   
}