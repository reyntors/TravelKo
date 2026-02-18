import React, { useEffect, useState } from "react";
import api from "@/services/api";

export default function CoordinatorApplications() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const token = localStorage.getItem("auth_token");

        const res = await api.get("/auth/admin/for-approval-coordinators", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setApplications(res.data || []);
      } catch (err) {
        console.error("Failed to fetch coordinators:", err.response?.data);
        alert(err.response?.data?.message || "Failed to load applications");
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, []);

  const handleApprove = async (id) => {
    try {
      const token = localStorage.getItem("auth_token");

      await api.put(
        `/auth/admin/approve-coordinator/${id}`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      // Remove from list after approval
      setApplications((prev) => prev.filter((a) => a.id !== id));

      alert("Coordinator approved successfully");
    } catch (err) {
      console.error(err.response?.data);
      alert(err.response?.data?.message || "Approval failed");
    }
  };

  const handleDecline = async (id) => {
    try {
      const token = localStorage.getItem("auth_token");

      await api.get(
        `/auth/admin/decline-coordinator/${id}`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      // Remove from list after rejection
      setApplications((prev) => prev.filter((a) => a.id !== id));

      alert("Coordinator rejected");
    } catch (err) {
      console.error(err.response?.data);
      alert(err.response?.data?.message || "Rejection failed");
    }
  };

  if (loading) {
    return <p>Loading applications...</p>;
  }

  return (
    <>
      <h3 className="fw-bold mb-3">Coordinator Applications</h3>

      {applications.length === 0 && (
        <div className="text-muted">No pending applications.</div>
      )}

      {applications.map((a) => (
        <div key={a.id} className="card p-3 mb-3 shadow-sm">
          <strong>{a.fullName || a.name}</strong>
          <div>{a.email}</div>
          <div>{a.phoneNumber || a.phone}</div>

          <div className="mt-3">
            <button
              className="btn btn-success btn-sm me-2"
              onClick={() => handleApprove(a.id)}
            >
              Approve
            </button>

            <button
              className="btn btn-danger btn-sm"
              onClick={() => handleDecline(a.id)}
            >
              Decline
            </button>
          </div>
        </div>
      ))}
    </>
  );
}
