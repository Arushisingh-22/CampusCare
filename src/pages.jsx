import React, { useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { categories } from "./data";
import {
  ComplaintCard,
  ComplaintSummary,
  SuccessModal,
} from "./components";

export function Home({ user }) {
  return (
    <main>
      <section className="hero-section text-center">
        <div className="container">
          <span className="badge bg-light text-primary mb-3">
            Campus Issue Reporting System
          </span>
          <h1 className="display-4 fw-bold">
            Your Campus, Your Voice
          </h1>
          <p className="lead mx-auto hero-text">
            Report campus problems, track complaint status, and help
            make your college a better place.
          </p>
          {user ? (
            <Link
              to={user.role === "admin" ? "/admin" : "/report"}
              className="btn btn-light btn-lg mt-3"
            >
              {user.role === "admin" ? "Open Admin Panel" : "Report an Issue"}
            </Link>
          ) : (
            <div className="mt-4">
              <Link to="/register" className="btn btn-light btn-lg me-2">
                Get Started
              </Link>
              <Link to="/login" className="btn btn-outline-light btn-lg">
                Login
              </Link>
            </div>
          )}
        </div>
      </section>

      <section className="container py-5">
        <h2 className="text-center fw-bold mb-4">How CampusCare Works</h2>
        <div className="row g-4">
          {[
            ["📝", "Report an Issue", "Submit a complaint about a campus problem."],
            ["🔎", "Track Progress", "Check the latest status of your complaint."],
            ["✅", "Get It Resolved", "View updates and admin remarks."],
          ].map(([icon, title, description]) => (
            <div className="col-md-4" key={title}>
              <div className="card feature-card text-center h-100">
                <div className="card-body p-4">
                  <div className="feature-icon">{icon}</div>
                  <h5 className="fw-bold mt-3">{title}</h5>
                  <p className="text-muted mb-0">{description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}

export function Login({ onLogin, user }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  if (user) {
    return <Navigate to={user.role === "admin" ? "/admin" : "/dashboard"} />;
  }

  function handleSubmit(e) {
    e.preventDefault();
    const result = onLogin(email.trim().toLowerCase(), password);

    if (!result.success) {
      setError(result.message);
    }
  }

  return (
    <div className="form-page container">
      <div className="form-card card shadow-sm">
        <div className="card-body p-4 p-md-5">
          <h2 className="text-center fw-bold mb-2">Welcome Back</h2>
          <p className="text-muted text-center mb-4">
            Login to your CampusCare account
          </p>

          {error && <div className="alert alert-danger">{error}</div>}

          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label">Email address</label>
              <input
                type="email"
                className="form-control"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@college.com"
                required
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Password</label>
              <input
                type="password"
                className="form-control"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                required
              />
            </div>
            <button className="btn btn-primary w-100" type="submit">
              Login
            </button>
          </form>

          <p className="text-center mt-3 mb-0">
            New student? <Link to="/register">Create an account</Link>
          </p>
          <div className="alert alert-info small mt-4 mb-0">
            <strong>Demo admin:</strong> admin@campuscare.com / admin123
          </div>
        </div>
      </div>
    </div>
  );
}

export function Register({ onRegister, user }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  if (user) return <Navigate to="/dashboard" />;

  function handleSubmit(e) {
    e.preventDefault();

    // Names may contain letters, spaces, apostrophes and hyphens.
    const validName = /^[A-Za-z][A-Za-z '-]*$/.test(name.trim());

    if (!validName) {
      setError("Name can contain only letters, spaces, apostrophes and hyphens.");
      return;
    }

    if (password.length < 6) {
      setError("Password must contain at least 6 characters.");
      return;
    }

    const result = onRegister({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      password,
      role: "student",
    });

    if (!result.success) setError(result.message);
  }

  return (
    <div className="form-page container">
      <div className="form-card card shadow-sm">
        <div className="card-body p-4 p-md-5">
          <h2 className="text-center fw-bold mb-2">Create Account</h2>
          <p className="text-muted text-center mb-4">
            Register as a student
          </p>

          {error && <div className="alert alert-danger">{error}</div>}

          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label">Full name</label>
              <input
                className="form-control"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your name"
                required
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Email address</label>
              <input
                type="email"
                className="form-control"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@college.com"
                required
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Password</label>
              <input
                type="password"
                className="form-control"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="At least 6 characters"
                minLength="6"
                required
              />
            </div>
            <button className="btn btn-primary w-100" type="submit">
              Register
            </button>
          </form>
          <p className="text-center mt-3 mb-0">
            Already registered? <Link to="/login">Login</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export function ReportIssue({ user, onAddComplaint }) {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("Medium");
  const [showModal, setShowModal] = useState(false);
  const [newComplaintId, setNewComplaintId] = useState("");
  const [error, setError] = useState("");

  if (!user) return <Navigate to="/login" />;

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    try {
      // Demonstrates async/await and a Promise-based submission flow.
      const complaint = await new Promise((resolve) => {
        setTimeout(() => {
          resolve({
            id: `CC${Date.now().toString().slice(-7)}`,
            title: title.trim(),
            category,
            location: location.trim(),
            description: description.trim(),
            priority,
            status: "Pending",
            email: user.email,
            date: new Date().toISOString().slice(0, 10),
            remarks: "",
          });
        }, 300);
      });

      onAddComplaint(complaint);
      setNewComplaintId(complaint.id);
      setShowModal(true);
      setTitle("");
      setCategory("");
      setLocation("");
      setDescription("");
      setPriority("Medium");
    } catch {
      setError("Unable to submit complaint. Please try again.");
    }
  }

  return (
    <div className="container form-page">
      <div className="form-card card shadow-sm">
        <div className="card-body p-4 p-md-5">
          <h2 className="fw-bold mb-2">Report a Campus Issue</h2>
          <p className="text-muted mb-4">
            Fill in the details so the campus team can review your complaint.
          </p>

          {error && <div className="alert alert-danger">{error}</div>}

          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label">Issue title</label>
              <input
                className="form-control"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Broken classroom fan"
                required
              />
            </div>

            <div className="row">
              <div className="col-md-6 mb-3">
                <label className="form-label">Category</label>
                <select
                  className="form-select"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  required
                >
                  <option value="">Select category</option>
                  {categories.map((item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </select>
              </div>
              <div className="col-md-6 mb-3">
                <label className="form-label">Priority</label>
                <select
                  className="form-select"
                  value={priority}
                  onChange={(e) => setPriority(e.target.value)}
                >
                  <option>Low</option>
                  <option>Medium</option>
                  <option>High</option>
                </select>
              </div>
            </div>

            <div className="mb-3">
              <label className="form-label">Location</label>
              <input
                className="form-control"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g. Block A, Room 201"
                required
              />
            </div>

            <div className="mb-4">
              <label className="form-label">Description</label>
              <textarea
                className="form-control"
                rows="4"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe the issue..."
                required
              ></textarea>
            </div>

            <button className="btn btn-primary w-100" type="submit">
              Submit Complaint
            </button>
          </form>
        </div>
      </div>

      <SuccessModal
        show={showModal}
        complaintId={newComplaintId}
        onClose={() => setShowModal(false)}
      />
    </div>
  );
}

export function Dashboard({ user, complaints }) {
  const [search, setSearch] = useState("");

  if (!user) return <Navigate to="/login" />;

  const myComplaints = complaints.filter(
    (item) => item.email === user.email
  );

  const filtered = myComplaints.filter((item) =>
    `${item.title} ${item.id} ${item.category}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  return (
    <div className="container py-5">
      <h2 className="fw-bold">Student Dashboard</h2>
      <p className="text-muted">Welcome, {user.name}!</p>

      <ComplaintSummary complaints={myComplaints} />

      <div className="d-flex flex-wrap justify-content-between align-items-center gap-3 mb-3">
        <h4 className="fw-bold mb-0">My Complaints</h4>
        <Link to="/report" className="btn btn-primary">
          + Report Issue
        </Link>
      </div>

      <input
        className="form-control mb-4"
        placeholder="Search by title, ID or category..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {filtered.length ? (
        <div className="row g-3">
          {filtered.map((item) => (
            <div className="col-md-6" key={item.id}>
              <ComplaintCard complaint={item} />
            </div>
          ))}
        </div>
      ) : (
        <div className="alert alert-info">
          No complaints found. Submit a new complaint to get started.
        </div>
      )}
    </div>
  );
}

export function Admin({ complaints, onStatusChange, user }) {
  const [search, setSearch] = useState("");

  if (!user || user.role !== "admin") {
    return <Navigate to="/login" />;
  }

  const filtered = complaints.filter((item) =>
    `${item.title} ${item.id} ${item.email} ${item.category}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  return (
    <div className="container py-5">
      <h2 className="fw-bold">Admin Dashboard</h2>
      <p className="text-muted">
        View student complaints and update their status.
      </p>

      <ComplaintSummary complaints={complaints} />

      <input
        className="form-control mb-4"
        placeholder="Search complaints..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {filtered.length ? (
        <div className="row g-3">
          {filtered.map((item) => (
            <div className="col-md-6" key={item.id}>
              <ComplaintCard
                complaint={item}
                admin
                onStatusChange={onStatusChange}
              />
            </div>
          ))}
        </div>
      ) : (
        <div className="alert alert-info">No complaints found.</div>
      )}
    </div>
  );
}

export function About() {
  return (
    <div className="container py-5">
      <div className="form-card card shadow-sm">
        <div className="card-body p-4 p-md-5">
          <h2 className="fw-bold">About CampusCare</h2>
          <p>
            CampusCare is a campus issue reporting system designed to help
            students report problems within their college.
          </p>
          <p>
            Students can submit complaints and track their progress. Admins
            can review complaints and update their status.
          </p>
          <h5 className="fw-bold mt-4">Our goal</h5>
          <p className="mb-0">
            To make campus communication easier and help issues get noticed
            and addressed.
          </p>
        </div>
      </div>
    </div>
  );
}