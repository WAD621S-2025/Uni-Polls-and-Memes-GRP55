document.addEventListener('DOMContentLoaded', () => {
    const signupForm = document.getElementById('signupForm');

    if (signupForm) {
        signupForm.addEventListener('submit', handleSignup);
    }
});

function handleSignup(event) {
    event.preventDefault();

    const fullName = document.getElementById('fullName').value.trim();
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;

    if (password !== confirmPassword) {
        alert("Error: Passwords do not match!");
        document.getElementById('password').focus();
        return;
    }

    if (password.length < 6) {
        alert("Error: Password must be at least 6 characters long.");
        document.getElementById('password').focus();
        return;
    }

    const userData = {
        fullName: fullName,
        email: email,
        password: password
    };

    console.log("Attempting to sign up with data:", userData);

    setTimeout(() => {
        console.log("Simulated successful registration!");
        alert("Registration successful! You can now log in.");
        window.location.href = 'login.html';
    }, 1500);
}
