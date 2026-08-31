function TaskList({ tasks, onDelete, onEdit, toggleComplete }) {
  if (tasks.length === 0) {
    return <p className="empty-text">No tasks yet.</p>;
  }

  const parseLocalDate = (dateValue) => {
    if (!dateValue) {
      return null;
    }

    const dateOnly = dateValue.slice(0, 10);
    const [year, month, day] = dateOnly.split("-").map(Number);

    return new Date(year, month - 1, day);
  };

  const getDueStatus = (dueDate, dueTime, completed) => {
    if (completed || !dueDate) {
      return null;
    }

    const now = new Date();

    // Start with the task's due date
    const due = parseLocalDate(dueDate);

    // If the task has a specific due time, add it
    if (dueTime) {
      const [hours, minutes] = dueTime.split(":");

      due.setHours(
        Number(hours),
        Number(minutes),
        0,
        0
      );
    } else {
      // If no time was selected, consider it due at the end of the day
      due.setHours(23, 59, 59, 999);
    }

    const difference = due - now;

    const oneHour = 60 * 60 * 1000; // milliseconds in an hour
    const oneDay = 24 * oneHour; // milliseconds in a day

    if (difference < 0) {
      return {
        text: "Overdue",
        className: "overdue",
      };
    }

    if (difference <= oneHour) {
      return {
        text: "Due Soon",
        className: "due-soon",
      };
    }

    if (difference <= oneDay) {
      return {
        text: "Due Today",
        className: "due-today",
      };
    }

    return null;     
  };

  return (
    <div className="task-list">
      {tasks.map((task) => {
        const dueStatus = getDueStatus(
          task.dueDate,
          task.dueTime,
          task.completed
        );

        return (
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
              ? parseLocalDate(task.dueDate).toLocaleDateString()
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

          {dueStatus && (
            <p className={`due-status ${dueStatus.className}`}>
              {dueStatus.text}  
            </p>
          )}

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
        );
  })}
    </div>
  );
}

export default TaskList;