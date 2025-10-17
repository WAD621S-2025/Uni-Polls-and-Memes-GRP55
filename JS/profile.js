document.addEventListener('DOMContentLoaded', () => {
  initProfile();

  document.getElementById('edit-info-btn').addEventListener('click', toggleEditInfo);
  document.querySelector('.cancel-btn').addEventListener('click', cancelEdit);
  document.querySelector('.save-btn').addEventListener('click', saveInfo);
});

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

function loadProfile() {
  for (let key in elements.display) {
    const value = localStorage.getItem(key);
    if (value) {
      elements.display[key].textContent = value;
      if (key in elements.edit) elements.edit[key].value = value;
    }
  }

  elements.header.name.textContent = localStorage.getItem('name') || 'Add your name';
  elements.header.username.textContent = localStorage.getItem('username') || 'Add username';
  elements.header.email.textContent = localStorage.getItem('email') || 'Add email';
  elements.header.bio.textContent = localStorage.getItem('bio') || 'Add a bio to tell others about yourself';

  const savedPhoto = localStorage.getItem('profilePhoto');
  if (savedPhoto) {
    elements.profilePhoto.src = savedPhoto;
    elements.profilePhoto.style.display = 'block';
    elements.profilePlaceholder.style.display = 'none';
    elements.navPhoto.src = savedPhoto;
    elements.navPhoto.style.display = 'block';
    elements.navPlaceholder.style.display = 'none';
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

function saveInfo() {
  for (let key in elements.edit) {
    const value = elements.edit[key].value.trim();
    elements.display[key].textContent = value || 'Not provided';
    localStorage.setItem(key, value);
  }

  elements.header.name.textContent = elements.edit.name.value || 'Add your name';
  elements.header.username.textContent = elements.edit.username.value || 'Add username';
  elements.header.email.textContent = elements.edit.email.value || 'Add email';
  elements.header.bio.textContent = elements.edit.bio.value || 'Add a bio to tell others about yourself';

  cancelEdit();
}

function handlePhotoUpload(e) {
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function(event) {
    const dataUrl = event.target.result;
    elements.profilePhoto.src = dataUrl;
    elements.profilePhoto.style.display = 'block';
    elements.profilePlaceholder.style.display = 'none';

    elements.navPhoto.src = dataUrl;
    elements.navPhoto.style.display = 'block';
    elements.navPlaceholder.style.display = 'none';

    localStorage.setItem('profilePhoto', dataUrl);
  };
  reader.readAsDataURL(file);
}
