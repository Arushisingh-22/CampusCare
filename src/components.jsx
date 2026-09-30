import React, { Component } from "react";
import { Link, NavLink } from "react-router-dom";

// Bootstrap Navbar
export function Navbar({ user, onLogout }) {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
      <div className="container">
        <Link className="navbar-brand fw-bold" to="/">
          CampusCare
        </Link>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarContent"
          aria-controls="navbarContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarContent">
          <div className="navbar-nav ms-auto align-items-lg-center">
            <NavLink className="nav-link" to="/">
              Home
            </NavLink>
            <NavLink className="nav-link" to="/about">
              About
            </NavLink>

            {user && user.role === "student" && (
              <>
                <NavLink className="nav-link" to="/report">
                  Report Issue
                </NavLink>
                <NavLink className="nav-link" to="/dashboard">
                  Dashboard
                </NavLink>
              </>
            )}

            {user && user.role === "admin" && (
              <NavLink className="nav-link" to="/admin">
                Admin Panel
              </NavLink>
            )}

            {user ? (
              <button
                className="btn btn-light btn-sm ms-lg-3 mt-2 mt-lg-0"
                onClick={onLogout}
              >
                Logout
              </button>
            ) : (
              <>
                <NavLink className="nav-link" to="/login">
                  Login
                </NavLink>
                <NavLink className="nav-link" to="/register">
                  Register
                </NavLink>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

// Bootstrap Card
export function ComplaintCard({ complaint, admin, onStatusChange }) {
  const statusClass = {
    Pending: "bg-warning text-dark",
    "In Progress": "bg-info text-dark",
    Resolved: "bg-success",
  };

  return (
    <div className="card complaint-card h-100 shadow-sm">
      <div className="card-body">
        <div className="d-flex justify-content-between align-items-start gap-2">
          <h5 className="card-title">{complaint.title}</h5>
          <span className={`badge ${statusClass[complaint.status] || "bg-secondary"}`}>
            {complaint.status}
          </span>
        </div>

        <p className="text-muted small mb-2">
          Complaint ID: {complaint.id}
        </p>
        <p className="mb-1">
          <strong>Category:</strong> {complaint.category}
        </p>
        <p className="mb-1">
          <strong>Location:</strong> {complaint.location}
        </p>
        <p className="mb-1">
          <strong>Priority:</strong> {complaint.priority}
        </p>
        <p className="card-text mt-2">{complaint.description}</p>
        {admin && (
          <>
            <p className="small text-muted mb-2">
              Student: {complaint.email}
            </p>
            <label className="form-label fw-semibold">
              Update status
            </label>
            <select
              className="form-select"
              value={complaint.status}
              onChange={(e) =>
                onStatusChange(complaint.id, e.target.value)
              }
            >
              <option>Pending</option>
              <option>In Progress</option>
              <option>Resolved</option>
            </select>
          </>
        )}
        {complaint.remarks && (
          <div className="alert alert-light border mt-3 mb-0">
            <strong>Admin remarks:</strong> {complaint.remarks}
          </div>
        )}
        <p className="small text-muted mt-3 mb-0">
          Submitted: {complaint.date}
        </p>
      </div>
    </div>
  );
}

// React class component
export class ComplaintSummary extends Component {
  render() {
    const { complaints } = this.props;
    const pending = complaints.filter(
      (item) => item.status === "Pending"
    ).length;
    const progress = complaints.filter(
      (item) => item.status === "In Progress"
    ).length;
    const resolved = complaints.filter(
      (item) => item.status === "Resolved"
    ).length;

    return (
      <div className="row g-3 mb-4">
        <div className="col-md-4">
          <div className="summary-box bg-warning-subtle">
            <h3>{pending}</h3>
            <p>Pending</p>
          </div>
        </div>
        <div className="col-md-4">
          <div className="summary-box bg-info-subtle">
            <h3>{progress}</h3>
            <p>In Progress</p>
          </div>
        </div>
        <div className="col-md-4">
          <div className="summary-box bg-success-subtle">
            <h3>{resolved}</h3>
            <p>Resolved</p>
          </div>
        </div>
      </div>
    );
  }
}

// Bootstrap Modal
export function SuccessModal({ show, complaintId, onClose }) {
  if (!show) return null;

  return (
    <>
      <div
        className="modal show d-block"
        tabIndex="-1"
        role="dialog"
        aria-modal="true"
        aria-labelledby="successModalTitle"
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header bg-success text-white">
              <h5 className="modal-title" id="successModalTitle">
                Complaint Submitted!
              </h5>
              <button
                type="button"
                className="btn-close btn-close-white"
                aria-label="Close"
                onClick={onClose}
              ></button>
            </div>
            <div className="modal-body text-center">
              <h2>🎉 Thank You!</h2>
              <p>Your complaint has been registered successfully.</p>
              <p>
                Your Complaint ID:
                <strong className="text-success"> {complaintId}</strong>
              </p>
              <p>You can track its status from your dashboard.</p>
            </div>
            <div className="modal-footer">
              <button className="btn btn-success" onClick={onClose}>
                Done
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="modal-backdrop show"></div>
    </>
  );
}

export function Footer() {
  return (
    <footer className="footer text-center py-3 mt-auto">
      <div className="container">
        <small>© 2026 CampusCare | Campus Issue Reporting System</small>
      </div>
    </footer>
  );
}