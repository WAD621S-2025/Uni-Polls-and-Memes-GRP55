document.addEventListener("DOMContentLoaded", () => {
  console.log("Page loaded ✅ Fetching polls...");
  loadPolls();
});
$
function loadPolls() {
  fetch("getPolls.php")
    .then(response => response.json()) 
    .then(polls => {
      const pollsContainer = document.getElementById("polls");
      pollsContainer.innerHTML = "";
      if (polls.length === 0) {
        pollsContainer.innerHTML = "<p>No polls available right now.</p>";
        return;
      }
      polls.forEach(poll => {
        const pollBox = document.createElement("div");
        pollBox.classList.add("poll-box");

        const question = document.createElement("h3");
        question.textContent = poll.question;
        pollBox.appendChild(question);

        ["option1", "option2", "option3", "option4"].forEach(optionKey => {
          const optionText = poll[optionKey];
          if (optionText) {
            const button = document.createElement("button");
            button.textContent = optionText;

            button.addEventListener("click", () => {
              console.log(`You voted for: ${optionText}`);
              vote(poll.id, optionText);
            });

            pollBox.appendChild(button);
          }
        });
        pollsContainer.appendChild(pollBox);
      });
    })
    .catch(error => {
      console.error("Error loading polls:", error);
      document.getElementById("polls").innerHTML =
        "<p>⚠️ Unable to load polls. Please try again later.</p>";
    });
}
function vote(pollId, selectedOption) {

  const voteData = {
    poll_id: pollId,
    option: selectedOption,
  };
  fetch("vote.php", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(voteData),
  })
    .then(response => response.text())
    .then(message => {

      alert(message);
      loadPolls();
    })
    .catch(error => {
      console.error("Error submitting vote:", error);
      alert("⚠️ Something went wrong while submitting your vote.");
    });
}
