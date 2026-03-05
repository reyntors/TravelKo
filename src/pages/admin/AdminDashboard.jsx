import { useEffect, useState } from "react";
import { Row, Col, Card, CardBody, Spinner } from "reactstrap";
import api from "@/services/api";

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalCoordinators: 0,
    totalApprovalCoordinators: 0,
    totalActiveBookings: 0,
    totalAllBookings: 0,
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAdminDashboard = async () => {
      try {
        const token = localStorage.getItem("auth_token");

        const res = await api.get("/auth/admin/dashboard", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = res.data;

        setStats({
          totalCoordinators: data.totalCoordinators || 0,
          totalApprovalCoordinators: data.totalApprovalCoordinators || 0,
          totalActiveBookings: data.totalActiveBookings || 0,
          totalAllBookings: data.totalAllBookings || 0,
        });
      } catch (err) {
        console.error("Failed to load admin dashboard", err.response?.data);
      } finally {
        setLoading(false);
      }
    };

    fetchAdminDashboard();
  }, []);

  const statsCards = [
    {
      title: "Total Coordinators",
      value: stats.totalCoordinators,
    },
    {
      title: "Approved Coordinators",
      value: stats.totalApprovalCoordinators,
    },
    {
      title: "Active Bookings",
      value: stats.totalActiveBookings,
    },
    {
      title: "All Bookings",
      value: stats.totalAllBookings,
    },
  ];

  return (
    <>
      <h2 className="fw-bold mb-4">Admin Dashboard</h2>

      {loading ? (
        <div className="text-center py-5">
          <Spinner />
        </div>
      ) : (
        <Row>
          {statsCards.map((s, i) => (
            <Col md="3" key={i}>
              <Card className="shadow-sm">
                <CardBody>
                  <h6 className="text-muted">{s.title}</h6>
                  <h2 className="fw-bold">{s.value}</h2>
                </CardBody>
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </>
  );
}
