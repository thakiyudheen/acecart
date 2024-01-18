const express=require('express')
const router= express.Router()
const login=require('../middleware/session')
const adminhelper= require('../controller/admin-controller')
const producthelper= require('../controller/product-controller')
const upload = require("../middleware/multer");
const usercontroller = require('../controller/usercontroller')
const orderController = require('../controller/order-controller')
const brandController = require('../controller/brand-controller')
const coupenController = require('../controller/coupen-controller')
const offerController = require('../controller/offer-controller')




// admin login ------------------------------------------------------
router.get('/',login.adminExist,adminhelper.getlogin)
router.post('/login',adminhelper.postLogin)
// get admin dash bord-----------------------------------------------
router.get('/dashbord',login.verifyAdmin,adminhelper.getDashbord)
// get the customers page------------------------------------------------
router.get('/customers',login.verifyAdmin,adminhelper.getcustomers)
//admin change status--------------------------------------------------------
router.get('/customers/block/:id/:stat',login.verifyAdmin,adminhelper.updateStatus)


// get Brand ---------------------------------------------------------
router.get('/getBrand',login.verifyAdmin,brandController.getBrand)
// get add brand -----------------------------------------------------
router.get('/addbrand',login.verifyAdmin,brandController.getAddbrand)
// post addbrand -----------------------------------------------------
router.post('/addbrand',login.verifyAdmin,brandController.postAddbrand)
// edit brand get-----------------------------------------------------
router.get('/editbrand/:id',login.verifyAdmin,brandController.geteditBrand)
// post  edit brand --------------------------------------------------
router.post('/editbrand',login.verifyAdmin,brandController.posteditBrand)
// deleet brand-------------------------------------------------------
router.get('/deletebrand/:id/:brand',brandController.deleteBrand)


// get the catogary-----------------------------------------------------
router.get('/category',login.verifyAdmin,adminhelper.getCatogary)
// add category -----------------------------------------------------
router.get('/addcategory',login.verifyAdmin,adminhelper.getaddCategory)
router.post('/addcategory',login.verifyAdmin,adminhelper.postaddCategory)

// delete edit category----------------------------------------------------
router.get('/deletecategory/:id/:category',adminhelper.deleteCategory)
router.get('/editcategory/:id',login.verifyAdmin,adminhelper.editCategory)
router.post('/editcategory',login.verifyAdmin,adminhelper.postCategory)


const uploadFields = [
    { name: "image1", maxCount: 1 },
    { name: "image2", maxCount: 1 },
    { name: "image3", maxCount: 1 },
    { name: "image4", maxCount: 1 },
  ];


// product management-----------------------------------------------------
router.get('/products',login.verifyAdmin,producthelper.getProducts)

// addproducts ----------------------------------------------------------
router.get('/addproducts',login.verifyAdmin,producthelper.getaddProducts)
router.post('/addproduct', upload.fields(uploadFields),producthelper.addProducts)

// block unblock product -------------------------------------------------
router.get('/products/block/:id/:status',login.verifyAdmin,producthelper.blockProducts)
// delete product -------------------------------------------------------------
router.get('/deleteproduct/:id',producthelper.deleteProduct)
// edit product --------------------------------------------------------
router.get('/editproduct/:id',login.verifyAdmin,producthelper.geteditProducts)
router.post('/editproduct/:id',upload.any(),producthelper.editProducts)
router.get('/editproduct/deleteimg/:imgname/:id',producthelper.DltImage)


// order listing -------------------------------------------------------
router.get('/getOrder',login.verifyAdmin,orderController.getOrder)
// upadate order status ------------------------------------------------
router.get('/updatestatus/:orderid/:status',orderController.updateOrderstatus)
// order details--------------------------------------------------------
router.get('/orderView/:orderid',login.verifyAdmin,orderController.getOrderdetails)
// reject order and reason  --------------------------------------------
router.post('/rejectorder',orderController.rejectOrder)


// get return order details---------------------------------------------
router.get('/viewReturn/:orderid',login.verifyAdmin,orderController.getReturnorder)
// accept or reject return ---------------------------------------------
router.get('/returnrequest/:orderid/:returnid/:type',orderController.returnRequest)


// get  coupen----------------------------------------------------------
router.get('/getCoupon',login.verifyAdmin,coupenController.getCoupen)
// add coupen ----------------------------------------------------------
router.post('/addcoupon',coupenController.postAddcoupon)
// get edit coupon------------------------------------------------------
router.get('/editcoupon/:cid',login.verifyAdmin,coupenController.getCouponedit)
// put edit the coupon--------------------------------------------------
router.put('/editcoupon',coupenController.putEditcoupon)
// delete coupon -------------------------------------------------------
router.get('/removecoupon/:couponid',coupenController.removeCoupon)



// get order by date for show graph -----------------------------------
router.get('/count-orders-by-day',adminhelper.getCount)
router.get('/count-orders-by-month',adminhelper.getCount)
router.get('/count-orders-by-year',adminhelper.getCount)
// end------------------------------------------------------------------


// download sales report -----------------------------------------------
router.post("/download-sale-report",adminhelper.generatesalesReport)




// get offer -----------------------------------------------------------
router.get('/offer',login.verifyAdmin,offerController.getOffer)
// post offer when add offer--------------------------------------------
router.post('/postoffer',offerController.postaddOffer)
// put edit offer-------------------------------------------------------
router.put('/puteditoffer',offerController.puteditOffer)
// delete offer---------------------------------------------------------
router.get('/deleteoffer/:offerid',offerController.deleteOffer)







// logout admin ---------------------------------------------------------
router.get('/logout',adminhelper.logOut)



module.exports=router