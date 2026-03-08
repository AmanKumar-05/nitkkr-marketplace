async function loadMyItems() {

  const token = localStorage.getItem("token");

  const res = await fetch("http://localhost:3000/api/items/mine", {

    headers: {
      "Authorization": "Bearer " + token
    }

  });

  const items = await res.json();

  const container = document.getElementById("my-items");

  container.innerHTML = "";

  items.forEach(item => {

    const card = document.createElement("div");

    card.innerHTML = `
      <h3>${item.title}</h3>
      <p>${item.price}</p>
      <button onclick="markSold('${item._id}')">Mark Sold</button>
    `;

    container.appendChild(card);

  });

}

loadMyItems();

async function markSold(id) {

  const token = localStorage.getItem("token");

  await fetch(`http://localhost:3000/api/items/${id}/sold`, {

    method: "PATCH",

    headers: {
      "Authorization": "Bearer " + token
    }

  });

  loadMyItems();

}