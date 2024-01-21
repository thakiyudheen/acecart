// remove from wishlist ------------------------------
function removeBanner(bannerid){
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
                url:'/admin/removeBanner/'+`${bannerid}`,
                method:'delete',
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