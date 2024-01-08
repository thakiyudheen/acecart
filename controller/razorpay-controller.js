const Razorpay =require('razorpay')


var instance = new Razorpay({
  key_id: process.env.RAZORPAY_ID_KEY,
  key_secret:  process.env.RAZORPAY_SECRET_KEY,
});

const createOrder = (req, res, orderid) => {
    try {
      const total = req.session.subtotel;
      var options = {
        amount: total * 100,
        currency: "INR",
        receipt: orderid,
      };
      console.log("Request Options:", options);
      instance.orders.create(options, function (err, order) {
        console.log("Razorpay Response:", order);
        if (err) {
          console.error("Razorpay Error:", err);
          res.status(500).send("Error in creating order");
          res.json({ status: false, err: err,method:'online' });
        } else {
          console.log("Order created successfully:", order);
          res.json({ status: true, order: order,method:'online' });
        }
      });
    } catch (error) {
      console.error("Unexpected Error:", error);
      res.status(500).send("Error in creating order");
    }
  };
  
module.exports = {
  createOrder,
}