

// update order status ---------------------
function updateOrderStatus(orderid,status){
    console.log("okk aajaxx");
    $.ajax({
        
        url:"/admin/updateStatus/"+`${orderid}/${status}`,
        
        method:"get",
        success:function (response){
            window.location.reload()
            alert(response.msg)
           
            
        },
        error:function (err){
            alert("Something Error")
    
        }
    })
}

// cancelorder0--------------------------------------

function cancelOrder(orderid,status){
    console.log("okk aajaxx");
    $.ajax({
        
        url:"/cancelorder/"+`${orderid}/${status}`,
        
        method:"get",
        success:function (response){
            window.location.reload()
            alert(response.msg)
           
            
        },
        error:function (err){
            alert("Something Error")
    
        }
    })
}



function  placeorder(event) {
    event.preventDefault(); // Prevents the default form submission behavior
    console.log("working ann addaa");
  
    // Corrected form selector
    var addressForm = $("#checkoutform");// Find the closest form ancestor
  
   
  
    // AJAX POST request
    $.ajax({
      url: "/confirmAddress",
      method: 'post',
      data: addressForm.serialize(),
      success: function (res) {
        console.log("yaaa");
       console.log(res.method);
       
       if(res.method=='cod'){
        window.location.href='/cashondelivery'
       }else if(res.method=='online'){
        createRazorpay(res.order)
      
       }else if(res.method=="wallet"){
          if(res.status==true){
            location.href='/ordersuccess'
          }else{
            Toastify({
              text: res.msg ,
              duration: 800,
              close: false,
              gravity: "top",
              position: 'center',
              style: {
                background: "rgba(255, 255, 255, 0.8)", // White with 80% opacity
                color: "red",
                borderRadius: "15px",
              }
            }).showToast();
          }
        
       }
      
  
      },
      error: function (error) {
        console.error(error);
      }
    });
  }
  
//   create razorpaay-------------------
function createRazorpay(order){
    
    const id = order.id;
    const total = order.amount;
    var options = {
      key:'rzp_test_61dJlVPHSCXynx',
      amount: total,
      currency: 'INR',
      name: 'aceCart',
      description: 'Test Transaction',
      image: '/assets/zeecart.png',
      order_id: id,
      handler: function (response) {

        alert(response.razorpay_payment_id);
        alert(response.razorpay_order_id);
        verifyPayment(response,order)
       
      },
      theme: {
        color: '#3c3c3c'
      }
    }
    var rzp1 = new Razorpay(options);
    rzp1.open();
}
  // verify payment -----------------------------
  function verifyPayment(payment,order){
    $.ajax({
        
      url:'/verifyPayment',
      method:"post",
      data:{
        payment,
        order
      },
      success:function (response){
        if(response.success){
          location.href='/ordersuccess'
        }
         
          
         
          
      },
      error:function (err){
          alert("Something Error")
  
      }
  })
  }


  // Return order
  function returnorder(e) {
    e.preventDefault();
    console.log("working ")
  
    // Additional validation if needed
    var addressForm = $('#returnForm');
    console.log(addressForm.serialize());
    // AJAX POST request
    $.ajax({
      method: 'post',  // Use PUT method
      url:"/returnorder",
      data: addressForm.serialize(),
      success: function (res) {
        Toastify({
          text: res.msg,
          duration: 800,
          close: false,
          gravity: "top",
          position: 'center',
          style: {
            background: "rgba(0, 0, 255, 0.7)", // Set the background color with opacity
            color: "#fff",
            borderRadius: "15px",
          }
        }).showToast();
        setTimeout(function() {
          // Reload the page
          location.reload();
        },1000);
         
       
        
      },
      error: function (error) {
        // Handle error response
        console.error(error);
      }
    });
  }

  // accept return -------------------------
  
function returnrequest(orderid,returnid,type ){
  console.log("okk aajaxx");
  $.ajax({
      
      url:"/admin/returnrequest/"+`${orderid}/${returnid}/${type}`,
      
      method:"get",
      success:function (res){
        console.log("okkkkkssss");
        if(res.status){
 
          Toastify({
            text:res.msg ,
            duration: 800,
            close: false,
            gravity: "top",
            position: 'center',
            style: {
              background: "rgba(0, 0, 255, 0.7)", // Set the background color with opacity
              color: "#fff",
              borderRadius: "15px",
            }
          }).showToast();
          
          setTimeout(function() {
            // Reload the page
            location.href='/admin/getOrder'
          },1000);
          

        }else{
          Toastify({
            text: res.msg ,
            duration: 800,
            close: false,
            gravity: "top",
            position: 'center',
            style: {
              background: "rgba(255, 255, 255, 0.8)", // White with 80% opacity
              color: "red",
              borderRadius: "15px",
            }
          }).showToast();
          setTimeout(function() {
            // Reload the page
            location.href='/admin/getOrder'
          },1000);

        }

          
      },
      error:function (err){
          alert("Something Error")
  
      }
  })
}