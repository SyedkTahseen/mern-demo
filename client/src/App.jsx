import React, { useEffect, useState } from "react";
import { createTask, deleteTask, getTasks, updateTask } from "./api.js";

function App() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    getTasks()
      .then(setTasks)
      .catch((requestError) => setError(requestError.message))
      .finally(() => setLoading(false));
  }, []);

  async function handleCreate(event) {
    event.preventDefault();
    setError("");
    setSaving(true);
    try {
      const task = await createTask({ title, description });
      setTasks((current) => [task, ...current]);
      setTitle("");
      setDescription("");
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setSaving(false);
    }
  }

  async function handleToggle(task) {
    setError("");
    try {
      const updated = await updateTask(task._id, { completed: !task.completed });
      setTasks((current) =>
        current.map((item) => (item._id === updated._id ? updated : item)),
      );
    } catch (requestError) {
      setError(requestError.message);
    }
  }

  async function handleDelete(id) {
    setError("");
    try {
      await deleteTask(id);
      setTasks((current) => current.filter((task) => task._id !== id));
    } catch (requestError) {
      setError(requestError.message);
    }
  }

  const completedCount = tasks.filter((task) => task.completed).length;

  return (
    <main className="page">
      <header className="page-header">
        <div>
          <p className="eyebrow">A little more focus</p>
          <h1>Task Tracker</h1>
          <p className="subtitle">Make space for what matters today.</p>
        </div>
        <div className="counter" aria-label={`${completedCount} tasks completed`}>
          <strong>{completedCount}</strong>
          <span>of {tasks.length} done</span>
        </div>
      </header>

      <section className="panel composer" aria-labelledby="new-task-heading">
        <h2 id="new-task-heading">Add a task</h2>
        <form onSubmit={handleCreate}>
          <label htmlFor="task-title">Task</label>
          <input
            id="task-title"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            placeholder="What needs to get done?"
            maxLength={120}
            required
          />
          <label htmlFor="task-description">Notes <span>(optional)</span></label>
          <textarea
            id="task-description"
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            placeholder="Add a little detail..."
            maxLength={500}
            rows={3}
          />
          <button className="primary-button" type="submit" disabled={saving}>
            {saving ? "Adding..." : "Add task"}
          </button>
        </form>
      </section>

      <section className="task-section" aria-labelledby="tasks-heading">
        <div className="section-heading">
          <h2 id="tasks-heading">Your tasks</h2>
          <span>{tasks.length} {tasks.length === 1 ? "task" : "tasks"}</span>
        </div>
        {error && <p className="error-message" role="alert">{error}</p>}
        {loading ? (
          <p className="empty-state">Loading your tasks...</p>
        ) : tasks.length === 0 ? (
          <p className="empty-state">Nothing here yet. Add your first task above.</p>
        ) : (
          <ul className="task-list">
            {tasks.map((task) => (
              <li className={`task-card${task.completed ? " is-complete" : ""}`} key={task._id}>
                <label className="task-check">
                  <input
                    type="checkbox"
                    checked={task.completed}
                    onChange={() => handleToggle(task)}
                    aria-label={`${task.completed ? "Mark incomplete" : "Complete"}: ${task.title}`}
                  />
                  <span className="checkmark" aria-hidden="true" />
                </label>
                <div className="task-copy">
                  <h3>{task.title}</h3>
                  {task.description && <p>{task.description}</p>}
                </div>
                <button
                  className="delete-button"
                  type="button"
                  onClick={() => handleDelete(task._id)}
                  aria-label={`Delete ${task.title}`}
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>
      <footer>Built with MongoDB, Express, React &amp; Node.js</footer>
    </main>
  );
}

export default App;
