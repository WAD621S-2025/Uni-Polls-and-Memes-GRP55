document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    if (loginForm) loginForm.addEventListener('submit', handleLogin);
});

function handleLogin(event) {
    event.preventDefault();

    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');

    const email = emailInput.value.trim();
    const password = passwordInput.value;

    if (!email || !password) {
        alert("Please enter both your email and password.");
        return;
    }

    // Simulate a successful login
    const user = {
        name: "John Doe",
        username: "johndoe",
        email: email,
        bio: "This is my bio",
        phone: "1234567890",
        campus: "Main Campus",
        major: "Computer Science",
        year: "3",
        profilePhoto: ""
    };

    localStorage.setItem('name', user.name);
    localStorage.setItem('username', user.username);
    localStorage.setItem('email', user.email);
    localStorage.setItem('bio', user.bio);
    localStorage.setItem('phone', user.phone);
    localStorage.setItem('campus', user.campus);
    localStorage.setItem('major', user.major);
    localStorage.setItem('year', user.year);
    if (user.profilePhoto) localStorage.setItem('profilePhoto', user.profilePhoto);

    alert("Login successful!");
    window.location.href = 'index.html';
}
