function TaskForm({
    title,
    description,
    setTitle,
    setDescription,
    createTask,
    updateTask,
    editingTaskId,
})   {
    return (
      <>
        <h3>Create Task</h3>

        <input
          placeholde="Task Title"
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