
/* =========================================
   LIEUTENANT ROLL
   PREMIUM FASHION STOREFRONT
   MAIN JAVASCRIPT
========================================= */


/* =========================================
   1. ELEMENT SELECTORS
========================================= */

const menuToggle = document.getElementById("menuToggle");
const mainNav = document.getElementById("mainNav");

const searchToggle = document.getElementById("searchToggle");
const searchPanel = document.getElementById("searchPanel");

const cartToggle = document.getElementById("cartToggle");
const cartDrawer = document.getElementById("cartDrawer");
const cartBackdrop = document.getElementById("cartBackdrop");
const closeCart = document.getElementById("closeCart");

const cartItems = document.getElementById("cartItems");
const cartCount = document.querySelector(".cart-count");
const cartTotal = document.getElementById("cartTotal");

const filterButtons = document.querySelectorAll(".filter-button");
const productGrid = document.querySelector(".product-grid");
const sortSelect = document.getElementById("sortProducts");


/* =========================================
   2. MOBILE NAVIGATION
========================================= */

if (menuToggle && mainNav) {

    menuToggle.addEventListener("click", () => {

        mainNav.classList.toggle("active");

        const isOpen = mainNav.classList.contains("active");

        menuToggle.setAttribute("aria-expanded", isOpen);

        menuToggle.innerHTML = isOpen
            ? '<i class="fas fa-times"></i>'
            : '<i class="fas fa-bars"></i>';

    });

    mainNav.querySelectorAll("a").forEach(link => {

        link.addEventListener("click", () => {

            mainNav.classList.remove("active");

            menuToggle.setAttribute("aria-expanded", "false");

            menuToggle.innerHTML = '<i class="fas fa-bars"></i>';

        });

    });

}


/* =========================================
   3. SEARCH PANEL
========================================= */

if (searchToggle && searchPanel) {

    searchToggle.addEventListener("click", () => {

        searchPanel.classList.toggle("active");

        const searchInput = searchPanel.querySelector("input");

        if (searchPanel.classList.contains("active")) {
            searchInput?.focus();
        }

    });

}


/* =========================================
   4. PRODUCT SEARCH
========================================= */

const searchInput = searchPanel?.querySelector("input");

if (searchInput) {

    searchInput.addEventListener("input", () => {

        const searchTerm = searchInput.value.toLowerCase().trim();

        document.querySelectorAll(".product-card").forEach(product => {

            const productName =
                product.querySelector("h3")?.textContent.toLowerCase() || "";

            const productCategory =
                product.querySelector(".product-category")?.textContent.toLowerCase() || "";

            product.classList.toggle(
                "hidden",
                !productName.includes(searchTerm) &&
                !productCategory.includes(searchTerm)
            );

        });

    });

}


/* =========================================
   5. PRODUCT FILTERING
========================================= */

let activeFilter = "all";

function filterProducts(category) {

    activeFilter = category;

    document.querySelectorAll(".product-card").forEach(product => {

        const productCategory = product.dataset.category;

        const matchesCategory =
            category === "all" || productCategory === category;

        product.classList.toggle("hidden", !matchesCategory);

    });

}

filterButtons.forEach(button => {

    button.addEventListener("click", () => {

        filterButtons.forEach(item =>
            item.classList.remove("active")
        );

        button.classList.add("active");

        filterProducts(button.dataset.filter);

        if (searchInput) {
            searchInput.value = "";
        }

    });

});


/* =========================================
   6. PRODUCT SORTING
========================================= */

if (sortSelect && productGrid) {

    sortSelect.addEventListener("change", () => {

        const products = [...productGrid.querySelectorAll(".product-card")];

        products.sort((a, b) => {

            const priceA = Number(a.dataset.price) || 0;
            const priceB = Number(b.dataset.price) || 0;

            const nameA =
                a.querySelector("h3")?.textContent.trim() || "";

            const nameB =
                b.querySelector("h3")?.textContent.trim() || "";

            switch (sortSelect.value) {

                case "price-low":
                    return priceA - priceB;

                case "price-high":
                    return priceB - priceA;

                case "name":
                    return nameA.localeCompare(nameB);

                default:
                    return 0;

            }

        });

        products.forEach(product =>
            productGrid.appendChild(product)
        );

    });

}


