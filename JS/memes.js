document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("memeForm");
    const gallery = document.getElementById("memeGallery");

    async function loadMemes() {
        try {
            const res = await fetch("getMemes.php");
            const memes = await res.json(); 

            gallery.innerHTML = "";

            if (!memes || memes.length === 0) {
                gallery.innerHTML = `<div class="empty-gallery-state">No memes yet. Upload one!</div>`;
                return;
            }

            memes.forEach(meme => addMemeCard(meme));
        } catch (err) {
            console.error("Error loading memes:", err);
            gallery.innerHTML = `<div class="empty-gallery-state">Could not load memes.</div>`;
        }
    }

    function addMemeCard(meme) {
        const card = document.createElement("div");
        card.classList.add("meme-card");

        const imgContainer = document.createElement("div");
        imgContainer.classList.add("meme-image-container");

        const img = document.createElement("img");
        img.classList.add("meme-image");
        img.src = meme.image_path;
        img.alt = meme.caption || "Meme";

        imgContainer.appendChild(img);

        const content = document.createElement("div");
        content.classList.add("meme-content");

        const caption = document.createElement("p");
        caption.classList.add("meme-caption");
        caption.textContent = meme.caption || "";

        content.appendChild(caption);
        card.appendChild(imgContainer);
        card.appendChild(content);

        gallery.prepend(card);
    }

    form.addEventListener("submit", async (e) => {
        e.preventDefault();
        const data = new FormData(form);
        const submitButton = form.querySelector('button[type="submit"]');

        submitButton.disabled = true;
        submitButton.textContent = "Uploading...";

        try {
            const res = await fetch("uploadMeme.php", {
                method: "POST",
                body: data
            });

            const result = await res.json();

            if (result && result.image_path) {
                alert("Meme uploaded successfully!");
                form.reset();

                const newMeme = {
                    image_path: result.image_path,
                    caption: result.caption || ''
                };

                addMemeCard(newMeme);

            } else {
                const errorMessage = result.error || "Upload failed.";
                alert("Upload failed: " + errorMessage);
            }

        } catch (err) {
            console.error("Upload error:", err);
            alert("Something went wrong while uploading your meme.");
        } finally {
            submitButton.disabled = false;
            submitButton.textContent = "Upload Meme";
        }
    });

    loadMemes();
});
