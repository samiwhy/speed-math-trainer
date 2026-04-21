// 1. Connect to the HTML elements
const questionDisplay = document.getElementById('question-display');
const answerInput = document.getElementById('answer-input');
const scoreDisplay = document.getElementById('score-display');
const startBtn = document.getElementById('start-btn');
const timerDisplay = document.getElementById('timer-display');
const mathType = document.getElementById('math-type');
const streakDisplay = document.getElementById('streak-display');
const highscoreDisplay = document.getElementById('highscore-display');

// 2. Game memory variables
let currentAnswer = 0;
let score = 0;
let timeLeft = 60; 
let timerInterval; 

// 3. The Streak Calculator Function
function calculateStreak() {
    // Get today's date and yesterday's date as simple text strings
    let today = new Date().toDateString();
    let yesterday = new Date(Date.now() - 86400000).toDateString(); // 86400000 ms in a day
    
    // Pull saved data from the browser's local memory
    let lastPlayed = localStorage.getItem('lastPlayedDate');
    let currentStreak = parseInt(localStorage.getItem('dailyStreak')) || 0;

    if (lastPlayed === today) {
        // You already practiced today! Keep the streak as is.
    } else if (lastPlayed === yesterday) {
        // You practiced yesterday. Increase the streak!
        currentStreak++;
    } else {
        // You missed a day (or this is your first time). Reset streak to 1.
        currentStreak = 1;
    }

    // Save the updated data back to local memory
    localStorage.setItem('lastPlayedDate', today);
    localStorage.setItem('dailyStreak', currentStreak);
    
    // Update the screen
    streakDisplay.textContent = `🔥 Streak: ${currentStreak} Days`;
}

// Run this function immediately when the page loads
calculateStreak();

// 4. The Upgraded Question Generator Engine
function generateQuestion() {
    let type = mathType.value; // Read what is selected in the dropdown
    let num1, num2;

    switch (type) {
        case 'addition':
            num1 = Math.floor(Math.random() * 90) + 10;
            num2 = Math.floor(Math.random() * 90) + 10;
            currentAnswer = num1 + num2;
            questionDisplay.textContent = `${num1} + ${num2}`;
            break;
            
        case 'subtraction':
            // Ensure the first number is always larger to avoid negative answers
            num1 = Math.floor(Math.random() * 90) + 10;
            num2 = Math.floor(Math.random() * num1); 
            currentAnswer = num1 - num2;
            questionDisplay.textContent = `${num1} - ${num2}`;
            break;
            
        case 'multiplication':
            // 2-digit number multiplied by a 1-digit number
            num1 = Math.floor(Math.random() * 90) + 10;
            num2 = Math.floor(Math.random() * 8) + 2; // 2 through 9
            currentAnswer = num1 * num2;
            questionDisplay.textContent = `${num1} × ${num2}`;
            break;
            
        case 'squares':
            // Squares from 1 to 50
            num1 = Math.floor(Math.random() * 50) + 1;
            currentAnswer = num1 * num1;
            questionDisplay.textContent = `${num1}²`;
            break;
            
        case 'cubes':
            // Cubes from 1 to 20
            num1 = Math.floor(Math.random() * 20) + 1;
            currentAnswer = num1 * num1 * num1;
            questionDisplay.textContent = `${num1}³`;
            break;

        case 'fractions':
            // Common high-yield fractions to percentages
            const exactFractions = [
                { text: '1/2', val: 50 }, { text: '1/4', val: 25 }, { text: '3/4', val: 75 },
                { text: '1/5', val: 20 }, { text: '2/5', val: 40 }, { text: '3/5', val: 60 }, { text: '4/5', val: 80 },
                { text: '1/8', val: 12.5 }, { text: '3/8', val: 37.5 }, { text: '5/8', val: 62.5 }, { text: '7/8', val: 87.5 },
                { text: '1/10', val: 10 }, { text: '1/20', val: 5 }, { text: '1/25', val: 4 }
            ];
            let randFrac = exactFractions[Math.floor(Math.random() * exactFractions.length)];
            currentAnswer = randFrac.val;
            questionDisplay.textContent = `${randFrac.text} = ?%`;
            break;

        case 'percentage':
            // e.g., 15% of 120
            let percentages = [10, 15, 20, 25, 30, 40, 50, 60, 70, 75, 80, 90];
            let p = percentages[Math.floor(Math.random() * percentages.length)];
            // Generate a base number that ends in 0 (from 10 to 200) to keep answers clean
            let base = (Math.floor(Math.random() * 20) + 1) * 10; 
            currentAnswer = (p * base) / 100;
            questionDisplay.textContent = `${p}% of ${base}`;
            break;
            
        case 'approximation':
            // 1. Generate clean base numbers
            let base1 = Math.floor(Math.random() * 30) + 10; 
            let base2 = Math.floor(Math.random() * 15) + 5;  
            
            // 2. Create a messy decimal offset
            let offset1 = (Math.random() * 0.3 - 0.15);
            let offset2 = (Math.random() * 0.3 - 0.15);
            
            // 3. Apply the offset
            let messy1 = (base1 + offset1).toFixed(2);
            let messy2 = (base2 + offset2).toFixed(2);
            
            // 4. Randomly choose between addition and multiplication
            if (Math.random() > 0.5) {
                currentAnswer = base1 + base2;
                questionDisplay.textContent = `${messy1} + ${messy2} ≈ ?`;
            } else {
                currentAnswer = base1 * base2;
                questionDisplay.textContent = `${messy1} × ${messy2} ≈ ?`;
            }
            break;
    }

    answerInput.value = '';
}

