document.addEventListener('DOMContentLoaded', () => {
    const confirmLogoutBtn = document.getElementById('confirmLogoutBtn');

    if (confirmLogoutBtn) {
        confirmLogoutBtn.addEventListener('click', performLogout);
    }
});

function performLogout() {

    localStorage.removeItem('userToken');
    localStorage.removeItem('userName'); 

    alert("You have been successfully logged out!");

    window.location.href = 'login.html'; 
}