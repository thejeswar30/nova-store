const products = [
    {
        id: 1,
        name: "Wireless Headphones",
        category: "electronics",
        price: 3499,
        image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&q=80",
        description: "Premium headphones for everyday listening."
    },
    {
        id: 2,
        name: "Classic Watch",
        category: "lifestyle",
        price: 2499,
        image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=600&q=80",
        description: "A minimal watch for everyday style."
    },
    {
        id: 3,
        name: "Travel Backpack",
        category: "accessories",
        price: 1899,
        image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=600&q=80",
        description: "A practical backpack for daily essentials."
    },
    {
        id: 4,
        name: "Bluetooth Speaker",
        category: "electronics",
        price: 2199,
        image: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?auto=format&fit=crop&w=600&q=80",
        description: "Enjoy music wherever you go."
    },
    {
        id: 5,
        name: "Sunglasses",
        category: "accessories",
        price: 999,
        image: "https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=600&q=80",
        description: "Classic sunglasses for everyday wear."
    },
    {
        id: 6,
        name: "Desk Lamp",
        category: "lifestyle",
        price: 1599,
        image: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=600&q=80",
        description: "A modern lamp for your workspace."
    },
    {
        id: 7,
        name: "Wireless Earbuds",
        category: "electronics",
        price: 1799,
        image: "https://images.unsplash.com/photo-1606220945770-b5b6c2c55bf1?auto=format&fit=crop&w=600&q=80",
        description: "Compact earbuds for everyday listening."
    },
    {
        id: 8,
        name: "Everyday Bag",
        category: "accessories",
        price: 2799,
        image: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=600&q=80",
        description: "A stylish bag for daily essentials."
    }
];

function formatPrice(price) {
    return new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
        maximumFractionDigits: 0
    }).format(price);
}

function getCart() {
    try {
        const cart = JSON.parse(localStorage.getItem("novaCart")) || [];

        if (!Array.isArray(cart)) {
            return [];
        }

        return cart.filter(function (item) {
            return item &&
                Number.isInteger(Number(item.id)) &&
                Number.isInteger(Number(item.quantity)) &&
                Number(item.quantity) > 0 &&
                products.some(function (product) {
                    return product.id === Number(item.id);
                });
        }).map(function (item) {
            return {
                id: Number(item.id),
                quantity: Number(item.quantity)
            };
        });
    } catch (error) {
        return [];
    }
}

function saveCart(cart) {
    localStorage.setItem("novaCart", JSON.stringify(cart));
    updateCartCount();
}

function updateCartCount() {
    const countElements = document.querySelectorAll(".cart-count");
    const cart = getCart();

    const total = cart.reduce(function (sum, item) {
        return sum + item.quantity;
    }, 0);

    countElements.forEach(function (element) {
        element.textContent = total;
    });
}

function addToCart(productId) {
    const product = products.find(function (item) {
        return item.id === Number(productId);
    });

    if (!product) {
        return;
    }

    const cart = getCart();
    const existingItem = cart.find(function (item) {
        return item.id === product.id;
    });

    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            id: product.id,
            quantity: 1
        });
    }

    saveCart(cart);

    return product.name;
}

function renderProductCard(product) {
    return `
        <article class="product-card">
            <a class="product-image-link" href="products.html?product=${product.id}">
                <img
                    class="product-image"
                    src="${product.image}"
                    alt="${product.name}"
                    loading="lazy"
                >
            </a>
            <div class="product-info">
                <p class="product-category">${product.category}</p>
                <h3>
                    <a href="products.html?product=${product.id}">
                        ${product.name}
                    </a>
                </h3>
                <p class="product-description">${product.description}</p>
                <div class="product-bottom">
                    <strong>${formatPrice(product.price)}</strong>
                    <button
                        class="add-to-cart"
                        type="button"
                        data-product-id="${product.id}"
                    >Add</button>
                </div>
            </div>
        </article>
    `;
}

document.addEventListener("DOMContentLoaded", updateCartCount);