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
