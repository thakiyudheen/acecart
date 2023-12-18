
const express=require('express')
const router= express.Router()
const login=require('../middleware/session')
const userhelper= require('../controller/controller')
const usercontroller=require('../controller/usercontroller')





// login page----------------------------------------------
router.get('/login',login.userExist,userhelper.getLogin)
router.post('/login',userhelper.postLogin)
// send otp
router.get('/send-otp',login.userExist,userhelper.getSignupOtp)
router.post('/send-otp',userhelper.postSignupOtp)
router.get('/resendOtp',userhelper.resendOtp)
// signUp user
router.get("/getSignup", login.userExist,userhelper.getSignup);
router.post('/signup',userhelper.postSignup)



// guet page ---------------------------------------------------
router.get('/',login.userExist,usercontroller.getGustpage)
// home page----------------------------------------------------
router.get('/userhome',login.verifyUser,usercontroller.getHomepage)



// product page--------------------------------------------------
router.get('/userhome/products',usercontroller.getProductpage)
// product details---------------------------------------------------
router.get('/userhome/products/productdetails/:id/',usercontroller.getProductDetails)
// get branded product ------------------------------------------
router.get('/userhome/brandpage/:brandname',login.verifyUser,usercontroller.getBrandpage)



// logout user --------------------------------------------------
router.get('/logoutuser',usercontroller.logOut)



module.exports=router