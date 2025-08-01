import http from "http";
import { db } from "./db.js";
import { parse } from "url";

const PORT = 5000;

const server = http.createServer((req, res) => {
  const { pathname, query } = parse(req.url, true);
  console.log("👉 Received:", req.method, pathname);

  res.setHeader("Access-Control-Allow-Origin", "http://localhost:3000");
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Content-Type", "application/json");

  if (req.method === "OPTIONS") {
    res.writeHead(204, {
      "Access-Control-Allow-Origin": "http://localhost:3000",
      "Access-Control-Allow-Credentials": "true",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS, DELETE",
      "Access-Control-Allow-Headers": "Content-Type",
    });
    res.end();
    return;
  }

  // GET login status
  if (req.method === "GET" && pathname === "/api/loginStatus") {
    const cookie = req.headers.cookie || "";
    const username = cookie.split("; ").find(c => c.startsWith("username="))?.split("=")[1];
    const role = cookie.split("; ").find(c => c.startsWith("role="))?.split("=")[1];
    const email = cookie.split("; ").find(c => c.startsWith("email="))?.split("=")[1];

    if (username && role) {
      res.end(JSON.stringify({ success: true, username, role, email }));
    } else {
      res.end(JSON.stringify({ success: false }));
    }
  }

  // POST login
  else if (req.method === "POST" && pathname === "/api/login") {
    let body = "";
    req.on("data", chunk => (body += chunk));
    req.on("end", () => {
      const { username, password } = JSON.parse(body);
      db.query(
        "SELECT * FROM users WHERE username = ? AND password = ?",
        [username, password],
        (err, results) => {
          if (err) {
            res.end(JSON.stringify({ success: false, error: "DB error" }));
          } else if (results.length === 1) {
            const user = results[0];
            res.setHeader("Set-Cookie", [
              `username=${user.username}; HttpOnly; Path=/`,
              `role=${user.role}; HttpOnly; Path=/`,
              `email=${user.email}; HttpOnly; Path=/`
            ]);
            res.end(JSON.stringify({
              success: true,
              role: user.role,
              username: user.username,
              email: user.email
            }));
          } else {
            res.end(JSON.stringify({ success: false, message: "Invalid credentials" }));
          }
        }
      );
    });
  }

  // POST register
  else if (req.method === "POST" && pathname === "/api/register") {
    let body = "";
    req.on("data", chunk => (body += chunk));
    req.on("end", () => {
      try {
        const { username, email, password, role } = JSON.parse(body);
        db.query(
          "INSERT INTO users (username, email, password, role) VALUES (?, ?, ?, ?)",
          [username, email, password, role],
          (err) => {
            if (err) {
              res.end(JSON.stringify({ success: false, error: err.message }));
            } else {
              res.end(JSON.stringify({ success: true }));
            }
          }
        );
      } catch {
        res.end(JSON.stringify({ success: false, error: "Invalid JSON" }));
      }
    });
  }

  // GET events (optionally filtered by creator)
  else if (req.method === "GET" && pathname === "/api/events") {
    const createdBy = query.createdBy;
    const sql = createdBy
      ? "SELECT * FROM events WHERE created_by = ?"
      : "SELECT * FROM events";
    const params = createdBy ? [createdBy] : [];

    db.query(sql, params, (err, results) => {
      if (err) res.end(JSON.stringify([]));
      else res.end(JSON.stringify(results));
    });
  }

  // POST event (create)
  else if (req.method === "POST" && pathname === "/api/events") {
    let body = "";
    req.on("data", chunk => (body += chunk));
    req.on("end", () => {
      const { name, date, description, created_by } = JSON.parse(body);
      db.query(
        "INSERT INTO events (name, date, description, created_by) VALUES (?, ?, ?, ?)",
        [name, date, description, created_by],
        (err) => {
          if (err) res.end(JSON.stringify({ success: false }));
          else res.end(JSON.stringify({ success: true }));
        }
      );
    });
  }

  // DELETE event
  else if (req.method === "DELETE" && pathname.startsWith("/api/events/")) {
    const eventId = pathname.split("/").pop();
    db.query("DELETE FROM events WHERE id = ?", [eventId], (err) => {
      if (err) res.end(JSON.stringify({ success: false }));
      else res.end(JSON.stringify({ success: true }));
    });
  }

  // GET event registrations for an event
  else if (req.method === "GET" && pathname === "/api/eventRegistrations") {
    const { eventId } = query;
    const sql = `
      SELECT er.*, e.name AS event_name, e.date AS event_date 
      FROM event_registrations er
      JOIN events e ON er.event_id = e.id
      WHERE er.event_id = ?
    `;
    db.query(sql, [eventId], (err, results) => {
      if (err) {
        res.statusCode = 500;
        res.end(JSON.stringify({ error: "Internal server error" }));
      } else {
        res.end(JSON.stringify(results));
      }
    });
  }

  // GET registered events for a student
  else if (req.method === "GET" && pathname === "/api/registeredEvents") {
    const { username } = query;
    const sql = `
      SELECT e.id as event_id, e.name, e.date, e.description, e.created_by 
      FROM events e 
      INNER JOIN event_registrations er ON e.id = er.event_id 
      WHERE er.student_username = ?
    `;
    db.query(sql, [username], (err, results) => {
      if (err) res.end(JSON.stringify([]));
      else res.end(JSON.stringify(results));
    });
  }

  // POST register event (student)
  else if (req.method === "POST" && pathname === "/api/registerEvent") {
    let body = "";
    req.on("data", chunk => (body += chunk));
    req.on("end", () => {
      const { event_id, student_username, student_email, branch, roll_no } = JSON.parse(body);
      db.query(
        "INSERT INTO event_registrations (event_id, student_username, student_email, branch, roll_no) VALUES (?, ?, ?, ?, ?)",
        [event_id, student_username, student_email, branch, roll_no],
        (err) => {
          if (err) res.end(JSON.stringify({ success: false }));
          else res.end(JSON.stringify({ success: true }));
        }
      );
    });
  }

  // POST unregister event
  else if (req.method === "POST" && pathname === "/api/unregisterEvent") {
    let body = "";
    req.on("data", chunk => (body += chunk));
    req.on("end", () => {
      const { event_id, student_username } = JSON.parse(body);
      db.query(
        "DELETE FROM event_registrations WHERE event_id = ? AND student_username = ?",
        [event_id, student_username],
        (err) => {
          if (err) res.end(JSON.stringify({ success: false }));
          else res.end(JSON.stringify({ success: true }));
        }
      );
    });
  }

  // GET users (admin)
  else if (req.method === "GET" && pathname === "/api/users") {
    db.query("SELECT * FROM users", (err, results) => {
      if (err) res.end(JSON.stringify([]));
      else res.end(JSON.stringify(results));
    });
  }

  // POST logout
  else if (req.method === "POST" && pathname === "/api/logout") {
    // You can clear cookie headers here if needed.
    res.end(JSON.stringify({ success: true }));
  }

  // Default response
  else {
    res.end(JSON.stringify({ message: "API is working" }));
  }
});

server.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
