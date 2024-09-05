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

## Explicando o <a href="path">Código</a> 🧑‍💻

#Carrinho de Compras com Filtro de Preços e Persistência Local
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



