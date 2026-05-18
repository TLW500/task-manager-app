function TaskList({ tasks, onDelete, onEdit, toggleComplete }) {
    if (tasks.length === 0) {
        return <p>No tasks yet. </p>
    }

    return (
        <>
        {tasks.map((task) => (
          <div key={task._id} style={{
            border: "1px solid #ccc",
            padding: "12px",
            borderRadius: "8px",
            marginBottom: "12px"
          }}>
            <strong
              style={{
                textDecoration: task.completed
                  ? "line=through"
                  : "none",
              }}
            >
                {task.title}
            </strong>
            <p>{task.description}</p>

            <button onClick={() => onDelete(task._id)}>
                Delete
            </button>

            <button
                onClick={() => onEdit(task)}
                style={{ marginLeft: "10px "}}
            >
                Edit
            </button>

            <button
              onClick={() => toggleComplete(task._id)}
              style={{ marginLeft: "10px" }}
            >
                {task.completed ? "Undo" : "Complete"}
            </button>
            </div>
        ))}
    </>
    );
}

export default TaskList;