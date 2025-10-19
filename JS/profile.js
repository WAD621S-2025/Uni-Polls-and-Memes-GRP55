document.addEventListener('DOMContentLoaded', () => {
    initProfile();

    document.getElementById('edit-info-btn').addEventListener('click', toggleEditInfo);
    document.querySelector('.cancel-btn').addEventListener('click', cancelEdit);
    document.querySelector('.save-btn').addEventListener('click', saveInfo);
});

const API_ENDPOINTS = {
    GET_PROFILE: 'getProfile.php',
    UPDATE_PROFILE_INFO: 'updateProfile.php',
    UPDATE_PROFILE_PHOTO: 'updateProfilePhoto.php',
    EMPTY_PROFILE_PIC: '../images/emptyProfile.webp'
};

const elements = {
    display: {
        name: document.getElementById('show-name'),
        username: document.getElementById('show-username'),
        email: document.getElementById('show-email'),
        phone: document.getElementById('show-phone'),
        campus: document.getElementById('show-campus'),
        major: document.getElementById('show-major'),
        year: document.getElementById('show-year'),
        bio: document.getElementById('show-bio')
    },
    edit: {
        name: document.getElementById('edit-name'),
        username: document.getElementById('edit-username'),
        email: document.getElementById('edit-email'),
        phone: document.getElementById('edit-phone'),
        campus: document.getElementById('edit-campus'),
        major: document.getElementById('edit-major'),
        year: document.getElementById('edit-year'),
        bio: document.getElementById('edit-bio')
    },
    header: {
        name: document.getElementById('display-name'),
        username: document.getElementById('display-username'),
        email: document.getElementById('display-email'),
        bio: document.getElementById('display-bio')
    },
    profilePhoto: document.getElementById('profile-photo'),
    profilePlaceholder: document.getElementById('profile-photo-placeholder'),
    navPhoto: document.getElementById('nav-profile-pic'),
    navPlaceholder: document.getElementById('nav-profile-placeholder'),
    infoDisplay: document.getElementById('info-display'),
    infoEdit: document.getElementById('info-edit')
};

function initProfile() {
    loadProfile();
    const photoInput = document.getElementById('photo-upload');
    photoInput.addEventListener('change', handlePhotoUpload);
}

async function loadProfile() {
    try {
        const response = await fetch(API_ENDPOINTS.GET_PROFILE);
        
        if (!response.ok) {
            throw new Error(`Failed to fetch profile: ${response.statusText}`);
        }

        const profileData = await response.json();
        
        if (!profileData || profileData.error) {
            throw new Error(profileData.error || 'Profile data is empty or user not logged in.');
        }

        for (const key in elements.display) {
            const value = profileData[key] || '';
            elements.display[key].textContent = value || 'Not provided';
            if (key in elements.edit) {
                elements.edit[key].value = value;
            }
        }
        
        elements.header.name.textContent = profileData.name || 'Add your name';
        elements.header.username.textContent = profileData.username || 'Add username';
        elements.header.email.textContent = profileData.email || 'Add email';
        elements.header.bio.textContent = profileData.bio || 'What do you want us to know about yourself?';

        const photoPath = profileData.profilePhoto || API_ENDPOINTS.EMPTY_PROFILE_PIC;
        
        elements.profilePhoto.src = photoPath;
        elements.navPhoto.src = photoPath;

        const photoExists = photoPath !== API_ENDPOINTS.EMPTY_PROFILE_PIC;

        elements.profilePhoto.style.display = photoExists ? 'block' : 'none';
        elements.profilePlaceholder.style.display = photoExists ? 'none' : 'block';
        elements.navPhoto.style.display = photoExists ? 'block' : 'none';
        elements.navPlaceholder.style.display = photoExists ? 'none' : 'block';

    } catch (error) {
        console.error("Error loading profile:", error);
    }
}

function toggleEditInfo() {
    elements.infoDisplay.style.display = 'none';
    elements.infoEdit.style.display = 'grid';
}

function cancelEdit() {
    elements.infoEdit.style.display = 'none';
    elements.infoDisplay.style.display = 'grid';
    loadProfile();
}

async function saveInfo() {
    const data = new FormData();
    const saveButton = document.querySelector('.save-btn');

    for (const key in elements.edit) {
        data.append(key, elements.edit[key].value.trim());
    }
    
    saveButton.disabled = true;
    saveButton.textContent = 'Saving...';

    try {
        const response = await fetch(API_ENDPOINTS.UPDATE_PROFILE_INFO, {
            method: 'POST',
            body: data,
        });

        const result = await response.json();

        if (result.success) {
            alert("Profile information updated successfully!");
            loadProfile();
            cancelEdit();
        } else {
            alert("Update failed: " + (result.error || "Unknown server error."));
        }
    } catch (error) {
        console.error("Save error:", error);
        alert("Something went wrong while saving your profile.");
    } finally {
        saveButton.disabled = false;
        saveButton.textContent = 'Save';
    }
}

async function handlePhotoUpload(e) {
    const file = e.target.files[0];
    if (!file) return;

    const data = new FormData();
    data.append('profilePhoto', file);

    try {
        const response = await fetch(API_ENDPOINTS.UPDATE_PROFILE_PHOTO, {
            method: 'POST',
            body: data,
        });

        const result = await response.json();

        if (result.success && result.newPhotoPath) {
            alert("Profile photo updated successfully!");
            
            elements.profilePhoto.src = result.newPhotoPath;
            elements.navPhoto.src = result.newPhotoPath;

            elements.profilePhoto.style.display = 'block';
            elements.profilePlaceholder.style.display = 'none';
            elements.navPhoto.style.display = 'block';
            elements.navPlaceholder.style.display = 'none';

        } else {
            alert("Photo upload failed: " + (result.error || "Unknown server error."));
        }
    } catch (error) {
        console.error("Photo upload error:", error);
        alert("Something went wrong while uploading your photo.");
    }
}