const Offer =require ("../model/offerModel");
const Category= require("../model/categoryModel");
const Product = require("../model/productModel");
const  cron = require("node-cron");
const moment = require('moment');

async function removeOffer(){
  console.log("crone working");
    try{
      console.log("working cronjob");
      const currentDate = moment(); // Current date and time
      const formattedDate = currentDate.format('YYYY-MM-DD');
      //  const comparisonDate = moment(expiryDate);
        
        const offer= await Offer.find({expiryDate:{$lte:formattedDate }})
        if(offer.length>0){
            for (const ele of offer) {
                const product = await Product.findOne({Category:ele.Category})
                product.DiscountAmount=product.Categoryoffer+product.DiscountAmount
                product.Categoryoffer=0;
                await product.save()
                await Offer.deleteOne({ _id: ele._id });
            }

           
        }

   

      
    }catch(err){
        console.log(err);
    }

}



  //  cronjob aqedule -------------------------------
  cron.schedule("*/10 * * * * *", async () => {
    try {
      
      await removeOffer();
    } catch (error) {
      console.error("Error in cron job:", error);
    }})
