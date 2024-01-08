// filter ajaxx-------------------------------------------------
function filter(e) {
    e.preventDefault();
    console.log("working ")
  
    // Additional validation if needed
    var addressForm = $("#filterForm");
    console.log(addressForm.serialize());
    // AJAX POST request
    $.ajax({
      type: 'post',  // Use PUT method
      url:"/filter",
      data: addressForm.serialize(),
      success: function (response) {
        // window.location.reload()
          
        
        const arr = response.products.map(el => {
            return `
              <div class="col-lg-3 col-md-3 col-sm-6 d-flex">
                <div class="card w-100 my-1 shadow-2-strong">
                  <a href="/userhome/products/productdetails/${el._id}">
                    <img src="/product-images/${el.images[0]}" class="card-img-top p-3" />
                  </a>
                  <div class="card-body d-flex flex-column">
                    <div class="d-flex flex-row">
                      ${el.AvailableQuantity === 0
                        ? `<h7 style="font-weight: 500; color: red;">Out of stock</h7>`
                        : `<h7 class="mb-1 me-1"><b>₹${el.DiscountAmount}\-</b></h7>
                          <span class="text-danger"><s><small>₹${el.Price}</small></s></span>`}
                    </div>
                    <p class="card-text"> <small>${el.ProductName}</small></p>
                    <div class="card-footer d-flex align-items-end pt-1 px-0 pb-0 mt-auto">
                      ${el.AvailableQuantity === 0
                        ? `<a href="#!" class="btn btn-primary shadow-0 me-1 disabled" onclick="addTocart('${el._id}')">Add to cart</a>`
                        : `<a href="#!" class="btn shadow-0 me-1 btnn " style="background-color:white; border: 1px solid black; color: black; border-redius:0px !important; " onclick="addTocart('${el._id}')">Add to cart</a>`}
                      <a onclick="addTowishlist('${el._id}')" class="btn px-2 pt-2 btnn " style="background-color:white; border: 1px solid grey; color: black; border-redius:0px !important;">
                        <i id="hurt" class="fas fa-heart fa-lg text-secondary px-1"></i>
                      </a>
                    </div>
                  </div>
                </div>
              </div>`;
          })
          
          console.log(">>>>>>>>>>>>>>>>>>",arr);
          const productsContainer = $('#proview');
            productsContainer.empty(); // Clear existing products
            productsContainer.append(arr.join(''));
         document.getElementById('count').innerHTML=response.count
        
      },
      error: function (error) {
        // Handle error response
        console.error(error);
      }
    });
  }