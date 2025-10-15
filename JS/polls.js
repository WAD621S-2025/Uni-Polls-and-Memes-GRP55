// polls.js
// -------------------------------------------------------------
// This file controls how polls are loaded and how votes are sent.
// It does two main things:
//  a) When the polls page loads — it fetches polls from getPolls.php
//     and displays them dynamically.
//  b) When a user votes — it sends their vote to vote.php.
// -------------------------------------------------------------

// 🟢 1. Run the script automatically when the page loads
document.addEventListener("DOMContentLoaded", () => {
  console.log("✅ Polls page loaded. Fetching available polls...");
  loadPolls(); // call our function to load polls
});


// 🟡 2. Function: Load polls from the backend (getPolls.php)
function loadPolls() {
  // Send a GET request to getPolls.php to fetch poll data
  fetch("getPolls.php")
    .then(response => response.json()) // Convert JSON text into a JavaScript object
    .then(polls => {
      const pollsContainer = document.getElementById("polls");
      pollsContainer.innerHTML = ""; // Clear any existing content before adding new polls

      // Check if we got any polls from the database
      if (polls.length === 0) {
        pollsContainer.innerHTML = "<p>No polls available right now.</p>";
        return;
      }

      // Loop through all polls
      polls.forEach(poll => {
        // Create a div to hold this poll
        const pollBox = document.createElement("div");
        pollBox.classList.add("poll-box");

        // Add the poll question as a heading
        const question = document.createElement("h3");
        question.textContent = poll.question;
        pollBox.appendChild(question);

        // Add poll options as clickable buttons
        ["option1", "option2", "option3", "option4"].forEach(optionKey => {
          const optionText = poll[optionKey]; // get the text for each option
          if (optionText) {
            const button = document.createElement("button");
            button.textContent = optionText;

            // When the user clicks an option → call vote() function
            button.addEventListener("click", () => {
              console.log(`🗳️ You voted for "${optionText}" in poll ID ${poll.id}`);
              vote(poll.id, optionText); // send the vote to PHP
            });

            pollBox.appendChild(button);
          }
        });

        // Add this poll to the container
        pollsContainer.appendChild(pollBox);
      });
    })
    .catch(error => {
      console.error("⚠️ Error loading polls:", error);
      document.getElementById("polls").innerHTML =
        "<p>Unable to load polls at this time.</p>";
    });
}


// 🔵 3. Function: Send the user's vote to the backend (vote.php)
function vote(pollId, selectedOption) {
  // Prepare the data we want to send
  const voteData = {
    poll_id: pollId,
    option: selectedOption
  };

  console.log("📤 Sending vote to the server...", voteData);

  // Send a POST request to vote.php
  fetch("vote.php", {
    method: "POST",
    headers: {
      "Content-Type": "application/json", // we’re sending JSON
    },
    body: JSON.stringify(voteData) // convert the JS object to JSON
  })
    .then(response => response.text()) // expect text response from PHP
    .then(message => {
      // Show the server’s response (for example: “Vote recorded successfully!”)
      alert(message);

      // Reload polls after voting (in case results or options need updating)
      loadPolls();
    })
    .catch(error => {
      console.error("⚠️ Error sending vote:", error);
      alert("Something went wrong while submitting your vote. Please try again.");
    });
}
