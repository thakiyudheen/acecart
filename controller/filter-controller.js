const ADMIN= require('../model/adminModel');
const User= require("../model/userModel");
const Category= require("../model/categoryModel");
const Product = require("../model/productModel");
const Brand = require("../model/brandModel");

module.exports={
    getfilter:async(req,res)=>{
        try{
           console.log(req.body);
              // Initial query object
                const query = { status: "Active" };

                // Add Category to the query if it is not an empty string
                if (req.body.Category!=undefined) {
                    query.Category = { $in: req.body.Category };
                }

                // Add BrandName to the query if it is not an empty string
                if (req.body.BrandName!=undefined) {
                    query.BrandName = { $in: req.body.BrandName };
                }

                // Add Price to the query if min and max are provided
                if (req.body.min!=''&& req.body.max!='') {
                    query.DiscountAmount = { $gt: req.body.min, $lt: req.body.max };
                }

                

            // const  products= await Product.find({Category:{$in:req.body.Category},BrandName:{$in:req.body.BrandName},Price:{$gt:req.body.min,$lt:req.body.max},status:"Active"})
            const [ categories, brands,products,count] = await Promise.all([
                Product.aggregate([{ $group: { _id: '$Category', count: { $sum: 1 } } }]),
                Product.aggregate([{ $group: { _id: '$BrandName', count: { $sum: 1 } } }]),
                Product.find(query),
                Product.find(query).count()



              ]);
            console.log(products)
            console.log(query);
              res.json({products,count})
            // res.render('user/productpage',{user:req.session.user,products,categories,brands,count})
           

        }catch(err){
            console.log(err)
        }
    }
}