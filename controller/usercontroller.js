const User= require("../model/userModel");
const Product= require("../model/productModel");
const Address= require("../model/addressModel");
const {sendEmail}=require('../auth/nodemailer')
const {getSignupOtp, generateOTP}=require('../util/generateotp')
const { hashData,verifyHashedData}=require('../util/bcrypt')
module.exports={
   getGustpage:async(req,res)=>{
      try{
         const product=await Product.find({Category:"FLAGSHIP MOBILES",status:"Active"})
        
         res.render('user/guesthome',{product})
      }catch(err){
         console.log(err)
      }
    
   },
   
   getHomepage:async(req,res)=>{
      try{
         const product=await Product.find({Category:"FLAGSHIP MOBILES",status:"Active"})
         res.render('user/homepage',{user:req.session.user,product})
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
      

   },
   // searching  ----------------------------------------------
   postSearch:async (req,res)=>{
      try{
         console.log(req.body)
         const product=await Product.find({
            ProductName:{ $regex: "^" + req.body.search, $options: "i"},status:"Active"
         })
         res.render('user/producthome',{product,user:req.session.user})
      }catch(err){
         console.log(err);
      }

   }
   ,
    getuserProfile:async (req,res)=>{
      try{
         const user1=await User.findOne({email:req.session.email})
         const addresses=await Address.find({userId:user1._id})
        res.render('user/userprofile',{user1,addresses,user:req.session.user})
      }catch(err){
        console.log(err);
      }
    },
    editUser:async (req,res)=>{
      try{
        console.log(req.body)
      
        await User.updateOne({email:req.session.email},{$set:req.body})
        
        res.json({msg:"changed successfully"})
      }catch(err){
         console.log(err);
      }
    },
    getresetPassword:(req,res)=>{
      try{
         res.render('user/resetpassword')
      }catch(err){
         console.log(err);
      }
    },
    postresetPassword:async(req,res)=>{
      try{
         const user=await User.findOne({email:req.session.email})
         const success=await verifyHashedData(req.body.oldPassword,user.password)
         if(success){
           
            const hashed= await hashData(req.body.newPassword)
            user.password=hashed;
            await user.save()
            console.log(hashed)
            
            // res.redirect('/userprofile')
            res.json(true )
         }else{
            res.json(false)
            // res.render('user/resetpassword',{err:"old password is incorrect!!"})
         }
      }catch(err){
         console.log(err);
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