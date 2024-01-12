const User= require("../model/userModel");
const Product= require("../model/productModel");
const Address= require("../model/addressModel");
const Wallet= require("../model/walletModel");
const Wallethistory= require("../model/wallethistoryModel");
const {sendEmail}=require('../auth/nodemailer')
const Otp = require("../model/otpModel");
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
         const [products, count ,categories, brands] = await Promise.all([
            Product.find({ status: 'Active' }),
            Product.find({ status: 'Active' }).count(),
            Product.aggregate([{ $group: { _id: '$Category', count: { $sum: 1 } } }]),
            Product.aggregate([{ $group: { _id: '$BrandName', count: { $sum: 1 } } }])
          ]);
         res.render('user/productpage',{user:req.session.user,products,categories,brands,count})
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
        console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>",req.body)
      
         const user= await User.updateOne({email:req.session.email},{$set:req.body})
        res.locals.user=user.name;
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
   },

   // get forget password----------------------------------------
   getForgotpass:(req,res)=>{
      try{
        
         res.render('user/forgotpass')
      }catch(err){
         console.log(err)
      }
    } ,
    
   postForgotpass:async (req,res)=>{
      try {
         const user = await User.find({ email: req.body.email });
         console.log("ready", user);
       
         if (user.length > 0) {
           console.log("1st thissk", req.body.email);
           await sendEmail(req.body.email);
           res.render('user/setnewpass', { email: req.body.email });
         } else {
           res.render('user/forgotpass', { err: "Email does not exist" });
         }
       } catch (err) {
         console.log(err);
       }
       
   },
   
   // postOtpforgot:async (req,res)=>{
   //    try{
   //       console.log("......................................",req.body)
   //       if(req.body.email){
   //          const arr=[];
   //          const {num1,num2,num3,num4}=req.body
   //          arr.push(num1)
   //          arr.push(num2)
   //          arr.push(num3)
   //          arr.push(num4)
   //          const userotp=arr.join("").toString()
            
            
    
   //          const otp_=await Otp.findOne({email:req.body.email})
   //          console.log(otp_)
   //          if(otp_?.otp==userotp&&otp_!=null){
   //                 res.render('user/setnewpass',{email:req.body.email})
   //          }else{
   //              res.render('user/otpforgot',{err:"Incorrect OTP"})
   //          }
           
   //           res.render()
   //       }else{
   //          res.redirect('/login')
   //       }

       
   //    }catch(err){
   //       console.log(err);
   //    }
   // },
   putForgotpass:async (req,res)=>{
      try{
         const userotp=req.body.otp;
         const otp_=await Otp.findOne({email:req.body.email})
                  console.log(otp_)
                  if(otp_?.otp==userotp&&otp_!=null){
                     let user= await User.findOne({email:req.body.email})
                     const hashed= await hashData(req.body.newPassword)
                     user.password=hashed;
                     await user.save()
                     console.log("...........>>>>>>>>>>>>>>>>>>>>>>>>>>");

                     if(req.session.userlogged){
                        res.json({user:true,otp:true})
                       }else{
                        res.json({user:false,otp:true})
                       }
                  }else{
                      res.json({otp:false})
                  }
         
        
         
        
         
      }catch(err){
         console.log(err);
      }
   },
   resendOtpforgot:async (req,res)=>{
      console.log("okkkkkkkkkkkkkkkkkkkkkkk",req.params.email);
      try{
         await sendEmail(req.params.email)
         res.json(true)
         // res.render('user/otpforgot',{status:"OTP resend successfully",email:req.params.email })
      }catch(err){
         console.log(err);
      }
   },
   getWallet:async (req,res)=>{
      try{
         const user=await User.findOne({email:req.session.email})
         const [wallet,wallethistory]=await Promise.all([
            Wallet.findOne({userid:user._id}),
            Wallethistory.findOne({userid:user._id})

         ])
        
         res.render('user/wallet',{wallet,wallethistory})
      }catch(err){
         console.log(err);
      }
   } ,







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