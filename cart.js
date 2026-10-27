document.addEventListener("DOMContentLoaded", function () {
    const cartContainer = document.getElementById("cart-items");
    const subtotalElement = document.getElementById("cart-subtotal");
    const totalElement = document.getElementById("cart-total");
    const emptyMessage = document.getElementById("empty-cart");
    const checkoutButton = document.getElementById("checkout-button");

    function renderCart() {
        if (!cartContainer) {
            return;
        }

        const cart = getCart();

        if (cart.length === 0) {
            cartContainer.innerHTML = "";

            if (emptyMessage) {
                emptyMessage.hidden = false;
            }

            if (subtotalElement) {
                subtotalElement.textContent = formatPrice(0);
            }

            if (totalElement) {
                totalElement.textContent = formatPrice(0);
            }

            if (checkoutButton) {
                checkoutButton.disabled = true;
            }

            updateCartCount();
            return;
        }

        if (emptyMessage) {
            emptyMessage.hidden = true;
        }

        if (checkoutButton) {
            checkoutButton.disabled = false;
        }

        let subtotal = 0;

        cartContainer.innerHTML = cart.map(function (item) {
            const product = products.find(function (entry) {
                return entry.id === item.id;
            });

            if (!product) {
                return "";
            }

            subtotal += product.price * item.quantity;

            return `
                <article class="cart-item">
                    <img src="${product.image}" alt="${product.name}">
                    <div class="cart-item-info">
                        <h3>${product.name}</h3>
                        <p>${formatPrice(product.price)}</p>
                        <div class="quantity-controls">
                            <button type="button" data-action="decrease" data-id="${product.id}" aria-label="Decrease quantity">−</button>
                            <span>${item.quantity}</span>
                            <button type="button" data-action="increase" data-id="${product.id}" aria-label="Increase quantity">+</button>
                        </div>
                    </div>
                    <div class="cart-item-actions">
                        <strong>${formatPrice(product.price * item.quantity)}</strong>
                        <button type="button" data-action="remove" data-id="${product.id}">Remove</button>
                    </div>
                </article>
            `;
        }).join("");

        if (subtotalElement) {
            subtotalElement.textContent = formatPrice(subtotal);
        }

        if (totalElement) {
            totalElement.textContent = formatPrice(subtotal);
        }

        updateCartCount();
    }

    if (cartContainer) {
        cartContainer.addEventListener("click", function (event) {
            const button = event.target.closest("button[data-action]");

            if (!button) {
                return;
            }

            const productId = Number(button.dataset.id);
            const action = button.dataset.action;
            const cart = getCart();
            const item = cart.find(function (entry) {
                return entry.id === productId;
            });

            if (!item) {
                return;
            }

            if (action === "increase") {
                item.quantity += 1;
            } else if (action === "decrease") {
                item.quantity -= 1;
            } else if (action === "remove") {
                const index = cart.findIndex(function (entry) {
                    return entry.id === productId;
                });

                if (index !== -1) {
                    cart.splice(index, 1);
                }
            }

            const updatedCart = cart.filter(function (entry) {
                return entry.quantity > 0;
            });

            saveCart(updatedCart);
            renderCart();
        });
    }

    renderCart();
});