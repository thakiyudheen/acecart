const User= require("../model/userModel");
const Product= require("../model/productModel");
const Address= require("../model/addressModel");
const Wallet= require("../model/walletModel");
const Wallethistory= require("../model/wallethistoryModel");
const Category= require("../model/categoryModel");
const Banner= require("../model/bannerModel");
const {sendEmail}=require('../auth/nodemailer')
const Otp = require("../model/otpModel");
const {getSignupOtp, generateOTP}=require('../util/generateotp')
const { hashData,verifyHashedData}=require('../util/bcrypt')
module.exports={
   getGustpage:async(req,res)=>{
      try{
          const banner= await Banner.find()
         
         const category=await Category.findOne({categoryname:"FLAGSHIP MOBILES"})
            if(category){
            const product=await Product.find({Category:category._id,status:"Active"})
           
            res.render('user/guesthome',{product,banner})
            }else{
               res.render('user/guesthome',{banner})
            }
           
        
      }catch(err){
         console.log(err)
      }
    
   },
   
   getHomepage:async(req,res)=>{
      try{
         const category=await Category.findOne({categoryname:"FLAGSHIP MOBILES"})
         
            const product=await Product.find({Category:category?._id,status:"Active"})
            const banner= await Banner.find()
        
        
         res.render('user/homepage',{user:req.session.user,product,banner})
      }catch(err){
         console.log(err)
      }
      
   },
   
   getProductpage: async (req, res) => {
      try {
        const pageSize = 6; // Set your desired page size
        const currentPage = parseInt(req.query.page) || 1;
    
        const [products, count, categories, brands] = await Promise.all([
          Product.find({ status: 'Active' })
            .skip((currentPage - 1) * pageSize)
            .limit(pageSize),
          Product.find({ status: 'Active' }).count(),
        
         Product.aggregate([
            {
              $lookup: {
                from: 'categories', // Use the actual name of your Category collection
                localField: 'Category',
                foreignField: '_id',
                as: 'categoryInfo'
              }
            },
            {
              $unwind: '$categoryInfo'
            },
            {
              $group: {
                _id: {
                  categoryId: '$categoryInfo._id',
                  categoryName: '$categoryInfo.categoryname'
                },
                count: { $sum: 1 }
              }
            }
          ]),
          
          
          Product.aggregate([{ $group: { _id: '$BrandName', count: { $sum: 1 } } }])
        ])
    
        const totalPages = Math.ceil(count / pageSize);
    
        res.render('user/productpage', {
          user: req.session.user,
          products,
          categories,
          brands,
          count,
          currentPage,
          totalPages
        });
      } catch (err) {
        console.log(err);
        // Handle errors appropriately, e.g., render an error page
        res.status(500).render('error', { error: 'Internal Server Error' });
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
         const{search}=req.body
         
         // Step 1: Find category IDs that match the search string
         const matchingCategories = await Category.find({ categoryname: { $regex:search, $options: "i" } }, '_id');
         console.log( matchingCategories)
         // Extract category IDs from the result
         const categoryIds = matchingCategories.map(category => category._id);
         console.log(categoryIds)
         // Step 2: Use category IDs in the main query
         const product = await Product.find({
         $or: [
            { ProductName: { $regex: search, $options: "i" } },
            { Category: { $in: categoryIds } }, // Use $in to match against an array of category IDs
            { BrandName: { $regex:search, $options: "i" } }
         ],
         status: "Active"
         });

         console.log("searched",product)

        
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
            
            
            res.json(true )
         }else{
            res.json(false)
            
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
         const [wallet]=await Promise.all([
            Wallet.findOne({userid:user._id}),
           



         ])
        const wallethistory=await  Wallethistory.findOne({ userid: user._id }).sort({ 'refund.date': -1 })
        console.log( wallethistory);
        // Assuming your array is named 'walletHistoryArray'
        const sortedArray =wallethistory?.refund.sort((a, b) => b.date - a.date);

         

         res.render('user/wallet',{wallet,wallethistory:sortedArray})
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