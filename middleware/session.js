// after login----------------------------
const verifyUser = (req, res, next) => {
  
    if (req.session.userlogged) {
      next();
    } else {
      res.redirect("/");
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
    userExist,
    adminExist,
    verifyAdmin
  }