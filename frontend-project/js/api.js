// js/api.js

function getItems() {
  return JSON.parse(localStorage.getItem("items")) || [];
}

function saveItems(items) {
  localStorage.setItem("items", JSON.stringify(items));
}

function addItem(item) {
  const items = getItems();
  items.push(item);
  saveItems(items);
}

function getUserItems(email) {
  return getItems().filter(i => i.sellerEmail === email);
}

function markItemSold(id) {
  const items = getItems().map(i =>
    i.id === id ? { ...i, status: "sold" } : i
  );
  saveItems(items);
}