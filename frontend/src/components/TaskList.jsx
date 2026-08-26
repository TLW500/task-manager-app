function TaskList({ tasks, onDelete, onEdit, toggleComplete }) {
  if (tasks.length === 0) {
    return <p className="empty-text">No tasks yet.</p>;
  }

  return (
    <div className="task-list">
      {tasks.map((task) => (
        <div
          key={task._id}
          className={`task-card ${task.completed ? "completed-task" : ""}`}
        >
          <div className="task-header">
            <h3
              className={
                task.completed
                  ? "task-title completed-title"
                  : "task-title"
              }
            >
              {task.title}
            </h3>

            <span
              className={
                task.completed
                  ? "status done"
                  : "status active"
              }
            >
              {task.completed ? "Done" : "Active"}
            </span>
          </div>

          <p className="task-description">
            {task.description || "No description"}
          </p>

          <p className="due-date">
            Due:{" "}
            {task.dueDate
              ? new Date(task.dueDate).toLocaleDateString()
              : "No due date"}
          </p>

          <p className="due-date">
            Time:{" "}
            {task.dueTime
              ? new Date(
                  `2000-01-01T${task.dueTime}`
                ).toLocaleTimeString([], {
                  hour: "numeric",
                  minute: "2-digit",
                })
              : "No due time"}
          </p>

          <div className="task-actions">
            <button
              type="button"
              onClick={() => toggleComplete(task._id)}
            >
              {task.completed ? "Undo" : "Complete"}
            </button>

            <button
              type="button"
              className="secondary-btn"
              onClick={() => onEdit(task)}
            >
              Edit
            </button>

            <button
              type="button"
              className="delete-btn"
              onClick={() => onDelete(task._id)}
            >
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

export default TaskList;