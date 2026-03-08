// Check if user is logged in
const token = localStorage.getItem("token");

if (!token) {
  window.location.href = "index.html";
}


// Load profile from backend
async function loadProfile() {

  try {

    const res = await fetch("https://nitkkr-marketplace-api.onrender.com/api/user/me", {
      headers: {
        "Authorization": "Bearer " + token
      }
    });

    const user = await res.json();

    document.getElementById("p-name").value = user.name || "";
    document.getElementById("p-email").value = user.email || "";
    document.getElementById("p-roll").value = user.roll || "";
    document.getElementById("p-hostel").value = user.hostel || "";
    document.getElementById("p-mobile").value = user.mobile || "";

  } catch (error) {

    console.error("Profile load error:", error);

  }

}

loadProfile();


// Update profile
async function saveProfile() {

  const hostel = document.getElementById("p-hostel").value;
  const mobile = document.getElementById("p-mobile").value;

  try {

    await fetch("https://nitkkr-marketplace-api.onrender.com/api/user/me", {

      method: "PUT",

      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + token
      },

      body: JSON.stringify({
        hostel,
        mobile
      })

    });

    alert("Profile Updated Successfully");

  } catch (error) {

    console.error("Profile update error:", error);

  }

}


// Logout
function logoutUser() {

  if (confirm("Are you sure you want to logout?")) {

    localStorage.removeItem("token");

    window.location.href = "index.html";

  }

}