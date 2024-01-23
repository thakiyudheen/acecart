// const easyinvoice = require('easyinvoice');
// const fs = require('fs');
// const path = require('path');

// module.exports = {
//     generateInvoice: async (orderDetails) => {
//         console.log("okkkk this in voice",orderDetails[0].products)
//         try {
//             var data = {
                
//                 "customize": {
                   
//                 },
    
//                 "images": {
//                     "logo": fs.readFileSync(path.join(__dirname, '..', 'public', 'assets', 'logo.png'), 'base64'),
//                 }
//                 ,
//                 "sender": {
//                     "company": "aceCart",
//                     "address": "Kottakkal",
//                     "zip": "676503",
//                     "city": "Malappuram",
//                     "country": "Kerala"
//                 },
//                 "client": {
//                     "company": orderDetails[0].address.name,
//                     "address": orderDetails[0].address.address,
//                     "zip":orderDetails[0].address.pincode ,
//                     "city": orderDetails[0].address.city,
//                     "state":orderDetails[0].address.state,
                   
//                 }
               
//                 ,
//                 "information": {
//                     "Order ID": orderDetails[0]._id,
//                     "date": orderDetails[0].orderDate,
//                     "invoice date": orderDetails[0].orderDate,
//                 },
//                 // "products": (orderDetails[0].products && orderDetails[0].products.length > 0) ? orderDetails[0].products.map((product) => ({
                    
//                 //     "quantity": product.quantity,
//                 //     "description": product.productid.ProductName, 
//                 //     "tax-rate": 18,
//                 //     "price": product.productid.DiscountAmount,
//                 // })) : [],
//                 "products": (orderDetails[0].products && orderDetails[0].products.length > 0) ?
//     orderDetails[0].products
//         .filter(product => product.status === "active")
//         .map(product => ({
//             "quantity": product.quantity,
//             "description": product.productid.ProductName,
//             "tax-rate": 1,
//             "price": product.productid.DiscountAmount,
//         })) : [],
                
    
//                 "bottom-notice": "Thank You For Your Purchase",
//                 "settings": {
//                     "currency": "USD",
//                     "tax-notation": "vat",
//                     "currency": "INR",
//                     "tax-notation": "GST",
//                     "margin-top": 50,
//                     "margin-right": 50,
//                     "margin-left": 50,
//                     "margin-bottom": 25
//                 },
    
          
//         }
       
//             const result = await easyinvoice.createInvoice(data);

//             const filePath = path.join(__dirname, '..','public', 'pdf', `${orderDetails[0]._id}.pdf`);
//             await fs.promises.writeFile(filePath, result.pdf, 'base64');
//             console.log("filePath");
//             return filePath;
//         } catch (error) {
//             console.error(error);
//             throw error;
//         }
//     }
// };