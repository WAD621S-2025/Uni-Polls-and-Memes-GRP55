document.addEventListener("DOMContentLoaded", () => {
    const profilePhoto = document.getElementById("profile-photo");
    const profilePhotoPlaceholder = document.getElementById("profile-photo-placeholder");
    const photoUploadInput = document.getElementById("photo-upload");
    const displayName = document.getElementById("display-name");
    const displayUsername = document.getElementById("display-username");
    const displayEmail = document.getElementById("display-email");
    const displayBio = document.getElementById("display-bio");

    const statNumbers = document.querySelectorAll(".profile-stats .stat-number");

    const showFields = {
        name: document.getElementById("show-name"),
        username: document.getElementById("show-username"),
        email: document.getElementById("show-email"),
        phone: document.getElementById("show-phone"),
        campus: document.getElementById("show-campus"),
        major: document.getElementById("show-major"),
        year: document.getElementById("show-year"),
        bio: document.getElementById("show-bio")
    };

    const editFields = {
        name: document.getElementById("edit-name"),
        username: document.getElementById("edit-username"),
        email: document.getElementById("edit-email"),
        phone: document.getElementById("edit-phone"),
        campus: document.getElementById("edit-campus"),
        major: document.getElementById("edit-major"),
        year: document.getElementById("edit-year"),
        bio: document.getElementById("edit-bio")
    };

    const infoDisplay = document.getElementById("info-display");
    const infoEdit = document.getElementById("info-edit");
    const editBtn = document.getElementById("edit-info-btn");
    const saveBtn = infoEdit.querySelector(".save-btn");
    const cancelBtn = infoEdit.querySelector(".cancel-btn");

    function loadUserInfo() {
        const user = {
            name: localStorage.getItem("name") || "",
            username: localStorage.getItem("username") || "",
            email: localStorage.getItem("email") || "",
            phone: localStorage.getItem("phone") || "",
            campus: localStorage.getItem("campus") || "",
            major: localStorage.getItem("major") || "",
            year: localStorage.getItem("year") || "",
            bio: localStorage.getItem("bio") || "",
            profilePhoto: localStorage.getItem("profilePhoto") || ""
        };

        if (user.profilePhoto) {
            profilePhoto.src = user.profilePhoto;
            profilePhoto.style.display = "block";
            profilePhotoPlaceholder.style.display = "none";
        } else {
            profilePhoto.style.display = "none";
            profilePhotoPlaceholder.style.display = "block";
        }

        displayName.textContent = user.name || "Add your name";
        displayUsername.textContent = user.username || "Add username";
        displayEmail.textContent = user.email || "Add email";
        displayBio.textContent = user.bio || "What do you want us to know about yourself?";

        Object.keys(showFields).forEach(key => {
            showFields[key].textContent = user[key] || "Not provided";
            editFields[key].value = user[key] || "";
        });
    }

    photoUploadInput.addEventListener("change", () => {
        if (!photoUploadInput.files[0]) return;
        const reader = new FileReader();
        reader.onload = e => {
            localStorage.setItem("profilePhoto", e.target.result);
            loadUserInfo();
            window.dispatchEvent(new Event("storage"));

const username = localStorage.getItem("username") || "";
statNumbers[0].textContent = allPolls.filter(p => p.createdBy === username).length;
statNumbers[1].textContent = memes.filter(m => m.createdBy === username).length;
statNumbers[2].textContent = Object.values(userVotes).filter(v => v.voter === username).length;

        };
        reader.readAsDataURL(photoUploadInput.files[0]);
    });

    editBtn.addEventListener("click", () => {
        infoDisplay.style.display = "none";
        infoEdit.style.display = "grid";
    });

    cancelBtn.addEventListener("click", () => {
        infoEdit.style.display = "none";
        infoDisplay.style.display = "grid";
        loadUserInfo();
    });

    saveBtn.addEventListener("click", () => {
        Object.keys(editFields).forEach(key => {
            localStorage.setItem(key, editFields[key].value.trim());
        });
        infoEdit.style.display = "none";
        infoDisplay.style.display = "grid";
        loadUserInfo();
    });

function loadStats() {
    const username = localStorage.getItem("username") || "Anonymous";
    const allPolls = JSON.parse(localStorage.getItem("communityPosts")) || [];
    const allMemes = JSON.parse(localStorage.getItem("memes")) || [];
    const userVotes = JSON.parse(localStorage.getItem("userVotes")) || {};

    statNumbers[0].textContent = 17
    statNumbers[1].textContent = 63
    statNumbers[2].textContent = 44
    statNumbers[3].textContent = 105;
}

loadUserInfo();
loadStats();


    window.addEventListener("storage", () => {
        loadUserInfo();
        loadStats();
    });
});
