document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');

    // Attach the event listener to the form's submit event
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }
});

/**
 * Handles the login form submission process.
 * 1. Prevents default form submission.
 * 2. Gathers credentials.
 * 3. Performs client-side validation.
 * 4. Simulates an API call for authentication.
 * 5. On success, stores session data and redirects.
 */
function handleLogin(event) {
    event.preventDefault(); // Stop the page reload

    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');

    const email = emailInput.value.trim();
    const password = passwordInput.value;

    // --- 1. Basic Client-Side Validation ---
    if (!email || !password) {
        alert("Please enter both your email and password.");
        return;
    }

    // You could add a simple email format check here:
    // if (!email.includes('@')) { /* ... */ }

    // --- 2. Gather Credentials ---
    const credentials = {
        email: email,
        password: password
    };

    // --- 3. Simulate Backend Authentication (Replace with actual fetch to Ballerina) ---
    console.log("Attempting to log in with:", credentials);
    
    // In a real application, you would make an asynchronous API call here:
    // fetch('http://localhost:9090/api/login', {
    //     method: 'POST',
    //     headers: { 'Content-Type': 'application/json' },
    //     body: JSON.stringify(credentials)
    // })
    // .then(response => response.json())
    // .then(data => {
    //     if (data.success) {
    //         // Call simulateLoginSuccess(data.userToken, data.userName)
    //     } else {
    //         alert(data.message || "Login failed. Check your credentials.");
    //     }
    // })
    // .catch(error => console.error('API Error:', error));


    // --- 4. Simulated Success (REMOVE in production code) ---
    // Simulate a successful response after a short delay
    setTimeout(() => {
        // Mock data that the server would normally return
        const mockUserToken = 'mock-jwt-12345';
        const mockUserName = 'Campus Cat';

        simulateLoginSuccess(mockUserToken, mockUserName);

    }, 1000); // 1 second delay for simulation
}

/**
 * Executes the actions required after a successful login.
 * @param {string} token - The authentication token received from the server.
 * @param {string} userName - The user's name or display name.
 */
function simulateLoginSuccess(token, userName) {
    console.log("Login successful! Token received.");

    // Store the authentication token and user info (for session persistence and profile)
    // Use localStorage for simple client-side session tracking
    localStorage.setItem('userToken', token);
    localStorage.setItem('userName', userName);
    
    // Redirect the user to the main landing page or the page they tried to access
    // *** IMPORTANT: Make sure 'index.html' is the correct home path ***
    window.location.href = 'index.html'; 
}