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

// This function loads cart items on the cart page.
function loadCart() {

    // This finds the cart section in the HTML.
    const cartItems = document.getElementById("cart-items");

    // This finds the total price area.
    const cartTotal = document.getElementById("cart-total");

    // This stops the function if the cart page is not open.
    if (!cartItems || !cartTotal) {
        return;
    }

    // This gets the cart data from localStorage.
    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    // This checks if the cart is empty.
    if (cart.length === 0) {
        cartItems.innerHTML = "<p>Your cart is empty.</p>";
        return;
    }

    // This requests products from the server.
    fetch("/api/products")
        .then(response => response.json())
        .then(products => {

            // This clears previous cart content.
            cartItems.innerHTML = "";

            // This stores the total price.
            let total = 0;

            // This goes through every product id stored in the cart.
            cart.forEach((productId, index) => {

                // This finds the matching product from the database.
                const product = products.find(p => p.id === productId);

                // This checks if the product exists.
                if (product) {

                    // This adds the product price to the total.
                    total += product.price;

                    // This creates a product card.
                    const cartCard = document.createElement("div");

                    // This adds styling to the product card.
                    cartCard.classList.add("product-card");

                    // This inserts product information into the card.
                    cartCard.innerHTML = `
                        <img src="${product.image}" alt="${product.name}">
                        <h3>${product.name}</h3>
                        <p>${product.description}</p>
                        <p class="price">€${product.price.toFixed(2)}</p>

                        <button onclick="removeFromCart(${index})">
                            Remove
                        </button>
                    `;

                    // This places the product card on the page.
                    cartItems.appendChild(cartCard);
                }
            });

            // This updates the total price on the screen.
            cartTotal.textContent = `€${total.toFixed(2)}`;
        });
}

// This function removes a product from the cart.
function removeFromCart(index) {

    // This gets the current cart from localStorage.
    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    // This removes one product using its position.
    cart.splice(index, 1);

    // This saves the updated cart.
    localStorage.setItem("cart", JSON.stringify(cart));

    // This reloads the cart page.
    loadCart();
}

// This loads the cart automatically when the page opens.
loadCart();