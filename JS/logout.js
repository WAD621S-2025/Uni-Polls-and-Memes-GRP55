document.addEventListener('DOMContentLoaded', () => {
    const confirmLogoutBtn = document.getElementById('confirmLogoutBtn');

    if (confirmLogoutBtn) {
        confirmLogoutBtn.addEventListener('click', performLogout);
    }
});

async function performLogout() {
    try {
        const response = await fetch('logout.php', {
            method: 'POST'
        });

        const result = await response.json();

        if (result.success) {
            alert("You have been successfully logged out!");
            window.location.href = 'login.html';
        } else {
            alert(result.message || "Logout failed on the server.");
        }
    } catch (error) {
        console.error('Logout Error:', error);
        alert("A network error occurred during logout. Please try again.");
    }
}