function handlePollCreation(e) {
    e.preventDefault();

    
    const question = document.getElementById('pollQuestion').value.trim();
    const optionInputs = document.querySelectorAll('.pollOption');
    const options = Array.from(optionInputs)
        .map(input => input.value.trim())
        .filter(v => v !== '');

    if (!question) return alert('Please enter a poll question.');
    if (options.length < 2) return alert('Please add at least two options.');


const username = localStorage.getItem("username") || "Anonymous";
const newPoll = {
    id: Date.now(),
    question,
    options,
    votes: new Array(options.length).fill(0),
    totalVotes: 0,
    createdAt: new Date().toISOString(),
    createdBy: username
};


        allPolls.unshift(newPoll);
    localStorage.setItem("polls", JSON.stringify(allPolls));
     const communityPosts = JSON.parse(localStorage.getItem("communityPosts")) || [];
    communityPosts.unshift({
        id: newPoll.id,
        user: "Celine (Admin)",
        content: question,
        time: new Date().toLocaleString(),
        type: "polls",
        votes: 0,
        comments: 0
    });
    localStorage.setItem("communityPosts", JSON.stringify(communityPosts));

    form.reset();
    resetOptionsContainer();
    displayPolls();
    updateCommunityStats();


    window.dispatchEvent(new Event('storage'));

    alert('Poll created successfully!');

    
}

const form = document.getElementById('createPollForm');
const pollsList = document.getElementById('pollsList');
const addOptionBtn = document.getElementById('addOptionBtn');
const optionsContainer = document.getElementById('optionsContainer');
const pollsStatElement = document.getElementById('stat-polls');

let allPolls = JSON.parse(localStorage.getItem("polls")) || [];
let userVotes = JSON.parse(localStorage.getItem("userVotes")) || {};

document.addEventListener('DOMContentLoaded', () => {
    displayPolls();
    setupEventListeners();
    updateCommunityStats();
});

function setupEventListeners() {
    addOptionBtn.addEventListener('click', addPollOption);
    form.addEventListener('submit', handlePollCreation);
}

function addPollOption() {
    const optionCount = optionsContainer.children.length + 1;
    const newOption = document.createElement('input');
    newOption.type = 'text';
    newOption.classList.add('pollOption');
    newOption.placeholder = `Option ${optionCount}`;
    newOption.required = true;
    optionsContainer.appendChild(newOption);
}

function handlePollCreation(e) {
    e.preventDefault();
    
    const question = document.getElementById('pollQuestion').value.trim();
    const optionInputs = document.querySelectorAll('.pollOption');
    const options = Array.from(optionInputs)
        .map(input => input.value.trim())
        .filter(v => v !== '');
    
    if (!question) return alert('Please enter a poll question.');
    if (options.length < 2) return alert('Please add at least two options.');

    const newPoll = {
        id: Date.now(),
        question,
        options,
        votes: new Array(options.length).fill(0),
        totalVotes: 0,
        createdAt: new Date().toISOString()
    };

    allPolls.unshift(newPoll);
    localStorage.setItem("polls", JSON.stringify(allPolls));

    form.reset();
    resetOptionsContainer();
    displayPolls();
    updateCommunityStats();
    window.dispatchEvent(new Event('storage'));

    alert('Poll created successfully!');
}

function resetOptionsContainer() {
    optionsContainer.innerHTML = `
        <input type="text" class="pollOption" placeholder="Option 1" required>
        <input type="text" class="pollOption" placeholder="Option 2" required>
    `;
}

function hasUserVoted(pollId) {
    return userVotes.hasOwnProperty(pollId);
}

function getUserVote(pollId) {
    return userVotes[pollId];
}

function displayPolls() {
    pollsList.innerHTML = '';

    if (allPolls.length === 0) {
        pollsList.innerHTML = '<p class="empty-gallery-state">No active polls yet. Create one above!</p>';
        return;
    }

    const sortedPolls = allPolls.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    sortedPolls.forEach(poll => pollsList.appendChild(createPollCard(poll)));
    updateCommunityStats();
}

function createPollCard(poll) {
    const pollDiv = document.createElement('div');
    pollDiv.classList.add('poll-card');
    
    const hasVoted = hasUserVoted(poll.id);
    const userVote = hasVoted ? getUserVote(poll.id) : null;
    
    const question = document.createElement('div');
    question.classList.add('poll-question');
    question.innerHTML = `<h3>${escapeHtml(poll.question)}</h3>`;
    
    const optionsList = document.createElement('div');
    optionsList.classList.add('poll-options-list');
    
    poll.options.forEach((option, index) => optionsList.appendChild(createPollOption(poll, option, index, hasVoted, userVote)));
    
    const footer = createPollFooter(poll, hasVoted);
    
    pollDiv.append(question, optionsList, footer);
    return pollDiv;
}

