import React, { useEffect, useState } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import "./dashboard.css";
import JntuhHeader from "../components/JntuhHeader";

function StudentDashboard() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [registeredEvents, setRegisteredEvents] = useState([]);
  const [showEvents, setShowEvents] = useState(false);
  const [formInputs, setFormInputs] = useState({});

  const username = state?.username;

  useEffect(() => {
    if (!username) {
      navigate("/login");
      return;
    }
    fetchAllEvents();
    fetchRegisteredEvents(username);
  }, [username, navigate]);

  const fetchAllEvents = () => {
    axios.get("http://localhost:5000/api/events")
      .then(res => setEvents(res.data));
  };

  const fetchRegisteredEvents = (uname) => {
    axios.get(`http://localhost:5000/api/registeredEvents?username=${uname}`)
      .then(res => setRegisteredEvents(res.data));
  };

  const handleRegister = async (event_id, formData) => {
    try {
      await axios.post("http://localhost:5000/api/registerEvent", {
        event_id,
        student_username: username,
        student_email: formData.email,
        branch: formData.branch,
        roll_no: formData.roll_no
      });
      fetchRegisteredEvents(username);
    } catch {
      alert("Error registering.");
    }
  };

  const handleUnregister = async (event_id) => {
    try {
      await axios.post("http://localhost:5000/api/unregisterEvent", {
        event_id,
        student_username: username
      });
      fetchRegisteredEvents(username);
    } catch {
      alert("Error unregistering.");
    }
  };

  const isRegistered = (eventId) => {
    return registeredEvents.some(e => e.event_id === eventId);
  };

  const handleFormChange = (eventId, e) => {
    setFormInputs(prev => ({
      ...prev,
      [eventId]: { ...prev[eventId], [e.target.name]: e.target.value }
    }));
  };

  const formatDate = (dateString) => {
    const dateObj = new Date(dateString);
    const day = String(dateObj.getDate()).padStart(2, "0");
    const month = String(dateObj.getMonth() + 1).padStart(2, "0");
    const year = dateObj.getFullYear();
    return `${day}-${month}-${year}`;
  };

  const handleLogout = () => {
    navigate("/");
  };

  return (
    <div className="dashboard">
       <JntuhHeader />
      <h2>Welcome, {username}!</h2>

      <div className="nav">
        <button onClick={() => setShowEvents(prev => !prev)}>Show Events</button>
          <button onClick={handleLogout}>Logout</button>
      </div>

      <center><h3>Welcome To Student Dashboard</h3></center>

      <div className="container">
        <p>Here, you can register or unregister for events.</p>
        <ul>
          <li><strong>Register:</strong> Enter your details and register.</li>
          <li><strong>Unregister:</strong> Cancel your registration for any event.</li>
        </ul>
      </div>

      {showEvents && (
        <div className="container">
          <center><h2>All Events</h2></center>
          {events.map((event) => (
            <div key={event.id} style={{ marginBottom: "30px" }}>
              <h4>{event.name}</h4>
              <p><strong>Date:</strong> {formatDate(event.date)}</p>
              <p><strong>Description:</strong> {event.description}</p>

              {isRegistered(event.id) ? (
                <button onClick={() => handleUnregister(event.id)}>Unregister</button>
              ) : (
                <div>
                  <button onClick={() => {
                    const form = document.getElementById(`form-${event.id}`);
                    form.style.display = form.style.display === "block" ? "none" : "block";
                  }}>Register</button>

                  <form
                    id={`form-${event.id}`}
                    style={{ display: "none", marginTop: "10px" }}
                    onSubmit={(e) => {
                      e.preventDefault();
                      handleRegister(event.id, formInputs[event.id]);
                    }}
                  >
                    <input
                      type="email"
                      name="email"
                      placeholder="Email"
                      required
                      onChange={(e) => handleFormChange(event.id, e)}
                      style={{ marginBottom: "10px", padding: "8px", width: "100%" }}
                    />
                    <input
                      type="text"
                      name="branch"
                      placeholder="Branch"
                      required
                      onChange={(e) => handleFormChange(event.id, e)}
                      style={{ marginBottom: "10px", padding: "8px", width: "100%" }}
                    />
                    <input
                      type="text"
                      name="roll_no"
                      placeholder="Roll Number"
                      required
                      onChange={(e) => handleFormChange(event.id, e)}
                      style={{ marginBottom: "10px", padding: "8px", width: "100%" }}
                    />
                    <button type="submit">Submit</button>
                  </form>
                </div>
              )}
              <hr />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default StudentDashboard;
