document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');

    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }
});

async function handleLogin(event) {
    event.preventDefault();

    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const loginForm = document.getElementById('loginForm');

    const email = emailInput.value.trim();
    const password = passwordInput.value;

    if (!email || !password) {
        alert("Please enter both your email and password.");
        return;
    }

    const data = new FormData(loginForm);
    const submitButton = loginForm.querySelector('button[type="submit"]');

    submitButton.disabled = true;
    submitButton.textContent = 'Logging in...';

    try {
        const response = await fetch('login.php', {
            method: 'POST',
            body: data
        });

        const result = await response.json();

        if (result.success) {
            handleLoginSuccess();
        } else {
            alert(result.message || "Login failed. Check your credentials.");
        }
    } catch (error) {
        console.error('Login Error:', error);
        alert("A network error occurred. Please try again.");
    } finally {
        submitButton.disabled = false;
        submitButton.textContent = 'Login';
    }
}

function handleLoginSuccess() {
    window.location.href = 'index.html'; 
}