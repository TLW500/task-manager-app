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
})   {
    return (
      <>
        <h3>{editingTaskId ? "Edit Task" : "Create Task"}</h3>

        <input
          placeholder="Task Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <br /><br />

        <input
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <br /><br />

        <label htmlFor="dueDate">Due Date</label>
        <input
          id="dueDate"
          type="date"
          value={dueDate}
          min={new Date().toISOString().split("T")[0]}
          onChange={(e) => setDueDate(e.target.value)}
        />
        <br /><br />

        <label htmlFor="dueTime">Due Time</label>
        <input
          id="dueTime"
          type="time"
          value={dueTime}
          onChange={(e) => setDueTime(e.target.value)}
        />
        <br /><br />

        {editingTaskId ? (
            <button onClick={() => updateTask(editingTaskId)}>
                Update Task
            </button>
        ) : (
            <button onClick={createTask}>
                Add Task
            </button>
        )}
      </>
    );
}

export default TaskForm;