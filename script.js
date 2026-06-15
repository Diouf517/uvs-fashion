// --- Fonction notification stylisée avec type ---
function showNotification(message, type = "info") {
  let notif = document.createElement("div");
  notif.className = `notification ${type}`;
  notif.textContent = message;
  document.body.appendChild(notif);

  setTimeout(() => notif.classList.add("show"), 100);
  setTimeout(() => {
    notif.classList.remove("show");
    setTimeout(() => notif.remove(), 400);
  }, 3000);
}

// --- Mettre à jour le compteur global ---
function updateCartCount() {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  let totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  document.getElementById("panier-link").textContent = `Panier (${totalItems})`;
}

// --- Boutons "Ajouter au panier" ---
const addButtons = document.querySelectorAll(".product button");

addButtons.forEach(button => {
  button.addEventListener("click", () => {
    showNotification("✅ Produit ajouté au panier !", "success");

    let productName = button.parentElement.querySelector("h3").textContent;
    let productPrice = parseInt(button.parentElement.querySelector("p").textContent.replace(/\D/g, ""));
    let productImage = button.parentElement.querySelector("img").getAttribute("src");

    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    let existingProduct = cart.find(item => item.name === productName);

    if (existingProduct) {
      existingProduct.quantity += 1;
    } else {
      cart.push({ name: productName, price: productPrice, quantity: 1, image: productImage });
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    updateCartCount(); // 🔥 mise à jour immédiate
  });
});

// --- Observer pour animations (images visibles) ---
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add("visible");
    }
  });
}, { threshold: 0.2 });

const products = document.querySelectorAll(".product");
products.forEach(product => {
  observer.observe(product);
});

// --- Affichage du panier dans panier.html ---
function displayCart() {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  let cartItemsContainer = document.getElementById("cart-items");
  let cartTotal = document.getElementById("cart-total");

  if (!cartItemsContainer) return;

  cartItemsContainer.innerHTML = "";
  let total = 0;

  cart.forEach((item, index) => {
    let itemTotal = item.price * item.quantity;
    total += itemTotal;

    cartItemsContainer.innerHTML += `
      <tr>
        <td><img src="${item.image}" alt="${item.name}" style="width:60px;height:auto;border-radius:4px;"> ${item.name}</td>
        <td>${item.price} FCFA</td>
        <td>${item.quantity}</td>
        <td>${itemTotal} FCFA</td>
        <td><button onclick="removeFromCart(${index})">Supprimer</button></td>
      </tr>
    `;
  });

  cartTotal.textContent = `${total} FCFA`;
}

// --- Supprimer un produit ---
function removeFromCart(index) {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  cart.splice(index, 1);
  localStorage.setItem("cart", JSON.stringify(cart));
  displayCart();
  updateCartCount();
  showNotification("❌ Produit supprimé !", "error");
}

// --- Vider le panier ---
function clearCart() {
  localStorage.removeItem("cart");
  displayCart();
  updateCartCount();
  showNotification("ℹ️ Panier vidé !", "info");
}

// --- Initialisation ---
document.addEventListener("DOMContentLoaded", () => {
  updateCartCount();
  if (document.getElementById("cart-items")) {
    displayCart();
  }
});

// --- Gestion du formulaire de connexion ---
document.addEventListener("DOMContentLoaded", () => {
  const loginForm = document.getElementById("login-form");
  const errorMessage = document.getElementById("error-message");

  if (loginForm) {
    loginForm.addEventListener("submit", (e) => {
      e.preventDefault();

      const username = document.getElementById("username").value.trim();
      const password = document.getElementById("password").value.trim();

      if (username === "admin" && password === "1234") {
        window.location.href = "home.html";
      } else {
        errorMessage.textContent = "Identifiants incorrects. Veuillez réessayer.";
      }
    });
  }
});
