import React, { useState, useEffect } from 'react';

function App() {
  // Load todos from localStorage
  const [todos, setTodos] = useState(() => {
    const saved = localStorage.getItem('todos');
    return saved ? JSON.parse(saved) : [];
  });
  const [input, setInput] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [currentTodo, setCurrentTodo] = useState({});
  const [filter, setFilter] = useState('all'); // 'all', 'active', 'completed'

  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(todos));
  }, [todos]);

  // Add Task
  const handleSubmit = (e) => {
    e.preventDefault();
    if (input.trim() === '') return;
    setTodos([
      ...todos,
      { text: input, id: Date.now(), completed: false }
    ]);
    setInput('');
  };

  // Delete Task
  const handleDelete = (id) => {
    setTodos(todos.filter(todo => todo.id !== id));
  };

  // Mark Complete
  const handleToggle = (id) => {
    setTodos(todos.map(todo =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ));
  };

  // Move Task Up/Down
  const moveUp = (idx) => {
    if (idx === 0) return;
    const newTodos = [...todos];
    [newTodos[idx - 1], newTodos[idx]] = [newTodos[idx], newTodos[idx - 1]];
    setTodos(newTodos);
  };
  const moveDown = (idx) => {
    if (idx === todos.length - 1) return;
    const newTodos = [...todos];
    [newTodos[idx], newTodos[idx + 1]] = [newTodos[idx + 1], newTodos[idx]];
    setTodos(newTodos);
  };

  // Edit/Update Task
  const startEditing = (todo) => {
    setIsEditing(true);
    setCurrentTodo({ ...todo });
  };
  const handleUpdate = (e) => {
    e.preventDefault();
    if (currentTodo.text.trim() === '') return;
    setTodos(todos.map(todo =>
      todo.id === currentTodo.id ? { ...todo, text: currentTodo.text } : todo
    ));
    setIsEditing(false);
    setCurrentTodo({});
  };

  // Clear Completed
  const clearCompleted = () => {
    setTodos(todos.filter(todo => !todo.completed));
  };

  // Filtered Tasks
  const filteredTodos = todos.filter(todo => {
    if (filter === 'active') return !todo.completed;
    if (filter === 'completed') return todo.completed;
    return true;
  });

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded shadow w-full max-w-md">
        <h1 className="text-2xl font-bold mb-4 text-center">Simple To-Do App</h1>

        {/* Pending Task Count */}
        <div className="text-gray-600 text-center mb-2">
          {todos.filter(todo => !todo.completed).length} tasks left
        </div>

        {/* Filter Buttons */}
        <div className="flex gap-2 justify-center mb-2">
          <button
            className={`px-2 py-1 rounded ${filter === 'all' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
            onClick={() => setFilter('all')}
          >All</button>
          <button
            className={`px-2 py-1 rounded ${filter === 'active' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
            onClick={() => setFilter('active')}
          >Active</button>
          <button
            className={`px-2 py-1 rounded ${filter === 'completed' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
            onClick={() => setFilter('completed')}
          >Completed</button>
        </div>

        {/* Clear Completed Button */}
        <button
          className="mb-4 bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 block mx-auto"
          onClick={clearCompleted}
        >
          Clear Completed
        </button>

        {/* Form: Add or Edit */}
        {isEditing ? (
          <form className="flex gap-2 mb-4" onSubmit={handleUpdate}>
            <input
              className="border rounded px-3 py-2 flex-1 focus:outline-none"
              type="text"
              value={currentTodo.text}
              onChange={e => setCurrentTodo({ ...currentTodo, text: e.target.value })}
              placeholder="Edit task..."
            />
            <button
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
              type="submit"
            >
              Update
            </button>
            <button
              className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500"
              type="button"
              onClick={() => setIsEditing(false)}
            >
              Cancel
            </button>
          </form>
        ) : (
          <form className="flex gap-2 mb-4" onSubmit={handleSubmit}>
            <input
              className="border rounded px-3 py-2 flex-1 focus:outline-none"
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder="Add a new task..."
            />
            <button
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              type="submit"
            >
              Add
            </button>
          </form>
        )}

        {/* To-Do List */}
        <ul>
          {filteredTodos.map(todo => {
            // For move up/down, get index in original todos
            const originalIndex = todos.findIndex(t => t.id === todo.id);
            return (
              <li
                key={todo.id}
                className="py-2 px-3 mb-2 bg-gray-50 rounded flex items-center justify-between"
              >
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={todo.completed}
                    onChange={() => handleToggle(todo.id)}
                    className="mr-2"
                  />
                  <span className={todo.completed ? "line-through text-gray-400" : ""}>
                    {todo.text}
                  </span>
                </div>
                <div className="flex gap-1">
                  <button
                    className="text-blue-400 hover:text-blue-600 mx-1"
                    onClick={() => moveUp(originalIndex)}
                    disabled={originalIndex === 0}
                  >↑</button>
                  <button
                    className="text-blue-400 hover:text-blue-600 mx-1"
                    onClick={() => moveDown(originalIndex)}
                    disabled={originalIndex === todos.length - 1}
                  >↓</button>
                  <button
                    className="text-yellow-500 hover:text-yellow-700 font-bold mx-1"
                    onClick={() => startEditing(todo)}
                  >Edit</button>
                  <button
                    className="text-red-500 hover:text-red-700 font-bold mx-1"
                    onClick={() => handleDelete(todo.id)}
                  >Delete</button>
                </div>
              </li>
            );
          })}
          {filteredTodos.length === 0 && (
            <li className="text-center text-gray-400">No tasks found!</li>
          )}
        </ul>
      </div>
    </div>
  );
}

export default App;

