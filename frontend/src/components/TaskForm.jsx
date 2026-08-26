function TaskForm({
  title,
  description,
  dueDate,
  dueTime,
  setTitle,
  setDescription,
  setDueDate,
  setDueTime,
  createTask,
  updateTask,
  editingTaskId,
}) {
  const handleSubmit = (event) => {
    event.preventDefault();

    if (editingTaskId) {
      updateTask(editingTaskId);
    } else {
      createTask();
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h3>{editingTaskId ? "Edit Task" : "Create Task"}</h3>

      <label htmlFor="taskTitle">Task Title</label>
      <input
        id="taskTitle"
        type="text"
        placeholder="Task Title"
        value={title}
        onChange={(event) => setTitle(event.target.value)}
        required
      />

      <label htmlFor="taskDescription">Description</label>
      <input
        id="taskDescription"
        type="text"
        placeholder="Description"
        value={description}
        onChange={(event) => setDescription(event.target.value)}
      />

      <label htmlFor="dueDate">Due Date</label>
      <input
        id="dueDate"
        type="date"
        value={dueDate}
        min={new Date().toISOString().split("T")[0]}
        onChange={(event) => setDueDate(event.target.value)}
      />

      <label htmlFor="dueTime">Due Time</label>
      <input
        id="dueTime"
        type="time"
        value={dueTime}
        onChange={(event) => setDueTime(event.target.value)}
        disabled={!dueDate}
      />

      <button type="submit">
        {editingTaskId ? "Update Task" : "Add Task"}
      </button>
    </form>
  );
}

export default TaskForm;