const express = require("express")
const path = require("path")
const app = express()
const port = 3000

app.use(express.static("public"))
app.use(express.json())

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"))
})

app.post("/start-game", (req, res) => {
  const { difficulty } = req.body
  let attempts
  switch (difficulty) {
    case "easy":
      attempts = 10
      break
    case "medium":
      attempts = 5
      break
    case "hard":
      attempts = 3
      break
    default:
      attempts = 5
  }
  const targetNumber = Math.floor(Math.random() * 100) + 1
  res.json({ attempts, targetNumber })
})

app.post("/make-guess", (req, res) => {
  const { guess, targetNumber } = req.body
  if (guess === targetNumber) {
    res.json({ correct: true, message: "Correct!" })
  } else if (guess < targetNumber) {
    res.json({ correct: false, message: "Too low! Try a higher number." })
  } else {
    res.json({ correct: false, message: "Too high! Try a lower number." })
  }
})

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`)
})

