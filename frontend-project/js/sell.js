// js/sell.js

// Check login
const token = localStorage.getItem("token");

if (!token) {
  window.location.href = "index.html";
}


async function createItem() {

  const title = document.getElementById("title").value;
  const category = document.getElementById("category").value;
  const price = document.getElementById("price").value;
  const description = document.getElementById("description").value;

  try {

    const res = await fetch("https://nitkkr-marketplace-api.onrender.com/api/items", {

      method: "POST",

      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + token
      },

      body: JSON.stringify({
        title,
        category,
        price,
        description
      })

    });

    const data = await res.json();

    if (res.ok) {
      alert("Item Listed Successfully");
      window.location.href = "mylistings.html";
    } else {
      alert(data.message || "Failed to list item");
    }

  } catch (error) {

    console.error("Item creation error:", error);
    alert("Server error while listing item");

  }

}