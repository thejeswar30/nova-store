document.addEventListener("DOMContentLoaded", function () {
    const featuredContainer = document.getElementById("featured-products");
    const productContainer = document.getElementById("product-list");
    const searchInput = document.getElementById("search-input");
    const categoryInputs = document.querySelectorAll('input[name="category"]');
    const sortSelect = document.getElementById("sort-select");
    const clearFiltersButton = document.getElementById("clear-filters");
    const newsletterForm = document.getElementById("newsletter-form");

    const params = new URLSearchParams(window.location.search);
    const productId = params.get("product");

    function showProducts(list, container) {
        if (!container) {
            return;
        }

        if (list.length === 0) {
            container.innerHTML = "<p class='empty-message'>No products found.</p>";
            return;
        }

        container.innerHTML = list.map(renderProductCard).join("");
    }

    function getSelectedCategory() {
        const selected = document.querySelector('input[name="category"]:checked');
        return selected ? selected.value : "all";
    }

    function filterProducts() {
        if (!productContainer) {
            return;
        }

        const searchTerm = searchInput
            ? searchInput.value.trim().toLowerCase()
            : "";

        const selectedCategory = getSelectedCategory();
        const sortValue = sortSelect ? sortSelect.value : "default";

        let filtered = products.filter(function (product) {
            const matchesSearch =
                product.name.toLowerCase().includes(searchTerm) ||
                product.description.toLowerCase().includes(searchTerm) ||
                product.category.toLowerCase().includes(searchTerm);

            const matchesCategory =
                selectedCategory === "all" ||
                product.category === selectedCategory;

            return matchesSearch && matchesCategory;
        });

        if (sortValue === "price-low") {
            filtered.sort(function (a, b) {
                return a.price - b.price;
            });
        } else if (sortValue === "price-high") {
            filtered.sort(function (a, b) {
                return b.price - a.price;
            });
        } else if (sortValue === "name") {
            filtered.sort(function (a, b) {
                return a.name.localeCompare(b.name);
            });
        }

        showProducts(filtered, productContainer);
    }

    if (featuredContainer) {
        showProducts(products.slice(0, 4), featuredContainer);
    }

    if (productContainer && productId) {
        const product = products.find(function (item) {
            return item.id === Number(productId);
        });

        if (product) {
            productContainer.innerHTML = `
                <article class="product-detail">
                    <img src="${product.image}" alt="${product.name}">
                    <div class="product-detail-info">
                        <p class="product-category">${product.category}</p>
                        <h1>${product.name}</h1>
                        <p>${product.description}</p>
                        <h2>${formatPrice(product.price)}</h2>
                        <button
                            class="add-to-cart"
                            type="button"
                            data-product-id="${product.id}"
                        >Add to Cart</button>
                        <p><a href="products.html">Back to products</a></p>
                    </div>
                </article>
            `;

            const catalogToolbar = document.querySelector(".catalog-toolbar");
            const filters = document.querySelector(".filters");
            const catalogIntro = document.querySelector(".catalog-intro");

            if (catalogToolbar) {
                catalogToolbar.hidden = true;
            }

            if (filters) {
                filters.hidden = true;
            }

            if (catalogIntro) {
                catalogIntro.hidden = true;
            }
        } else {
            showProducts([], productContainer);
        }
    } else if (productContainer) {
        filterProducts();
    }

    if (searchInput) {
        searchInput.addEventListener("input", filterProducts);
    }

    categoryInputs.forEach(function (input) {
        input.addEventListener("change", filterProducts);
    });

    if (sortSelect) {
        sortSelect.addEventListener("change", filterProducts);
    }

    if (clearFiltersButton) {
        clearFiltersButton.addEventListener("click", function () {
            if (searchInput) {
                searchInput.value = "";
            }

            categoryInputs.forEach(function (input) {
                input.checked = input.value === "all";
            });

            if (sortSelect) {
                sortSelect.value = "default";
            }

            filterProducts();
        });
    }

    document.addEventListener("click", function (event) {
        const button = event.target.closest(".add-to-cart");

        if (!button) {
            return;
        }

        const productName = addToCart(button.dataset.productId);

        if (productName) {
            const originalText = button.textContent;
            button.textContent = "Added!";
            button.disabled = true;

            window.setTimeout(function () {
                button.textContent = originalText;
                button.disabled = false;
            }, 1000);
        }
    });

    if (newsletterForm) {
        newsletterForm.addEventListener("submit", function (event) {
            event.preventDefault();

            const emailInput = newsletterForm.querySelector('input[type="email"]');

            if (emailInput && emailInput.checkValidity()) {
                alert("Thank you for subscribing!");
                newsletterForm.reset();
            } else if (emailInput) {
                emailInput.reportValidity();
            }
        });
    }

    updateCartCount();
});