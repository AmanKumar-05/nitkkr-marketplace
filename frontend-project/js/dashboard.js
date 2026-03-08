// js/dashboard.js

const token = localStorage.getItem("token");
const role = localStorage.getItem("role");
const user = JSON.parse(localStorage.getItem("currentUser"));

// Pages that require login
const privatePages = ["dashboard.html", "sell.html", "mylistings.html", "profile.html"];
const currentPage = window.location.pathname.split("/").pop();

// Protect private pages
if (privatePages.includes(currentPage) && !token) {
  window.location.href = "index.html";
}

// Guest restriction
if (role === "guest") {
  if (
    currentPage === "dashboard.html" ||
    currentPage === "sell.html" ||
    currentPage === "mylistings.html"
  ) {
    window.location.href = "buy.html";
  }
}

// Welcome message
const welcome = document.getElementById("welcome-user");
if (welcome && user && user.name) {
  welcome.textContent = `Welcome, ${user.name} 👋`;
}

// Logout
function logoutUser() {
  localStorage.clear();
  window.location.href = "index.html";
}

// Confirm logout
function confirmLogout() {
  if (confirm("Are you sure you want to logout?")) {
    localStorage.clear();
    window.location.href = "index.html";
  }
}

// Toggle profile dropdown
function toggleMenu() {
  const menu = document.getElementById("dropdown");
  if (menu) {
    menu.style.display = menu.style.display === "flex" ? "none" : "flex";
  }
}

// Close dropdown if clicked outside
window.addEventListener("click", function (e) {
  const menu = document.getElementById("dropdown");
  const icon = document.querySelector(".profile-icon");

  if (menu && icon && !menu.contains(e.target) && e.target !== icon) {
    menu.style.display = "none";
  }
});