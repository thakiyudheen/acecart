// delete catogory-----------------------------

function remove(dta){
    console.log('okk',dta);
    let ok=confirm("Are you sure to delete")
    if(ok==true){
        $.ajax({
        
            url:"/admin/deletecategory/"+dta,
            
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
   
}

// delete product --------------------------
function deletepro(dta){
    let ok=confirm("Are you sure to delete")
    if(ok==true){
        $.ajax({
        
            url:"/admin/deleteproduct/"+dta,
            
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
   
}
// user block ------------------------------------------------------
function block(id,status){
    console.log("ajax working ");
    $.ajax({
        
        url:"/admin/customers/block/"+`${id}/${status}`,
        
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
// delete image when edit image --------------------------------------------------

function removeimg(imgname,id,no){
    console.log("ajax working ");
    let ok=confirm("Are you sure to delete")
    if(ok){
        $.ajax({
        
            url:"/admin/editproduct/deleteimg/"+`${imgname}/${id}`,
            
            method:"get",
            success:function (response){
                window.location.reload()
                alert(response.msg)
               
                
            },
            error:function (err){
                let srcs =document.getElementById(`imagePreview${no}`);
                document.getElementById(`image${no}`).value='';
                srcs.removeAttribute('src');
                    alert("Something Error")
               
                
        
            }
        })
    }
   
   
}