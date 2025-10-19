// DOM Elements
const form = document.getElementById('createPollForm');
const pollsList = document.getElementById('pollsList');
const addOptionBtn = document.getElementById('addOptionBtn');
const optionsContainer = document.getElementById('optionsContainer');
const pollsStatElement = document.getElementById('stat-polls');

const API_ENDPOINTS = {
    GET_POLLS: 'getPolls.php',
    CREATE_POLL: 'createPoll.php',
    RECORD_VOTE: 'recordVote.php',
    GET_STATS: 'getPollStats.php'
};

let allPolls = [];
let userVotes = {};

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

async function handlePollCreation(e) {
    e.preventDefault();
    
    const question = document.getElementById('pollQuestion').value.trim();
    const optionInputs = document.querySelectorAll('.pollOption');
    const options = Array.from(optionInputs)
        .map(input => input.value.trim())
        .filter(value => value !== '');
    
    if (!question) {
        alert('Please enter a poll question.');
        return;
    }
    
    if (options.length < 2) {
        alert('Please add at least two options.');
        return;
    }

    const formData = new FormData();
    formData.append('question', question);
    options.forEach((option, index) => {
        formData.append(`option_${index}`, option);
    });

    try {
        const response = await fetch(API_ENDPOINTS.CREATE_POLL, {
            method: 'POST',
            body: formData
        });

        const result = await response.json();

        if (result.success) {
            form.reset();
            resetOptionsContainer();
            await displayPolls();
            alert('Poll created successfully!');
        } else {
            alert(result.message || 'Poll creation failed.');
        }
    } catch (error) {
        console.error('Creation error:', error);
        alert('A network error occurred during poll creation.');
    }
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

async function displayPolls() {
    pollsList.innerHTML = '<p class="loading-state">Loading polls...</p>';
    
    try {
        const response = await fetch(API_ENDPOINTS.GET_POLLS);
        const data = await response.json();
        
        if (data.error) throw new Error(data.error);

        allPolls = data.polls || [];
        userVotes = data.userVotes || {};
        
    } catch (error) {
        console.error('Error loading polls:', error);
        pollsList.innerHTML = '<p class="error-state">Error loading polls. Please check connection.</p>';
        return;
    }
    
    pollsList.innerHTML = '';
    
    if (allPolls.length === 0) {
        pollsList.innerHTML = '<p class="empty-gallery-state">No active polls yet. Create one above!</p>';
        return;
    }
    
    const sortedPolls = allPolls.sort((a, b) => 
        new Date(b.createdAt) - new Date(a.createdAt)
    );
    
    sortedPolls.forEach(poll => {
        const pollCard = createPollCard(poll);
        pollsList.appendChild(pollCard);
    });
    
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
    
    poll.options.forEach((option, index) => {
        const optionDiv = createPollOption(poll, option, index, hasVoted, userVote);
        optionsList.appendChild(optionDiv);
    });
    
    const footer = createPollFooter(poll, hasVoted);
    
    pollDiv.appendChild(question);
    pollDiv.appendChild(optionsList);
    pollDiv.appendChild(footer);
    
    return pollDiv;
}

function createPollOption(poll, option, index, hasVoted, userVote) {
    const optionDiv = document.createElement('div');
    optionDiv.classList.add('poll-option');
    
    if (hasVoted) {
        optionDiv.classList.add('show-results');
        if (index === userVote) {
            optionDiv.classList.add('voted');
        }
    }
    
    const optionText = document.createElement('span');
    optionText.classList.add('option-text');
    optionText.textContent = escapeHtml(option);
    
    if (!hasVoted) {
        const voteBtn = document.createElement('button');
        voteBtn.classList.add('vote-btn');
        voteBtn.textContent = 'Vote';
        voteBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            handleVote(poll.id, index);
        });
        optionDiv.appendChild(voteBtn);
    }
    
    optionDiv.appendChild(optionText);
    
    if (hasVoted) {
        const percentage = poll.totalVotes > 0 
            ? ((poll.votes[index] / poll.totalVotes) * 100).toFixed(1) 
            : 0;
        
        const resultsBar = document.createElement('div');
        resultsBar.classList.add('poll-results-bar');
        resultsBar.style.width = `${percentage}%`;
        
        const resultsText = document.createElement('span');
        resultsText.classList.add('results-text');
        resultsText.textContent = `${poll.votes[index]} (${percentage}%)`;
        
        optionDiv.appendChild(resultsBar);
        optionDiv.appendChild(resultsText);
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

async function handleVote(pollId, optionIndex) {
    if (hasUserVoted(pollId)) {
        alert('You have already voted on this poll!');
        return;
    }
    
    try {
        const response = await fetch(API_ENDPOINTS.RECORD_VOTE, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ pollId, optionIndex })
        });
        
        const result = await response.json();
        
        if (result.success) {
            await displayPolls();
            alert('Vote recorded successfully!');
        } else {
            alert(result.message || 'Vote failed. Please try again.');
        }
    } catch (error) {
        console.error('Vote error:', error);
        alert('A network error occurred while recording your vote.');
    }
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

async function updateCommunityStats() {
    if (!pollsStatElement) return;

    try {
        const response = await fetch(API_ENDPOINTS.GET_STATS);
        const stats = await response.json();

        if (stats && stats.totalPolls !== undefined) {
            pollsStatElement.textContent = stats.totalPolls;
        } else {
            pollsStatElement.textContent = allPolls.length;
        }
    } catch (error) {
        console.warn('Could not fetch poll stats from server. Using local count.', error);
        pollsStatElement.textContent = allPolls.length;
    }
}