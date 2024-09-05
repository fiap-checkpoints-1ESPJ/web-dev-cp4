const addProductForm = document.getElementById('addProductForm');
const productList = document.getElementById('productList');
const submitButton = document.getElementById('submitButton');
const cancelButton = document.getElementById('cancelButton');
const confirmationModal = new bootstrap.Modal(document.getElementById('confirmationModal'));
const changesList = document.getElementById('changesList');
const confirmUpdateButton = document.getElementById('confirmUpdate');
const noImageCheckbox = document.getElementById('noImageCheckbox');
const imageUrlGroup = document.getElementById('imageUrlGroup');
const productImage = document.getElementById('productImage');

let currentProduct = null;

function renderProducts() {
    const products = JSON.parse(localStorage.getItem('products')) || [];
    productList.innerHTML = products.map(product => `
        <div class="col-md-4 mb-4">
            <div class="card">
                <img src="${product.image}" class="card-img-top" alt="${product.name}" style="height: 200px; object-fit: cover;">
                <div class="card-body">
                    <h5 class="card-title">${product.name}</h5>
                    <p class="card-text">$${product.price.toFixed(2)}</p>
                    <button class="btn btn-primary me-2" data-edit-id="${product.id}">Edit</button>
                    <button class="btn btn-danger" data-delete-id="${product.id}">Delete</button>
                </div>
            </div>
        </div>
    `).join('');

    document.querySelectorAll('[data-edit-id]').forEach(button => {
        button.addEventListener('click', function() {
            const productId = parseInt(this.getAttribute('data-edit-id'));
            editProduct(productId);
        });
    });

    document.querySelectorAll('[data-delete-id]').forEach(button => {
        button.addEventListener('click', function() {
            const productId = parseInt(this.getAttribute('data-delete-id'));
            deleteProduct(productId);
        });
    });
}


function addOrUpdateProduct(event) {
    event.preventDefault();
    const productId = document.getElementById('productId').value;
    if (productId) {
        showConfirmationModal();
    } else {
        saveProduct();
    }
}

function showConfirmationModal() {
    const products = JSON.parse(localStorage.getItem('products')) || [];
    const productId = parseInt(document.getElementById('productId').value);
    const oldProduct = products.find(p => p.id === productId);
    const newProduct = {
        id: productId,
        name: document.getElementById('productName').value,
        price: parseFloat(document.getElementById('productPrice').value),
        image: document.getElementById('productImage').value
    };

    changesList.innerHTML = '';
    for (const [key, value] of Object.entries(newProduct)) {
        if (key !== 'id' && oldProduct[key] !== value) {
            changesList.innerHTML += `<li>${key}: ${oldProduct[key]} → ${value}</li>`;
        }
    }

    currentProduct = newProduct;
    confirmationModal.show();
}

function saveProduct() {
    const products = JSON.parse(localStorage.getItem('products')) || [];
    const productId = document.getElementById('productId').value;
    const product = currentProduct || {
        id: productId ? parseInt(productId) : (products.length > 0 ? Math.max(...products.map(p => p.id)) + 1 : 1),
        name: document.getElementById('productName').value,
        price: parseFloat(document.getElementById('productPrice').value),
        image: noImageCheckbox.checked ? `https://via.placeholder.com/300x200?text=${document.getElementById('productName').value.replaceAll(" ", "+")}` : document.getElementById('productImage').value
    };

    if (productId) {
        const index = products.findIndex(p => p.id === parseInt(productId));
        if (index !== -1) {
            products[index] = product;
        }
        localStorage.setItem('cart', JSON.stringify([]));
    } else {
        products.push(product);
    }
    localStorage.setItem('products', JSON.stringify(products));
    renderProducts();
    addProductForm.reset();
    document.getElementById('productId').value = '';
    submitButton.textContent = 'Add Product';
    cancelButton.classList.add('d-none');
    currentProduct = null;
}

function editProduct(productId) {
    const products = JSON.parse(localStorage.getItem('products')) || [];
    const product = products.find(p => p.id === productId);
    if (product) {
        document.getElementById('productId').value = product.id;
        document.getElementById('productName').value = product.name;
        document.getElementById('productPrice').value = product.price;
        document.getElementById('productImage').value = product.image;
        submitButton.textContent = 'Update Product';
        cancelButton.classList.remove('d-none');
    }
}

function cancelEdit() {
    addProductForm.reset();
    document.getElementById('productId').value = '';
    submitButton.textContent = 'Add Product';
    cancelButton.classList.add('d-none');
}

function deleteProduct(productId) {
    let products = JSON.parse(localStorage.getItem('products')) || [];
    products = products.filter(product => product.id !== productId);
    localStorage.setItem('products', JSON.stringify(products));

    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    cart = cart.filter(c => c.id !== productId);
    localStorage.setItem('cart', JSON.stringify(cart));
    renderProducts();
}

addProductForm.addEventListener('submit', addOrUpdateProduct);
confirmUpdateButton.addEventListener('click', () => {
    confirmationModal.hide();
    saveProduct();
});
noImageCheckbox.addEventListener('change', function() {
    if (this.checked) {
        imageUrlGroup.style.display = 'none';
        productImage.removeAttribute('required');
        productImage.value = '';
    } else {
        imageUrlGroup.style.display = 'block';
        productImage.setAttribute('required', '');
    }
});

renderProducts();
