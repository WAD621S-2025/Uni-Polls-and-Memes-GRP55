document.addEventListener("DOMContentLoaded", () => {
    const statMembers = document.getElementById("stat-members");
    const statDiscussions = document.getElementById("stat-discussions");
    const statPolls = document.getElementById("stat-polls");
    const statMemes = document.getElementById("stat-memes");
    const postForm = document.getElementById("postForm");
    const postContentInput = document.getElementById("postContent");
    const feedContainer = document.getElementById("feedContainer");
    const filterButtons = document.querySelectorAll(".filter-btn");

    const API_ENDPOINTS = {
        stats: "getCommunityStats.php",
        posts: "getCommunityFeed.php",
        createPost: "createCommunityPost.php"
    };

    function createPostCard(post) {
        const card = document.createElement('div');
        card.classList.add('post-card', post.type);
        
        let headerContent = '';
        let footerContent = '';
        let icon = '';

        if (post.type === 'discussions') {
            icon = '🗣️';
            headerContent = `${icon} Discussion by **${post.user}** • ${post.time}`;
            footerContent = `<p class="post-text">${post.content}</p>`;
        } else if (post.type === 'polls') {
            icon = '📊';
            headerContent = `${icon} Poll shared by **${post.user}** • ${post.time}`;
            footerContent = `<p class="post-text">${post.content}</p><a href="${post.link || 'polls.html'}" class="cta-link">View Poll</a>`;
        } else if (post.type === 'memes') {
            icon = '😂';
            headerContent = `${icon} Meme shared by **${post.user}** • ${post.time}`;
            footerContent = `<p class="post-text">${post.content}</p><a href="${post.link || 'memes.html'}" class="cta-link">See Meme</a>`;
        } else {
            icon = 'ℹ';
            headerContent = `${icon} Activity by **${post.user}** • ${post.time}`;
            footerContent = `<p class="post-text">${post.content}</p>`;
        }

        card.innerHTML = `
            <div class="post-header">
                ${headerContent}
            </div>
            <div class="post-body">
                ${footerContent}
            </div>
            <div class="post-footer">
                <button class="like-btn">👍 ${post.likes || 0}</button>
                <button class="comment-btn">💬 ${post.comments || 0}</button>
            </div>
        `;
        return card;
    }

    async function loadFeed(filter = 'all') {
        feedContainer.innerHTML = '<p class="loading-state">Loading recent activity...</p>';
        
        try {
            const res = await fetch(`${API_ENDPOINTS.posts}?filter=${filter}`);
            
            if (!res.ok) {
                throw new Error(`Server returned status: ${res.status}`);
            }

            const filteredPosts = await res.json(); 

            feedContainer.innerHTML = '';
            
            if (!filteredPosts || filteredPosts.length === 0) {
                feedContainer.innerHTML = `<p class="empty-feed-state">No activity found for this filter.</p>`;
                return;
            }

            filteredPosts.forEach(post => {
                feedContainer.appendChild(createPostCard(post));
            });

        } catch (error) {
            console.error("Error loading feed:", error);
            feedContainer.innerHTML = `<p class="error-state">Error loading feed. Please check the network connection or ${API_ENDPOINTS.posts}.</p>`;
        }
    }

    postForm.addEventListener("submit", async (e) => {
        e.preventDefault();

        const content = postContentInput.value.trim();
        if (!content) return;

        const data = new FormData(postForm);
        
        const postButton = postForm.querySelector('.submit-post-btn');
        postButton.disabled = true;
        postButton.textContent = "Posting...";

        try {
            const res = await fetch(API_ENDPOINTS.createPost, {
                method: "POST", 
                body: data 
            });
            
            const newPostData = await res.json();
            
            if (newPostData && newPostData.id) {
                alert("Post created successfully!");
                postForm.reset();
                
                const newCard = createPostCard(newPostData);
                feedContainer.prepend(newCard); 
                
                loadStats();
                
            } else if (newPostData && newPostData.error) {
                 alert(`Post failed: ${newPostData.error}`);
            } else {
                alert("Post failed: Unknown server error.");
            }
        } catch (error) {
            console.error("Post creation error:", error);
            alert("An unexpected error occurred while posting.");
        } finally {
            postButton.disabled = false;
            postButton.textContent = "Post";
        }
    });

    filterButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            const filter = e.target.getAttribute('data-filter');
            
            filterButtons.forEach(btn => btn.classList.remove('active'));
            e.target.classList.add('active');

            loadFeed(filter);
        });
    });
    
    async function loadStats() {
        try {
            const res = await fetch(API_ENDPOINTS.stats);
            
            if (!res.ok) {
                throw new Error('Failed to fetch stats');
            }
            
            const stats = await res.json();

            statMembers.textContent = stats.members.toLocaleString() || '0';
            statDiscussions.textContent = stats.discussions.toLocaleString() || '0';
            statPolls.textContent = stats.polls.toLocaleString() || '0';
            statMemes.textContent = stats.memes.toLocaleString() || '0';

        } catch (error) {
            console.error("Error loading stats:", error);
            statMembers.textContent = '';
            statDiscussions.textContent = '';
            statPolls.textContent = '';
            statMemes.textContent = '';
        }
    }

    loadStats();
    loadFeed('all');
});