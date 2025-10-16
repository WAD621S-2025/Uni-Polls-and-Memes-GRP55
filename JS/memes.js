document.addEventListener("DOMContentLoaded", () => {
  console.log("Loading memes...");
  loadMemes();
});
function loadMemes() {
  fetch("getMemes.php")
    .then(response => response.json())
    .then(memes => {
      const container = document.getElementById("memes");
      container.innerHTML = "";

      if (memes.length === 0) {
        container.innerHTML = "<p>No memes found.</p>";
        return;
      }

      memes.forEach(meme => {
        const memeBox = document.createElement("div");
        memeBox.classList.add("meme-box");

        const img = document.createElement("img");
        img.src = meme.image_path;
        img.alt = "Meme image";

        const caption = document.createElement("p");
        caption.textContent = meme.caption;

        memeBox.appendChild(img);
        memeBox.appendChild(caption);
        container.appendChild(memeBox);
      });
    })
    .catch(err => {
      console.error("Failed to load memes:", err);
      document.getElementById("memes").innerHTML =
        "<p>Could not load memes right now. Please try again later.</p>";
    });
}
document.addEventListener("DOMContentLoaded", () => {
  console.log("Memes page ready 🧠 Loading memes...");
  loadMemes();

  // Set up form submission listener
  const uploadForm = document.getElementById("uploadForm");
  if (uploadForm) {
    uploadForm.addEventListener("submit", handleUpload);
  }
});

function loadMemes() {
  fetch("getMemes.php")
    .then(response => response.json())
    .then(memes => {
      const container = document.getElementById("memes");
      container.innerHTML = "";

      if (!memes || memes.length === 0) {
        container.innerHTML = "<p>No memes available yet.</p>";
        return;
      }

      memes.forEach(meme => {
        const memeBox = document.createElement("div");
        memeBox.classList.add("meme-box");

        const img = document.createElement("img");
        img.src = meme.image_path;
        img.alt = meme.caption || "Meme";

        const caption = document.createElement("p");
        caption.textContent = meme.caption || "";

        memeBox.appendChild(img);
        memeBox.appendChild(caption);
        container.appendChild(memeBox);
      });
    })
    .catch(err => {
      console.error("Error loading memes:", err);
      document.getElementById("memes").innerHTML =
        "<p>⚠️ Could not load memes. Please try again later.</p>";
    });
}

// Function to handle meme uploads
function handleUpload(e) {
  e.preventDefault(); // Stop the page from refreshing

  const form = e.target;
  const formData = new FormData(form);

  // Debug message
  console.log("Uploading meme...");

  fetch("uploadMeme.php", {
    method: "POST",
    body: formData
  })
    .then(response => response.text())
    .then(result => {
      if (result.trim().toLowerCase() === "success") {
        alert("✅ Meme uploaded successfully!");
        form.reset(); // Clear form fields
        loadMemes();  // Reload meme list
      } else {
        alert("⚠️ Upload failed: " + result);
      }
    })
    .catch(error => {
      console.error("Upload error:", error);
      alert("❌ Something went wrong while uploading your meme.");
    });
}
