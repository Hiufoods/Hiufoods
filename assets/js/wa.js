let cart = [];

function updatePrice(productType) {
    let price = 0;
    let quantity = parseInt(document.getElementById(`${productType}-quantity`).value);

    if (isNaN(quantity) || quantity <= 0) {
        quantity = 1;  // Default quantity to 1 if it's not a valid number
    }

    // Price Calculation Logic for Jasuke
    if (productType === 'jasuke') {
        const selectedProduct = document.getElementById("jasuke-product").value;
        switch (selectedProduct) {
            case 'Jasuke Original':
                price = 8000;
                break;
            case 'Choco melted':
                price = 10000;
                break;
            case 'Choco crunchy':
                price = 10000;
                break;
            case 'Cream cheese':
                price = 10000;
                break;
            case 'Matcha':
                price = 10000;
                break;
            case 'Mozzarella Original':
                price = 13000;
                break;
            case 'Mozzarella Choco melted':
                price = 15000;
                break;
            case 'Mozzarella Choco crunchy':
                price = 15000;
                break;
            case 'Mozzarella Cream cheese':
                price = 15000;
                break;
            case 'Mozzarella Matcha':
                price = 15000;
                break;
            default:
                price = 8000; // Default to Jasuke Original if no selection
                break;
        }
    }
    // Price Calculation Logic for Dimsum
    else if (productType === 'dimsum') {
        price = 10000;  // Default price for Dimsum
    }
    // Price Calculation Logic for Mentai
    else if (productType === 'mentai') {
        const selectedProduct = document.getElementById("mentai-product").value;
        if (selectedProduct.includes("Small")) {
            price = 15000;
        } else if (selectedProduct.includes("Medium")) {
            price = 29000;
        } else if (selectedProduct.includes("Large")) {
            price = 58000;
        }
    }

    // Update Total Price for Product
    document.getElementById(`${productType}-total-price`).innerText = price * quantity;
}

function adjustQuantity(productType, action) {
    let quantityInput = document.getElementById(`${productType}-quantity`);
    let quantity = parseInt(quantityInput.value);

    if (isNaN(quantity) || quantity <= 0) {
        quantity = 1;  // Default to 1 if invalid value
    }

    if (action === 'increase') {
        quantity += 1;
    } else if (action === 'decrease' && quantity > 1) {
        quantity -= 1;
    }

    quantityInput.value = quantity;
    updatePrice(productType);
}

function addToCart(productType) {
    const quantity = parseInt(document.getElementById(`${productType}-quantity`).value);
    const price = parseInt(document.getElementById(`${productType}-total-price`).innerText);
    const productName = document.getElementById(`${productType}-product`)?.value;

    if (!productName || isNaN(quantity) || quantity <= 0 || isNaN(price) || price <= 0) {
        alert("Please make sure all product details are correctly selected.");
        return;
    }

    // Check if the product is already in the cart
    const existingItem = cart.find(item => item.name === productName);

    if (existingItem) {
        // Update quantity and recalculate total price
        existingItem.quantity += quantity;
        existingItem.price = existingItem.unitPrice * existingItem.quantity;  // Correct price update
    } else {
        const cartItem = {
            name: productName,
            quantity: quantity,
            unitPrice: price / quantity, // Unit price calculation
            price: price // Total price (quantity * unit price)
        };
        cart.push(cartItem);
    }

    // Store the updated cart in a cookie
    storeCartInCookie();
    updateCartDisplay();
}

function updateCartDisplay() {
    let cartList = document.getElementById("cart");
    cartList.innerHTML = '';  // Clear previous cart items
    let totalPrice = 0;

    cart.forEach((item, index) => {
        const cartItem = document.createElement("li");
        cartItem.innerHTML = `${item.name} - Quantity: ${item.quantity} - Price: Rp ${item.price} IDR 
                              <button onclick="removeFromCart(${index})">Remove</button>`;
        cartList.appendChild(cartItem);
        totalPrice += item.price;
    });

    document.getElementById("total-price").innerText = `Total Price: Rp ${totalPrice} IDR`;
}

function removeFromCart(index) {
    cart.splice(index, 1);  // Remove item from cart
    storeCartInCookie();  // Update the cookie
    updateCartDisplay();  // Update the display
}

function storeCartInCookie() {
    // Convert the cart array to a JSON string and store it in the cookie
    document.cookie = `cart=${JSON.stringify(cart)}; path=/; max-age=86400`;  // Expires in 1 day
}

function loadCartFromCookie() {
    // Retrieve the cart from the cookie
    const cartCookie = document.cookie.split('; ').find(row => row.startsWith('cart='));
    if (cartCookie) {
        const cartData = JSON.parse(cartCookie.split('=')[1]);
        if (Array.isArray(cartData)) {
            cart = cartData;
        }
    }
    updateCartDisplay();
}

function removeCartCookie() {
    // Delete the cart cookie by setting the expiry date in the past
    document.cookie = "cart=; path=/; max-age=0";
}

function sendWhatsAppMessage() {
    // Format cart details with line breaks and bullet points
    let cartDetails = cart.map(item => {
        return `• ${item.name} = ${item.quantity}\n   harga: Rp. ${item.price} IDR`;
    }).join('\n');  // Join cart items into a formatted string

    // Calculate total price
    let totalPrice = cart.reduce((total, item) => total + item.price, 0);

    // Build the message content with clear headings and separators
    let message = `*Hai Kak*. Mau pesan Jajannya apakah pesanan saya tersedia?\n\n${cartDetails}\n\n*Total:*
    Rp ${totalPrice} IDR\n\n*HIUfoods!*`;

    let url = `https://wa.me/6281358193025?text=${encodeURIComponent(message)}`;

    // Open WhatsApp with the pre-filled message
    window.open(url, '_blank');

    // Remove the cart cookie after sending the order
    removeCartCookie();
}

// Load cart from cookie when the page is loaded
window.onload = function() {
    loadCartFromCookie();
};
