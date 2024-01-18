const Offer =require ("../model/offerModel");
const Category= require("../model/categoryModel");
const Product = require("../model/productModel");
const moment = require('moment');

module.exports={
    getOffer:async(req,res)=>{
        try{
            const offer =await Offer.find()
            const category=await  Category.find()
            res.render('admin/offer',{offer,category})
        }catch(err){
            console.log(err);
        }
    },
    postaddOffer:async (req,res)=>{
        try{
            
            const offer=await Offer.findOne({Category:req.body.Category})
            console.log(offer)
            if(offer){
                res.json({status:false})
            }else{
               
               
                const offers=await Offer.create(req.body)
                console.log("okk",offers);
                const products = await Product.find({ Category: offers.Category });

                for (const ele of products) {
                    const product = await Product.findOne({ _id: ele._id });
                    const categoryOffer = Math.floor((ele.DiscountAmount * offers.discount) / 100);

                    product.Categoryoffer = categoryOffer;
                    product.DiscountAmount = ele.DiscountAmount - categoryOffer;

                    await product.save();
                }

                res.json({status:true})
            }

           
            
        }catch(err){
            console.log(err);
        }
    },
    puteditOffer :async (req, res) => {
        try {
            console.log("Request Body:", req.body);
    
            const existingOffer = await Offer.findOne({ Category: req.body.Category });
    
            if (existingOffer && req.body.oldCategory !== req.body.Category) {
                res.json({ status: false, message: "Category already exists." });
            } else {
                const { Category, expiryDate, oldCategory, discount } = req.body;
    
                // Update the offer
                const updatedOffer = await Offer.findByIdAndUpdate(
                    req.body._id,
                    { Category, expiryDate, discount },
                    { new: true }
                );
    
                // Reset the discount amounts for products in the old category
                const productsInOldCategory = await Product.find({ Category: oldCategory });
                for (const ele of productsInOldCategory) {
                    const product = await Product.findByIdAndUpdate(
                        ele._id,
                        { $set: { Categoryoffer: 0, DiscountAmount: ele.DiscountAmount + ele.Categoryoffer } },
                        { new: true }
                    );
                }
                const currentDate = moment(); // Current date and time
                const formattedDate = currentDate.format('YYYY-MM-DD');
                const comparisonDate = moment(expiryDate);
                
                console.log(currentDate.isBefore(comparisonDate));
                if(currentDate.isBefore(comparisonDate)){
                // Apply the new discount amounts for products in the updated category
                const productsInUpdatedCategory = await Product.find({ Category: Category });
                for (const ele of productsInUpdatedCategory) {
                    let Categoryoffer=Math.floor( (ele.DiscountAmount * updatedOffer.discount) / 100)
                    let DiscountAmount= ele.DiscountAmount-Categoryoffer
                    const product = await Product.findByIdAndUpdate(
                        ele._id,
                        { $set: { Categoryoffer:Categoryoffer, DiscountAmount:DiscountAmount } },
                        { new: true }
                    );
                }
            }
    
                res.json({ status: true, message: "Offer and products updated successfully." });
            }
        } catch (err) {
            console.error(err);
            res.status(500).json({ status: false, message: "Internal Server Error" });
        }
    },
    // delete offer
    deleteOffer:async(req,res)=>{
        try{
            
            const offer=await Offer.findOne({_id:req.params.offerid})
            const products1 = await Product.find({ Category:offer.Category });
            for (const ele of products1) {
                const product = await Product.findOne({ _id: ele._id });
                

                
                product.DiscountAmount = ele.DiscountAmount + ele.Categoryoffer;
                product.Categoryoffer = 0;
                await product.save()

                
            }
            
            await Offer.deleteOne({_id:req.params.offerid})
            res.json ({status:true})
        }catch(err){
            console.log(err);
        }
    }
}