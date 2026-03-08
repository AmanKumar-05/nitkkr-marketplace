// js/dashboard.js

const user = JSON.parse(localStorage.getItem("currentUser"));
const role = localStorage.getItem("role");

// Only protect private pages
const privatePages = ["dashboard.html", "sell.html", "mylistings.html", "profile.html"];
const currentPage = window.location.pathname.split("/").pop();

// If page is private and no user → go home
if (privatePages.includes(currentPage) && !user) {
  window.location.href = "index.html";
}

if (!user) {
  window.location.href = "index.html";
}

const welcome = document.getElementById("welcome-user");
if (welcome && user.name) {
  welcome.textContent = `Welcome, ${user.name} 👋`;
}
// Protect dashboard & private pages
if (
  window.location.pathname.includes("dashboard.html") ||
  window.location.pathname.includes("sell.html") ||
  window.location.pathname.includes("mylistings.html")
) {
  if (!user) {
    window.location.href = "index.html";
  }
}

// Guest restriction
if (role === "guest") {
  if (
    window.location.pathname.includes("dashboard.html") ||
    window.location.pathname.includes("sell.html") ||
    window.location.pathname.includes("mylistings.html")
  ) {
    window.location.href = "buy.html";
  }
}

// Logout
function logoutUser() {
  localStorage.clear();
  window.location.href = "index.html";
}
function confirmLogout() {
  if (confirm("Are you sure you want to logout?")) {
    localStorage.clear();
    window.location.href = "index.html";
  }
}


function toggleMenu() {
  const menu = document.getElementById("dropdown");
  menu.style.display = menu.style.display === "flex" ? "none" : "flex";
}

function confirmLogout() {
  if (confirm("Are you sure you want to logout?")) {
    localStorage.clear();
    window.location.href = "index.html";
  }
}

// Close menu if clicked outside
window.addEventListener("click", function (e) {
  const menu = document.getElementById("dropdown");
  const icon = document.querySelector(".profile-icon");

  if (menu && !menu.contains(e.target) && e.target !== icon) {
    menu.style.display = "none";
  }
});