async function createItem() {

  const token = localStorage.getItem("token");

  const title = document.getElementById("title").value;
  const category = document.getElementById("category").value;
  const price = document.getElementById("price").value;
  const description = document.getElementById("description").value;

  const res = await fetch("http://localhost:3000/api/items", {

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

  alert("Item Listed Successfully");

}