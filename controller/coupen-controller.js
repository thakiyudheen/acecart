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
            req.body.couponCode=req.body.couponCode.toUpperCase()
            const coupon=await Coupon.findOne({couponCode:req.body.couponCode})
            if(coupon){
                res.json({status:false})
            }else{
                await Coupon.create(req.body)
                res.json({status:true})
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
        try {
            let { couponCode, oldCouponcode, description, minPurchaseAmount, discountAmount, startDate, expiryDate } = req.body;
            couponCode = couponCode.toUpperCase();
            oldCouponcode = oldCouponcode.toUpperCase();
            console.log(req.body,oldCouponcode,couponCode);
            const coupons = await Coupon.findOne({ couponCode: couponCode });
        
            if (coupons && couponCode!=oldCouponcode) {
            
            res.json({ status: false,oldCode:oldCouponcode});
            } else {
                await Coupon.updateOne(
                    { _id: req.body.id },
                    {
                        $set: {
                            couponCode: couponCode,
                            description: description,
                            minPurchaseAmount: minPurchaseAmount,
                            discountAmount: discountAmount,
                            startDate: startDate,
                            expiryDate: expiryDate,
                        },
                    }
                );
        
                res.json({ msg: "successfully edited", status: true });
            }
        } catch (err) {
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