const User= require("../model/userModel");
const Address= require("../model/addressModel");
const Product= require("../model/productModel");
const Cart= require("../model/cartModel");
const Order= require("../model/orderModel");
const mongoose = require('mongoose');



module.exports={
    getCheckout:async(req,res)=>{
        try{
        const user=await User.findOne({email:req.session.email})
        
        const address=await Address.find({userId:user._id})
        console.log(req.session.couponCode);
        if(address){
            console.log(address)
            res.render('user/checkout',{
                address,
                subtotelbefore: req.session.subtotelbefore,
                subtotel:req.session.subtotel,
                coupondiscount:req.session.couponDiscount,
                couponCode:req.session.couponCode
            })
        }

           
        }catch(err){
            console.log(err);
        }
    },
    addAddress:async (req,res)=>{
        try{
            console.log(req.session.email);
             const user=await User.findOne({email:req.session.email})
             if(user){
                req.body.userId=user._id
                const adress=req.body;
                await Address.create(adress)
                res.redirect('/placeOrder')
             }
            
        }catch(err){
            console.log(err);
        }
    },
    
    deleteAddress:async(req,res)=>{
        try{
            await Address.deleteOne({_id:req.params.id})
            res.json({msg:"suucessfully deleted"})
        }catch(err){
            console.log(err);
        }
    },
    addAddressProfile:async (req,res)=>{
        try{
            console.log(req.session.email);
             const user=await User.findOne({email:req.session.email})
             if(user){
                req.body.userId=user._id
                const adress=req.body;
                await Address.create(adress)
                res.redirect('/userprofile')
             }
            
        }catch(err){
            console.log(err);
        }
    },
    editAddress:async (req,res)=>{
        try{
            const address=await Address.findOne({_id:req.params.id})
            res.render('user/editaddress',{address})
        }catch(err){
            console.log(err);
        }
    },
    posteditAddress:async (req,res)=>{
        try{
            await Address.updateOne({_id:req.body._id},{$set:req.body},{upsert:true})
            res.redirect('/userprofile')
        }catch(err){
            console.log(err);
        }
    }
}