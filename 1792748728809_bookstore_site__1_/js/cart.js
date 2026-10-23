/* BCS353 - Web Designing Workshop
   Simple shopping-cart logic shared by catalogue.html and cart.html.
   The cart is stored in the browser's localStorage as a JSON array:
   [{ name, price, qty }, ...]
*/

var CART_KEY = "bookstoreCart";

function getCart() {
  try {
    var data = localStorage.getItem(CART_KEY);
    return data ? JSON.parse(data) : [];
  } catch (e) {
    return [];
  }
}

function saveCart(cart) {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
}

function addToCart(name, price) {
  var cart = getCart();
  var existing = cart.find(function (item) { return item.name === name; });
  if (existing) {
    existing.qty += 1;
  } else {
    cart.push({ name: name, price: price, qty: 1 });
  }
  saveCart(cart);
  alert(name + " added to cart!");
}

function removeFromCart(name) {
  var cart = getCart().filter(function (item) { return item.name !== name; });
  saveCart(cart);
  renderCart();
}

function changeQty(name, delta) {
  var cart = getCart();
  var item = cart.find(function (i) { return i.name === name; });
  if (item) {
    item.qty += delta;
    if (item.qty <= 0) {
      removeFromCart(name);
      return;
    }
  }
  saveCart(cart);
  renderCart();
}

function renderCart() {
  var tbody = document.getElementById("cartBody");
  var totalCell = document.getElementById("cartTotal");
  if (!tbody) return;

  var cart = getCart();
  tbody.innerHTML = "";
  var total = 0;

  if (cart.length === 0) {
    tbody.innerHTML = '<tr><td colspan="4">Your cart is empty. Visit the ' +
      '<a href="catalogue.html">Catalogue</a> to add books.</td></tr>';
  } else {
    cart.forEach(function (item) {
      var amount = item.price * item.qty;
      total += amount;

      var row = document.createElement("tr");
      row.innerHTML =
        "<td></td>" +
        "<td>$" + item.price.toFixed(2) + "</td>" +
        '<td><button class="qty-btn" data-action="dec">-</button> ' +
        item.qty +
        ' <button class="qty-btn" data-action="inc">+</button></td>' +
        "<td>$" + amount.toFixed(2) +
        ' &nbsp; <button class="remove-btn" data-action="remove">Remove</button></td>';
      // textContent keeps book names safe, whatever characters they contain
      row.cells[0].textContent = item.name;

      row.querySelector('[data-action="dec"]').onclick =
        function () { changeQty(item.name, -1); };
      row.querySelector('[data-action="inc"]').onclick =
        function () { changeQty(item.name, 1); };
      row.querySelector('[data-action="remove"]').onclick =
        function () { removeFromCart(item.name); };

      tbody.appendChild(row);
    });
  }

  if (totalCell) {
    totalCell.textContent = "$" + total.toFixed(2);
  }
}

// Show the department chosen in the left frame (?dept=CSE etc.) in the heading
function showDepartmentHeading() {
  var params = new URLSearchParams(window.location.search);
  var dept = params.get("dept");
  var heading = document.getElementById("catalogueHeading");
  if (dept && heading) {
    heading.textContent = "Book Catalogue – " + dept + " Recommended Reading";
  }
}

// Wire up the Add to Cart buttons on the catalogue page
document.addEventListener("DOMContentLoaded", function () {
  var buttons = document.querySelectorAll(".add-cart-btn");
  buttons.forEach(function (btn) {
    btn.addEventListener("click", function () {
      addToCart(btn.dataset.name, parseFloat(btn.dataset.price));
    });
  });
});
