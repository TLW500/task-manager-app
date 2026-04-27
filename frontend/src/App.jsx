import { useState } from "react";
import axios from "axios";

function App() {
  // Auth state
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState(null);

  // Task state
  const [tasks, setTasks] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const register = async () => {
    try {
      const res = await axios.post("http://localhost:5000/api/auth/register", {
        name: "Tyrrell",
        email,
        password,
      });

      setUser(res.data);
      localStorage.setItem("token", res.data.token)
    } catch (err) {
      console.error(err);
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

  // Load tasks after login
  useEffect(() => {
    if (user) {
      fetchTasks();
    }
  }, [user]);

  return (
    <div style={{ padding: "20px" }}>
      <h1>Task Manager</h1>

      {!user ? (
        <>
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
        </>
      ) : (
        <h2>Welcome {user.name}</h2>
      )}
    </div>
  );
}

export default App;