

let timer;
let timeElapsed = 0;
let isTimerRunning = false;


let studyGoals = [];
let studyResources = [];


const minutesDisplay = document.getElementById('minutes');
const secondsDisplay = document.getElementById('seconds');
const startBtn = document.getElementById('startTimer');
const pauseBtn = document.getElementById('pauseTimer');
const resetBtn = document.getElementById('resetTimer');

const goalForm = document.getElementById('goalForm');
const subjectInput = document.getElementById('subjectInput');
const topicInput = document.getElementById('topicInput');
const hoursInput = document.getElementById('hoursInput');
const goalsList = document.getElementById('goalsList');

const resourceForm = document.getElementById('resourceForm');
const resourceNameInput = document.getElementById('resourceNameInput');
const resourceUrlInput = document.getElementById('resourceUrlInput');
const resourcesList = document.getElementById('resourcesList');

const overallProgressBar = document.getElementById('overallProgressBar');
const progressText = document.getElementById('progressText');




function updateTimerDisplay() {
    const minutes = Math.floor(timeElapsed / 60);
    const seconds = timeElapsed % 60;
    minutesDisplay.textContent = minutes < 10 ? '0' + minutes : minutes;
    secondsDisplay.textContent = seconds < 10 ? '0' + seconds : seconds;
}


function startTimer() {
    if (isTimerRunning) return;
    
    // Clear any existing timer first
    clearInterval(timer);
    
    isTimerRunning = true;
    startBtn.disabled = true;
    pauseBtn.disabled = false;
    
    timer = setInterval(() => {
        timeElapsed++;
        updateTimerDisplay();
        console.log('Timer tick:', timeElapsed); // Add this to debug
    }, 1000);
}

function pauseTimer() {
    clearInterval(timer);
    isTimerRunning = false;
    startBtn.disabled = false;
    pauseBtn.disabled = true;
}

function resetTimer() {
    clearInterval(timer);
    isTimerRunning = false;
    timeElapsed = 0;
    startBtn.disabled = false;
    pauseBtn.disabled = true;
    updateTimerDisplay();
}


function saveGoals() {
    localStorage.setItem('studyGoals', JSON.stringify(studyGoals));
}

function loadGoals() {
    const storedGoals = localStorage.getItem('studyGoals');
    if (storedGoals) {
        studyGoals = JSON.parse(storedGoals);
        renderGoals();
        updateOverallProgress();
    }
}

function renderGoals() {
    goalsList.innerHTML = '';
    studyGoals.forEach((goal, index) => {
        const goalDiv = document.createElement('div');
        goalDiv.innerHTML = `
            <span>${goal.subject}: ${goal.topic} (${goal.hours} hrs) ${goal.completed ? '✅' : ''}</span>
            <button data-index="${index}" class="complete-btn">${goal.completed ? 'Undo' : 'Complete'}</button>
            <button data-index="${index}" class="delete-goal-btn">Delete</button>
        `;
        goalsList.appendChild(goalDiv);
    });
    addGoalEventListeners(); 
}

function addGoalEventListeners() {
    document.querySelectorAll('.complete-btn').forEach(button => {
        button.onclick = (e) => {
            const index = e.target.dataset.index;
            studyGoals[index].completed = !studyGoals[index].completed; 
            saveGoals();
            renderGoals();
            updateOverallProgress();
        };
    });
    document.querySelectorAll('.delete-goal-btn').forEach(button => {
        button.onclick = (e) => {
            const index = e.target.dataset.index;
            studyGoals.splice(index, 1); 
            saveGoals();
            renderGoals();
            updateOverallProgress();
        };
    });
}


function saveResources() {
    localStorage.setItem('studyResources', JSON.stringify(studyResources));
}

function loadResources() {
    const storedResources = localStorage.getItem('studyResources');
    if (storedResources) {
        studyResources = JSON.parse(storedResources);
        renderResources();
    }
}

function renderResources() {
    resourcesList.innerHTML = '';
    studyResources.forEach((resource, index) => {
        const li = document.createElement('li');
        li.innerHTML = `
            <a href="${resource.url}" target="_blank">${resource.name}</a>
            <button data-index="${index}" class="delete-resource-btn">Delete</button>
        `;
        resourcesList.appendChild(li);
    });
    addResourceEventListeners();
}

function addResourceEventListeners() {
    document.querySelectorAll('.delete-resource-btn').forEach(button => {
        button.onclick = (e) => {
            const index = e.target.dataset.index;
            studyResources.splice(index, 1);
            saveResources();
            renderResources();
        };
    });
}


function updateOverallProgress() {
    const totalGoals = studyGoals.length;
    if (totalGoals === 0) {
        overallProgressBar.style.width = '0%';
        progressText.textContent = '0';
        return;
    }
    const completedGoals = studyGoals.filter(goal => goal.completed).length;
    const percentage = (completedGoals / totalGoals) * 100;
    overallProgressBar.style.width = `${percentage.toFixed(0)}%`;
    overallProgressBar.textContent = `${percentage.toFixed(0)}%`;
    progressText.textContent = percentage.toFixed(0);
}


startBtn.addEventListener('click', startTimer);
pauseBtn.addEventListener('click', pauseTimer);
resetBtn.addEventListener('click', resetTimer);

goalForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const newGoal = {
        subject: subjectInput.value,
        topic: topicInput.value,
        hours: parseFloat(hoursInput.value),
        completed: false 
    };
    studyGoals.push(newGoal);
    saveGoals();
    renderGoals();
    updateOverallProgress();
    goalForm.reset(); 
});

resourceForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const newResource = {
        name: resourceNameInput.value,
        url: resourceUrlInput.value
    };
    studyResources.push(newResource);
    saveResources();
    renderResources();
    resourceForm.reset();
});


document.addEventListener('DOMContentLoaded', () => {
    updateTimerDisplay(); 
    loadGoals(); 
    loadResources();
});