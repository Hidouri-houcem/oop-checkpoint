// Classe pour le produit
class Product {
    constructor(id, name, price) {
        this.id = id;
        this.name = name;
        this.price = price;
    }
}

// Classe pour l'élément du panier d'achat
class ShoppingCartItem {
    constructor(product, quantity = 1) {
        this.product = product;
        this.quantity = quantity;
    }

    //  le prix total de cet élément 
    getTotalPrice() {
        return (this.product.price * this.quantity).toFixed(2);
    }
}

// Classe pour le panier d'achat
class ShoppingCart {
    constructor() {
        this.items = [];
    }

    // Ajouter un produit au panier
    addItem(product, quantity = 1) {
        const existingItem = this.items.find(item => item.product.id === product.id);
        if (existingItem) {
            existingItem.quantity += quantity;  // Augmenter la quantité si le produit existe déjà
        } else {
            this.items.push(new ShoppingCartItem(product, quantity));  // Ajouter un nouveau produit
        }
    }

    // Supprimer un produit du panier
    removeItem(productId) {
        const index = this.items.findIndex(item => item.product.id === productId);
        if (index !== -1) {
            this.items.splice(index, 1);  // Retirer l'élément du panier
        }
    }

    // Obtenir le total du panier
    getTotal() {
        return this.items.reduce((total, item) => total + (item.product.price * item.quantity), 0).toFixed(2);
    }

    // Afficher les éléments du panier
    displayItems() {
        this.items.forEach(item => {
            let cartItem = document.createElement('div');
            cartItem.classList.add('item');

            cartItem.innerHTML = `
                <div class="image">
                    <img src="./img/${item.product.id}.png" alt="${item.product.name}">
                </div>
                <div class="name">${item.product.name}</div>
                <div class="totalPrice">${item.getTotalPrice()} TND</div>
                <div class="quantity">
                    <span class="minus">-</span>
                    <span>${item.quantity}</span>
                    <span class="plus">+</span>
                </div>
                <div class="remove">
                    <button class="remove-item">Supprimer</button>
                </div>
            `;

            // Gestion des boutons + et -
            cartItem.querySelector('.plus').addEventListener('click', () => {
                item.quantity++;
                updateCartDisplay();
            });

            cartItem.querySelector('.minus').addEventListener('click', () => {
                if (item.quantity > 1) {
                    item.quantity--;
                    updateCartDisplay();
                }
            });

            // Gestion de la suppression d'un élément
            cartItem.querySelector('.remove-item').addEventListener('click', () => {
                cart.removeItem(item.product.id);
                updateCartDisplay();
                updateCartCount();
            });

            listCart.appendChild(cartItem);
            
        });
    }

    // Obtenir le nombre total d'éléments dans le panier
    getItemCount() {
        return this.items.reduce((count, item) => count + item.quantity, 0);
    }
}

// Sélectionner les éléments DOM
let iconCart = document.querySelector('.icon-cart');
let body = document.querySelector('body');
let closeCart = document.querySelector('.close');
let addCartButtons = document.querySelectorAll('.addCart');
let listCart = document.querySelector('.listCart');
let cartCount = document.querySelector('.icon-cart span');

// Créer une instance du panier
let cart = new ShoppingCart();

// Ouvrir et fermer le panier
iconCart.addEventListener('click', () => {
    body.classList.toggle('showCart');
});

closeCart.addEventListener('click', () => {
    body.classList.toggle('showCart');
});

// Mettre à jour le nombre d'éléments dans le panier
function updateCartCount() {
    cartCount.textContent = cart.getItemCount();
}

// Ajouter un produit au panier
addCartButtons.forEach(button => {
    button.addEventListener('click', (event) => {
        let productElement = event.target.closest('.item');
        let productId = productElement.getAttribute('data-id');
        let productName = productElement.querySelector('h2').textContent;
        let productPrice = parseFloat(productElement.querySelector('.price').textContent.replace('TND', '').trim());

        // Créer un produit
        let product = new Product(productId, productName, productPrice);

        // Ajouter le produit au panier
        cart.addItem(product, 1);

        // Mettre à jour l'affichage du panier
        updateCartDisplay();
        updateCartCount();
    });
});

// Afficher les produits du panier
function updateCartDisplay() {
    listCart.innerHTML = '';  // Réinitialiser l'affichage
    cart.displayItems();  // Afficher les éléments du panier
}
