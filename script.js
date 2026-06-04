const dishes = [
  {
    id: "lemon-seabass",
    name: "Lemon Sea Bass",
    category: "seafood",
    price: 27.5,
    rating: 4.9,
    time: "18 min",
    popular: true,
    image: "https://images.unsplash.com/photo-1559847844-5315695dadae?auto=format&fit=crop&w=900&q=80",
    description: "Grilled sea bass with lemon butter, tender herbs, and seasonal vegetables.",
    tags: ["Seafood", "Lemon", "Herbs"]
  },
  {
    id: "mushroom-risotto",
    name: "Wild Mushroom Risotto",
    category: "vegetarian",
    price: 21,
    rating: 4.8,
    time: "16 min",
    popular: false,
    image: "https://images.unsplash.com/photo-1476124369491-e7addf5db371?auto=format&fit=crop&w=900&q=80",
    description: "Creamy arborio rice with roasted mushrooms, aged parmesan, and truffle oil.",
    tags: ["Vegetarian", "Parmesan", "Truffle"]
  },
  {
    id: "ember-steak",
    name: "Ember-Grilled Steak",
    category: "meat",
    price: 34,
    rating: 4.9,
    time: "22 min",
    popular: true,
    image: "https://images.unsplash.com/photo-1600891964092-4316c288032e?auto=format&fit=crop&w=900&q=80",
    description: "Charcoal-grilled steak with black pepper jus and crisp golden potatoes.",
    tags: ["Meat", "Charcoal", "Pepper"]
  },
  {
    id: "herb-pasta",
    name: "Basil Pesto Pasta",
    category: "vegetarian",
    price: 18.75,
    rating: 4.7,
    time: "14 min",
    popular: false,
    image: "https://images.unsplash.com/photo-1551183053-bf91a1d81141?auto=format&fit=crop&w=900&q=80",
    description: "Fresh pasta tossed with basil pesto, cherry tomatoes, and soft cheese.",
    tags: ["Pasta", "Basil", "Light"]
  },
  {
    id: "shrimp-tacos",
    name: "Spiced Shrimp Tacos",
    category: "seafood",
    price: 19.5,
    rating: 4.6,
    time: "12 min",
    popular: false,
    image: "https://images.unsplash.com/photo-1551504734-5ee1c4a1479b?auto=format&fit=crop&w=900&q=80",
    description: "Marinated shrimp, bright slaw, mango chili sauce, and warm tortillas.",
    tags: ["Shrimp", "Mango", "Chili"]
  },
  {
    id: "garden-bowl",
    name: "Roasted Garden Bowl",
    category: "vegetarian",
    price: 16.25,
    rating: 4.5,
    time: "10 min",
    popular: false,
    image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=900&q=80",
    description: "Quinoa, chickpeas, avocado, roasted vegetables, and lemon tahini.",
    tags: ["Healthy", "Quinoa", "Tahini"]
  },
  {
    id: "date-pudding",
    name: "Date Caramel Pudding",
    category: "dessert",
    price: 11,
    rating: 4.9,
    time: "8 min",
    popular: true,
    image: "https://images.unsplash.com/photo-1565958011703-44f9829ba187?auto=format&fit=crop&w=900&q=80",
    description: "Warm date cake with salted caramel and light vanilla cream.",
    tags: ["Dessert", "Date", "Caramel"]
  },
  {
    id: "citrus-cheesecake",
    name: "Citrus Cheesecake",
    category: "dessert",
    price: 12.5,
    rating: 4.7,
    time: "7 min",
    popular: false,
    image: "https://images.unsplash.com/photo-1533134242443-d4fd215305ad?auto=format&fit=crop&w=900&q=80",
    description: "Creamy cheesecake with lemon-orange curd and a crisp biscuit base.",
    tags: ["Citrus", "Cream", "Chilled"]
  }
];

const state = {
  filter: "all",
  query: "",
  cart: {}
};

const menuGrid = document.querySelector("#menuGrid");
const filterTabs = document.querySelector("#filterTabs");
const menuSearch = document.querySelector("#menuSearch");
const cartItems = document.querySelector("#cartItems");
const subtotalEl = document.querySelector("#subtotal");
const serviceEl = document.querySelector("#service");
const totalEl = document.querySelector("#total");
const orderCountEl = document.querySelector("#orderCount");
const checkoutBtn = document.querySelector("#checkoutBtn");
const navToggle = document.querySelector(".nav-toggle");
const navLinks = document.querySelector("#navLinks");
const reservationForm = document.querySelector("#reservation");

const money = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD"
});

