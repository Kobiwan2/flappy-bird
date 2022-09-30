document.addEventListener("DOMContentLoaded", () => {
  const bird = document.querySelector("#bird");
  const gameDisplay = document.querySelector(".game-container");
  const ground = document.querySelector("#ground-container");
  const pipeTop = document.querySelector(".pipe-top");
  const pipeBottom = document.querySelector(".pipe-bottom");
  const highScoreElement = document.getElementById("highscore");
  const gameOverOverlay = document.getElementById("game-over-overlay");
  const resetGameButton = document.getElementById("reset-game-button");
  const GROUND_HEIGHT_PX = 50;

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
  // TODO: take into account ground height
  function changePipeHeightRandomly(pipe, position) {
    if(position === "top") {
      pipe.style.top = parseInt(Math.random() * -128) + "px";
      return;
    }

    if(position === "bottom") {
      pipe.style.bottom = parseInt(Math.random() * -128) + "px";
      return;
    }
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
    const outOfBoundsBottom = rect.y + rect.height < 0;
    return (
      outOfBoundsBottom
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

    if (isPipeOutOfBoundsLeft(pipeTop)) {
      changePipeHeightRandomly(pipeTop, "top");
    }
    
    movePipeLeft(pipeTop);

    if (isPipeOutOfBoundsLeft(pipeBottom)) {
      changePipeHeightRandomly(pipeBottom, "bottom");
    }

    movePipeLeft(pipeBottom);

    increaseHighscore();
  }
  
  resetGame();
});
