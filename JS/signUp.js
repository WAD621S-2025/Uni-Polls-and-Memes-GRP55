document.addEventListener('DOMContentLoaded', () => {
    const signupForm = document.getElementById('signupForm');

    if (signupForm) {
        signupForm.addEventListener('submit', handleSignup);
    }
});

/**
 * Handles the sign-up form submission.
 * Performs client-side validation and simulates API call.
 */
function handleSignup(event) {
    event.preventDefault(); // Stop the default form submission

    const fullName = document.getElementById('fullName').value.trim();
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;

    // --- 1. Client-Side Validation ---
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

    // --- 2. Gather Data ---
    const userData = {
        fullName: fullName,
        email: email,
        password: password
        // IMPORTANT: Never send the confirmPassword field to the API
    };

    // --- 3. Simulate API Call (Replace with actual fetch to Ballerina) ---
    console.log("Attempting to sign up with data:", userData);

    // In a real application, you would use fetch here:
    // fetch('http://localhost:9090/api/signup', { ... })
    
    // Simulate a successful registration response after a delay
    setTimeout(() => {
        console.log("Simulated successful registration!");
        
        // --- 4. Success Action ---
        alert("Registration successful! You can now log in.");
        
        // Redirect to the login page
        window.location.href = 'login.html'; 

    }, 1500); // 1.5 second delay for simulation

    // Note: In a real app, you would handle network errors and server-side validation messages here.
}