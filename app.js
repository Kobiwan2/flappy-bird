document.addEventListener("DOMContentLoaded", () => {
  const bird = document.querySelector("#bird");
  const gameDisplay = document.querySelector(".game-container");
  const ground = document.querySelector("#ground-container");
  const pipes = document.querySelectorAll(".pipe");
  const highScoreElement = document.getElementById("highscore");
  const gameOverOverlay = document.getElementById("game-over-overlay");
  const resetGameButton = document.getElementById("reset-game-button");

  const originalBirdBottomPercent = 0;
  let birdBottomPercent = originalBirdBottomPercent;

  let gravity = 1;

  let birdRotateTimeoutId = null;
  let startGameTimeoutId = null;

  function movePipeLeft(pipe) {
    let nextPipeLeftValue = parseInt(pipe.style.left) - 1;
    // false | 0 | '' | null | undefined | NaN

    if (isNaN(nextPipeLeftValue) || nextPipeLeftValue === -10) {
      nextPipeLeftValue = 100;
    }

    pipe.style.left = nextPipeLeftValue + "%";
  }

  function changePipeHeightRandomly(pipe) {
    // 5 - 35
    pipe.style.height = parseInt(Math.max(35, Math.random() * 45)) + "%";
  }

  function up() {
    birdBottomPercent += 20;
    setBirdBottomPercentageTo(birdBottomPercent);

    rotateBirdLookingUpOrDown();
  }

  function increaseHighscore() {
    const newHighscoreValue = 1 + parseInt(highScoreElement.innerText);
    highScoreElement.innerText = newHighscoreValue;
  }

  function showGameOver() {
    gameOverOverlay.classList.add("visible");
  }

  function setBirdBottomPercentageTo(value) {
    bird.style.bottom = value + "%";
  }

  function resetGame() {
    birdBottomPercent = originalBirdBottomPercent;
    setBirdBottomPercentageTo(birdBottomPercent);

    highScoreElement.innerText = 0;
    gameOverOverlay.classList.remove("visible");
    startGameTimeoutId = setInterval(startGame, 25);
  }

  function rotateBirdLookingUpOrDown() {
    bird.style.transform = "rotate(335deg)";

    clearTimeout(birdRotateTimeoutId);
    birdRotateTimeoutId = null;

    if (birdRotateTimeoutId) {
      return;
    }

    birdRotateTimeoutId = setTimeout(() => {
      bird.style.transform = "rotate(25deg)";
    }, 500);
  }

  document.addEventListener("keyup", (event) => {
    if (event.keyCode === 32) {
      up();
    }
  });

  resetGameButton.addEventListener("click", () => {
    resetGame();
  });

  function isBirdCollidingWithGround() {
    const rect = bird.getBoundingClientRect();

    const outOfBoundsLeft = rect.x + rect.width < 0;
    const outOfBoundsBottom = rect.y + rect.height < 0;
    const outOfBoundsRight = rect.x > window.innerWidth;
    const outOfBoundsTop = rect.y > window.innerHeight;

    return (
      outOfBoundsLeft || outOfBoundsBottom || outOfBoundsRight || outOfBoundsTop
    );
  }

  function isPipeOutOfBoundsLeft(pipe) {
    const rect = pipe.getBoundingClientRect();
    return rect.x + rect.width < 0;
  }

  function startGame() {
    birdBottomPercent -= gravity; 
    setBirdBottomPercentageTo(birdBottomPercent);

    if (isBirdCollidingWithGround()) {
      showGameOver();
      clearInterval(startGameTimeoutId);
      return;
    }

    pipes.forEach((pipe) => {
      if (isPipeOutOfBoundsLeft(pipe)) {
        changePipeHeightRandomly(pipe);
      }

      movePipeLeft(pipe);
    });

    increaseHighscore();
  }
  
  resetGame();
});
