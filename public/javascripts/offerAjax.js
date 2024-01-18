
// add ofer ------------------------------------------------
function addoffer(e) {
    e.preventDefault();
    console.log("working ")
  
    // Additional validation if needed
    var addressForm = $('#offerForm');
    console.log(addressForm.serialize());
    // AJAX POST request
    $.ajax({
      method: 'post',  // Use PUT method
      url:"/admin/postoffer",
      data: addressForm.serialize(),
      success: function (res) {
        if(res.status){
            Toastify({
                text: "Offer Added",
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
               
        }else{
            document.getElementById('commonError').innerHTML="This Category already in offer!!!"
        }
        
       
        
      },
      error: function (error) {
        // Handle error response
        console.error(error);
      }
    });
  }

  // edit offer--------------------------------------------------------
  function editoffer(e) {
    e.preventDefault();
    var offerId = e.currentTarget.getAttribute("data-offer-id");
    var addressForm = $('#editofferForm' + offerId);
    console.log("data",addressForm.serialize());
    $.ajax({
      method: 'put',  // Use PUT method
      url:"/admin/puteditoffer",
      data: addressForm.serialize(),
      success: function (res) {
        if(res.status){
            Toastify({
                text: "Offer Edited",
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
               
        }else{
            document.getElementById('commonError11').innerHTML="This Category already in offer!!!"
        }
        
       
        
      },
      error: function (error) {
        // Handle error response
        console.error(error);
      }
    });
  }

  // delete id------------------------------------
  function deleteoffer(offerid){
    Swal.fire({
        title: 'Are you sure?',
        text: "You won't be able to revert this!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, delete it!'
        }).then((result) => {
        if (result.isConfirmed) {
            $.ajax({
                url:'/admin/deleteoffer'+`/${offerid}`,
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