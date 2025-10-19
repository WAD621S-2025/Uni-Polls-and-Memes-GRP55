const form = document.getElementById('createPollForm');
const pollsList = document.getElementById('pollsList');
const addOptionBtn = document.getElementById('addOptionBtn');
const optionsContainer = document.getElementById('optionsContainer');

addOptionBtn.addEventListener('click', () => {
  const newOption = document.createElement('input');
  newOption.type = 'text';
  newOption.classList.add('pollOption');
  newOption.placeholder = `Option ${optionsContainer.children.length + 1}`;
  newOption.required = true;
  optionsContainer.appendChild(newOption);
});

form.addEventListener('submit', e => {
  e.preventDefault();
  const question = document.getElementById('pollQuestion').value.trim();
  const options = Array.from(document.querySelectorAll('.pollOption')).map(o => o.value.trim()).filter(Boolean);
  if (!question || options.length < 2) return alert('Add a question and at least two options.');
  
  const newPoll = { id: Date.now(), question, options, votes: Array(options.length).fill(0) };
  const polls = JSON.parse(localStorage.getItem('polls') || '[]');
  polls.push(newPoll);
  localStorage.setItem('polls', JSON.stringify(polls));
  form.reset();
  optionsContainer.innerHTML = `
    <input type="text" class="pollOption" placeholder="Option 1" required>
    <input type="text" class="pollOption" placeholder="Option 2" required>
  `;
  displayPolls();
});

function displayPolls() {
  const polls = JSON.parse(localStorage.getItem('polls') || '[]');
  pollsList.innerHTML = '';
  if (polls.length === 0) {
    pollsList.innerHTML = '<p>No active polls yet? Create one!</p>';
    return;
  }

  polls.forEach(poll => {
    const pollDiv = document.createElement('div');
    pollDiv.classList.add('poll-item');

    const question = document.createElement('h3');
    question.textContent = poll.question;

    const optionsList = document.createElement('div');
    optionsList.classList.add('poll-options');

    poll.options.forEach((option, index) => {
      const btn = document.createElement('button');
      btn.textContent = `${option} (${poll.votes[index]})`;
      btn.addEventListener('click', () => votePoll(poll.id, index));
      optionsList.appendChild(btn);
    });

    pollDiv.appendChild(question);
    pollDiv.appendChild(optionsList);
    pollsList.appendChild(pollDiv);
  });
}

function votePoll(pollId, optionIndex) {
  const polls = JSON.parse(localStorage.getItem('polls') || '[]');
  const poll = polls.find(p => p.id === pollId);
  poll.votes[optionIndex]++;
  localStorage.setItem('polls', JSON.stringify(polls));
  displayPolls();
}

displayPolls();
