const User= require("../model/userModel");
const Product= require("../model/productModel");
const Cart= require("../model/cartModel");
const {sendEmail}=require('../auth/nodemailer')
const {getSignupOtp, generateOTP}=require('../util/generateotp')
const mongoose = require('mongoose');




module.exports={
    getCart:(req,res)=>{
        try {


         User.findOne({email:req.session.email}).then(async(user)=>{
            if(user){
       
        const products = await Cart.aggregate([
            {
                $match: {
                    userid: user._id
                }
            },
            {
                $unwind: '$products'
            },
            {
                $lookup: {
                    from: 'products',
                    localField: 'products.productid',
                    foreignField: '_id',
                    as: 'product'
                }
        
             },
            {
                $project: {
                    productid: '$products.productid',
                    quantity: '$products.quantity',
                    product: { $arrayElemAt: ['$product', 0] }
                }
            }
        ]);

            // find the document sub totel ---------------------------
            let subtotel=0;
            let totelqty=0;
            let toteldiscount=0;
            let  totelprice=0;
            if(products!=null){
                products.forEach((ele)=>{
                  totelprice+=ele.product.Price*ele.quantity
                  subtotel+= ele.product.DiscountAmount*ele.quantity
                  toteldiscount=totelprice-subtotel
                  totelqty+= ele.quantity

                })

                
            }
            //   data store in session -------------------------------
                req.session.subtotel=subtotel
                req.session.subtotelbefore=subtotel
                req.session.totelprice= totelprice;
                req.session.couponDiscount=0;
                req.session.couponCode='';
              console.log(products)
               res.render('user/cart',{products,user:req.session.user,subtotel,totelqty,toteldiscount,totelprice})
            }
         })
        
        }catch(err){
            console.log(err);
        }
    },
    addTocart:async (req,res)=>{
        console.log("okk aan mone")
        console.log(req.session.email)

        try {
            const productId = req.params.id;
        
            // Step 1: Check product availability
            const product = await Product.findOne({ _id: productId });
        
            if (product && product.AvailableQuantity >= 1) { // Assuming you want to add only 1 quantity to the cart
        
                // Step 2: Check if the user is logged in
                const user = await User.findOne({ email: req.session.email });
        
                if (user) {
                    // Step 3: Check if the user has a cart
                    const cart = await Cart.findOne({ userid: user._id });
        
                    if (cart) {
                        // Step 4: Check if the product is already in the cart
                        const carts =await Cart.findOne({userid:user._id})
                        const existingProduct = carts.products.find(item => item.productid.toString() === productId);
                        console.log(">>>>>>>be",existingProduct, product.AvailableQuantity);
        
                        if (existingProduct) {
                            // If product is already in the cart, compare the quantities
                            if (existingProduct.quantity < product.AvailableQuantity&&existingProduct.quantity<5) {
                                // 
                                // Increase the quantity in the cart
                                await Cart.updateOne(
                                    { userid: user._id, 'products.productid': productId },
                                    { $inc: { 'products.$.quantity': 1 } }
                                );
                                res.json({ msg: true ,user:true});
                            } else {
                                res.json({ msg: false, error: "Quantity exceeds available quantity",user:true });
                            }
                        } else {
                            // If product is not in the cart, add it
                            await Cart.updateOne(
                                { userid: user._id },
                                {
                                    $push: {
                                        products: {
                                            productid: productId,
                                            quantity: 1
                                        }
                                    }
                                }
                            );
                            res.json({ msg: true ,user:true});
                        }
                    } else {
                        // If user does not have a cart, create a new one
                        const cartData = {
                            userid: user._id,
                            products: [{ productid: productId, quantity: 1 }]
                        };
                        await Cart.create(cartData);
                        res.json({ msg: true,user:true });
                    }
                } else {
                    res.json({ msg: false,user:false});
                }
            } else {
                res.json({ msg: false, error: "Product not available or quantity exceeds available quantity" });
            }
        } catch (err) {
            console.log(err);
            res.status(500).json({ msg: false, error: "Internal server error" });
        }
         
        
    },
    updateCart:async(req,res)=>{
        try{
        
            
                console.log("logesh h",req.params.proid,req.params.no,req.params.qty,req.params.cartid)
                const productId = req.params.proid.trim();
                const product = await Product.findOne({ _id:productId});
                const user = await User.findOne({ email: req.session.email });
                const cart = await Cart.findOne({ userid: user._id });
                const existingProduct = cart.products.find(item => item.productid.toString() === productId);
                 if( existingProduct.quantity < product.AvailableQuantity||req.params.no==-1){
                    console.log("yaa ready ");
                    if(existingProduct.quantity==5 && req.params.no==1){
                        res.json({ msg: "Maximum purchase quantity exceeded (5 products allowed)." ,status:false});
                    }else{
                        await Cart.updateOne(
                            { _id: req.params.cartid, 'products.productid': req.params.proid.trim() },
                            { $inc: { 'products.$.quantity': req.params.no } }
                        );
                       
                   

                        const updatedCart = await Cart.findOne({ _id: req.params.cartid }).select('products');
                    
                        console.log('yes here reached');
                        
                        // Find the updated product
                        const product = updatedCart.products.find(p =>{ 
                            console.log('asdfa',p.productid.toString(),req.params.proid.toString(),p.productid.toString().trim()==req.params.proid.trim().toString());
                            
                            return p.productid.toString().trim() === req.params.proid.toString().trim()});
                        
                        console.log('this is cart-------------------------------',product)

                         // Find the user's cart and populate the products
                        const cart = await Cart.findOne({ userid: user._id }).populate('products.productid');

                        let subtotel = 0;
                        let totelqty = 0;
                        let toteldiscount = 0;
                        let totelprice = 0;

                        if (cart && cart.products.length > 0) {
                            cart.products.forEach((ele) => {
                                totelprice += ele.productid.Price * ele.quantity;
                                subtotel += ele.productid.DiscountAmount * ele.quantity;
                                toteldiscount = totelprice - subtotel;
                                totelqty += ele.quantity;
                            });
                        }

                        // Store data in session
                        req.session.subtotel = subtotel;
                        req.session.subtotelbefore = subtotel;
                        req.session.totelprice = totelprice;
                        req.session.couponDiscount = 0;
                        req.session.couponCode = '';

                        
                        // Respond with the updated quantity
                        res.json({ status: true, updatedQuantity: product.quantity ,subtotel,totelqty,toteldiscount,totelprice});
                
                    }

                 }else{
                     res.json({msg:'Quantity exceeds available quantity',status:false});
                 }


           
           
           
            } catch (err) {
                console.log(err);
                res.status(500).json({ msg: "error", error: "Internal server error" });
            }
            

      

    },
    removeCart:async (req,res)=>{
        try{
            await Cart.updateOne({
                _id:req.params.cartid
            },
            {
                $pull:
                {
                    products:
                    {
                        productid: req.params.proid.trim()
                    }
                }
            })
            res.json({msg:true})
        }catch(err){
            console.log(err);
        }
        
    }
}