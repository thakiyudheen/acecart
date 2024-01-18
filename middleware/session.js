const User=require('../model/userModel')
// after login----------------------------
const verifyUser = async  (req, res, next) => {
  
    if (req.session.userlogged) {
     const users=await User.findOne({email:req.session.email})
     console.log(">>>>>>>>>>>>>>>>>>>>>>>",users );
      if(users.status=='blocked'){
        req.session.email=false;
        res.redirect("/");
      }else{
        res.locals.user=users.name
        next();
      }
     
    } else {
      res.redirect("/");
    }
  };

  // after login for navbar----------------------------
const verifyUsernav = async (req, res, next) => {
 
  if (req.session.userlogged) {
    const users= await User.findOne({email:req.session.email})
   
      if(users.status=='blocked'){
        req.session.userlogged=false;
        res.redirect("/");
      }else{
        res.locals.user=users.name
        next();
      }
  } else {
    res.redirect("/login");
  }
};



  // bfore login-----------------------
  const userExist = (req, res, next) => {
    if (req.session.userlogged) {
      res.redirect("/userhome");
    } else {
      next();
    }
  };
  

  const adminExist = (req, res, next) => {
    if (req.session.adminlogged) {
      res.render('admin/admindashboard',{name:req.session.adminname})
    } else {
      next()
    }
  };


  const verifyAdmin=(req,res,next)=>{
    if (req.session.adminlogged) {
      next()
    } else {
      res.redirect('/admin')
    }

  }
  
  module.exports={
    verifyUser,
    verifyUsernav,
    userExist,
    adminExist,
    verifyAdmin
  }