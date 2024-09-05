# Checkpoint 4 Web Development

## Integrantes 👋
<ul>
    <li>Gabriel Barros (RM556309)</li>  
    <li>João Marcelo Furtado Romero (RM555199)</li>
    <li>Kayky Silva Stiliano (RM555148)</li>
    <li>Pedro Henrique Bizzo de Santana (RM557263)</li>
    <li>Pedro Henrique Mendes Dos Santos (RM555332)</li>
</ul>

## Dependências 📦
<ul>
    <li>Bootstrap</li>
    <li>Font Awesome</li>
</ul>
 
<br>

## Explicando o <a href="https://github.com/fiap-checkpoints-1ESPJ/web-dev-cp4/blob/main/scripts/home.js">Código</a> 🧑‍💻
Carrinho de Compras com Filtro de Preços e Persistência Local
Esta parte do código implementa um carrinho de compras interativo, permitindo aos usuários adicionar produtos, ver o total de itens no carrinho e aplicar filtros de preços. Os dados dos produtos são carregados de um arquivo local e persistidos no `localStorage` para melhorar a performance.
<br>

Seletores DOM: O código começa pegando referências dos elementos do DOM, como `productList`, `cartCounter`, `cartIcon`, entre outros, para facilitar a manipulação da interface.

```c
const productList = document.getElementById('productList');
const cartCounter = document.getElementById('cartCounter');
const cartIcon = document.getElementById('cartIcon');
const cartItems = document.getElementById('cartItems');
const cartTotal = document.getElementById('cartTotal');
const cartModal = new bootstrap.Modal(document.getElementById('cartModal'));
const checkoutButton = document.getElementById('checkoutButton');
const priceFilter = document.getElementById('priceFilter');
```
<br>

Função de Delay: Esta função `delay()` cria uma pausa simulando a latência de rede ao buscar os produtos.

```c
function delay(ms=600) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
```
<br>

Fetch de Produtos: A função `fetchProducts()` carrega os produtos de um arquivo JSON, os armazena no `localStorage` para futuras visitas e renderiza os produtos na página. Se os produtos já estiverem no `localStorage`, eles são renderizados diretamente, evitando uma nova requisição.
```c
async function fetchProducts() {
    try {
        productList.innerHTML = '<div class="text-center"><div class="spinner-border" role="status"><span class="visually-hidden">Loading...</span></div></div>';

        await delay(1000);
        let existingPossibleProducts = JSON.parse(localStorage.getItem('products'));
        if (existingPossibleProducts) {
            renderProducts(existingPossibleProducts);
            return;
        }
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
```
<br>

Renderização de Produtos: A função `renderProducts()` atualiza o HTML para exibir os produtos dinamicamente. Cada produto tem um botão "Adicionar ao Carrinho" que, quando clicado, chama a função `addToCart()`.

```c
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
```
<br>

Adicionar ao Carrinho: A função `addToCart()` adiciona produtos ao carrinho e atualiza o contador do carrinho. Ela também trata a interface do botão, mostrando um spinner enquanto a ação é processada.

```c
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
```
<br>

Atualização do Contador do Carrinho: A função `updateCartCounter()` calcula o total de itens no carrinho e atualiza o contador exibido no ícone de carrinho.

```c
function updateCartCounter() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCounter.textContent = totalItems;
}
```

Renderização dos Itens do Carrinho: `renderCartItems()` exibe os produtos no modal do carrinho, calcula o preço total e habilita o botão de checkout. Também oferece a opção de remover itens individualmente.

```c
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
```
<br>

Renderização dos Itens do Carrinho: `renderCartItems()` exibe os produtos no modal do carrinho, calcula o preço total e habilita o botão de checkout. Também oferece a opção de remover itens individualmente.

```c
function removeFromCart(productId) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    cart = cart.filter(item => item.id !== productId);
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCounter();
    renderCartItems();
}
```
<br>

Checkout: A função `proceedToCheckout()` redireciona o usuário para uma página de checkout se houver itens no carrinho. Caso contrário, exibe um alerta.

```c
function proceedToCheckout() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    if (cart.length > 0) {
        window.location.href = 'checkout.html';
    } else {
        alert('Your cart is empty. Add some items before checking out.');
    }
}
```
<br>

