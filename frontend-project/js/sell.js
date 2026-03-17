const token = localStorage.getItem("token");

// Protect page
if (!token) {
  window.location.href = "index.html";
}

let isSubmitting = false; // 🔥 prevent multiple clicks

async function createItem() {

  if (isSubmitting) return; // 🔥 block duplicate clicks

  const button = document.querySelector("button[onclick='createItem()']");

  if (button) {
    button.disabled = true;
    button.innerText = "Posting...";
  }

  const formData = new FormData();

  const title = document.getElementById("title")?.value.trim();
  const category = document.getElementById("category")?.value;
  const price = document.getElementById("price")?.value;
  const description = document.getElementById("description")?.value.trim();

  const imageInput = document.getElementById("image");
  const imageFile = imageInput?.files[0];

  // ✅ Validation
  if (!title || !price) {
    alert("Please fill required fields (Title & Price)");

    resetButton(button);
    return;
  }

  if (!category || category === "Select category") {
    alert("Please select a category");

    resetButton(button);
    return;
  }

  // 🔥 Start submission lock
  isSubmitting = true;

  formData.append("title", title);
  formData.append("category", category);
  formData.append("price", price);
  formData.append("description", description);

  if (imageFile) {
    formData.append("image", imageFile);
  }

  try {

    const res = await fetch("https://nitkkr-marketplace-api.onrender.com/api/items", {

      method: "POST",

      headers: {
        "Authorization": "Bearer " + token
      },

      body: formData
    });

    const data = await res.json();

    if (res.ok) {

      alert("Item Listed Successfully");

      // 🔥 Optional: clear form before redirect (safe UX)
      document.querySelector("form")?.reset();

      window.location.href = "mylistings.html";

    } else {

      alert(data.message || "Failed to list item");

    }

  } catch (error) {

    console.error("Item creation error:", error);
    alert("Server error while listing item");

  } finally {

    isSubmitting = false; // 🔥 unlock

    resetButton(button);

  }

}


// 🔥 helper function (clean UI reset)
function resetButton(button) {
  if (button) {
    button.disabled = false;
    button.innerText = "Post Item";
  }
}