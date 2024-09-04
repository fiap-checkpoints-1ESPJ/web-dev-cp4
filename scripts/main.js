
import {useLocalStorage} from "./localStorage.js"

const productStorage = useLocalStorage("@EcoTrend-product::")
const cartStorage = useLocalStorage("@EcoTrend-cart::")
const cartCounterStorage = useLocalStorage("@EcoTrend-cart-counter::")
cartCounterStorage.setItem(0)

document.addEventListener('DOMContentLoaded', () => {
    const productContainer = document.getElementById('product-container');

    async function fetchProducts() {
        try {
            const response = await fetch('../data/product.json');
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const products = await response.json();
            renderProducts(products);
        } catch (error) {
            console.error('Fetch error:', error);
        }
    }

    function renderProducts(products) {
        products.forEach(product => {
            const card = document.createElement('div');
            card.className = 'card';
            
            card.innerHTML = `
                <h2>${product.name}</h2>
                <p>Price: $${product.price.toFixed(2)}</p>
                <button class="add-to-cart" data-id="${product.id}" data-name="${product.name}" data-price="${product.price}">Add to Cart</button>
            `;
            
            productContainer.appendChild(card);
        });

        document.querySelectorAll('.add-to-cart').forEach(button => {
            button.addEventListener('click', handleAddToCart);
        });
    }

    function handleAddToCart(event) {
        const button = event.target;
        const id = button.getAttribute('data-id');
        const name = button.getAttribute('data-name');
        const price = parseFloat(button.getAttribute('data-price'));

        const cart = JSON.parse(localStorage.getItem('cart')) || [];

        const existingProductIndex = cart.findIndex(item => item.id === parseInt(id));
        
        if (existingProductIndex > -1) {
            cart[existingProductIndex].quantity += 1;
        } else {
            cart.push({
                id: parseInt(id),
                name: name,
                price: price,
                quantity: 1
            });
        }

        localStorage.setItem('cart', JSON.stringify(cart));

        button.textContent = 'Added';
        setTimeout(() => {
            button.textContent = 'Add to Cart';
        }, 1000);
    }

    fetchProducts();
});



function addToCart(item){
    const cart = cartStorage.getItem()
    const updatedCart = [...cart, item]
    cartCounterStorage.setItem(updatedCart.length)
    cartStorage.setItem(updatedCart)
}

function deleteFromCart(itemId){
    const cart = cartStorage.getItem()
    const updatedCart = cart.filter(item => item.id !== itemId)
    cartCounterStorage.setItem(updatedCart.length)
    cartStorage.setItem(updatedCart)
}

function buy(){
    const cart = cartStorage.getItem()

    cartCounterStorage.setItem(updatedCart.length)
    console.log(cart)
}

function addToProducts(item){
    const products = productStorage.getItem()
    const updatedProducts = [...products, item]
    productStorage.setItem(updatedProducts)
}

function deleteFromProducts(itemId){
    const products = productStorage.getItem()
    const updatedProducts = products.filter(item => item.id !== itemId)
    cartStorage.setItem(updatedProducts)
}

document.addEventListener('click', function(event) {
  var cartContainer = document.querySelector('.cart-container');
  var cartDropdown = document.querySelector('.cart-dropdown');

  if (!cartContainer.contains(event.target)) {
      cartDropdown.style.display = 'none';
  } else {
      cartDropdown.style.display = 'block';
  }
});




