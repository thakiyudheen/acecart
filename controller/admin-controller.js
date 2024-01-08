const ADMIN= require('../model/adminModel');
const User= require("../model/userModel");
const Category= require("../model/categoryModel");
const Product= require("../model/productModel");


module.exports={
    getlogin:(req,res)=>{
        res.render('admin/login')
    },
    postLogin:async (req,res)=>{

        try{
            console.log(req.body)
            const data= await ADMIN.findOne({email:req.body.email})
    
            if(data){
                
                if(data.password===req.body.password){
                    req.session.adminlogged=true;
                    req.session.adminname =data.name;
                    
                     res.render('admin/admindashboard',{name:data.name})
                }else{
                    console.log("okk")
                    res.render('admin/login',{err:"incorrect password or email  "})
                }
               
            }else{
                res.render('admin/login',{err:"incorrect password or email "})
            }
        }catch(err){
            console.log(err)
        }
       
        
    },
    getcustomers:async (req,res)=>{ 
     try{
        const data=await User.find()
        console.log(data)
        res.render("admin/adminuser",{users:data})
    }catch(err){
        console.log(err)
    }
        
       
    },
    updateStatus:async (req,res)=>{

          try{
       const id=req.params.id
       const status=req.params.stat
       console.log(status)
       var msg;
       if(status=="active"){
        await User.updateOne({_id:id},{$set:{status:"blocked"}})
        msg="blocked"
       }else{
        await User.updateOne({_id:id},{$set:{status:"active"}})
        msg="unblocked"
       }
       res.json({msg:`${msg} successfully...!`})
        }catch(err){
            console.log(err)
        }
      
    },
    // get catogary --------------------------------
    getCatogary:async (req,res)=>{
        try{

            const data= await Category.find()
            if(data){
                console.log()
                res.render('admin/category',{data})
            }else{
                res.render('admin/category',{err:"Category is empty..!"})
            }
           
        }catch(err){
            console.log(err)
        }
       
    },
    getaddCategory:(req,res)=>{
        try{
            res.render('admin/addcategory')
        }catch(err){
            console.log(err);
       
        }
    },
    postaddCategory:async (req,res)=>{
        try{
            console.log(req.body)
            let cat=req.body.categoryname
               cat=  cat.toUpperCase()
            const data= await Category.findOne({categoryname:cat})
            if(data){
                res.render('admin/addcategory',{err:"This category already taken"})
            }else{
                let cat=req.body.categoryname
               cat= cat.toUpperCase()

                await Category.create({categoryname:cat})
                
                res.redirect('/admin/category')
            }
        }catch(err){
            console.log(err);
       
        }
    },
    deleteCategory:async (req,res)=>{
        try{
            await Category.deleteOne({_id:req.params.id})
            await Product.deleteMany({Category:req.params.category})
            res.json({msg:"catogary deleted success"})
        }catch(err){
            console.log(err);
        }
    },
    editCategory: async (req,res)=>{
        try{
          const data=  await Category.find({_id:req.params.id})
           res.render('admin/editcategory',{category:data[0]})
        }catch(err){
            console.log(err);
        }
    },
    postCategory:async(req,res)=>{
        try{
           console.log(req.body)
            let cat=req.body.categoryname
            cat= cat.toUpperCase().trim()
            console.log(cat)
           const data= await Category.findOne({categoryname:cat})
           console.log("okkk",data)
           
           if(data){
            const data1=await Category.findOne({_id:req.body.id})
            res.render('admin/editcategory',{err:"This category already taken",category:data1})
           }else{
            await Category.updateOne({_id:req.body.id},{$set:{categoryname:cat}})
            res.redirect('/admin/category')
           }
        }catch(err){
            console.log(err);
        }
    },



    // logout admin --------------------------------------------------------------------------------------

    logOut:(req,res)=>{
        req.session.destroy(function(err){
           if(err){
           console.log(err)
           res.send("Error")
           }else{
               res.redirect("/admin")
           }
       })
  
     }

    
}