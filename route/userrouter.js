
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
router.get('/userprofile',login.verifyUser,cartCount,usercontroller.getuserProfile)
// edit user---------------------------------------------------
router.put('/edituser',usercontroller.editUser)
// delete address----------------------------------------------
router.get('/deleteaddress/:id',addressController.deleteAddress)
// get address page
router.get('/address',login.verifyUser,addressController.getAddress)



// reset password----------------------------------------------
router.get('/resetpassword',login.verifyUser,cartCount,usercontroller.getresetPassword)
// reset password post ----------------------------------------
router.put('/resetpassword',login.verifyUser,cartCount,usercontroller.postresetPassword)



// forgot password----------------------------------------------
router.get('/forgotpass',usercontroller.getForgotpass)
// get otp forget and also check email exist or not ------------
router.post('/forgotpass',usercontroller.postForgotpass)
// resend otp --------------------------------------------------
router.get('/resendotpforgot/:email',usercontroller.resendOtpforgot)
// put forgot password------------------------------------------
router.put('/putforgotpassword',usercontroller.putForgotpass)


// product page--------------------------------------------------
router.get('/userhome/products',login.verifyUsernav,cartCount,usercontroller.getProductpage)
// product details---------------------------------------------------
router.get('/userhome/products/productdetails/:id/',login.verifyUsernav,usercontroller.getProductDetails)
// get branded product ------------------------------------------
router.get('/userhome/brandpage/:brandname',login.verifyUsernav,cartCount,usercontroller.getBrandpage)
// search product ------------------------------------------------------
router.post('/search',usercontroller.postSearch )


// cart listing--------------------------------------------------------
router.get("/cart",login.verifyUsernav,cartCount,cartcontroller.getCart)
// add to cart --------------------------------------------------------
router.get('/addTocart/:id',login.verifyUser,cartcontroller.addTocart)
// Update count -------------------------------------------------------
router.get('/updatecart/:proid/:no/:qty/:cartid',cartcontroller.updateCart)
// remove from cart---------------------------------------------------
router.get('/removecart/:cartid/:proid',login.verifyUser,cartcontroller.removeCart)


// get wish list------------------------------------------------------
router.get('/wishlist',login.verifyUsernav,cartCount,wishlistController.getWishlist)
// add to wishlist ---------------------------------------------------
router.get('/addtowishlist/:proid',wishlistController.addTowishlist)
// remove wishlist----------------------------------------------------
router.get('/removewishlist/:proid/:wishid',wishlistController.removeWishlist)


// coupen check------------------------------------------------------
router.post('/checkcoupon',couponController.checkCoupon )
// add coupon -------------------------------------------------------
router.get('/coupons',login.verifyUser,couponController.getCoupons)
// get  wallet
router.get('/getwallet',login.verifyUser,usercontroller.getWallet)


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
router.get('/orderlist',login.verifyUser,cartCount,orderController.OrderList)
// get order details --------------------------------------------------
router.get('/orderdetails/:orderid',login.verifyUser,orderController.OrderDetails)
// cancel order -------------------------------------------------------
router.get('/cancelorder/:orderid/:status',orderController.cancelOrder)
// order succcessfully! -----------------------------------------------
router.get('/ordersuccess',orderController.getorderSuccess)

// verify online payment-----------------------------------------------
router.post('/verifyPayment',login.verifyUser,orderController.verifyPayment)

// return order--------------------------------------------------------
router.post('/returnorder',orderController.postreturnOrder)
// cancel item single product -----------------------------------------
router.get("/singleCancel/:orderid/:proid",orderController.cancelSingleitem)


// generate invoice ---------------------------------------------------
router.get('/downloadinvoice/:orderid',orderController.genarateInvoice)
// download pdf ------------------------------------------------------
router.get('/downloadinvoice1/:orderid',orderController.downloadInvoice)



// logout user --------------------------------------------------
router.get('/logoutuser',usercontroller.logOut)



module.exports=router