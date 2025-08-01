import React, { useEffect, useState } from "react";
import axios from "axios";
import "./dashboard.css"; // Make sure background is set differently here
import JntuhHeader from "../components/JntuhHeader";

function StaffDashboard() {
  const [username, setUsername] = useState("");
  const [events, setEvents] = useState([]);
  const [activeSection, setActiveSection] = useState("");

  useEffect(() => {
    axios.get("http://localhost:5000/api/loginStatus", { withCredentials: true })
      .then(res => {
        if (res.data.success && res.data.role === "staff") {
          setUsername(res.data.username);
          fetchEvents(res.data.username);
        } else {
          window.location.href = "/login";
        }
      }).catch(() => {
        window.location.href = "/login";
      });
  }, []);

  const fetchEvents = (creator) => {
    axios.get(`http://localhost:5000/api/events?createdBy=${creator}`)
      .then(res => setEvents(res.data));
  };

  const createEvent = (e) => {
    e.preventDefault();
    const { event_name, event_date, event_description } = e.target;
    axios.post("http://localhost:5000/api/events", {
      name: event_name.value,
      date: event_date.value,
      description: event_description.value,
      created_by: username
    }, { withCredentials: true })
      .then(() => {
        fetchEvents(username);
        e.target.reset();
        setActiveSection("list"); // Switch to event list after creating
      });
  };

  const deleteEvent = (id) => {
    axios.delete(`http://localhost:5000/api/events/${id}`, { withCredentials: true })
      .then(() => fetchEvents(username));
  };

  const logout = () => {
    axios.post("http://localhost:5000/api/logout", {}, { withCredentials: true })
      .then(() => window.location.href = "/");
  };

  const toggleSection = (section) => {
    setActiveSection(prev => prev === section ? "" : section);
  };

  return (
    <div className="dashboard staff-dashboard">
       <JntuhHeader />
      <h2>Welcome, {username}!</h2>
      <div className="nav">
        <button onClick={() => toggleSection("create")}>Create Event</button>
        <button onClick={() => toggleSection("list")}>Created Events</button>
        <button onClick={logout}>Logout</button>
      </div>

      <center><h3>Welcome To Staff Dashboard</h3></center>
      <p className="intro-text">
        This is your staff dashboard. It provides sections to create new events and view events you've created.
      </p>
      <ul className="dashboard-info">
        <li><strong>Event Creation:</strong> Easily create new events by filling out a simple form.</li>
        <li><strong>Event Management:</strong> See a list of all the events you have created.</li>
        <li><strong>Delete Events:</strong> You can easily delete an event if it's canceled or needs to be removed.</li>
      </ul>

      {activeSection === "create" && (
        <div className="container">
          <h3>Create Event</h3>
          <form onSubmit={createEvent}>
            <label>Event Name:</label>
            <input name="event_name" placeholder="Event Name" required />
            <label>Event Date:</label>
            <input type="date" name="event_date" required />
            <label>Event Description:</label>
            <textarea name="event_description" placeholder="Description" required />
            <button type="submit">Create Event</button>
          </form>
        </div>
      )}

      {activeSection === "list" && (
        <div className="container">
          <h3>Your Events</h3>
          {events.length === 0 ? (
            <p>No events created yet.</p>
          ) : (
            <ul>
              {events.map(ev =>
                <li key={ev.id}>
                  <strong>Event Name:</strong> {ev.name}<br />
                  <strong>Date:</strong> {ev.date}<br />
                  <strong>Description:</strong> {ev.description}<br />
                  <button onClick={() => deleteEvent(ev.id)}>Delete</button>
                </li>
              )}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}

export default StaffDashboard;
