const ADMIN= require('../model/adminModel');
const User= require("../model/userModel");
const Category= require("../model/categoryModel");
const Product = require("../model/productModel");
const Brand = require("../model/brandModel");


module.exports={
    getaddProducts:async (req,res)=>{
        try{
            
            const[category,brand]=await Promise.all([
                Category.find(),
                Brand.find()
            ])

            res.render('admin/addpronew',{category,brand})
        }catch(err){
            console.log(err)
        }
        
    },
    addProducts:async(req,res)=>{
        try{
            console.log("okkkk",req.body);
            console.log("fiels",req.files);
            const files=req?.files
           
            let images=[files.image1[0].filename,files.image2[0].filename,files.image3[0].filename,files.image4[0].filename]
            console.log(images)
            const pro={
                ...req.body,
                images
            }
            console.log(pro)
            await Product.create(pro)
            res.redirect('/admin/products')
            

            
        }catch(err){
            console.log(err)
        }
    },
    getProducts:async(req,res)=>{
        try{
            const data =await Product.find()

            res.render('admin/products',{data})
        }catch(err){
            console.log(err);
        }
        
    },
    blockProducts:async(req,res)=>{
        try{
           if(req.params.status=="Active"){
            await Product.updateOne({_id:req.params.id},{$set:{status:"Blocked"}})
            
           }else{
            await Product.updateOne({_id:req.params.id},{$set:{status:"Active"}})
           }
           res.redirect('/admin/products')
        }catch(err){
            console.log(err);
        }
    },
    deleteProduct:async (req,res)=>{
        try{
            await Product.deleteOne({_id:req.params.id})
            res.json({msg:"delete successfully...!"})
        }catch(err){
            console.log(err);
        }
    },
    geteditProducts:async (req,res)=>{
        try{
            const [products,category,brand]=await Promise.all([
                Product.find({_id:req.params.id}),
                Category.find(),
                Brand.find()
            ])
            
           
            res.render('admin/editpronew',{product:products[0],category,brand})
        }catch(err){
            console.log(err);
        }
    },
    editProducts:async (req,res)=>{
        try{
          const id = req.params.id
          const images=[];
          const proImg=await Product.findOne({_id:id})
          console.log(proImg)
          if(proImg){
            images.push(...proImg.images)
          }
         
          console.log("old ",images)
          console.log("not at ",req.files);
        //   retrieve image pos and add -------------
        for(let i=0;i<5;i++){
            if(req.files[i]){
                console.log("okkkk")
               let position=req.files[i].fieldname.split('')
               images[position[5]-1]=req.files[i].filename
            }
        }
        // end image ------------------------------------
        console.log("images",images)
        let UpdatedProducts=req.body
        UpdatedProducts.images=images;
        console.log(UpdatedProducts)
        
        // upload file to -------------------------------
        const uploaded =await Product.updateOne({_id:id},{$set:{...UpdatedProducts}})

       
       
          if (uploaded) {
            res.redirect("/admin/products");
          }
        }catch(err){
            console.log(err);
        }
    },
    // delete the img when edit product --------------------
    DltImage:async (req,res)=>{
        await Product.updateOne({_id:req.params.id},{$pull:{images:req.params.imgname}})
        res.json({msg :"deleted successfully"})
    }

    
    
}