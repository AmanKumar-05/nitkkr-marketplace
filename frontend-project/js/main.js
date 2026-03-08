// js/main.js

function continueAsUser(role) {
  localStorage.setItem("role", role); // student or staff
  window.location.href = "login.html";
}