Eventos: Quando o ícone do carrinho é clicado, o modal do carrinho é exibido. O botão de checkout chama a função `proceedToCheckout()`.

```c
checkoutButton.addEventListener('click', () => proceedToCheckout())
cartIcon.addEventListener('click', () => {
    renderCartItems();
    cartModal.show();
});
```
<br>

Filtragem de Preços: O código permite que os usuários filtrem os produtos com base no preço (do mais caro ao mais barato e vice-versa).

```c
priceFilter.addEventListener('change', function() {
    const existingPossibleProducts = JSON.parse(localStorage.getItem('products')) || []
    let filteredProducts = existingPossibleProducts
    switch (this.value) {
        case "most-expensive":
            filteredProducts = existingPossibleProducts.sort((a, b) => b.price - a.price);
            break
        case "less-expensive":
            filteredProducts = existingPossibleProducts.sort((a, b) => b.price + a.price);
            break
    }
    renderProducts(filteredProducts)
});
```
<br>

## Explicando o <a href="https://github.com/fiap-checkpoints-1ESPJ/web-dev-cp4/blob/main/scripts/checkout.js">Código</a> 🧑‍💻
Resumo do Pedido e Avaliação com Estrelas
Este código complementa o sistema de carrinho de compras, gerando um resumo do pedido, permitindo ao usuário ajustar quantidades de produtos e enviar avaliações com estrelas. Ele também inclui interações como a exibição de modais (janelas modais) para revisões e mensagens de agradecimento.
<br>

Seletores DOM: Referências aos elementos do DOM para o resumo do pedido, total, formulário de pagamento, e modais como o de avaliação e agradecimento. Além disso, referências para as estrelas usadas na avaliação de produtos.

```c
const orderSummary = document.getElementById('orderSummary');
const orderTotal = document.getElementById('orderTotal');
const paymentForm = document.getElementById('paymentForm');
const reviewModal = new bootstrap.Modal(document.getElementById('reviewModal'));
const thankYouModal = new bootstrap.Modal(document.getElementById('thankYouModal'));
const emptyCartModal = new bootstrap.Modal(document.getElementById('emptyCartModal'));
const stars = document.querySelectorAll('.star-rating .fa-star');
const submitReviewBtn = document.getElementById('submitReview');
```
<br>

Adicionar mais produtos: A função `addMore()` permite ao usuário adicionar mais unidades de um produto ao carrinho. Se o produto já estiver no carrinho, sua quantidade é aumentada, caso contrário, ele é adicionado como um novo item.

```c
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
```
<br>

Atualizar Quantidade: `updateQuantity()` permite alterar a quantidade de um produto no carrinho, tanto aumentando quanto diminuindo. Se a quantidade de um produto chegar a zero, ele é removido do carrinho.

```c
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
```
<br>

Renderizar Resumo do Pedido: A função `renderOrderSummary()` exibe os produtos no resumo do pedido, mostrando o nome, quantidade e total por item. Além disso, permite ao usuário ajustar a quantidade diretamente da página de resumo.

```c
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
```
<br>

Verificar Carrinho Vazio: `checkEmptyCart()` verifica se o carrinho está vazio. Se estiver, exibe um modal informando que o carrinho está vazio e redireciona o usuário para a página inicial após o fechamento do modal.

```c
function checkEmptyCart() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    if (cart.length === 0) {
        emptyCartModal.show();
        document.getElementById('emptyCartModal').addEventListener('hidden.bs.modal', () => {
            window.location.href = 'index.html';
        });
    }
}
```
<br>

Formulário de Pagamento: Ao enviar o formulário de pagamento, o modal de avaliação é exibido, permitindo ao usuário classificar e deixar um comentário sobre o pedido.

```c
paymentForm.addEventListener('submit', (e) => {
    e.preventDefault();
    reviewModal.show();
});
```
<br>

Avaliação com Estrelas: As estrelas de avaliação respondem a eventos de "mouseover", "mouseout" e "click". Isso permite ao usuário escolher sua avaliação visualmente, destacando as estrelas selecionadas e registrando a classificação.

```c
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
```
<br>

Envio da Avaliação: Ao clicar no botão "Enviar Avaliação", a classificação e o comentário são capturados e exibidos no console. Após o envio, o modal de agradecimento é exibido e o carrinho é esvaziado.

