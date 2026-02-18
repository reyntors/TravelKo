import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "@/services/api";

export default function ManageCoordinators() {
  const navigate = useNavigate();

  const [coordinators, setCoordinators] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchApprovedCoordinators = async () => {
      try {
        const token = localStorage.getItem("auth_token");

        const res = await api.get("/auth/admin/approved-coordinators", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = Array.isArray(res.data) ? res.data : [];

        const normalized = data.map((c) => ({
          id: c.id,
          name: c.fullName || "—",
          email: c.email || "—",
          tours: c.tours?.length || c.totalTours || 0, // adjust depending on backend
          status: c.status || "Active",
        }));

        setCoordinators(normalized);
      } catch (err) {
        console.error("Failed to fetch coordinators:", err.response?.data);
        alert(err.response?.data?.message || "Failed to load coordinators");
      } finally {
        setLoading(false);
      }
    };

    fetchApprovedCoordinators();
  }, []);

  if (loading) {
    return <p>Loading coordinators...</p>;
  }

  return (
    <>
      <h3 className="fw-bold mb-3">Manage Coordinators</h3>

      {coordinators.length === 0 ? (
        <div className="text-muted">No approved coordinators found.</div>
      ) : (
        <table className="table shadow-sm bg-white">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Tours</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {coordinators.map((c) => (
              <tr key={c.id}>
                <td>{c.name}</td>
                <td>{c.email}</td>
                <td>{c.tours}</td>
                <td>
                  <span className="badge bg-success">{c.status}</span>
                </td>
                <td>
                  <button
                    className="btn btn-sm btn-outline-success"
                    onClick={() => navigate(`/admin/coordinator/${c.id}`)}
                  >
                    View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </>
  );
}