function createPollOption(poll, option, index, hasVoted, userVote) {
    const optionDiv = document.createElement('div');
    optionDiv.classList.add('poll-option');

    if (hasVoted) {
        optionDiv.classList.add('show-results');
        if (index === userVote) optionDiv.classList.add('voted');
    }

    const optionText = document.createElement('span');
    optionText.classList.add('option-text');
    optionText.textContent = escapeHtml(option);

    if (!hasVoted) {
        const voteBtn = document.createElement('button');
        voteBtn.classList.add('vote-btn');
        voteBtn.textContent = 'Vote';
        voteBtn.addEventListener('click', e => {
            e.stopPropagation();
            handleVote(poll.id, index);
        });
        optionDiv.appendChild(voteBtn);
    }

    optionDiv.appendChild(optionText);

    if (hasVoted) {
        const percentage = poll.totalVotes > 0 ? ((poll.votes[index] / poll.totalVotes) * 100).toFixed(1) : 0;
        const resultsBar = document.createElement('div');
        resultsBar.classList.add('poll-results-bar');
        resultsBar.style.width = `${percentage}%`;

        const resultsText = document.createElement('span');
        resultsText.classList.add('results-text');
        resultsText.textContent = `${poll.votes[index]} (${percentage}%)`;

        optionDiv.append(resultsBar, resultsText);
    }

    return optionDiv;
}

function createPollFooter(poll, hasVoted) {
    const footer = document.createElement('div');
    footer.classList.add('poll-footer');

    const totalVotes = document.createElement('span');
    totalVotes.classList.add('total-votes');
    totalVotes.textContent = `${poll.totalVotes} vote${poll.totalVotes !== 1 ? 's' : ''}`;
    footer.appendChild(totalVotes);

    if (hasVoted) {
        const votedLabel = document.createElement('span');
        votedLabel.classList.add('voted-label');
        votedLabel.textContent = 'You voted';
        footer.appendChild(votedLabel);
    }

    return footer;
}

function handleVote(pollId, optionIndex) {
    if (hasUserVoted(pollId)) return alert('You have already voted on this poll!');

    userVotes[pollId] = optionIndex;
    localStorage.setItem("userVotes", JSON.stringify(userVotes));

    const poll = allPolls.find(p => p.id === pollId);
    if (poll) {
        poll.votes[optionIndex]++;
        poll.totalVotes++;
        localStorage.setItem("polls", JSON.stringify(allPolls));
    }

    displayPolls();
    updateCommunityStats();
    window.dispatchEvent(new Event('storage'));

    alert('Vote recorded successfully!');
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function updateCommunityStats() {
    const statBadge = document.getElementById("total-polls-badge");
    if (statBadge) statBadge.textContent = allPolls.length;
}


window.addEventListener("storage", () => {
    allPolls = JSON.parse(localStorage.getItem("polls")) || [];
    userVotes = JSON.parse(localStorage.getItem("userVotes")) || {};
    displayPolls();
    updateCommunityStats();
});

function handlePollCreation(e) {
    e.preventDefault();
    
    const question = document.getElementById('pollQuestion').value.trim();
    const optionInputs = document.querySelectorAll('.pollOption');
    const options = Array.from(optionInputs)
        .map(input => input.value.trim())
        .filter(v => v !== '');

    if (!question) return alert('Please enter a poll question.');
    if (options.length < 2) return alert('Please add at least two options.');

    const newPoll = {
        id: Date.now(),
        question,
        options,
        votes: new Array(options.length).fill(0),
        totalVotes: 0,
        createdAt: new Date().toISOString()
    };

    allPolls.unshift(newPoll);
    localStorage.setItem("polls", JSON.stringify(allPolls));

    const communityPosts = JSON.parse(localStorage.getItem("communityPosts")) || [];
    communityPosts.unshift({
        id: newPoll.id,
        user: "Celine (Admin)",
        content: question,
        time: new Date().toLocaleString(),
        type: "polls",
        votes: 0,
        comments: 0
    });
    localStorage.setItem("communityPosts", JSON.stringify(communityPosts));

    form.reset();
    resetOptionsContainer();
    displayPolls();
    updateCommunityStats();

    window.dispatchEvent(new Event('storage'));

    alert('Poll created successfully!');
}



