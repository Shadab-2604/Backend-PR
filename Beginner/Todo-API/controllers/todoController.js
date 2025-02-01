// controllers/todoController.js
const Todo = require("../models/Todo");
exports.getTodos = async (req, res) => {
  const todos = await Todo.find({ user: req.user.id });
  res.json({ data: todos });
};
exports.createTodo = async (req, res) => {
  const todo = await Todo.create({ ...req.body, user: req.user.id });
  res.status(201).json(todo);
};
exports.updateTodo = async (req, res) => {
  const todo = await Todo.findById(req.params.id);
  if (!todo || todo.user.toString() !== req.user.id) return res.status(403).json({ error: "Forbidden" });
  Object.assign(todo, req.body);
  await todo.save();
  res.json(todo);
};
exports.deleteTodo = async (req, res) => {
  const todo = await Todo.findById(req.params.id);
  if (!todo || todo.user.toString() !== req.user.id) return res.status(403).json({ error: "Forbidden" });
  await todo.deleteOne();
  res.status(204).send();
};