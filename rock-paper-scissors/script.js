const WINNING_SCORE = 5;
const CHOICES = ["rock", "paper", "scissors"];

let humanScore = 0;
let computerScore = 0;

const choiceButtons = document.querySelectorAll(".choice");
const humanScoreDisplay = document.querySelector("#human-score");
const computerScoreDisplay = document.querySelector("#computer-score");
const resultsDisplay = document.querySelector("#results");
const winnerDisplay = document.querySelector("#winner");
const resetButton = document.querySelector("#reset");

function getComputerChoice() {
  const index = Math.floor(Math.random() * CHOICES.length);
  return CHOICES[index];
}

function capitalize(word) {
  return word.charAt(0).toUpperCase() + word.slice(1);
}

function beats(first, second) {
  return (
    (first === "rock" && second === "scissors") ||
    (first === "paper" && second === "rock") ||
    (first === "scissors" && second === "paper")
  );
}

function playRound(humanChoice, computerChoice) {
  if (humanChoice === computerChoice) {
    resultsDisplay.textContent = `It's a tie! You both chose ${capitalize(humanChoice)}.`;
  } else if (beats(humanChoice, computerChoice)) {
    humanScore++;
    resultsDisplay.textContent = `You win! ${capitalize(humanChoice)} beats ${capitalize(computerChoice)}.`;
  } else {
    computerScore++;
    resultsDisplay.textContent = `You lose! ${capitalize(computerChoice)} beats ${capitalize(humanChoice)}.`;
  }

  updateScore();
  checkForWinner();
}

function updateScore() {
  humanScoreDisplay.textContent = humanScore;
  computerScoreDisplay.textContent = computerScore;
}

function checkForWinner() {
  if (humanScore < WINNING_SCORE && computerScore < WINNING_SCORE) return;

  winnerDisplay.textContent =
    humanScore === WINNING_SCORE
      ? "You won the game! 🎉"
      : "The computer won the game. Try again!";

  choiceButtons.forEach((button) => (button.disabled = true));
  resetButton.hidden = false;
}

function resetGame() {
  humanScore = 0;
  computerScore = 0;
  updateScore();
  resultsDisplay.textContent = "Pick a move to start.";
  winnerDisplay.textContent = "";
  choiceButtons.forEach((button) => (button.disabled = false));
  resetButton.hidden = true;
}

choiceButtons.forEach((button) => {
  button.addEventListener("click", () => {
    playRound(button.dataset.choice, getComputerChoice());
  });
});

resetButton.addEventListener("click", resetGame);
