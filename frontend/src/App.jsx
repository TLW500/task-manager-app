import "./App.css";
import { useState, useEffect } from "react";
import axios from "axios";
import TaskForm from "./components/TaskForm";
import TaskList from "./components/TaskList";

function App() {
  // Auth state
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState(null);
  const [name, setName] = useState("");
  const [isRegistering, setIsRegistering] = useState(false);

  // Task state
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [dueTime, setDueTime] = useState("");
  const [editingTaskId, setEditingTaskId] = useState(null);

  // Filter state
  const [filter, setFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [message, setMessage] = useState(""); // message state
  const [messageType, setMessageType] = useState(""); // message type state

  const API_URL = import.meta.env.VITE_API_URL;


  const registerUser = async () => {
    if(!name.trim() || !email.trim() || !password) {
      setMessage("Name, email, and password are required.");
      setMessageType("error");
      return;
    }
    try {
      const res = await axios.post(`${API_URL}/api/auth/register`, {
        name,
        email,
        password,
      });

      console.log("Registering with:", {
        name,
        email,
        passwordLength: password.length,
      });

      setUser(res.data);
      localStorage.setItem("user", JSON.stringify(res.data));
      localStorage.setItem("token", res.data.token)

      //Clear the registration form
      setName("");
      setEmail("");
      setPassword("");
      setIsRegistering(false);

      setMessage("Registration successful.");
      setMessageType("success");

    } catch (err) {
      console.error(err);
      setMessage(err.response?.data?.message || "Registration failed.");
      setMessageType("error");
    }
  };

  // Login user
  const login = async () => {
    try {
      const res = await axios.post(`${API_URL}/api/auth/login`, {
        email,
        password,
      });

      setUser(res.data);
      localStorage.setItem("user", JSON.stringify(res.data));
      localStorage.setItem("token", res.data.token);

      setMessage(`Welcome back, ${res.data.name}!`);
      setMessageType("success");
    } catch (err) {
      console.error(err);
      setMessage(err.response?.data?.message || "Login failed.");
      setMessageType("error");
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    setTasks([]);
    setName("");
    setEmail("");
    setPassword("");
  };

  // Fetch tasks
  const fetchTasks = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.get(`${API_URL}/api/tasks`, {
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
   if (!title.trim()) {
      setMessage("Task title is required.");
      setMessageType("error");
      return;
    }

    if (dueDate) {
      const selectedDateTime = new Date(
        `${dueDate}T${dueTime || "23:59"}`
      );

      if (
        Number.isNaN(selectedDateTime.getTime()) ||
        selectedDateTime < new Date()
      ) {
        setMessage("Due date and time must be in the future.");
        setMessageType("error");
        return;
      }
    }

    try {
      const token = localStorage.getItem("token");

      await axios.post(
        `${API_URL}/api/tasks`,
        {
          title,
          description,
          dueDate,
          dueTime,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setTitle("");
      setDescription("");
      setDueDate("");
      setDueTime("");

      await fetchTasks();

      setMessage("Task created successfully.");
      setMessageType("success");
    } catch (err) {
      console.error(err);
      setMessage(
        err.response?.data?.message || "Unable to create task."
      );
      setMessageType("error");
    }
  };

  // Delete task
  const deleteTask = async (id) => {
    try {
      const token = localStorage.getItem("token");

      await axios.delete(`${API_URL}/api/tasks/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      fetchTasks(); // refresh list
      setMessage("Task deleted successfully.");
      setMessageType("success");
    } catch (err) {
      console.error(err);
    }
  };

  // Update task
  const updateTask = async (id) => {
  if (!title.trim()) {
    setMessage("Task title is required.");
    setMessageType("error");
    return;
  }

  if (dueDate) {
    const selectedDateTime = new Date(
      `${dueDate}T${dueTime || "23:59"}`
    );

    if (
      Number.isNaN(selectedDateTime.getTime()) ||
      selectedDateTime < new Date()
    ) {
      setMessage("Due date and time must be in the future.");
      setMessageType("error");
      return;
    }
  }

  try {
    const token = localStorage.getItem("token");

    await axios.put(
      `${API_URL}/api/tasks/${id}`,
      { title, description, dueDate, dueTime },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    setEditingTaskId(null);
    setTitle("");
    setDescription("");
    setDueDate("");
    setDueTime("");

    await fetchTasks();

    setMessage("Task updated successfully.");
    setMessageType("success");
  } catch (err) {
    console.error(err);
    setMessage(
      err.response?.data?.message || "Unable to update task."
    );
    setMessageType("error");
  }
};

  const toggleComplete = async (id) => {
    try {
      const token = localStorage.getItem("token");

      await axios.put(
        `${API_URL}/api/tasks/${id}/toggle`,
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

  useEffect(() => {
    if (!message) {
      return;
    }

    const timer = setTimeout(() => {
      setMessage("");
      setMessageType("");
    }, 3000);

    return () => clearTimeout(timer);
  }, [message]);

  const filteredTasks = tasks.filter((task) => {
  const matchesFilter =
    filter === "completed"
      ? task.completed
      : filter === "active"
      ? !task.completed
      : true;

  const matchesSearch =
    task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    task.description.toLowerCase().includes(searchTerm.toLowerCase());

  return matchesFilter && matchesSearch;
});

  return (
  <div className="app-container">
    <div className="app-card">
    <h1>Task Manager</h1>
    {message && (
      <div className={`message ${messageType}`}>
        {message}
      </div>
    )}

    {!user ? (
      <>
        {isRegistering && (
          <>
            <input
              type="text"
              placeholder="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <br /><br />
          </>
    )}
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <br /><br />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <br /><br />

        <div className="auth-buttons">
          {isRegistering ? (
            <>
              <button onClick={registerUser}>
                Create Account
              </button>

              <button
                className="secondary-btn"
                onClick={() => {
                  setIsRegistering(false);
                  setName("");
                  setMessage("");
                  setMessageType("");
                }}
              >
                Back to Login
              </button>
            </>
          ) : (
        <>
          <button onClick={login}>
            Login
          </button>

          <button
            className="secondary-btn"
            onClick={() => {
              setIsRegistering(true)
              setMessage("");
              setMessageType("");
            }}
          >
            Create Account
          </button>
        </>
      )}
    </div>
    </>
    ) : (
      <>
        <h2>Welcome {user.name}</h2>
        <button
          onClick={logout}
          className="logout-btn"
        >
          Logout
        </button>

        {/* Task Form */}
        <TaskForm
          title={title}
          description={description}
          dueDate={dueDate}
          dueTime={dueTime}
          setTitle={setTitle}
          setDescription={setDescription}
          setDueDate={setDueDate}
          setDueTime={setDueTime}
          createTask={createTask}
          updateTask={updateTask}
          editingTaskId={editingTaskId}
        />

        <hr />

        {/* Filter */}
        <input
          className="search-input"
          placeholder="Search tasks..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <div className="filter-buttons">
          <button onClick={() => setFilter("all")}>
            All
          </button>

          <button
            onClick={() => setFilter("active")}
            style={{ marginLeft: "10px" }}
          >
            Active
          </button>

          <button
            onClick={() => setFilter("completed")}
            style={{ marginLeft: "10px" }}
          >
            Completed
          </button>
        </div>

        {/* Task List */}
        <TaskList
          tasks={filteredTasks}
          onDelete={deleteTask}
          onEdit={(task) => {
            setEditingTaskId(task._id);
            setTitle(task.title);
            setDescription(task.description);
            setDueDate(task.dueDate ? task.dueDate.slice(0, 10) : "");
            setDueTime(task.dueTime || "");
          }}
          toggleComplete={toggleComplete}
        />
      </>
    )}
    </div>
  </div>
  );
}

export default App;