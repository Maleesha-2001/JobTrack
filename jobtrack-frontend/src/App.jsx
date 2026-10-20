
import { useEffect, useState } from "react";
import "./App.css";

const API_URL = "http://localhost:8080/applications";

function App() {
  const [applications, setApplications] = useState([]);
  const [companyName, setCompanyName] = useState("");
  const [jobTitle, setJobTitle] = useState("");
  const [status, setStatus] = useState("Applied");
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  async function loadApplications() {
    try {
      const response = await fetch(API_URL);
      if (!response.ok) {
        throw new Error("Could not load applications");
      }

      setApplications(await response.json());
      setError("");
    } catch {
      setError("Backend connection failed. Check Spring Boot.");
    }
  }

  useEffect(() => {
    loadApplications();
  }, []);

  const filteredApplications = applications.filter((application) => {
    const company = (application.companyName || "").toLowerCase();
    const title = (application.jobTitle || "").toLowerCase();
    const appStatus = application.status || "";

    const matchesSearch =
      company.includes(searchTerm.toLowerCase()) ||
      title.includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "All" || appStatus === statusFilter;

    return matchesSearch && matchesStatus;
  });

  async function addApplication(event) {
    event.preventDefault();

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ companyName, jobTitle, status }),
      });

      if (!response.ok) {
        throw new Error("Could not save application");
      }

      setCompanyName("");
      setJobTitle("");
      setStatus("Applied");
      await loadApplications();
    } catch {
      setError("Could not save. Check backend and CORS settings.");
    }
  }

  async function updateStatus(application) {
    const newStatus = prompt(
      "Enter new status: Applied, Interview, Pending, Rejected, or Accepted",
      application.status
    );

    if (!newStatus?.trim()) return;

    const allowedStatuses = [
      "Applied",
      "Interview",
      "Pending",
      "Rejected",
      "Accepted",
    ];

    const normalizedStatus = allowedStatuses.find(
      (item) => item.toLowerCase() === newStatus.trim().toLowerCase()
    );

    if (!normalizedStatus) {
      setError("Please enter a valid status.");
      return;
    }

    try {
      const response = await fetch(`${API_URL}/${application.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          companyName: application.companyName,
          jobTitle: application.jobTitle,
          status: normalizedStatus,
        }),
      });

      if (!response.ok) {
        throw new Error("Update failed");
      }

      await loadApplications();
    } catch {
      setError("Could not update application.");
    }
  }

  async function deleteApplication(id) {
    if (!window.confirm("Delete this job application?")) return;

    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Delete failed");
      }

      await loadApplications();
    } catch {
      setError("Could not delete application.");
    }
  }

  return (
    <main className="dashboard">
      <header className="topbar">
        <div className="brand">
          <span className="brand-icon">J</span>
          <span>JobTrack</span>
        </div>
        <span className="topbar-label">JOB APPLICATION TRACKER</span>
      </header>

      <section className="welcome">
        <p className="eyebrow">YOUR CAREER JOURNEY</p>
        <h1>Keep your career moving.</h1>
        <p>Track your applications, manage progress, and stay organized.</p>
      </section>

      <section className="stats">
        <article className="stat-card">
          <span>Total applications</span>
          <strong>{applications.length}</strong>
        </article>

        <article className="stat-card">
          <span>Interviews</span>
          <strong>
            {
              applications.filter(
                (a) => (a.status || "").toLowerCase() === "interview"
              ).length
            }
          </strong>
        </article>

        <article className="stat-card">
          <span>Accepted</span>
          <strong>
            {
              applications.filter(
                (a) => (a.status || "").toLowerCase() === "accepted"
              ).length
            }
          </strong>
        </article>
      </section>

      <section className="panel">
        <h2>Add an application</h2>

        <form className="application-form" onSubmit={addApplication}>
          <label>
            Company
            <input
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              placeholder="e.g. Virtusa"
              required
            />
          </label>

          <label>
            Job title
            <input
              value={jobTitle}
              onChange={(e) => setJobTitle(e.target.value)}
              placeholder="e.g. Software Engineer Intern"
              required
            />
          </label>

          <label>
            Status
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            >
              <option>Applied</option>
              <option>Interview</option>
              <option>Pending</option>
              <option>Accepted</option>
              <option>Rejected</option>
            </select>
          </label>

          <button className="primary-button" type="submit">
            + Add application
          </button>
        </form>
      </section>

      {error && <p className="error-message">{error}</p>}

      <section className="panel">
        <div className="section-heading">
          <div>
            <h2>Your applications</h2>
            <p>All your job opportunities in one place.</p>
          </div>

          <button
            className="secondary-button"
            type="button"
            onClick={loadApplications}
          >
            Refresh
          </button>
        </div>

        <div className="application-filters">
          <input
            type="text"
            placeholder="Search company or job title..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            aria-label="Search applications"
          />

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            aria-label="Filter by status"
          >
            <option value="All">All statuses</option>
            <option value="Applied">Applied</option>
            <option value="Interview">Interview</option>
            <option value="Pending">Pending</option>
            <option value="Accepted">Accepted</option>
            <option value="Rejected">Rejected</option>
          </select>
        </div>

        <p className="results-count">
          Showing <strong>{filteredApplications.length}</strong> of{" "}
          <strong>{applications.length}</strong> applications
        </p>

        {filteredApplications.length === 0 ? (
          <p className="empty-state">
            {applications.length === 0
              ? "No applications yet. Add your first one above."
              : "No matching applications found."}
          </p>
        ) : (
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Company</th>
                  <th>Job title</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {filteredApplications.map((application) => (
                  <tr key={application.id}>
                    <td>{application.companyName}</td>
                    <td>{application.jobTitle}</td>
                    <td>
                      <span
                        className={`status status-${(
                          application.status || "pending"
                        ).toLowerCase()}`}
                      >
                        {application.status}
                      </span>
                    </td>
                    <td className="actions">
                      <button
                        className="edit-button"
                        type="button"
                        onClick={() => updateStatus(application)}
                      >
                        Update
                      </button>

                      <button
                        className="delete-button"
                        type="button"
                        onClick={() => deleteApplication(application.id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <footer>Built with React + Spring Boot · JobTrack</footer>
    </main>
  );
}

export default App;
