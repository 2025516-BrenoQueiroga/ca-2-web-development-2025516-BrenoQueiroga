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
    cartTotal.textContent = "€0.00";
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

// This function validates the checkout form.
function setupCheckoutForm() {

    // This finds the checkout form in the HTML.
    const checkoutForm = document.getElementById("checkout-form");

    // This stops the function if the checkout form is not on the current page.
    if (!checkoutForm) {
        return;
    }

    // This listens when the user tries to submit the form.
    checkoutForm.addEventListener("submit", function (event) {

        // This stops the page from refreshing automatically.
        event.preventDefault();

        // These lines get the values typed by the user.
        const name = document.getElementById("customer-name").value.trim();
        const email = document.getElementById("customer-email").value.trim();
        const phone = document.getElementById("customer-phone").value.trim();
        const address = document.getElementById("customer-address").value.trim();
        const message = document.getElementById("checkout-message");

        // This pattern allows only letters and spaces in the name.
        const namePattern = /^[A-Za-z\s]+$/;

        // This pattern allows only numbers in the phone field.
        const phonePattern = /^[0-9]+$/;

        // This checks if any field is empty.
        if (name === "" || email === "" || phone === "" || address === "") {
            message.textContent = "Please fill in all fields.";
            message.style.color = "red";
            return;
        }

        // This checks if the name has only letters and spaces.
        if (!namePattern.test(name)) {
            message.textContent = "Name must contain only letters and spaces.";
            message.style.color = "red";
            return;
        }

        // This checks if the phone number has only numbers.
        if (!phonePattern.test(phone)) {
            message.textContent = "Phone number must contain only numbers.";
            message.style.color = "red";
            return;
        }

        // This checks if the phone number has 9 or 10 digits.
        if (phone.length < 9 || phone.length > 10) {
            message.textContent = "Phone number must be 9 or 10 digits long.";
            message.style.color = "red";
            return;
        }

        // This checks if the cart is empty before placing the order.
        const cart = JSON.parse(localStorage.getItem("cart")) || [];

        if (cart.length === 0) {
            message.textContent = "Your cart is empty. Please add products before checkout.";
            message.style.color = "red";
            return;
        }

        // This shows a success message if all checks pass.
        message.textContent = "Order placed successfully. Thank you for shopping with IrieTech!";
        message.style.color = "#2ecc71";

        // This clears the cart after the order is placed.
        localStorage.removeItem("cart");

        // This resets the form fields.
        checkoutForm.reset();
    });
}

// This runs the checkout form setup when the page opens.
setupCheckoutForm();

// This function sets up the market price update button.
function setupPriceUpdateButton() {

    // This finds the price update button on the homepage.
    const updateButton = document.getElementById("update-prices-btn");

    // This stops the function if the button is not on the current page.
    if (!updateButton) {
        return;
    }

    // This listens for a click on the update price button.
    updateButton.addEventListener("click", function () {

        // This sends a request to the server to update prices in the database.
        fetch("/api/update-prices", {
            method: "PUT"
        })
        .then(response => response.json())
        .then(data => {

            // This gives simple feedback to the user.
            alert(data.message);

            // This reloads the page to show the new prices.
            location.reload();
        });
    });
}

// This runs the price update button setup when the page opens.
setupPriceUpdateButton();