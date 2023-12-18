const User= require("../model/userModel");
const Product= require("../model/productModel");
const {sendEmail}=require('../auth/nodemailer')
const {getSignupOtp, generateOTP}=require('../util/generateotp')
module.exports={
   getGustpage:async(req,res)=>{
      try{
         const product=await Product.find({Category:"FLAGSHIP MOBILES",status:"Active"})
        
         res.render('user/guesthome',{product})
      }catch(err){
         console.log(err)
      }
    
   },
   
   getHomepage:(req,res)=>{
      try{
         res.render('user/homepage',{user:req.session.user})
      }catch(err){
         console.log(err)
      }
      
   },
   getProductpage:async(req,res)=>{
      try{
         const product=await Product.find({status:"Active"})
         console.log(product)
         res.render('user/producthome',{user:req.session.user,product})
      }catch(err){
         console.log(err)
      }
     
   },
   getProductDetails:async (req,res)=>{
      try{
         const product=await Product.findOne({_id:req.params.id})
         res.render('user/productdetails',{product})
      }catch(err){
         console.log(err)
      }
     
   },
   getBrandpage:async(req,res)=>{
      try{
         const product=await Product.find({BrandName:req.params.brandname,status:'Active'})
         if(product){
            res.render('user/producthome',{user:req.session.user,product})
         }
      }catch(err){
         console.log(err)
      }
      

   }








   ,
   // logout user --------------------------------------------------
   logOut:(req,res)=>{
      req.session.destroy(function(err){
         if(err){
         console.log(err)
         res.send("Error")
         }else{
             res.redirect("/")
         }
     })

   }
}