// 5. The Setup Function
function startGame() {
    score = 0;
    timeLeft = 60;
    scoreDisplay.textContent = `Score: ${score}`;
    timerDisplay.textContent = `Time: ${timeLeft}s`;
    
    answerInput.disabled = false; 
    answerInput.focus(); 
    startBtn.disabled = true; 
    mathType.disabled = true; // Lock the dropdown while playing
    
    generateQuestion(); 
    
    timerInterval = setInterval(() => {
        timeLeft--; 
        timerDisplay.textContent = `Time: ${timeLeft}s`; 
        
        if (timeLeft <= 0) {
            endGame();
        }
    }, 1000); 
}

// 6. The End Game Function (with High Score Logic)
function endGame() {
    clearInterval(timerInterval); 
    answerInput.disabled = true; 
    startBtn.disabled = false; 
    mathType.disabled = false; 
    
    // Get the current category
    let type = mathType.value;
    
    // Look up the saved high score for this specific category
    let savedHighScore = parseInt(localStorage.getItem(`highScore_${type}`)) || 0;
    
    // Check if the current score beats the saved score
    if (score > savedHighScore) {
        localStorage.setItem(`highScore_${type}`, score);
        savedHighScore = score; 
        questionDisplay.textContent = `New Record! 🎉 Score: ${score}`;
    } else {
        questionDisplay.textContent = `Time's up! Final Score: ${score}`;
    }
    
    // Update the high score display
    highscoreDisplay.textContent = `🏆 ${type.toUpperCase()} Best: ${savedHighScore}`;
    answerInput.value = '';
}

// 7. Event Listeners
startBtn.addEventListener('click', startGame);

answerInput.addEventListener('input', () => {
    // Upgraded from parseInt to Number to allow decimal answers like 12.5
    if (answerInput.value !== '' && Number(answerInput.value) === currentAnswer) {
        score++; 
        scoreDisplay.textContent = `Score: ${score}`; 
        generateQuestion(); 
    }
});

// Listen for changes to the dropdown menu to update the high score display
mathType.addEventListener('change', () => {
    let type = mathType.value;
    let savedHighScore = parseInt(localStorage.getItem(`highScore_${type}`)) || 0;
    highscoreDisplay.textContent = `🏆 ${type.toUpperCase()} Best: ${savedHighScore}`;
});

// Trigger this once manually so the correct score shows on initial page load
mathType.dispatchEvent(new Event('change'));
