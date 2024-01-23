const User= require("../model/userModel");
const otp = require("../model/otpModel");
const Wallet = require("../model/walletModel");
const Wallethistory = require("../model/wallethistoryModel");
const {sendEmail}=require('../auth/nodemailer')
const { generateOTP}=require('../util/generateotp')
const { hashData,verifyHashedData}=require('../util/bcrypt')



module.exports={
    
    getSignupOtp:async(req,res)=>{
        try{
            const refferal=req.query.reff;
            console.log("this is reffffffffffffffff",refferal);
            if(refferal){
                res.render('user/signUp',{refferal})
            }else{
                 res.render('user/signUp',{refferal:""})
            }
           
        }catch(err){
            console.log(err)
        }

    },
    postSignupOtp:async(req,res)=>{
        try{
            console.log(req.body)

            const { status, name, email, password,refferal} = req.body;
           let data= await User.findOne({email:email})
           if(data){
            
            res.render('user/signUp',{exists:'Email already exist'})
           }else{

            const hashedpass= await hashData(password)
            console.log(hashedpass)
            req.session.userdata={
                status:status,
                name:name,
                email:email,
                password:hashedpass,
                refferal:refferal
            }
           
         console.log("okk session",req.session.userdata); 
      
           sendEmail(email)
        
 
        

           res.redirect('/getSignup')
           }

            
        }catch(err){
            console.log(err)
        }
    },
    getSignup:(req,res)=>{
        console.log("redy")
        try{
            
            res.render('user/otp')

        }catch(err){
            console.log(err);
        }
    },
    postSignup:async (req,res)=>{
        
        const arr=[];
        const {num1,num2,num3,num4}=req.body
        arr.push(num1)
        arr.push(num2)
        arr.push(num3)
        arr.push(num4)
        const userotp=arr.join("").toString()
        
        console.log(userotp)
        
        const otp_=await otp.findOne({email:req.session.userdata?.email})
        console.log(otp_)
        if(otp_?.otp==userotp&&otp_!=null){
         const refferal=req.session.userdata.refferal   
       
          
            User.create(req.session.userdata).then(async(data)=>{
                
                await Wallet.create({
                    userid:data._id,
                    wallet:0
                    })   

             if(refferal!=""){
            //    wallet check and add amount in wallet ----------------------------------------
            const wallet= await Wallet.findOne({userid:refferal})
            if(wallet){
                await Wallet.updateOne({userid:refferal},{$inc:{wallet:100}})
            }else{
                await Wallet.create({
                    userid:refferal,
                    wallet:100
                    })
            }
            //  end-----------------------------------------------------------------------------
            const wallethistory = await Wallethistory.findOne({ userid:refferal});
            if (wallethistory) {
            let amount = 100;
            const reason = "Added refferal amount";
            const type = "credit";
            const date = new Date();
            await Wallethistory.updateOne(
            { userid: refferal },
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
            let amount = 100;
            const reason ="Added refferal amount";
            const type = "credit";
            const date = new Date();
            await Wallethistory.create({
            userid:refferal,
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
          

                res.render('user/login',{msg:"signUp successfully..!"});
            })
        }else{
            res.render('user/otp',{err:"Incorrect OTP"})
        }
       
    },
    getLogin:(req,res)=>{
        res.render('user/login')
    },
    resendOtp:async (req,res)=>{
     
           sendEmail(req.session.userdata.email)
           res.render('user/otp',{status:"OTP resend successfully" })
      
    },
    postLogin:async(req,res)=>{
       const {email,password}=req.body
      const data= await User.findOne({email:email})
      console.log(data)
      
     
     if(data&&data.status=='active'){
        let ifmatch= await verifyHashedData(password,data.password)
        if(ifmatch){
            req.session.user=data.name;
            req.session.userlogged=true;
            req.session.email=data.email;
            console.log(data.name)
            res.redirect('/userhome')
        }else{
            res.render("user/login",{err:"Incorrect password or email"})
        }
       
     }else{
        res.render("user/login",{err:"Incorrect password or email"})
     }
    }

}