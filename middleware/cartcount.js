const Cart = require("../model/cartModel");
const User = require("../model/userModel");

const CartCount = async (req, res, next) => {
  try {
    const email = req.session.email;
    const user = await User.findOne({ email: email });
    if (user) {
      const userId = user._id;
      const cartData = await Cart.findOne({userid:userId });

      if (cartData) {
        const cartCount = cartData.products.length;
       
        res.locals.cartCount = cartCount;
        res.locals.name = user.name;

      } else {
        res.locals.cartCount = 0;
        res.locals.name = user.name;
      }
    }
    console.log("okkkkkkkkkkkkkkkkk",res.locals.cartCount);
    next();
  } catch (error) {
    console.error(error);
    res.locals.cartCount = 0;
    next();
  }
};

module.exports = CartCount;