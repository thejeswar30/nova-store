document.addEventListener("DOMContentLoaded", function () {
    const checkoutForm = document.getElementById("checkout-form");
    const orderSummary = document.getElementById("checkout-items");
    const subtotalElement = document.getElementById("checkout-subtotal");
    const totalElement = document.getElementById("checkout-total");
    const confirmation = document.getElementById("order-confirmation");

    function renderCheckout() {
        const cart = getCart();
        let total = 0;

        if (orderSummary) {
            if (cart.length === 0) {
                orderSummary.innerHTML = "<p>Your cart is empty.</p>";
            } else {
                orderSummary.innerHTML = cart.map(function (item) {
                    const product = products.find(function (entry) {
                        return entry.id === item.id;
                    });

                    if (!product) {
                        return "";
                    }

                    total += product.price * item.quantity;

                    return `
                        <div class="checkout-item">
                            <span>${product.name} × ${item.quantity}</span>
                            <strong>${formatPrice(product.price * item.quantity)}</strong>
                        </div>
                    `;
                }).join("");
            }
        } else {
            cart.forEach(function (item) {
                const product = products.find(function (entry) {
                    return entry.id === item.id;
                });

                if (product) {
                    total += product.price * item.quantity;
                }
            });
        }

        if (subtotalElement) {
            subtotalElement.textContent = formatPrice(total);
        }

        if (totalElement) {
            totalElement.textContent = formatPrice(total);
        }

        if (checkoutForm) {
            const submitButton = checkoutForm.querySelector('button[type="submit"]');

            if (submitButton) {
                submitButton.disabled = cart.length === 0;
            }
        }

        return cart;
    }

    if (checkoutForm) {
        checkoutForm.addEventListener("submit", function (event) {
            event.preventDefault();

            const cart = getCart();

            if (cart.length === 0) {
                alert("Your cart is empty. Please add a product first.");
                return;
            }

            if (!checkoutForm.checkValidity()) {
                checkoutForm.reportValidity();
                return;
            }

            const orderNumber = "NOVA-" + Date.now().toString().slice(-8);

            if (confirmation) {
                confirmation.hidden = false;
                confirmation.innerHTML = `
                    <h2>Order placed successfully!</h2>
                    <p>Your demo order number is <strong>${orderNumber}</strong>.</p>
                    <p>This is a demonstration checkout. No payment was processed.</p>
                    <a href="products.html">Continue shopping</a>
                `;
            } else {
                alert("Demo order placed successfully. Order number: " + orderNumber);
            }

            saveCart([]);
            checkoutForm.reset();
            renderCheckout();
        });
    }

    renderCheckout();
});