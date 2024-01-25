
// add to wishlist ----------------------------
function addTowishlist(proid){
    console.log("ajax ready");
   $.ajax({
    url:'/addTowishlist/'+proid,
    method:'get',
    success:async function (response){
        if (response.proexist==false&&response.user==true){
          await  Swal.fire({
            position: "center",
            icon: "success",
            title: "Added To wishlist",
            showConfirmButton: false,
            timer: 1200
          });
          window.location.reload()
        }else if(response.proexist==true&&response.user==true){
            Swal.fire("The item already in wishlist!");
        
        
        }else{
            window.location.href='/login'
        }
      
     },
    error:function (err){
            alert("Something Error")
       
        

    }
  })
}

// remove from wishlist ------------------------------
function removewishlist(proid,wishid){
    Swal.fire({
        title: 'Are you sure?',
        text: "Remove this!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, delete it!'
        }).then((result) => {
        if (result.isConfirmed) {
            $.ajax({
                url:'/removewishlist/'+`${proid}/${wishid}`,
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