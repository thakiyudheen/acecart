function addTocart(proid){
    console.log("ajax ready");
   $.ajax({
    url:'/addTocart/'+proid,
    method:'get',
    success:async function (res){
        if (res.msg){
          
          Toastify({
            text: "Added to cart",
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
        
          // window.location.reload()
        }else if(res.msg==false&&res.user==false){
          console.log("err ok")
          window.location.href='/login'
        }else{
         
         Toastify({
          text: res.error,
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
      
     },
    error:function (err){
            alert("Something Error")
       
        

    }
  })
}



// change  quentity-------------------------

 function quantityChanger(proid,no,qty,cartid){
  console.log("CHANGE QUE");
  $.ajax({
    url:"/updatecart/"+`${proid}/${no}/${qty}/${cartid}`,
    method:'get',
    success:function (res){
      if(res.status){
      
         location.reload()
      }else{
        Toastify({
          text: res.msg,
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
          location.reload();
        },1000);
        
      }
      
    },
    error:function (err){
      alert("Something Error")
    }
  })
 }

//  remove from cart-------------------------------
function removecart(cartid,proid){
  console.log("remove QUE");
  const ok=confirm("Are sure  remove")
  if(ok){
    $.ajax({
      url:"/removecart/"+`${cartid}/${proid}`,
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