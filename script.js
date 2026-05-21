const words = ["ABAT","ABDO","ABRI","ACRE","ACRO","AFRO","AGIR","AIRE","AMER","ANAL","APTE","AUTO","BAIL","BAKA","BANC","BIDE","BITE","BLEU","BOUE","BRUT","CACA","CAMP","CAVE","CHAT","CHOC","CIRE","CINQ","CIEL","CLIP","COCU","CODE","COUR","CROC","CUIR","DANS","DENT","DIVA","DODO","DONC","DUNE","ELFE","ENVI","EXIL","FADE","FAON","FINI","FLOU","FUIR","GANG","GARE","GAZO","GOLF","GREC","GUET","HALL","HIER","HOMO","HUER","IDEM","INDE","INOX","ISSU","JAVA","JOUR","JUPE","KILO","KIWI","LAID","LENT","LIRE","LOGO","LOUP","LUNE","LINX","MAIN","MAIS","MAMI","MENU","MIEN","MITE","MODE","MOTO","MULE","NAPE","NAZE","NIER","NORD","NUIT","OGRE","ONDE","ORAL","OURS","OVNI","PAGE","PAFF","PAPA","PAPY","PEUR","PINE","PIPE","PIPI","PLAT","PLOT","PNEU","PORN","PRIX","PUMA","QUOI","RAGE","RARE","RIRE","RITE","RUNE","SAIN","SAMU","SANG","SEPT","SITE","SOIN","SOUK","SURF","TANK","TATA","TAXI","TIPI","TIRE","TOFU","TRIO","TUBE","TUTO","VAIN","VASE","VERS","VERT","VITE","VOLT","VRAI","WOKE","YACH","YACK","YOGA","ZEST","ZEUB","ZOOM","ZOUK"];
let secretWord = words[Math.floor(Math.random() * words.length)];
const maxAttempts = 6;
let attempts = 0;
let gameOver = false;
let stats = {
    gamesPlayed: 0,
    wins: 0,
    losses: 0,
    score: 0
};

// récupération des stats locales
if (localStorage.getItem("sutomStats")) {
    stats = JSON.parse(localStorage.getItem("sutomStats"));
}

updateScoreboard();

function checkGuess() {
    if (gameOver) return;

    const input = document.getElementById("guessInput");
    const guess = input.value.toUpperCase();
    const message = document.getElementById("message");

    if (guess.length !== secretWord.length) {
        alert("Le mot doit contenir " + secretWord.length + " lettres !");
        return;
    }

    if (attempts >= maxAttempts) return;

    createRow(guess);
    attempts++;

    if (guess === secretWord) {
        message.textContent = "ðŸŽ‰ VICTOIRE !";
        document.body.classList.add("win");
        gameOver = true;

        stats.gamesPlayed++;
        stats.wins++;

        // SCORE PERFORMANCE
        let points = 7 - attempts;
        let gainedPoints = points * 10;
        stats.score += gainedPoints;
        animateScore(stats.score);

        saveStats();
        updateScoreboard();
        return;
    }

    if (attempts === maxAttempts) {
        message.textContent = "ðŸ’€ GAME OVER ! Le mot Ã©tait : " + secretWord;
        document.body.classList.add("game-over");
        gameOver = true;

        stats.gamesPlayed++;
        stats.losses++;

        saveStats();
        updateScoreboard();
    }

    input.value = "";
}

function createRow(guess) {
    const game = document.getElementById("game");
    const row = game.children[attempts];

    let secretArray = secretWord.split("");
    let guessArray = guess.split("");
    let result = new Array(secretWord.length);

    // lettres bien placées
    for (let i = 0; i < secretWord.length; i++) {
        if (guessArray[i] === secretArray[i]) {
            result[i] = "correct";
            secretArray[i] = null;
            guessArray[i] = null;
        }
    }

    // lettres présentes
    for (let i = 0; i < secretWord.length; i++) {
        if (guessArray[i] !== null) {
            let index = secretArray.indexOf(guessArray[i]);
            if (index !== -1) {
                result[i] = "present";
                secretArray[index] = null;
            } else {
                result[i] = "absent";
            }
        }
    }

    for (let i = 0; i < secretWord.length; i++) {
        const cell = row.children[i];
        cell.textContent = guess[i];
        cell.classList.add(result[i]);

        setTimeout(() => {
            cell.classList.add("reveal");
        }, i * 200);
    }
}

// ENTREE CLAVIER
document.getElementById("guessInput").addEventListener("keydown", function(event) {
    if (event.key === "Enter") checkGuess();
});

// RESTART
function restartGame() {
    secretWord = words[Math.floor(Math.random() * words.length)];
    attempts = 0;
    gameOver = false;

    document.getElementById("game").innerHTML = "";
    document.getElementById("guessInput").value = "";
    document.getElementById("message").textContent = "";

    document.body.classList.remove("game-over");
    document.body.classList.remove("win");

    console.log("Nouveau mot :", secretWord);
    createEmptyGrid();
}

// supprimer caractères non alphabétiques
document.getElementById("guessInput").addEventListener("input", function() {
    this.value = this.value.replace(/[^a-zA-Z]/g, "");
});

// créer grille vide
function createEmptyGrid() {
    const game = document.getElementById("game");
    game.innerHTML = "";
    for (let i = 0; i < maxAttempts; i++) {
        const row = document.createElement("div");
        row.classList.add("row");
        for (let j = 0; j < secretWord.length; j++) {
            const cell = document.createElement("div");
            cell.classList.add("cell");
            row.appendChild(cell);
        }
        game.appendChild(row);
    }
}

// SCOREBOARD
function updateScoreboard() {
    document.getElementById("gamesPlayed").textContent = stats.gamesPlayed;
    document.getElementById("wins").textContent = stats.wins;
    document.getElementById("losses").textContent = stats.losses;
    document.getElementById("score").textContent = stats.score;

    let winRate = stats.gamesPlayed > 0 ? Math.round((stats.wins / stats.gamesPlayed) * 100) : 0;
    document.getElementById("winRate").textContent = winRate + "%";
}

// LOCAL STORAGE
function saveStats() {
    localStorage.setItem("sutomStats", JSON.stringify(stats));
}

function resetStats() {
    stats = { gamesPlayed:0, wins:0, losses:0, score:0 };
    saveStats();
    updateScoreboard();
}

// ANIMATION SCORE
function animateScore(newScore) {
    let scoreElement = document.getElementById("score");
    let currentScore = parseInt(scoreElement.textContent);
    let interval = setInterval(function() {
        if (currentScore < newScore) {
            currentScore++;
            scoreElement.textContent = currentScore;
        } else clearInterval(interval);
    }, 20);
}

// initialisation
createEmptyGrid();