```c
submitReviewBtn.addEventListener('click', () => {
    const rating = document.querySelectorAll('.star-rating .fa-star.active').length;
    const comment = document.getElementById('reviewComment').value;

    console.log('Rating:', rating);
    console.log('Comment:', comment);

    reviewModal.hide();
    thankYouModal.show();

    localStorage.removeItem('cart');
});
```
<br>

Eventos de Carregamento: No carregamento da página, `checkEmptyCart()` é chamado para garantir que o carrinho não esteja vazio e renderizar o resumo do pedido.

```c
window.addEventListener('load', checkEmptyCart);
```
<br>

## Explicando o <a href="https://github.com/fiap-checkpoints-1ESPJ/web-dev-cp4/blob/main/scripts/admin.js">Código</a> 🧑‍💻
Gerenciamento de Produtos com LocalStorage e Interface de Confirmação
Este código implementa um sistema de gerenciamento de produtos com funcionalidades de adicionar, atualizar e excluir produtos, além de uma interface modal para confirmação de mudanças. Os produtos são armazenados no `localStorage` e exibidos dinamicamente na página.
<br>

Seletores DOM: Referências aos elementos da página, como o formulário de produtos, lista de produtos, botões de submissão, cancelamento e modais de confirmação.

```c
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
```
<br>

Renderizar Produtos: A função `renderProducts()` busca os produtos armazenados no `localStorage` e renderiza cada produto na página como cartões com nome, preço e imagem. Também adiciona botões de editar e excluir, associando eventos de clique a esses botões.

```c
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
```
<br>

Adicionar ou Atualizar Produtos: `addOrUpdateProduct()` lida com o envio do formulário de produto. Se um produto estiver sendo editado (possui id), exibe um modal de confirmação para as alterações. Caso contrário, salva o novo produto diretamente.

```c
function addOrUpdateProduct(event) {
    event.preventDefault();
    const productId = document.getElementById('productId').value;
    if (productId) {
        showConfirmationModal();
    } else {
        saveProduct();
    }
}
```
<br>

Exibir Modal de Confirmação: Se o produto estiver sendo atualizado, a função `showConfirmationModal()` exibe um modal listando as alterações entre o produto antigo e o novo, permitindo ao usuário confirmar as mudanças.

```c
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
```
<br>

Salvar Produto: `saveProduct()` é responsável por salvar ou atualizar o produto no `localStorage`. Caso seja uma atualização, o produto existente é modificado; caso contrário, um novo produto é adicionado à lista.

```c
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
```
<br>

Editar Produto: Quando o botão "Edit" é clicado, a função `editProduct()` preenche o formulário com os dados do produto selecionado, permitindo ao usuário fazer alterações. O botão de submissão é atualizado para "Update Product", e o botão de cancelamento de edição é exibido.

```c
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
```
<br>

Cancelar Edição: `cancelEdit()` limpa o formulário e retorna o estado da página ao modo de adição de produto, escondendo o botão de cancelamento de edição.

```c
function cancelEdit() {
    addProductForm.reset();
    document.getElementById('productId').value = '';
    submitButton.textContent = 'Add Product';
    cancelButton.classList.add('d-none');
}
```
<br>

Excluir Produto: A função `deleteProduct()` remove o produto selecionado tanto da lista de produtos quanto do carrinho (se o produto estiver no carrinho), atualizando o `localStorage`.

```c
function deleteProduct(productId) {
    let products = JSON.parse(localStorage.getItem('products')) || [];
    products = products.filter(product => product.id !== productId);
    localStorage.setItem('products', JSON.stringify(products));

    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    cart = cart.filter(c => c.id !== productId);
    localStorage.setItem('cart', JSON.stringify(cart));
    renderProducts();
}
```
<br>

Eventos de Submissão e Renderização: O formulário é processado pelo evento de submissão, e os produtos são carregados na página ao carregar o script.

```c
addProductForm.addEventListener('submit', addOrUpdateProduct);
confirmUpdateButton.addEventListener('click', () => {
    confirmationModal.hide();
    saveProduct();
});
```
<br>

Checkbox de Imagem: Se o checkbox "Sem Imagem" estiver marcado, o campo de URL da imagem é ocultado e uma imagem de espaço reservado (placeholder) é usada no lugar. Caso contrário, o campo de URL da imagem é obrigatório.

```c
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
```
<br>


