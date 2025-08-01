import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./form.css";

function Login() {
  const [form, setForm] = useState({
    username: "",
    password: "",
    role: ""
  });
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.username || !form.password || !form.role) {
      setMessage("❗ Please fill in all fields.");
      return;
    }

    try {
      const res = await axios.post("http://localhost:5000/api/login", {
        username: form.username,
        password: form.password
      }, { withCredentials: true });

      if (res.data.success && res.data.role.toLowerCase() === form.role.toLowerCase()) {
        setMessage("✅ Login successful. Redirecting...");
        setTimeout(() => {
          if (form.role === "student") {
            navigate("/student", { state: { username: res.data.username, email: res.data.email } });
          } else if (form.role === "staff") {
            navigate("/staff", { state: { username: res.data.username, email: res.data.email } });
          } else if (form.role === "admin") {
            navigate("/admin", { state: { username: res.data.username, email: res.data.email } });
          }
        }, 1000);
      } else {
        setMessage("❌ Invalid credentials or role mismatch.");
      }
    } catch (err) {
      console.error(err);
      setMessage("❌ Server error during login.");
    }
  };

  return (
    <div className="form-container">
      <div className="form-box">
        <h2>Login</h2>
        <form onSubmit={handleSubmit}>
          <div className="textbox">
            <input
              type="text"
              placeholder="Username"
              name="username"
              value={form.username}
              onChange={handleChange}
              required
            />
          </div>
          <div className="textbox">
            <input
              type="password"
              placeholder="Password"
              name="password"
              value={form.password}
              onChange={handleChange}
              required
            />
          </div>
          <div className="textbox">
            <select name="role" value={form.role} onChange={handleChange} required>
              <option value="" disabled>Select Role</option>
              <option value="student">Student</option>
              <option value="staff">Staff</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          <input type="submit" className="btn" value="Login" />
          <p className="switch-link">
            Don’t have an account? <a href="/register">Register</a>
          </p>
          {message && <p className="login-message">{message}</p>}
        </form>
      </div>
    </div>
  );
}

export default Login;
