import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "@/services/api";

export default function AdminCoordinatorDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [coordinator, setCoordinator] = useState(null);
  const [tours, setTours] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("auth_token");

        // 1️⃣ Fetch coordinator info
        const coordRes = await api.get(`/auth/admin/approved-coordinators`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const found = coordRes.data.find((c) => c.id === Number(id));
        setCoordinator(found);

        // 2️⃣ Fetch tours created by coordinator
        const tourRes = await api.get(
          `/auth/admin/tours-created-by-coordinator/${id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        );

        const tourData = Array.isArray(tourRes.data) ? tourRes.data : [];
        console.log(tourData);

        setTours(tourData);
      } catch (err) {
        console.error("Failed loading details:", err.response?.data);
        alert(err.response?.data?.message || "Failed to load details");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const deleteCoordinator = async () => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this coordinator?",
    );
    if (!confirmDelete) return;

    try {
      const token = localStorage.getItem("auth_token");

      await api.delete(`/auth/admin/delete-coordinator/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      alert("Coordinator deleted successfully");
      navigate("/admin/coordinators");
    } catch (err) {
      console.error("Delete failed:", err.response?.data);
      alert(err.response?.data?.message || "Delete failed");
    }
  };

  const formatPeso = (n) =>
    new Intl.NumberFormat("en-PH", {
      style: "currency",
      currency: "PHP",
      maximumFractionDigits: 0,
    }).format(n);

  if (loading) return <p>Loading details...</p>;
  if (!coordinator) return <p>Coordinator not found.</p>;

  // 🔥 Compute revenue
  const toursWithRevenue = tours.map((t) => {
    const bookings = t.totalBookings || t.joinerBookedSlots || 0;
    const revenue = bookings * (t.joinerPrice || 0);

    return {
      ...t,
      bookings,
      revenue,
    };
  });

  const totalRevenue = toursWithRevenue.reduce((sum, t) => sum + t.revenue, 0);

  return (
    <div className="container mt-4">
      <h2 className="fw-bold mb-4">Coordinator Details</h2>

      {/* ACCOUNT INFORMATION */}
      <div className="card p-4 mb-4 shadow-sm">
        <h4 className="mb-3">Account Information</h4>

        <p>
          <strong>Name:</strong> {coordinator.fullName}
        </p>
        <p>
          <strong>Email:</strong> {coordinator.email}
        </p>
        <p>
          <strong>Phone:</strong> {coordinator.phoneNumber}
        </p>
        <p>
          <strong>Status:</strong>{" "}
          <span className="badge bg-success">
            {coordinator.status || "Active"}
          </span>
        </p>

        <button className="btn btn-danger mt-3" onClick={deleteCoordinator}>
          Delete Coordinator
        </button>
      </div>

      {/* ALL TOURS */}
      <div className="card p-4 shadow-sm">
        <h4 className="mb-3">All Tours</h4>

        {toursWithRevenue.length === 0 ? (
          <p className="text-muted">No tours found.</p>
        ) : (
          <>
            <div className="table-responsive">
              <table className="table align-middle">
                <thead className="table-light">
                  <tr>
                    <th>Tour Title</th>
                    <th className="text-center">Bookings</th>
                    {/* <th className="text-center">Book Slots</th> */}
                    <th className="text-center">Max Slots</th>
                    <th className="text-end">Revenue</th>
                  </tr>
                </thead>
                <tbody>
                  {toursWithRevenue.map((tour) => (
                    <tr key={tour.id}>
                      <td>{tour.title}</td>
                      <td className="text-center">{tour.bookings}</td>
                      {/* <td className="text-center">{tour.joinerBookedSlots}</td> */}
                      <td className="text-center">{tour.joinerMaxSlots}</td>
                      <td className="text-end">{formatPeso(tour.revenue)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="mt-3 fw-bold text-end">
              Total Revenue: {formatPeso(totalRevenue)}
            </div>

            <div className="mt-3 fw-bold">
              Total Revenue: {formatPeso(totalRevenue)}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
