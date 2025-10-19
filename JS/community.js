document.addEventListener("DOMContentLoaded", () => {
  const statMembers = document.getElementById("stat-members");
  const statDiscussions = document.getElementById("stat-discussions");
  const statPolls = document.getElementById("stat-polls");
  const statMemes = document.getElementById("stat-memes");
  const postForm = document.getElementById("postForm");
  const postContentInput = document.getElementById("postContent");
  const feedContainer = document.getElementById("feedContainer");
  const filterButtons = document.querySelectorAll(".filter-btn");

  function getLocalPosts() {
    return JSON.parse(localStorage.getItem("communityPosts")) || [];
  }

  function saveLocalPosts(posts) {
    localStorage.setItem("communityPosts", JSON.stringify(posts));
  }

  function createPostCard(post) {
    const card = document.createElement("div");
    card.classList.add("post-card", post.type);

    let icon = "";
    if (post.type === "discussions") icon = "🗣️";
    else if (post.type === "polls") icon = "📊";
    else if (post.type === "memes") icon = "😂";
    else icon = "ℹ";

    card.innerHTML = `
      <div class="post-header">
        ${icon} <strong>${post.type}</strong> by <b>${post.user}</b> • ${post.time}
      </div>
      <div class="post-body">
        <p>${post.content}</p>
      </div>
      <div class="post-footer">
        <button class="like-btn">👍 ${post.likes || 13}</button>
        <button class="comment-btn">💬 ${post.comments || 6}</button>
      </div>
    `;
    return card;
  }

  function loadFeed(filter = "all") {
    feedContainer.innerHTML = '<p class="loading-state">Loading recent activity...</p>';
    const allPosts = getLocalPosts();
    const filteredPosts =
      filter === "all"
        ? allPosts
        : allPosts.filter((post) => post.type === filter);

    feedContainer.innerHTML = "";

    if (filteredPosts.length === 0) {
      feedContainer.innerHTML = `<p class="empty-feed-state">No activity found for this filter.</p>`;
      return;
    }

    filteredPosts
      .sort((a, b) => new Date(b.time) - new Date(a.time))
      .forEach((post) => feedContainer.appendChild(createPostCard(post)));
  }

  postForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const content = postContentInput.value.trim();
    if (!content) return;

    const newPost = {
      id: Date.now(),
      user: "Celine (Admin)",
      content,
      time: new Date().toLocaleString(),
      type: document.querySelector('input[name="postType"]:checked')?.value || "discussions",
      likes: 0,
      comments: 0,
    };

    const posts = getLocalPosts();
    posts.push(newPost);
    saveLocalPosts(posts);

    feedContainer.prepend(createPostCard(newPost));
    postForm.reset();
    loadStats();
  });

  filterButtons.forEach((button) => {
    button.addEventListener("click", (e) => {
      const filter = e.target.getAttribute("data-filter");
      filterButtons.forEach((btn) => btn.classList.remove("active"));
      e.target.classList.add("active");
      loadFeed(filter);
    });
  });

  function loadStats() {
    const posts = getLocalPosts();
    statMembers.textContent = 107; 
    statDiscussions.textContent = posts.filter((p) => p.type === "discussions").length;
    statPolls.textContent = posts.filter((p) => p.type === "polls").length;
    statMemes.textContent = posts.filter((p) => p.type === "memes").length;
  }

  loadStats();
  loadFeed("all");
});

document.addEventListener("DOMContentLoaded", () => {
    const communityGallery = document.getElementById("communityGallery");
    const statMemes = document.getElementById("stat-memes");

    function loadCommunityMemes() {
        const savedMemes = JSON.parse(localStorage.getItem("memes")) || [];
        communityGallery.innerHTML = "";

        if (savedMemes.length > 0) {
            savedMemes.forEach(meme => {
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
                communityGallery.prepend(card);
            });
        } else {
            communityGallery.innerHTML = `<div class="empty-gallery-state">No memes yet.</div>`;
        }

        if (statMemes) statMemes.textContent = savedMemes.length;
    }

    loadCommunityMemes();
});

document.addEventListener("DOMContentLoaded", () => {
    const communityGallery = document.getElementById("communityGallery");
    const statMemes = document.getElementById("stat-memes");

    function loadCommunityMemes() {
        const savedMemes = JSON.parse(localStorage.getItem("memes")) || [];
        communityGallery.innerHTML = "";

        if (savedMemes.length > 0) {
            savedMemes.forEach(meme => {
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
                communityGallery.prepend(card);
            });
        } else {
            communityGallery.innerHTML = `<div class="empty-gallery-state">No memes yet.</div>`;
        }

        if (statMemes) statMemes.textContent = savedMemes.length;
    }

    window.addEventListener("storage", (e) => {
        if (e.key === "memes") loadCommunityMemes();
    });

    loadCommunityMemes();
});

function loadFeed(filter = "all") {
    feedContainer.innerHTML = '<p class="loading-state">Loading recent activity...</p>';
    const allPosts = JSON.parse(localStorage.getItem("communityPosts")) || [];
    const filteredPosts =
        filter === "all" ? allPosts : allPosts.filter(post => post.type === filter);

    feedContainer.innerHTML = "";

    if (filteredPosts.length === 0) {
        feedContainer.innerHTML = `<p class="empty-feed-state">No activity found for this filter.</p>`;
        return;
    }

    filteredPosts
        .sort((a, b) => new Date(b.time) - new Date(a.time))
        .forEach(post => feedContainer.appendChild(createPostCard(post)));
}

window.addEventListener("storage", () => {
    loadFeed("all");   
});
