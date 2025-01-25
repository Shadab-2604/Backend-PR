const taskForm = document.getElementById('task-form');
const taskInput = document.getElementById('task-input');
const taskList = document.getElementById('task-list');

// Fetch tasks
const fetchTasks = async () => {
  const response = await fetch('/api/tasks');
  const tasks = await response.json();
  renderTasks(tasks);
};

// Render tasks
const renderTasks = (tasks) => {
  taskList.innerHTML = '';
  tasks.forEach((task) => {
    const li = document.createElement('li');
    li.className = task.done ? 'done' : '';
    li.textContent = task.description;

    // Add buttons
    const doneBtn = document.createElement('button');
    doneBtn.textContent = task.done ? 'Undo' : 'Done';
    doneBtn.onclick = () => toggleTaskStatus(task.id, !task.done);

    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = 'Delete';
    deleteBtn.onclick = () => deleteTask(task.id);

    li.appendChild(doneBtn);
    li.appendChild(deleteBtn);
    taskList.appendChild(li);
  });
};

// Add task
taskForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const description = taskInput.value;
  await fetch('/api/tasks', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ description }),
  });
  taskInput.value = '';
  fetchTasks();
});

// Toggle task status
const toggleTaskStatus = async (id, done) => {
  await fetch(`/api/tasks/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ done }),
  });
  fetchTasks();
};

// Delete task
const deleteTask = async (id) => {
  await fetch(`/api/tasks/${id}`, { method: 'DELETE' });
  fetchTasks();
};

// Initial fetch
fetchTasks();
