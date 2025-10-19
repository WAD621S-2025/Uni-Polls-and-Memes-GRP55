document.addEventListener('DOMContentLoaded', () => {
    const confirmLogoutBtn = document.getElementById('confirmLogoutBtn');
    if (confirmLogoutBtn) confirmLogoutBtn.addEventListener('click', performLogout);
});

function performLogout() {
    localStorage.clear();
    alert("You have been successfully logged out!");
    window.location.href = 'login.html';
}
