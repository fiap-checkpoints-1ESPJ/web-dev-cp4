const productList = document.getElementById('productList');
const cartCounter = document.getElementById('cartCounter');
const cartIcon = document.getElementById('cartIcon');
const cartItems = document.getElementById('cartItems');
const cartTotal = document.getElementById('cartTotal');
const cartModal = new bootstrap.Modal(document.getElementById('cartModal'));
const checkoutButton = document.getElementById('checkoutButton');
const addToCartBtn = document.getElementById('addToCart');
const priceFilter = document.getElementById('priceFilter');

let products = [];

async function fetchProducts() {
    try {
        let existingPossibleProducts = JSON.parse(localStorage.getItem('products'));
        if (existingPossibleProducts) return renderProducts(existingPossibleProducts)
        existingPossibleProducts = []

        const response = await fetch('../data/products.json');
        const data = await response.json();
        products = data.products;

        localStorage.setItem('products', JSON.stringify(products));
        renderProducts(products);
    } catch (error) {
        console.error('Error fetching products:', error);
        productList.innerHTML = '<p>Error loading products. Please try again later.</p>';
    }
}

function renderProducts(products) {
    productList.innerHTML = products.map(product => `
        <div class="col-md-4 mb-4">
            <div class="card h-100">
                <img src="${product.image}" class="card-img-top" alt="${product.name}">
                <div class="card-body d-flex flex-column">
                    <h5 class="card-title">${product.name}</h5>
                    <p class="card-text">$${product.price.toFixed(2)}</p>
                    <button class="btn btn-primary mt-auto addToCart" id="${product.id}" data-product-id="${product.id}">
                        <span class="button-text">Add to Cart</span>
                        <span class="spinner-border spinner-border-sm d-none" role="status" aria-hidden="true"></span>
                    </button>
                </div>
            </div>
        </div>
    `).join('');

    const buttons = document.querySelectorAll('.addToCart');
    buttons.forEach(button => {
        button.addEventListener('click', function() {
            const productId = this.getAttribute('id');
            addToCart(productId, this);
        });
    });
}


function addToCart(productId, button) {
    productId = Number(productId)
    const buttonText = button.querySelector('.button-text');
    const spinner = button.querySelector('.spinner-border');

    buttonText.classList.add('d-none');
    spinner.classList.remove('d-none');
    button.disabled = true;

    setTimeout(() => {
        let cart = JSON.parse(localStorage.getItem('cart')) || [];
        const existingProduct = cart.find(item => item.id === productId);

        if (existingProduct) {
            existingProduct.quantity += 1;
        } else {
            const productsUpdated = JSON.parse(localStorage.getItem('products')) || [];
            const product = productsUpdated.find(p => p.id === productId);
            cart.push({ ...product, quantity: 1 });
        }

        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartCounter();

        spinner.classList.add('d-none');
        buttonText.classList.remove('d-none');
        button.disabled = false;
    }, 300);
}

function updateCartCounter() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCounter.textContent = totalItems;
}

function renderCartItems() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    let totalPrice = 0;

    if (cart.length === 0) {
        cartItems.innerHTML = '<p>Your cart is empty.</p>';
        checkoutButton.disabled = true;
    } else {
        cartItems.innerHTML = cart.map(item => {
            const itemTotal = item.price * item.quantity;
            totalPrice += itemTotal;
            return `
                <div class="d-flex justify-content-between align-items-center mb-2">
                    <span>${item.name} x${item.quantity}</span>
                    <span>
                        $${itemTotal.toFixed(2)}
                        <i class="fas fa-trash-alt ms-2 delete-item" data-item-id="${item.id}"></i>
                    </span>
                </div>
            `;
        }).join('');
        checkoutButton.disabled = false;
    }

    cartTotal.textContent = totalPrice.toFixed(2);

    const deleteButtons = document.querySelectorAll('.delete-item');
    deleteButtons.forEach(button => {
        button.addEventListener('click', function() {
            const itemId = this.getAttribute('data-item-id');
            removeFromCart(Number(itemId));
        });
    });
}

function removeFromCart(productId) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    cart = cart.filter(item => item.id !== productId);
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCounter();
    renderCartItems();
}

function proceedToCheckout() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    if (cart.length > 0) {
        window.location.href = 'checkout.html';
    } else {
        alert('Your cart is empty. Add some items before checking out.');
    }
}

checkoutButton.addEventListener('click', () => proceedToCheckout())

cartIcon.addEventListener('click', () => {
    renderCartItems();
    cartModal.show();
});

priceFilter.addEventListener('change', function() {
    const existingPossibleProducts = JSON.parse(localStorage.getItem('products')) || []
    let filteredProducts = existingPossibleProducts
    switch (this.value) {
        case "most-expensive":
            filteredProducts = existingPossibleProducts.sort((a, b) => b.price - a.price);
            break
        case "less-expensive":

            let len = filteredProducts.length;
            for (let i = 0; i < len; i++) {
                for (let j = 0; j < len - 1; j++) {
                    if (filteredProducts[j].price > filteredProducts[j + 1].price) {
                        let temp = filteredProducts[j];
                        filteredProducts[j] = filteredProducts[j + 1];
                        products[j + 1] = temp;
                    }
                }
            }
            break
    }
    renderProducts(filteredProducts)
});


fetchProducts();
updateCartCounter();
