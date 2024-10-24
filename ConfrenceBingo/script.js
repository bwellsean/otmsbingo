// List of phrases to populate the bingo board
const phrases = [
    "Parent lets you know that he/she never liked the subject/grade that you teach",
    "You go in for a handshake when a parent makes it clear that a fist bump is in order",
    "Parent who is your former student asks if you still remember his/her name",
    "You successfully remember the name of a former student who is now a parent",
    "Parent never breaks eye contact with you (who will blink first?)",
    "At the end of the conference you realize you have mistakenly been discussing the wrong student",
    "Parent tries to sell you something",
    "Dad brings in chew cup, take a free space if its mom.",
    "More tattoos then teeth",
    "You make it through conferences",
    "without a bathroom break",
    "Can see moms thong/ or Dads underwear",
    "You incorporate a famous movie line into conference (I.e., You can't handle the truth!)",
    "FREE SPACE",
    "Referee a fight between to divocred parents",
    "Parent in denial",
    "A live animal makes an apperance",
    "A sexual reference is made.",
    "A swear word is used",
    "Parent is younger than Mr. Blackwell",
    "ADHD and medication mentioned",
    "Translator is needed",
    "Principal is needed",
    "Mom has longer than 2 inch finger nails",
    "Dad wears wife beater",
    "90% chance mom strips"
];

let playerName = '';
let bingoCount = 0; // Track how many BINGOs the player has

document.getElementById('start-btn').addEventListener('click', () => {
    playerName = document.getElementById('player-name').value;
    
    if (playerName) {
        document.getElementById('name-input').style.display = 'none';
        document.getElementById('game-container').style.display = 'block';
        generateBingoBoard();
    } else {
        alert('Please enter your name to start the game!');
    }
});

// Function to shuffle the phrases array
function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

let bingoCells = []; // To keep track of the cells

// Function to generate bingo board
function generateBingoBoard() {
    const board = document.getElementById('bingo-board');
    board.innerHTML = '';
    document.getElementById('bingo-message').innerText = ''; // Reset BINGO message

    // Shuffle the phrases and take the first 24 (since we'll set the middle cell to "FREE SPACE")
    const shuffledPhrases = shuffle([...phrases]).slice(0, 24);
    bingoCells = [];

    // Populate the bingo board
    for (let i = 0; i < 25; i++) {
        const cell = document.createElement('div');
        cell.classList.add('bingo-cell');
        
        // Middle cell is a "FREE SPACE"
        if (i === 12) {
            cell.innerText = "FREE SPACE";
            cell.classList.add('clicked'); // Mark the free space as clicked
            const cellData = {
                element: cell,
                clicked: true
            };
            bingoCells.push(cellData);
        } else {
            // For all other cells, use shuffled phrases
            cell.innerText = shuffledPhrases.shift();
            const cellData = {
                element: cell,
                clicked: false
            };
            bingoCells.push(cellData);

            // Mark cell when clicked and check for BINGO
            cell.addEventListener('click', () => {
                cell.classList.toggle('clicked');
                cellData.clicked = !cellData.clicked;
                checkForBingo();
            });
        }

        board.appendChild(cell);
    }
}

// Check for a winning BINGO condition
function checkForBingo() {
    const size = 5;
    let bingo = false;

    // Check rows and columns
    for (let i = 0; i < size; i++) {
        if (bingoCells.slice(i * size, (i + 1) * size).every(cell => cell.clicked)) {
            bingo = true; // Horizontal bingo
        }
        if (bingoCells.filter((_, idx) => idx % size === i).every(cell => cell.clicked)) {
            bingo = true; // Vertical bingo
        }
    }

    // Check diagonals
    if (bingoCells.filter((_, idx) => idx % (size + 1) === 0).every(cell => cell.clicked)) {
        bingo = true; // Top-left to bottom-right diagonal
    }
    if (bingoCells.filter((_, idx) => (idx > 0 && (idx % (size - 1) === 0)) && idx < (size * size - 1)).every(cell => cell.clicked)) {
        bingo = true; // Top-right to bottom-left diagonal
    }

    // Display "BINGO" message if a winning condition is met
    if (bingo) {
        document.getElementById('bingo-message').innerText = 'BINGO!';
    }
}
// Function to send user data to Google Sheets using fetch
function sendDataToGoogleSheet(name, count) {
    const url = 'https://script.google.com/macros/s/AKfycbxHAXTONS9PDyjI9pFaPnkFN_c7ZNwhd26Je0aXugVm2O9qHHYB7zXb_VFeqQQtM8oyVg/exechttps://script.google.com/macros/s/AKfycbzZbxQ8pNOr9wLlibHGnVtiCwK_q1QHvtpUfSEpHx4hEJzYeX8kBTAdyc8zPUeMlCf1zw/exec';

    fetch('https://script.google.com/macros/s/AKfycbzZbxQ8pNOr9wLlibHGnVtiCwK_q1QHvtpUfSEpHx4hEJzYeX8kBTAdyc8zPUeMlCf1zw/exec', {
        method: 'POST',
        mode: 'no-cors',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            playerName: name,
            bingoCount: count
        })
    })
    .then(() => console.log('Data sent successfully'))
    .catch(err => console.error('Error sending data:', err));
}

// Reset the board
document.getElementById('reset-btn').addEventListener('click', generateBingoBoard);

// Initial board generation
generateBingoBoard();