function renderMenu() {
  const query = state.query.trim().toLowerCase();
  const filtered = dishes.filter((dish) => {
    const matchesFilter = state.filter === "all" || dish.category === state.filter;
    const matchesQuery = `${dish.name} ${dish.description} ${dish.tags.join(" ")}`
      .toLowerCase()
      .includes(query);
    return matchesFilter && matchesQuery;
  });

  if (!filtered.length) {
    menuGrid.innerHTML = '<p class="empty-cart">No dishes match your search.</p>';
    return;
  }

  menuGrid.innerHTML = filtered.map((dish) => `
    <article class="dish-card">
      <div class="dish-media">
        <img src="${dish.image}" alt="${dish.name}">
        <span class="price-badge">${money.format(dish.price)}</span>
        ${dish.popular ? '<span class="popular-badge">&#9733; Featured</span>' : ""}
      </div>
      <div class="dish-body">
        <div class="dish-title-row">
          <h3>${dish.name}</h3>
          <span class="rating">&#9733; ${dish.rating}</span>
        </div>
        <p>${dish.description}</p>
        <div class="tag-list">
          ${dish.tags.map((tag) => `<span>${tag}</span>`).join("")}
        </div>
        <div class="dish-footer">
          <span class="cook-time">${dish.time}</span>
          <button class="add-btn" type="button" data-add="${dish.id}">Add to Cart</button>
        </div>
      </div>
    </article>
  `).join("");
}

function renderCart() {
  const rows = Object.entries(state.cart);
  const count = rows.reduce((sum, [, qty]) => sum + qty, 0);
  const subtotal = rows.reduce((sum, [id, qty]) => {
    const dish = dishes.find((item) => item.id === id);
    return sum + dish.price * qty;
  }, 0);
  const service = subtotal * 0.12;
  const total = subtotal + service;

  orderCountEl.textContent = count;
  subtotalEl.textContent = money.format(subtotal);
  serviceEl.textContent = money.format(service);
  totalEl.textContent = money.format(total);

  if (!rows.length) {
    cartItems.innerHTML = '<p class="empty-cart">Choose a few dishes to begin your order.</p>';
    checkoutBtn.disabled = true;
    return;
  }

  checkoutBtn.disabled = false;
  cartItems.innerHTML = rows.map(([id, qty]) => {
    const dish = dishes.find((item) => item.id === id);
    return `
      <div class="cart-row">
        <img src="${dish.image}" alt="${dish.name}">
        <div class="cart-meta">
          <h4>${dish.name}</h4>
          <span>${money.format(dish.price)}</span>
          <div class="cart-controls">
            <button class="qty-btn" type="button" data-dec="${id}" aria-label="Decrease ${dish.name}">-</button>
            <strong>${qty}</strong>
            <button class="qty-btn" type="button" data-inc="${id}" aria-label="Increase ${dish.name}">+</button>
          </div>
        </div>
      </div>
    `;
  }).join("");
}

function addToCart(id) {
  state.cart[id] = (state.cart[id] || 0) + 1;
  renderCart();
}

function updateQuantity(id, amount) {
  if (!state.cart[id]) return;
  state.cart[id] += amount;

  if (state.cart[id] <= 0) {
    delete state.cart[id];
  }

  renderCart();
}

filterTabs.addEventListener("click", (event) => {
  const button = event.target.closest("[data-filter]");
  if (!button) return;

  state.filter = button.dataset.filter;
  document.querySelectorAll(".filter-btn").forEach((item) => {
    item.classList.toggle("active", item === button);
  });
  renderMenu();
});

menuSearch.addEventListener("input", (event) => {
  state.query = event.target.value;
  renderMenu();
});

menuGrid.addEventListener("click", (event) => {
  const button = event.target.closest("[data-add]");
  if (!button) return;
  addToCart(button.dataset.add);
});

cartItems.addEventListener("click", (event) => {
  const increment = event.target.closest("[data-inc]");
  const decrement = event.target.closest("[data-dec]");

  if (increment) {
    updateQuantity(increment.dataset.inc, 1);
  }

  if (decrement) {
    updateQuantity(decrement.dataset.dec, -1);
  }
});

checkoutBtn.addEventListener("click", () => {
  const count = Object.values(state.cart).reduce((sum, qty) => sum + qty, 0);
  if (!count) return;
  alert("Your order has been prepared. The Marea Table team will contact you to confirm.");
});

reservationForm.addEventListener("submit", (event) => {
  event.preventDefault();
  reservationForm.reset();
  alert("Reservation request received. We will confirm your table shortly.");
});

navToggle.addEventListener("click", () => {
  const isOpen = navLinks.classList.toggle("open");
  navToggle.setAttribute("aria-expanded", String(isOpen));
});

navLinks.addEventListener("click", () => {
  navLinks.classList.remove("open");
  navToggle.setAttribute("aria-expanded", "false");
});

renderMenu();
renderCart();

if (window.lucide) {
  window.lucide.createIcons();
}
