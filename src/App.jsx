import React, { useEffect, useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { sampleComplaints } from "./data";
import { Navbar, Footer } from "./components";
import {
  Home,
  Login,
  Register,
  ReportIssue,
  Dashboard,
  Admin,
  About,
} from "./pages";

const ADMIN_ACCOUNT = {
  name: "Campus Admin",
  email: "admin@campuscare.com",
  password: "admin123",
  role: "admin",
};

function readStorage(key, fallback) {
  try {
    const saved = localStorage.getItem(key);
    return saved ? JSON.parse(saved) : fallback;
  } catch {
    return fallback;
  }
}

export default function App() {
  const [user, setUser] = useState(() => readStorage("campuscareUser", null));
  const [users, setUsers] = useState(() => readStorage("campuscareUsers", []));
  const [complaints, setComplaints] = useState(() =>
    readStorage("campuscareComplaints", null)
  );

  // Fetch JSON data only when no saved complaint data exists.
  useEffect(() => {
    let active = true;

    async function loadComplaints() {
      if (complaints !== null) return;

      try {
        const response = await fetch("/complaints.json");
        if (!response.ok) throw new Error("Could not load complaints");

        const jsonComplaints = await response.json();
        if (active) {
          setComplaints([...sampleComplaints, ...jsonComplaints]);
        }
      } catch {
        if (active) setComplaints(sampleComplaints);
      }
    }

    loadComplaints();
    return () => {
      active = false;
    };
  }, [complaints]);

  useEffect(() => {
    if (user) localStorage.setItem("campuscareUser", JSON.stringify(user));
    else localStorage.removeItem("campuscareUser");
  }, [user]);

  useEffect(() => {
    localStorage.setItem("campuscareUsers", JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    if (complaints !== null) {
      localStorage.setItem(
        "campuscareComplaints",
        JSON.stringify(complaints)
      );
    }
  }, [complaints]);

  function login(email, password) {
    if (
      email === ADMIN_ACCOUNT.email &&
      password === ADMIN_ACCOUNT.password
    ) {
      setUser({
        name: ADMIN_ACCOUNT.name,
        email: ADMIN_ACCOUNT.email,
        role: "admin",
      });
      return { success: true };
    }

    const found = users.find(
      (item) => item.email === email && item.password === password
    );

    if (!found) {
      return {
        success: false,
        message: "Invalid email or password. Please try again.",
      };
    }

    setUser({
      name: found.name,
      email: found.email,
      role: "student",
    });
    return { success: true };
  }

  function register(newUser) {
    const exists = users.some((item) => item.email === newUser.email);

    if (newUser.email === ADMIN_ACCOUNT.email || exists) {
      return {
        success: false,
        message: "An account with this email already exists.",
      };
    }

    setUsers((previous) => [...previous, newUser]);
    setUser({
      name: newUser.name,
      email: newUser.email,
      role: "student",
    });

    return { success: true };
  }

  function logout() {
    setUser(null);
  }

  function addComplaint(newComplaint) {
    setComplaints((previous) => [...(previous || []), newComplaint]);
  }

  function updateStatus(id, status) {
    setComplaints((previous) =>
      (previous || []).map((item) =>
        item.id === id ? { ...item, status } : item
      )
    );
  }

  return (
    <div className="app-shell">
      <Navbar user={user} onLogout={logout} />

      <Routes>
        <Route path="/" element={<Home user={user} />} />
        <Route
          path="/login"
          element={<Login onLogin={login} user={user} />}
        />
        <Route
          path="/register"
          element={<Register onRegister={register} user={user} />}
        />
        <Route
          path="/report"
          element={
            <ReportIssue user={user} onAddComplaint={addComplaint} />
          }
        />
        <Route
          path="/dashboard"
          element={<Dashboard user={user} complaints={complaints || []} />}
        />
        <Route
          path="/admin"
          element={
            <Admin
              user={user}
              complaints={complaints || []}
              onStatusChange={updateStatus}
            />
          }
        />
        <Route path="/about" element={<About />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      <Footer />
    </div>
  );
}