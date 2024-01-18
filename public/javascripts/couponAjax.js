function addcoupon(e) {
  e.preventDefault();
  console.log("working");

  // Corrected form selector
  var couponForm = $('#couponform');

  console.log(couponForm.serialize());

  // AJAX POST request
  $.ajax({
    url: "/admin/addcoupon",
    method: 'post',
    data: couponForm.serialize(),
    success: function (res) {
      if(res.status){
        window.location.reload();
      }else{
        
        document.getElementById('couponTypeError').innerHTML="coupen code exist!!"
       
      }
     
    },
    error: function (error) {
      console.error(error);
    }
  });
}

// edit coupon ---------------------------------
function editcoupon(e) {
  e.preventDefault();
  console.log("working");

  // Corrected form selector
  var couponForm = $('#editcouponform');

  console.log(couponForm.serialize());

  // AJAX POST request
  $.ajax({
    url: "/admin/editcoupon",
    method: 'put',
    data: couponForm.serialize(),
    success: function (res) {
      if(res.status){
        Toastify({
          text: res.msg,
          duration: 1500,
          gravity: 'top',
          position: 'center',
          backgroundColor: 'black',
          style: {
              borderRadius: '10px',
          },
      }).showToast();
        window.location.href='/admin/getCoupon';
      }else{
        console.log(res.oldCode);
        document.getElementById('noError').innerHTML="Coupon code  exist!!"
        document.getElementById('coupon-type').value=res.oldCode
      }
     
    },
    error: function (error) {
      console.error(error);
    }
  });
}

// remove coupon  ------------------------------
function removecoupon(couponid){
  Swal.fire({
      title: 'Are you sure?',
      text: "are You sure remove this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
      }).then((result) => {
      if (result.isConfirmed) {
          $.ajax({
              url:'/admin/removecoupon/'+`${couponid}`,
              method:'get',
              success:async function (response){
                  
                      window.location.reload()
                  
                
               },
              error:function (err){
                      alert("Something Error")
                 
                  
          
              }
            })
          
      }
      })
  
      
      
  
}

// check coupon-----------------


function checkcoupon(event) {
  event.preventDefault(); // Prevents the default form submission behavior
  console.log("working");

  // Corrected form selector
  var couponForm = $(event.target).closest('form'); // Find the closest form ancestor

  console.log(couponForm.serialize());

  // AJAX POST request
  $.ajax({
    url: "/checkcoupon",
    method: 'post',
    data: couponForm.serialize(),
    success: function (res) {
      if(res.status){
        Swal.fire({
          position: "center",
          icon: "success",
          title: "Your work has been saved",
          showConfirmButton: false,
          timer: 800
        });
        document.getElementById('totalPrice').innerHTML=`${res.subtotel}`
        document.getElementById('discountAmount').innerHTML=`${res.coupondiscount}`
        document.getElementById('button-addon2').disabled=true ;
        document.getElementById('checkcouponerr').innerHTML= "Coupon applied successfully";
        document.getElementById('checkcouponerr').style.color= "orange";
       
      }else{
        
        document.getElementById('checkcouponerr').innerHTML= "Coupon not Exist!!";
        document.getElementById('coupon').value= "";
        document.getElementById('checkcouponerr').style.color= "red";
        
         
      }

     

    },
    error: function (error) {
      console.error(error);
    }
  });
}



