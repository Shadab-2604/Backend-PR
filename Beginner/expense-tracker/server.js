const express = require('express')
const fs = require('fs')
const path = require('path')

const app = express()
const PORT = 3000
const DATA_FILE = path.join(__dirname, 'data', 'data.json');

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

const loadtData = () => {
  JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
}

const saveData = (data) => {
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
}

app.get('/expenses', (req, res) => {
  const data = loadData();
  const total = data.reduce((acc, expense) => acc + expense.amount, 0);
  res.json({expenses: data, total});
});


app.post("/expenses" , (req,res) => {
  const data = loadData();
  const newExpense ={
    id : ++Date.lastID,
    date : new Date().toISOString(),
    ...req.body,
  };
  date.expenses.push(newExpense);
  saveData(data);
  res.status(201).json(newExpense);
});
app.delete("/expenses/:id", (req, res) => {
  const data = loadData();
  const id = parseInt(req.params.id);
  data.expenses = data.expenses.filter((exp) => exp.id !== id);
  saveData(data);
  res.status(204).end();
});

app.listen (PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`)
})