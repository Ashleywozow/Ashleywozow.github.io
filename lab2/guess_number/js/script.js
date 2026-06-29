//Event Listeners
document.querySelector("#guessBtn").addEventListener("click", checkGuess);
document.querySelector("#resetBtn").addEventListener("click", initializeGame);


//Global variables
let randomNumber;
let attempts = 0;
let wins = 0;
let losses = 0;

initializeGame();

function initializeGame() {
   randomNumber = Math.floor(Math.random() * 99) + 1;
   console.log("Random number: " + randomNumber);
   attempts = 0;

   //resetting the attempts left
   document.querySelector("#attempts").textContent = 7;

   //hiding the Reset button
   document.querySelector("#resetBtn").style.display = "none";

   //showing the Guess button
   document.querySelector("#guessBtn").style.display = "inline";

   //hide the answer
   document.querySelector("#answer").style.display = "none";

   //display wins and losses
   document.querySelector("#wins").textContent = wins;
   document.querySelector("#losses").textContent = losses;

   let playerGuess = document.querySelector("#playerGuess");
   playerGuess.focus(); //adding focus to textbox
   playerGuess.value = ""; //clearing the textbox

   let feedback = document.querySelector("#feedback");
   feedback.textContent = ""; //clearing the feedback text
  
   //clearing the previous guesses
   document.querySelector("#guesses").textContent = "";
}

function checkGuess() {
    let feedback = document.querySelector("#feedback");
    feedback.textContent = "";
    let guess = document.querySelector("#playerGuess").value;
    console.log("Player guess: " + guess);
    if (guess < 1 || guess > 99) {
        let feedback = document.querySelector("#feedback");
        feedback.textContent = "Enter a number between 1 and 99!!";
        feedback.style.color = "maroon";
        return;
    }
    attempts++;
    console.log("Attempts: " + attempts);
    let attemptsLeft = 7 - attempts;
    document.querySelector("#attempts").textContent = attemptsLeft;
    feedback.style.color = "pink";
    feedback.style.fontSize = "1.5rem";
    if (guess == randomNumber) {
        feedback.textContent = "You guessed it! You Won!";
        feedback.style.color = "turquoise";
        feedback.style.fontSize = "2.0rem";
        wins += 1;
        console.log("Wins: " + wins);
        document.querySelector("#wins").textContent = wins;
        gameOver();
    } else {
        document.querySelector("#guesses").textContent += guess + " ";
        if (attempts == 7) {
            feedback.textContent = "Sorry, you lost!";
            feedback.style.color = "maroon";
            feedback.style.fontSize = "1.8rem";
            
            losses += 1;
            console.log("Losses: " + losses);
            document.querySelector("#losses").textContent = losses;


            document.querySelector("#answer").style.display = "block";
            document.querySelector("#randomNumber").textContent = randomNumber;
            document.querySelector("#randomNumber").style.color = "hotpink";


            gameOver();
        } else if (guess > randomNumber) {
            feedback.textContent = "Guess was too high!";
        } else {
            feedback.textContent = "Guess was too low!";
        }
    }
}

function gameOver() {
    let guessBtn = document.querySelector("#guessBtn");
    let resetBtn = document.querySelector("#resetBtn");
    guessBtn.style.display = "none"; //hides Guess button
    resetBtn.style.display = "inline"; //displays Reset button
    //resetBtn.addEventListener("click", resetGame);
}
