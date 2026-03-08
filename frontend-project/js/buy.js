async function loadItems() {

  const res = await fetch("https://nitkkr-marketplace-api.onrender.com/api/items");
  const items = await res.json();

  const container = document.getElementById("items-container");

  container.innerHTML = "";

  items.forEach(item => {

    const card = document.createElement("div");
    card.className = "item-card";

    card.innerHTML = `
      <h3>${item.title}</h3>
      <p>₹ ${item.price}</p>
      <p>${item.description}</p>
      <p>Seller: ${item.seller.name}</p>
      <p>Email: ${item.seller.email}</p>
    `;

    container.appendChild(card);

  });

}

loadItems();