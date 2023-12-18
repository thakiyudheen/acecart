const User= require("../model/userModel");
const otp = require("../model/otpModel");
const {sendEmail}=require('../auth/nodemailer')
const { generateOTP}=require('../util/generateotp')


var _email;
var _name;
var _status;
var _password;
var _otp;
module.exports={
    
    getSignupOtp:async(req,res)=>{
        try{
            res.render('user/signUp')
        }catch(err){
            console.log(err)
        }

    },
    postSignupOtp:async(req,res)=>{
        try{
            console.log(req.body)
            const { status, name, email, password} = req.body;
           let data= await User.findOne({email:email})
           if(data){
            console.log(data)
            res.render('user/signUp',{exists:'Email already exist'})
           }else{
         
           _status=status
           _name=name
           _email=email
           _password=password

        //    const nowotp=generateOTP()
        //    await otp.create({email:_email,otp:nowotp})
        //    console.log("otp:"+nowotp)
           sendEmail(email)
        //    setTimeout(async()=>{
        //     await otp.deleteOne({email:_email})
 
        //     },120000)

           res.redirect('/getSignup')
           }

            
        }catch(err){

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
        console.log("ok mam ",req.body)
        const arr=[];
        const {num1,num2,num3,num4}=req.body
        arr.push(num1)
        arr.push(num2)
        arr.push(num3)
        arr.push(num4)
        const userotp=arr.join("").toString()
        console.log(_otp)
        console.log(userotp)

        const otp_=await otp.findOne({email:_email})
        console.log(otp_)
        if(otp_?.otp==userotp&&otp_!=null){
            User.create({name:_name,email:_email,password:_password,status:_status}).then((data)=>{
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
        // await otp.deleteOne({email:_email})
        // const newotp=generateOTP()
        //   await otp.create({email:_email,otp:newotp})
        //   console.log("otp:"+newotp)
           sendEmail(_email)
           res.render('user/otp',{status:"OTP resend successfully" })
        //    setTimeout(async()=>{
        //    await otp.deleteOne({email:_email})

        //    },120000)
    },
    postLogin:async(req,res)=>{
       const {email,password}=req.body
      const data= await User.findOne({email:email})
      console.log(data)
     if(data&&data.status=='active'&&data.password===password){
        req.session.user=data.name;
        req.session.userlogged=true;
        console.log(data.name)
        res.redirect('/userhome')
     }else{
        res.render("user/login",{err:"Incorrect password or email"})
     }
    }

}