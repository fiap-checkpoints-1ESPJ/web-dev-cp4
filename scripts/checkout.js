const orderSummary = document.getElementById('orderSummary');
const orderTotal = document.getElementById('orderTotal');
const paymentForm = document.getElementById('paymentForm');
const reviewModal = new bootstrap.Modal(document.getElementById('reviewModal'));
const thankYouModal = new bootstrap.Modal(document.getElementById('thankYouModal'));
const emptyCartModal = new bootstrap.Modal(document.getElementById('emptyCartModal'));
const stars = document.querySelectorAll('.star-rating .fa-star');
const submitReviewBtn = document.getElementById('submitReview');

function addMore(productId) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    const existingProduct = cart.find(item => item.id === productId);

    if (existingProduct) {
        existingProduct.quantity += 1;
    } else {
        const product = products.find(p => p.id === productId);
        cart.push({ ...product, quantity: 1 });
    }

    localStorage.setItem('cart', JSON.stringify(cart));
}

function updateQuantity(productId, change) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    const productIndex = cart.findIndex(item => item.id === productId);

    if (productIndex !== -1) {
        cart[productIndex].quantity += change;
        if (cart[productIndex].quantity <= 0) {
            cart.splice(productIndex, 1);
        }
    }

    localStorage.setItem('cart', JSON.stringify(cart));
    renderOrderSummary();

    if(cart.length === 0) checkEmptyCart();
}

function renderOrderSummary() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    let totalPrice = 0;

    orderSummary.innerHTML = cart.map(item => {
        const itemTotal = item.price * item.quantity;
        totalPrice += itemTotal;
        return `
            <div class="d-flex justify-content-between align-items-center mb-2">
                <span>${item.name}</span>
                <div class="quantity-control">
                    <button class="btn btn-minus" data-item-id="${item.id}" data-change="-1">-</button>
                    <span class="mx-2">${item.quantity}</span>
                    <button class="btn btn-plus" data-item-id="${item.id}" data-change="1">+</button>
                </div>
                <span>$${itemTotal.toFixed(2)}</span>
            </div>
        `;
    }).join('');

    orderTotal.textContent = totalPrice.toFixed(2);

    const minusButtons = document.querySelectorAll('.btn-minus');
    const plusButtons = document.querySelectorAll('.btn-plus');

    minusButtons.forEach(button => {
        button.addEventListener('click', function() {
            const itemId = parseInt(this.getAttribute('data-item-id'));
            const change = parseInt(this.getAttribute('data-change'));
            updateQuantity(itemId, change);
        });
    });

    plusButtons.forEach(button => {
        button.addEventListener('click', function() {
            const itemId = parseInt(this.getAttribute('data-item-id'));
            const change = parseInt(this.getAttribute('data-change'));
            updateQuantity(itemId, change);
        });
    });
}

function checkEmptyCart() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    if (cart.length === 0) {
        emptyCartModal.show();
        document.getElementById('emptyCartModal').addEventListener('hidden.bs.modal', () => {
            window.location.href = 'index.html';
        });
    }
}

paymentForm.addEventListener('submit', (e) => {
    e.preventDefault();
    reviewModal.show();
});

stars.forEach(star => {
    star.addEventListener('mouseover', () => {
        const rating = star.getAttribute('data-rating');
        stars.forEach(s => {
            s.classList.remove('fas', 'far');
            s.classList.add(s.getAttribute('data-rating') <= rating ? 'fas' : 'far');
        });
    });

    star.addEventListener('mouseout', () => {
        stars.forEach(s => {
            s.classList.remove('fas');
            s.classList.add('far');
        });
    });

    star.addEventListener('click', () => {
        const rating = star.getAttribute('data-rating');
        stars.forEach(s => {
            s.classList.remove('fas', 'far', 'active');
            s.classList.add(s.getAttribute('data-rating') <= rating ? 'active' : 'far');
            s.classList.add(s.getAttribute('data-rating') <= rating ? 'fas' : 'far');
        });
    });
});

submitReviewBtn.addEventListener('click', () => {
    const rating = document.querySelectorAll('.star-rating .fa-star.active').length;
    const comment = document.getElementById('reviewComment').value;

    console.log('Rating:', rating);
    console.log('Comment:', comment);

    reviewModal.hide();
    thankYouModal.show();

    localStorage.removeItem('cart');
});

window.addEventListener('load', checkEmptyCart);

renderOrderSummary();
