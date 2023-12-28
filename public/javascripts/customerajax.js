// delete catogory-----------------------------

function remove(dta,catname){
    console.log('okk',dta,catname);
    let ok=confirm("Are you sure to delete this category and all this category products")
    if(ok==true){
        $.ajax({
        
            url:"/admin/deletecategory/"+`${dta}/${catname}`,
            
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

// delete brand


// delete catogory-----------------------------

function removebrand(dta,brand){
    console.log('okk',dta,brand);
    let ok=confirm("Are you sure to delete this brand and all this branded products")
    if(ok==true){
        $.ajax({
        
            url:"/admin/deletebrand/"+`${dta}/${brand}`,
            
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