/* =========================================
   7. SHOPPING CART STORAGE
========================================= */

let cart = [];

try {
    cart = JSON.parse(localStorage.getItem("lieutenantRollCart")) || [];
    if (!Array.isArray(cart)) cart = [];
} catch {
    cart = [];
}

function saveCart() {

    localStorage.setItem(
        "lieutenantRollCart",
        JSON.stringify(cart)
    );

}


/* =========================================
   8. OPEN AND CLOSE CART
========================================= */

function openCart() {

    cartDrawer?.classList.add("active");
    cartBackdrop?.classList.add("active");

    document.body.classList.add("no-scroll");

}

function closeCartDrawer() {

    cartDrawer?.classList.remove("active");
    cartBackdrop?.classList.remove("active");

    document.body.classList.remove("no-scroll");

}

cartToggle?.addEventListener("click", openCart);

closeCart?.addEventListener("click", closeCartDrawer);

cartBackdrop?.addEventListener("click", closeCartDrawer);


/* =========================================
   9. ADD PRODUCTS TO CART
========================================= */

document.querySelectorAll(".product-add").forEach(button => {

    button.addEventListener("click", () => {

        const product = button.closest(".product-card");

        if (!product) return;

        const name =
            product.querySelector("h3")?.textContent.trim();

        const price =
            Number(product.dataset.price);

        const image =
            product.querySelector(".product-image img")?.src || "";

        if (!name || !Number.isFinite(price) || price <= 0) {
            alert("Product information is incomplete.");
            return;
        }

        const existingProduct = cart.find(
            item => item.name === name
        );

        if (existingProduct) {

            existingProduct.quantity++;

        } else {

            cart.push({
                name,
                price,
                image,
                quantity: 1
            });

        }

        saveCart();
        renderCart();
        openCart();

    });

});


/* =========================================
   10. DISPLAY CART PRODUCTS
========================================= */

function renderCart() {

    if (!cartItems) return;

    cartItems.innerHTML = "";

    if (cart.length === 0) {

        cartItems.innerHTML = `
            <div class="empty-cart">
                <p>Your shopping bag is currently empty.</p>
                <p>Discover something distinctive.</p>
            </div>
        `;

    }

    cart.forEach((item, index) => {

        const cartItem = document.createElement("div");

        cartItem.className = "cart-item";

        const image = document.createElement("img");
        image.src = item.image;
        image.alt = item.name;

        const info = document.createElement("div");
        info.className = "cart-item-info";

        const name = document.createElement("h4");
        name.textContent = item.name;

        const price = document.createElement("p");
        price.textContent = formatCurrency(item.price);

        const actions = document.createElement("div");
        actions.className = "cart-item-actions";

        const decrease = document.createElement("button");
        decrease.textContent = "−";
        decrease.setAttribute("aria-label", "Decrease quantity");

        const quantity = document.createElement("span");
        quantity.textContent = item.quantity;

        const increase = document.createElement("button");
        increase.textContent = "+";
        increase.setAttribute("aria-label", "Increase quantity");

        const remove = document.createElement("button");
        remove.className = "remove-item";
        remove.textContent = "Remove";

        decrease.addEventListener("click", () => {
            updateQuantity(index, -1);
        });

        increase.addEventListener("click", () => {
            updateQuantity(index, 1);
        });

        remove.addEventListener("click", () => {
            removeProduct(index);
        });

        actions.append(decrease, quantity, increase);

        info.append(name, price, actions, remove);

        const subtotal = document.createElement("strong");
        subtotal.className = "cart-item-price";
        subtotal.textContent = formatCurrency(
            item.price * item.quantity
        );

        cartItem.append(image, info, subtotal);

        cartItems.appendChild(cartItem);

    });

    updateCartSummary();

}


