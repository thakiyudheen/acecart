
const express=require('express')
const router= express.Router()
const login=require('../middleware/session')
const userhelper= require('../controller/controller')
const usercontroller=require('../controller/usercontroller')
const cartcontroller=require('../controller/cart-controller')
const addressController = require('../controller/address-controller')
const orderController = require('../controller/order-controller')
const wishlistController = require('../controller/wishlist-controller')
const filterController = require('../controller/filter-controller')
const couponController = require('../controller/coupen-controller')
const cartCount = require("../middleware/cartcount");




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
router.get('/userhome',login.verifyUser,cartCount,usercontroller.getHomepage)
// get user profile --------------------------------------------
router.get('/userprofile',login.verifyUser,usercontroller.getuserProfile)
// edit user---------------------------------------------------
router.put('/edituser',usercontroller.editUser)
// delete address----------------------------------------------
router.get('/deleteaddress/:id',addressController.deleteAddress)




// reset password----------------------------------------------
router.get('/resetpassword',login.verifyUser,usercontroller.getresetPassword)
// reset password post ----------------------------------------
router.put('/resetpassword',login.verifyUser,usercontroller.postresetPassword)



// forgot password----------------------------------------------
router.get('/forgotpass',usercontroller.getForgotpass)
// get otp forget and also check email exist or not ------------
router.post('/forgotpass',usercontroller.postForgotpass)
// resend otp --------------------------------------------------
router.get('/resendotpforgot/:email',usercontroller.resendOtpforgot)
// put forgot password------------------------------------------
router.put('/putforgotpassword',usercontroller.putForgotpass)


// product page--------------------------------------------------
router.get('/userhome/products',login.verifyUsernav,usercontroller.getProductpage)
// product details---------------------------------------------------
router.get('/userhome/products/productdetails/:id/',login.verifyUsernav,usercontroller.getProductDetails)
// get branded product ------------------------------------------
router.get('/userhome/brandpage/:brandname',login.verifyUsernav,usercontroller.getBrandpage)
// search product ------------------------------------------------------
router.post('/search',usercontroller.postSearch )


// cart listing--------------------------------------------------------
router.get("/cart",login.verifyUsernav,cartcontroller.getCart)
// add to cart --------------------------------------------------------
router.get('/addTocart/:id',login.verifyUser,cartcontroller.addTocart)
// Update count -------------------------------------------------------
router.get('/updatecart/:proid/:no/:qty/:cartid',cartcontroller.updateCart)
// remove from cart---------------------------------------------------
router.get('/removecart/:cartid/:proid',login.verifyUser,cartcontroller.removeCart)


// get wish list------------------------------------------------------
router.get('/wishlist',login.verifyUsernav,wishlistController.getWishlist)
// add to wishlist ---------------------------------------------------
router.get('/addtowishlist/:proid',wishlistController.addTowishlist)
// remove wishlist----------------------------------------------------
router.get('/removewishlist/:proid/:wishid',wishlistController.removeWishlist)


// coupen check------------------------------------------------------
router.post('/checkcoupon',couponController.checkCoupon )
// end 



// filetr 
router.post('/filter',filterController.getfilter)

// place order---------------------------------------------------------
router.get('/placeOrder',login.verifyUser,addressController.getCheckout)
// add address --------------------------------------------------------
router.post('/addaddress',login.verifyUser,addressController.addAddress)
// add address from user profiel --------------------------------------
router.post('/addaddressprofile',login.verifyUser,addressController.addAddressProfile)
// edit address on profile get ----------------------------------------
router.get('/editaddress/:id',login.verifyUser,addressController.editAddress)
// edit address post method--------------------------------------------
router.post('/editaddress',addressController.posteditAddress)
// when the user click the confirm order-------------------------------
router.post('/confirmAddress',login.verifyUser,orderController.confirmAddress)
// cash on delivery----------------------------------------------------
router.get('/cashondelivery',login.verifyUser,orderController.cashOndelivery)
// order list ---------------------------------------------------------
router.get('/orderlist',login.verifyUser,orderController.OrderList)
// get order details --------------------------------------------------
router.get('/orderdetails/:orderid',login.verifyUser,orderController.OrderDetails)
// cancel order -------------------------------------------------------
router.get('/cancelorder/:orderid/:status',orderController.cancelOrder)
// order succcessfully! -----------------------------------------------
router.get('/ordersuccess',login.verifyUser,orderController.getorderSuccess)


// logout user --------------------------------------------------
router.get('/logoutuser',usercontroller.logOut)



module.exports=router