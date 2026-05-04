import { useState, useEffect } from "react";
import axios from "axios";

function App() {
  // Auth state
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState(null);

  // Task state
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [editingTaskId, setEditingTaskId] = useState(null);

  const register = async () => {
    try {
      const res = await axios.post("http://localhost:5000/api/auth/register", {
        name: "Tyrrell",
        email,
        password,
      });

      setUser(res.data);
      localStorage.setItem("token", res.data.token)

      alert("Registered successfully");

    } catch (err) {
      console.error("FULL ERROR:", err);
      console.log("SERVER RESPONSE:", err.respose?.data);

      alert(JSON.stringify(err.response?.data));
    }
  };

  // Login user
  const login = async () => {
    try {
      const res = await axios.post("http://localhost:5000/api/auth/login", {
        email,
        password,
      });

      setUser(res.data);
      localStorage.setItem("token", res.data.token);
    } catch (err) {
      console.error(err);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
    setTasks({});
  };

  // Fetch tasks
  const fetchTasks = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.get("http://localhost:5000/api/tasks", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setTasks(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  // Create task
  const createTask = async () => {
    try {
      const token = localStorage.getItem("token");

      await axios.post(
        "http://localhost:5000/api/tasks",
        { title, description },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      
      setTitle("");
      setDescription("");

      fetchTasks(); // refresh list
    } catch (err) {
      console.error(err);
    }
  };

  // Delete task
  const deleteTask = async (id) => {
    try {
      const token = localStorage.getItem("token");

      await axios.delete(`http://localhost:5000/api/tasks/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      fetchTasks(); // refresh list
    } catch (err) {
      console.error(err);
    }
  };

  // Update task
  const updateTask = async (id) => {
    try {
      const token = localStorage.getItem("token");

      await axios.put(
        `http://localhost:5000/api/tasks/${id}`,
        { title, description },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setEditingTaskId(null);
      setTitle("");
      setDescription("");
      
      fetchTasks();
    } catch (err) {
      console.error(err);
    }
  };

  // Load tasks after login
  useEffect(() => {
    if (user) {
      fetchTasks();
    }
  }, [user]);

  return (
  <div style={{ padding: "20px", maxWidth: "500px", margin: "auto" }}>
    <h1>Task Manager</h1>

    {!user ? (
      <>
        {/* Login/Register */}
        <input
          placeholder="Email"
          onChange={(e) => setEmail(e.target.value)}
        />
        <br /><br />

        <input
          type="password"
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}
        />
        <br /><br />

        <button onClick={register}>Register</button>

        <button
          onClick={login}
          style={{ marginLeft: "10px" }}
        >
          Login
        </button>
      </>
    ) : (
      <>
        <h2>Welcome {user.name}</h2>
        <button
          onClick={logout}
          style={{ marginButtom: "20px"}}
        >
          Logout
        </button>

        {/* Create Task Form */}
        <h3>Create Task</h3>

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

        {editingTaskId ? (
          <button onClick={() => updateTask(editingTaskId)}>
            Update Task
          </button>
        ) : (
          <button onClick={createTask}>
            Add Task
          </button>
        )}

        <hr />

        {/* Task List */}
        <h3>Your Tasks</h3>

        {tasks.length === 0 ? (
          <p>No tasks yet.</p>
        ) : (
          tasks.map((task) => (
            <div
              key={task._id}
              style={{
                border: "1px solid #ccc",
                padding: "12px",
                borderRadius: "8px",
                marginBottom: "12px"
              }}
            >
              <strong>{task.title}</strong>

              <p>{task.description}</p>

              <button
                onClick={() => deleteTask(task._id)}
              >
                Delete
              </button>

              <button
                onClick={() => {
                  setEditingTaskId(task._id);
                  setTitle(task.title);
                  setDescription(task.description);
                }}
                style={{ marginLeft: "10px" }}
              >
                Edit
              </button>
            </div>
          ))
        )}
      </>
    )}
  </div>
)};
export default App;