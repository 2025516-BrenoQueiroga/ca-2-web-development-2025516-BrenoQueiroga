// This waits until the page is fully loaded before running the code.
document.addEventListener("DOMContentLoaded", function () {
    // This finds the product list area in the HTML.
    const productList = document.getElementById("product-list");

    // This checks if the product list exists on the current page.
    if (productList) {
        // This calls the server route that sends products from the database.
        fetch("/api/products")
            .then(response => response.json())
            .then(products => {
                // This clears the product list before adding products.
                productList.innerHTML = "";

                // This goes through every product received from the server.
                products.forEach(product => {
                    // This creates a new div for each product card.
                    const productCard = document.createElement("div");

                    // This adds the CSS class used to style the product card.
                    productCard.classList.add("product-card");

                    // This adds product information inside the card.
                    productCard.innerHTML = `
                        <img src="${product.image}" alt="${product.name}">
                        <h3>${product.name}</h3>
                        <p>${product.description}</p>
                        <p class="price">€${product.price.toFixed(2)}</p>
                        <button onclick="addToCart(${product.id})">Add to Cart</button>
                    `;

                    // This places the product card inside the product list.
                    productList.appendChild(productCard);
                });
            })
            .catch(error => {
                // This shows an error message if products cannot be loaded.
                productList.innerHTML = "<p>Products could not be loaded.</p>";
                console.log("Error loading products:", error);
            });
    }
});

// This function adds a product to the cart using localStorage.
function addToCart(productId) {
    // This gets the current cart from localStorage or creates an empty cart.
    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    // This adds the selected product id to the cart.
    cart.push(productId);

    // This saves the updated cart back into localStorage.
    localStorage.setItem("cart", JSON.stringify(cart));

    // This gives simple feedback to the user.
    alert("Product added to cart!");
}