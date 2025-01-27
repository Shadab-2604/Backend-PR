let gameState = {
    difficulty: "",
    attemptsLeft: 0,
    targetNumber: 0,
    timerInterval: null,
    startTime: 0,
  }
  
  function selectDifficulty(difficulty) {
    gameState.difficulty = difficulty
    document.getElementById("difficulty-selection").style.display = "none"
    document.getElementById("game-area").style.display = "block"
    startGame()
  }
  
  function startGame() {
    fetch("/start-game", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ difficulty: gameState.difficulty }),
    })
      .then((response) => response.json())
      .then((data) => {
        gameState.attemptsLeft = data.attempts
        gameState.targetNumber = data.targetNumber
        updateAttemptsDisplay()
        startTimer()
      })
  }
  
  function makeGuess() {
    const guess = Number.parseInt(document.getElementById("guess-input").value)
    fetch("/make-guess", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ guess, targetNumber: gameState.targetNumber }),
    })
      .then((response) => response.json())
      .then((data) => {
        gameState.attemptsLeft--
        updateAttemptsDisplay()
        document.getElementById("message").textContent = data.message
        if (data.correct || gameState.attemptsLeft === 0) {
          endGame(data.correct)
        }
      })
  }
  
  function updateAttemptsDisplay() {
    document.getElementById("attempts-left").textContent = gameState.attemptsLeft
  }
  
  function startTimer() {
    gameState.startTime = Date.now()
    gameState.timerInterval = setInterval(updateTimer, 1000)
  }
  
  function updateTimer() {
    const elapsedTime = Math.floor((Date.now() - gameState.startTime) / 1000)
    const minutes = Math.floor(elapsedTime / 60)
      .toString()
      .padStart(2, "0")
    const seconds = (elapsedTime % 60).toString().padStart(2, "0")
    document.getElementById("time").textContent = `${minutes}:${seconds}`
  }
  
  function endGame(won) {
    clearInterval(gameState.timerInterval)
    document.getElementById("game-area").style.display = "none"
    document.getElementById("play-again").style.display = "block"
    if (won) {
      document.getElementById("message").textContent =
        `Congratulations! You guessed the number in ${10 - gameState.attemptsLeft} attempts.`
    } else {
      document.getElementById("message").textContent = `Game over! The number was ${gameState.targetNumber}.`
    }
  }
  
  function resetGame() {
    document.getElementById("difficulty-selection").style.display = "block"
    document.getElementById("play-again").style.display = "none"
    document.getElementById("message").textContent = "Welcome! I'm thinking of a number between 1 and 100."
    document.getElementById("guess-input").value = ""
    gameState = {
      difficulty: "",
      attemptsLeft: 0,
      targetNumber: 0,
      timerInterval: null,
      startTime: 0,
    }
  }
  
  