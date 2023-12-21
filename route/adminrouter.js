const express=require('express')
const router= express.Router()
const login=require('../middleware/session')
const adminhelper= require('../controller/admin-controller')
const producthelper= require('../controller/product-controller')
const upload = require("../middleware/multer");
const usercontroller = require('../controller/usercontroller')

// admin login ------------------------------------------------------
router.get('/',login.adminExist,adminhelper.getlogin)
router.post('/login',adminhelper.postLogin)
// get the customers page------------------------------------------------
router.get('/customers',login.verifyAdmin,adminhelper.getcustomers)
//admin change status--------------------------------------------------------
router.get('/customers/block/:id/:stat',login.verifyAdmin,adminhelper.updateStatus)



// get the catogary-----------------------------------------------------
router.get('/category',login.verifyAdmin,adminhelper.getCatogary)
// add category -----------------------------------------------------
router.get('/addcategory',login.verifyAdmin,adminhelper.getaddCategory)
router.post('/addcategory',login.verifyAdmin,adminhelper.postaddCategory)

// delete edit category----------------------------------------------------
router.get('/deletecategory/:id',adminhelper.deleteCategory)
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



// logout admin ---------------------------------------------------------
router.get('/logout',adminhelper.logOut)



module.exports=router