/* =========================================
   11. UPDATE PRODUCT QUANTITY
========================================= */

function updateQuantity(index, change) {

    if (!cart[index]) return;

    cart[index].quantity += change;

    if (cart[index].quantity <= 0) {
        cart.splice(index, 1);
    }

    saveCart();
    renderCart();

}


/* =========================================
   12. REMOVE PRODUCT
========================================= */

function removeProduct(index) {

    cart.splice(index, 1);

    saveCart();
    renderCart();

}


/* =========================================
   13. CART TOTAL AND COUNT
========================================= */

function updateCartSummary() {

    const totalQuantity = cart.reduce(
        (total, item) => total + item.quantity,
        0
    );

    const totalPrice = cart.reduce(
        (total, item) =>
            total + item.price * item.quantity,
        0
    );

    if (cartCount) {
        cartCount.textContent = totalQuantity;
    }

    if (cartTotal) {
        cartTotal.textContent = formatCurrency(totalPrice);
    }

}


/* =========================================
   14. CURRENCY FORMAT
========================================= */

function formatCurrency(amount) {

    return new Intl.NumberFormat("en-NG", {
        style: "currency",
        currency: "NGN",
        maximumFractionDigits: 0
    }).format(amount);

}


/* =========================================
   15. QUICK VIEW
========================================= */

document.querySelectorAll(".quick-view").forEach(button => {

    button.addEventListener("click", () => {

        const product = button.closest(".product-card");

        if (!product) return;

        const name =
            product.querySelector("h3")?.textContent.trim();

        const price =
            Number(product.dataset.price);

        const category =
            product.querySelector(".product-category")?.textContent.trim();

        alert(
            `${name}\n${category}\nPrice: ${formatCurrency(price)}`
        );

    });

});


/* =========================================
   16. WHATSAPP CHECKOUT
========================================= */

const checkoutButton =
    document.getElementById("checkoutButton");

const whatsappNumber = "234XXXXXXXXXX";

if (checkoutButton) {

    checkoutButton.addEventListener("click", () => {

        if (cart.length === 0) {

            alert("Your shopping bag is empty.");
            return;

        }

        const orderDetails = cart.map((item, index) => {

            return `${index + 1}. ${item.name}
Quantity: ${item.quantity}
Price: ${formatCurrency(item.price * item.quantity)}`;

        }).join("\n\n");

        const total = cart.reduce(
            (sum, item) => sum + item.price * item.quantity,
            0
        );

        const message = `
Hello LIEUTENANT ROLL,

I would like to place an order.

${orderDetails}

TOTAL: ${formatCurrency(total)}

Please provide information about payment and delivery.

Thank you.
        `.trim();

        const whatsappURL =
            `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;

        window.open(whatsappURL, "_blank");

    });

}


/* =========================================
   17. ENQUIRY FORM
========================================= */

const enquiryForm = document.getElementById("enquiryForm");

if (enquiryForm) {

    enquiryForm.addEventListener("submit", event => {

        event.preventDefault();

        const formData = new FormData(enquiryForm);

        const name = formData.get("name") || "";
        const email = formData.get("email") || "";
        const subject = formData.get("subject") || "General enquiry";
        const message = formData.get("message") || "";

        const whatsappMessage = `
Hello LIEUTENANT ROLL.

Name: ${name}
Email: ${email}
Subject: ${subject}

Message:
${message}
        `.trim();

        const url =
            `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(whatsappMessage)}`;

        window.open(url, "_blank");

    });

}


/* =========================================
   18. INITIALISE STOREFRONT
========================================= */

renderCart();

console.log(
    "LIEUTENANT ROLL storefront successfully initialised."
);
