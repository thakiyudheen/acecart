const User= require("../model/userModel");
const Product= require("../model/productModel");
const Cart= require("../model/cartModel");
const Brand = require("../model/brandModel");

module.exports={
    getBrand:async (req,res)=>{
        try{
            const brand=await Brand.find()
            res.render('admin/brand',{brand})
        }catch(err){
            console.log(err);
        }
    },
    getAddbrand:(req,res)=>{
        try{
            res.render('admin/addbrand')
        }catch(err){
            console.log(err);
        }
    },
    postAddbrand:async (req,res)=>{
        try{
            console.log(req.body)
            let brand=req.body.brandname
               brand= brand.toUpperCase()
            const data= await Brand.findOne({brandname:brand})
            if(data){
                res.render('admin/addbrand',{err:"This category already taken"})
            }else{
                let brand=req.body.brandname
               brand= brand.toUpperCase()

                await Brand.create({brandname:brand})
                
                res.redirect('/admin/getBrand')
            }
        }catch(err){
            console.log(err);
        }
    },
    geteditBrand:async (req,res)=>{
        try{
            const brand=  await Brand.findOne({_id:req.params.id})
            res.render('admin/editbrand',{brand})

        }catch(err){
            console.log(err);
        }
    },
    posteditBrand:async (req,res)=>{
        try{
            console.log(req.body)
            let brand=req.body.brandname
            brand= brand.toUpperCase().trim()
            console.log(brand)
           const data= await Brand.findOne({brandname:brand})
           console.log("okkk",data)
           
           if(data){
            const data1=await Brand.findOne({_id:req.body.id})
            res.render('admin/editbrand',{err:"This category already taken",brand:data1})
           }else{
            await Brand.updateOne({_id:req.body.id},{$set:{brandname:brand}})
            res.redirect('/admin/getBrand')
           }

        }catch(err){
            console.log(err);
        }
    },
    deleteBrand:async (req,res)=>{
        try{
            await Brand.deleteOne({_id:req.params.id})
            await Product.deleteMany({BrandName:req.params.brand})
            res.json({msg:"brand deleted successfully"})
        }catch(err){
            console.log(err);
        }
    }
}