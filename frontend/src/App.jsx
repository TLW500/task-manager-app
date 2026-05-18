import { useState, useEffect } from "react";
import axios from "axios";
import TaskForm from "./components/TaskForm";
import TaskList from "./components/TaskList";

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
      localStorage.setItem("user", JSON.stringify(res.data));
      localStorage.setItem("token", res.data.token)

      alert("Registered successfully");

    } catch (err) {
      console.error("FULL ERROR:", err);
      console.log("SERVER RESPONSE:", err.response?.data);

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
      localStorage.setItem("user", JSON.stringify(res.data));
      localStorage.setItem("token", res.data.token);
    } catch (err) {
      console.error(err);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    setTasks([]);
    setEmail("");
    setPassword("");
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

  const toggleComplete = async (id) => {
    try {
      const token = localStorage.getItem("token");

      await axios.put(
        `http://localhost:5000/api/tasks/${id}/toggle`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

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

  useEffect(() => {
    const savedUser = localStorage.getItem("user");

    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

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
          style={{ marginBottom: "20px"}}
        >
          Logout
        </button>

        {/* Task Form */}
        <TaskForm
          title={title}
          description={description}
          setTitle={setTitle}
          setDescription={setDescription}
          createTask={createTask}
          updateTask={updateTask}
          editingTaskId={editingTaskId}
        />

        <hr />

        {/* Task List */}
        <TaskList
          tasks={tasks}
          onDelete={deleteTask}
          onEdit={(task) => {
            setEditingTaskId(task._id);
            setTitle(task.title);
            setDescription(task.description);
          }}
          toggleComplete={toggleComplete}
        />
      </>
    )}
  </div>
  );
}

export default App;