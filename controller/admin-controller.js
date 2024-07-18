const ADMIN= require('../model/adminModel');
const User= require("../model/userModel");
const Category= require("../model/categoryModel");
const Product= require("../model/productModel");
const Order= require("../model/orderModel");
const moment = require('moment');
const pdf = require("../util/salespdf");
const {generateSalesPDF}= require("../util/salespdf");




module.exports={
    getlogin:(req,res)=>{
        res.render('admin/login')
    },
    postLogin:async (req,res)=>{

        try{
            console.log(req.body)
            const data= await ADMIN.findOne({email:req.body.email})
            console.log('thsi is data',data)
            
            if(data){
                
          
                if(data.password===req.body.password){
                    req.session.adminlogged=true;
                    req.session.adminname =data.name;
                    console.log('this is admin',password)
                    
                     res.redirect('/admin/dashbord')
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
    getDashbord:async(req,res)=>{
   

        try {
          const totalOrderPromise = Order.aggregate([{ $match: { orderStatus: 'Order Processing' } }, { $group: { _id: '$orderStatus', sum: { $sum: 1 } } }]);
          const paidOrdersPromise = Order.aggregate([{ $match: { PaymentStatus: 'Paid' } }, { $group: { _id: '$PaymentStatus', sum: { $sum: '$totalAmount' } } }]);
          const totalUsersPromise = User.countDocuments();
          const lastOrdersPromise = Order.find().sort({ orderDate: -1 }).limit(5);
          const mostSoldProductsPromise = Order.aggregate([
            { $unwind: '$products' },
            { $group: { _id: '$products.productid', totalQuantity: { $sum: '$products.quantity' } } },
            { $lookup: { from: 'products', localField: '_id', foreignField: '_id', as: 'productInfo' } },
            { $sort: { totalQuantity: -1 } },
            { $limit: 5 },
            {
              $project: {
                _id: 1,
                totalQuantity: 1,
                productInfo: { $arrayElemAt: ['$productInfo', 0] } // Extract the first element of the array
              }
            }
          ]);
        
          const [totalOrder, paidOrders, totalUsers, lastOrders, mostSoldProducts] = await Promise.all([
            totalOrderPromise,
            paidOrdersPromise,
            totalUsersPromise,
            lastOrdersPromise,
            mostSoldProductsPromise
          ]);
        
          // console.log("full fillll", totalOrder, mostSoldProducts[0].productInfo.images[0]);
        
          res.render('admin/admindashboard', { order: paidOrders, lastOrders, users: totalUsers, totalOrder, mostSoldProducts });
        } catch (err) {
          console.error(err);
        }
        
    }
    
    ,
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
            await Product.deleteMany({Category:req.params.id})
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
    getCount:async (req,res)=>{
        try{

        const orders = await Order.find({
          orderStatus: {
            $nin: ["returned", "Cancelled", "Rejected"],
          },
        });
        
       
        
        const orderCountsByDay = {};
        const totalAmountByDay = {};
        const orderCountsByMonthYear = {};
        const totalAmountByMonthYear = {};
        const orderCountsByYear = {};
        const totalAmountByYear = {};
        let labelsByCount;
        let labelsByAmount;
        
        console.log("wot h its good for your ");
        
        orders.forEach((order) => {
            
          const orderDate = moment(order.orderDate, "ddd MMM DD YYYY");
          const dayMonthYear = orderDate.format("YYYY-MM-DD");
          const monthYear = orderDate.format("YYYY-MM");
          const year = orderDate.format("YYYY");
      
          if (req.url === "/count-orders-by-day") {
            if (!orderCountsByDay[dayMonthYear]) {
              orderCountsByDay[dayMonthYear] = 1;
              totalAmountByDay[dayMonthYear] = order.totalAmount;
            } else {
              orderCountsByDay[dayMonthYear]++;
              totalAmountByDay[dayMonthYear] += order.totalAmount;
            }

            const ordersByDay = Object.keys(orderCountsByDay).map(
                (dayMonthYear) => ({
                  _id: dayMonthYear,
                  count: orderCountsByDay[dayMonthYear],
                })
              );
    
              const amountsByDay = Object.keys(totalAmountByDay).map(
                (dayMonthYear) => ({
                  _id: dayMonthYear,
                  total: totalAmountByDay[dayMonthYear],
                })
              );
    
              amountsByDay.sort((a, b) => (a._id < b._id ? -1 : 1));
              ordersByDay.sort((a, b) => (a._id < b._id ? -1 : 1));
    
              labelsByCount = ordersByDay.map((entry) =>
                moment(entry._id, "YYYY-MM-DD").format("DD MMM YYYY")
              );
    
              labelsByAmount = amountsByDay.map((entry) =>
                moment(entry._id, "YYYY-MM-DD").format("DD MMM YYYY")
              );
    
              dataByCount = ordersByDay.map((entry) => entry.count);
              dataByAmount = amountsByDay.map((entry) => entry.total);

          } else if (req.url === "/count-orders-by-month") {


            if (!orderCountsByMonthYear[monthYear]) {
              orderCountsByMonthYear[monthYear] = 1;
              totalAmountByMonthYear[monthYear] = order.totalAmount;
            } else {
              orderCountsByMonthYear[monthYear]++;
              totalAmountByMonthYear[monthYear] += order.totalAmount;
            }

            const ordersByMonth = Object.keys(orderCountsByMonthYear).map(
                (monthYear) => ({
                  _id: monthYear,
                  count: orderCountsByMonthYear[monthYear],
                })
              );
              const amountsByMonth = Object.keys(totalAmountByMonthYear).map(
                (monthYear) => ({
                  _id: monthYear,
                  total: totalAmountByMonthYear[monthYear],
                })
              );
    
              ordersByMonth.sort((a, b) => (a._id < b._id ? -1 : 1));
              amountsByMonth.sort((a, b) => (a._id < b._id ? -1 : 1));
    
              labelsByCount = ordersByMonth.map((entry) =>
                moment(entry._id, "YYYY-MM").format("MMM YYYY")
              );
              labelsByAmount = amountsByMonth.map((entry) =>
                moment(entry._id, "YYYY-MM").format("MMM YYYY")
              );
              dataByCount = ordersByMonth.map((entry) => entry.count);
              dataByAmount = amountsByMonth.map((entry) => entry.total);
            

          } else if (req.url === "/count-orders-by-year") {
            if (!orderCountsByYear[year]) {
              orderCountsByYear[year] = 1;
              totalAmountByYear[year] = order.totalAmount;
            } else {
              orderCountsByYear[year]++;
              totalAmountByYear[year] += order.totalAmount;
            }

            const ordersByYear = Object.keys(orderCountsByYear).map((year) => ({
                _id: year,
                count: orderCountsByYear[year],
              }));
              const amountsByYear = Object.keys(totalAmountByYear).map((year) => ({
                _id: year,
                total: totalAmountByYear[year],
              }));
    
              ordersByYear.sort((a, b) => (a._id < b._id ? -1 : 1));
              amountsByYear.sort((a, b) => (a._id < b._id ? -1 : 1));
    
              labelsByCount = ordersByYear.map((entry) => entry._id);
              labelsByAmount = amountsByYear.map((entry) => entry._id);
              dataByCount = ordersByYear.map((entry) => entry.count);
              dataByAmount = amountsByYear.map((entry) => entry.total);
            }
          })
        
        res.json({ labelsByCount, labelsByAmount, dataByCount, dataByAmount });
        
        }catch(err){

        }
    },

    // generate pdf---------------------------------------------------
    generatesalesReport:async (req,res)=>{
      try {
        let startDate = new Date(req.body.startDate);
        let endDate = new Date(req.body.endDate);
        endDate.setHours(23, 59, 59, 999);
        const order = await Order
          .find({
            PaymentStatus: "Paid",
            orderDate: {
              $gte: startDate,
              $lte: endDate,
            },
          })
          .populate("products.productid");
  
        
        const pdfBuffer = await generateSalesPDF(order, startDate, endDate);
  
        // Set headers for the response
        res.setHeader("Content-Type", "application/pdf");
        res.setHeader(
          "Content-Disposition",
          "attachment; filename=sales Report.pdf"
        );
  
        res.status(200).end(pdfBuffer);
      } catch (error) {
        console.log(error);
       
       
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