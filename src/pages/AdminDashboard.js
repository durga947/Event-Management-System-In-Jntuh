// client/src/components/AdminDashboard.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import "./dashboard.css";
import JntuhHeader from "../components/JntuhHeader";

function AdminDashboard() {
  const [username, setUsername] = useState("");
  const [events, setEvents] = useState([]);
  const [visibleEvents, setVisibleEvents] = useState({});
  const [showEventButtons, setShowEventButtons] = useState(false);
  const [registrations, setRegistrations] = useState({});

  useEffect(() => {
    axios.get("http://localhost:5000/api/loginStatus", { withCredentials: true })
      .then(res => {
        if (res.data.success && res.data.role === "admin") {
          setUsername(res.data.username);
          fetchEvents();
        } else {
          window.location.href = "/login";
        }
      })
      .catch(() => window.location.href = "/login");
  }, []);

  const fetchEvents = () => {
    axios.get("http://localhost:5000/api/events", { withCredentials: true })
      .then(res => setEvents(res.data))
      .catch(err => console.error("Event fetch error:", err));
  };

  const toggleEventButtons = () => {
    setShowEventButtons(prev => !prev);
  };

  const toggleEventDetails = (eventId) => {
    setVisibleEvents(prev => ({
      ...prev,
      [eventId]: !prev[eventId]
    }));

    if (!registrations[eventId]) {
      axios.get(`http://localhost:5000/api/eventRegistrations?eventId=${eventId}`, {
        withCredentials: true
      })
        .then(res => {
          setRegistrations(prev => ({
            ...prev,
            [eventId]: res.data
          }));
        })
        .catch(err => console.error("Fetch registration error:", err));
    }
  };

  const logout = () => {
    axios.post("http://localhost:5000/api/logout", {}, { withCredentials: true })
      .then(() => window.location.href = "/");
  };

  const formatDateTime = (dateString) => {
    const optionsDate = { day: "2-digit", month: "2-digit", year: "numeric" };
    const date = new Date(dateString);
    return `${date.toLocaleDateString("en-GB", optionsDate)} `;
  };

  return (
    <div className="dashboard">
       <JntuhHeader />
      <center><h2>Welcome, {username}!</h2></center>

      <div className="nav">
        <button className="toggle-details" onClick={toggleEventButtons}>
          Student Registration Details
        </button>
        <button className="logout" onClick={logout}>Logout</button>
      </div>

      <div className="intro">
        <h3>Welcome To Admin Dashboard</h3>
        <p>Here, you can manage and view details related to event registrations and events.</p>
      </div>

      <ul>
        <li><strong>Student Registration Details:</strong> View detailed information about students registered for various events.</li>
        <li><strong>Logout:</strong> Securely log out of the dashboard.</li>
      </ul>

      {showEventButtons && (
        <div className="events">
          <h3>Events Created by Staff</h3>
          {events.length > 0 ? (
            events.map((event) => (
              <div key={event.id} className="event-container">
                <button className="event-button" onClick={() => toggleEventDetails(event.id)}>
                  {event.name}
                </button>

                {visibleEvents[event.id] && (
                  <div className="event-details">
                    {registrations[event.id] ? (
                      registrations[event.id].length > 0 ? (
                        <table>
                          <thead>
                            <tr>
                              <th>Student ID</th>
                              <th>Student Name</th>
                              <th>Registration Date</th>
                              <th>Student Email</th>
                              <th>Branch</th>
                              <th>Roll No</th>
                              <th>Event ID</th>
                              <th>Event Name</th>
                              <th>Event Date</th>
                            </tr>
                          </thead>
                          <tbody>
                            {registrations[event.id].map(reg => (
                              <tr key={reg.id}>
                                <td>{reg.id}</td>
                                <td>{reg.student_username}</td>
                                <td>{formatDateTime(reg.registration_date)}</td>
                                <td>{reg.student_email}</td>
                                <td>{reg.branch}</td>
                                <td>{reg.roll_no}</td>
                                <td>{reg.event_id}</td>
                                <td>{reg.event_name}</td>
                                <td>{formatDateTime(reg.event_date)}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      ) : (
                        <p>No students registered for this event.</p>
                      )
                    ) : (
                      <p>Loading registrations...</p>
                    )}
                  </div>
                )}
              </div>
            ))
          ) : (
            <p>No events found.</p>
          )}
        </div>
      )}
    </div>
  );
}

export default AdminDashboard;
