import React, { useState } from "react";
import axios from "axios";
import "./form.css";
import { useNavigate } from "react-router-dom";

function Register() {
  const [form, setForm] = useState({
    username: "",
    email: "",
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
    try {
      const res = await axios.post("http://localhost:5000/api/register", form, {
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (res.data.success) {
        setMessage("✅ Registered successfully! Redirecting to login...");
        setTimeout(() => {
          navigate("/login");
        }, 1500);
      } else {
        setMessage("❌ Error: " + (res.data.error || "Unknown error"));
      }
    } catch (err) {
      console.error("Registration error:", err);
      setMessage("❌ Server error during registration.");
    }
  };

  return (
    <div className="form-container">
      <div className="form-box">
        <h2>Register</h2>
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
              type="email"
              placeholder="Email"
              name="email"
              value={form.email}
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
          <input type="submit" className="btn" value="Register" />
          <p className="switch-link">
            Already have an account? <a href="/login">Login</a>
          </p>
          {message && <p className="login-message">{message}</p>}
        </form>
      </div>
    </div>
  );
}

export default Register;
