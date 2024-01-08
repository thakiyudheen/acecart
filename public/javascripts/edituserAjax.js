 function edituser(e) {
    e.preventDefault();
    console.log("working ")

    // Additional validation if needed
    var addressForm = $('#addressForm');
    console.log(addressForm.serialize());
    // AJAX POST request
    $.ajax({
      type: 'PUT',  // Use PUT method
      url:"/edituser",
      data: addressForm.serialize(),
      success: function (response) {
           window.location.reload()
        
      },
      error: function (error) {
        // Handle error response
        console.error(error);
      }
    });
}

function deleteaddress(id){
    console.log("remove QUE");
  const ok=confirm("Are sure  remove")
  if(ok){
    $.ajax({
      url:"/deleteaddress/"+`${id}`,
      method:'get',
      success:function (response){
        window.location.reload()
      },
      error:function (err){
        alert("Something Error")
      }
    })

  }
}


// reset password -----------------------------

function resetpassword(e) {
  e.preventDefault();
  console.log("working ")

  // Additional validation if needed
  var addressForm = $('#passwordResetForm');
  console.log(addressForm.serialize());
  // AJAX POST request
  $.ajax({
    type: 'PUT',  // Use PUT method
    url:"/resetpassword",
    data: addressForm.serialize(),
    success: function (response) {
      if(response){
        window.location.href='/userprofile'
      }else{
        document.getElementById("oldpasserr").innerHTML="old password is incorrect!!"
      }
        
      
    },
    error: function (error) {
      // Handle error response
      console.error(error);
    }
  });
}


// forgot password

function forgotpassword(e) {
  e.preventDefault();
  console.log("working ")

  // Additional validation if needed
  var addressForm = $("#forgotpasswordForm");
  console.log(addressForm.serialize());
  // AJAX POST request
  $.ajax({
    type: 'PUT',  // Use PUT method
    url:"/putforgotpassword",
    data: addressForm.serialize(),
    success: function (response) {
      if(response.otp==true&&response.user==false){
        window.location.href='/login'
      }else if(response.otp==true&&response.user==true){
        window.location.href='/userprofile'
      }else{
        document.getElementById('errmsg').innerHTML="Invalid OTP "
      }
        
      
    },
    error: function (error) {
      // Handle error response
      console.error(error);
    }
  });
}

// resend otp--------------------------

function resndOtp(email){
  

  $.ajax({
    url:"/resendotpforgot/"+`${email}`,
    method:'get',
    success:function (response){
      window.location.reload()
    },
    error:function (err){
      alert("Something Error")
    }
  })

}
