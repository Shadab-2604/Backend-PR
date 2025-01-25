const express = require('express');
const fs = require('fs');
const path = require('path');
const bodyParser = require('body-parser');

const app = express();
const PORT = 3000;

// Path to tasks.json
const TASK_FILE = path.join(__dirname, 'tasks.json');

// Middleware
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// Helper to load tasks
const loadTasks = () => {
  if (!fs.existsSync(TASK_FILE)) {
    fs.writeFileSync(TASK_FILE, JSON.stringify([]));
  }
  return JSON.parse(fs.readFileSync(TASK_FILE, 'utf8'));
};

// Helper to save tasks
const saveTasks = (tasks) => {
  fs.writeFileSync(TASK_FILE, JSON.stringify(tasks, null, 4));
};

// Get all tasks
app.get('/api/tasks', (req, res) => {
  const tasks = loadTasks();
  res.json(tasks);
});

// Add a task
app.post('/api/tasks', (req, res) => {
  const tasks = loadTasks();
  const { description } = req.body;
  if (!description) {
    return res.status(400).json({ error: 'Description is required' });
  }
  const id = tasks.length ? tasks[tasks.length - 1].id + 1 : 1;
  const now = new Date().toISOString();
  const task = { id, description, done: false, created_at: now, updated_at: now };
  tasks.push(task);
  saveTasks(tasks);
  res.json(task);
});

// Update a task
app.put('/api/tasks/:id', (req, res) => {
  const tasks = loadTasks();
  const { id } = req.params;
  const { description, done } = req.body;
  const task = tasks.find((t) => t.id === parseInt(id, 10));
  if (!task) {
    return res.status(404).json({ error: 'Task not found' });
  }
  if (description) task.description = description;
  if (done !== undefined) task.done = done;
  task.updated_at = new Date().toISOString();
  saveTasks(tasks);
  res.json(task);
});

// Delete a task
app.delete('/api/tasks/:id', (req, res) => {
  const tasks = loadTasks();
  const { id } = req.params;
  const updatedTasks = tasks.filter((t) => t.id !== parseInt(id, 10));
  saveTasks(updatedTasks);
  res.status(204).send();
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
