document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("memeForm");
    const gallery = document.getElementById("memeGallery");
    const fileInput = document.getElementById("memeFile");
    const captionInput = document.getElementById("memeCaption");

    function loadMemes() {
        const savedMemes = JSON.parse(localStorage.getItem("memes")) || [];
        gallery.innerHTML = "";

        if (savedMemes.length > 0) {
            savedMemes.forEach(meme => addMemeCard(meme, gallery));
        } else {
            gallery.innerHTML = `<div class="empty-gallery-state">No memes yet. Upload one!</div>`;
        }
    }

    function addMemeCard(meme, container) {
        const card = document.createElement("div");
        card.classList.add("meme-card");

        const img = document.createElement("img");
        img.src = meme.image_path;
        img.alt = meme.caption || "Meme";
        img.classList.add("meme-image");

        const caption = document.createElement("p");
        caption.textContent = meme.caption || "";
        caption.classList.add("meme-caption");

        card.appendChild(img);
        card.appendChild(caption);
        container.prepend(card);
    }

    form?.addEventListener("submit", (e) => {
        e.preventDefault();
        if (!fileInput.files[0]) return alert("Select an image.");

        const reader = new FileReader();
        reader.onload = function(event) {
            const newMeme = {
                id: Date.now(),
                image_path: event.target.result,
                caption: captionInput.value.trim()
            };

            const savedMemes = JSON.parse(localStorage.getItem("memes")) || [];
            savedMemes.unshift(newMeme);
            localStorage.setItem("memes", JSON.stringify(savedMemes));

            addMemeCard(newMeme, gallery);

            const communityPosts = JSON.parse(localStorage.getItem("communityPosts")) || [];
            communityPosts.unshift({
                id: newMeme.id,
                user: "Celine (Admin)",
                content: newMeme.caption || "Shared a meme",
                time: new Date().toLocaleString(),
                type: "memes",
                likes: 0,
                comments: 0
            });
            localStorage.setItem("communityPosts", JSON.stringify(communityPosts));

            window.dispatchEvent(new Event('storage'));

            form.reset();
        };
        reader.readAsDataURL(fileInput.files[0]);
    });

    loadMemes();
});
