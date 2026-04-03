import { useState } from "react";
import axios from "axios";

function App() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState(null);

  const register = async () => {
    try {
      const res = await axios.post("http://localhost:5000/api/auth/register", {
        name: "Tyrrell",
        email,
        password,
      });

      setUser(res.data);
      console.log(res.data);
    } catch (err) {
      console.error(err);
    }
  };

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