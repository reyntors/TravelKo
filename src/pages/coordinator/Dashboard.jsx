import React, { useEffect, useState } from "react";
import { Container, Row, Col, Card, CardBody, Spinner } from "reactstrap";
import {
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaMoneyBillWave,
  FaStar,
} from "react-icons/fa";
import api from "@/services/api";

export default function Dashboard() {
  const [loading, setLoading] = useState(true);

  const [stats, setStats] = useState({
    totalTours: 0,
    activeBookings: 0,
    totalRevenue: 0,
    avgRating: 0,
  });

  useEffect(() => {
    const fetchCoordinatorStats = async () => {
      try {
        const token = localStorage.getItem("auth_token");
        if (!token) return;

        const res = await api.get("/auth/coordinator/stats", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = res.data;

        setStats({
          totalTours: data.totalTours || 0,
          activeBookings: data.totalActiveBookings || 0,
          totalRevenue: Number(data.totalRevenue || 0),
          avgRating: data.averageRating || 0,
        });
      } catch (err) {
        console.error("Failed to load coordinator stats", err.response?.data);
      } finally {
        setLoading(false);
      }
    };

    fetchCoordinatorStats();
  }, []);

  const green = "#16A34A";
  const border = "#E5E7EB";
  const text = "#111827";

  const statCardStyle = {
    border: `1px solid ${border}`,
    borderRadius: 14,
    boxShadow: "0 1px 0 rgba(0,0,0,0.02)",
  };

  const statTitle = { fontSize: 13, color: text, marginBottom: 10 };
  const statValue = { fontSize: 28, fontWeight: 800, lineHeight: 1.1 };
  const statSub = { fontSize: 13, color: text, marginTop: 10 };

  const iconBoxBase = {
    width: 54,
    height: 54,
    borderRadius: 12,
    display: "grid",
    placeItems: "center",
    color: "#ffffff",
    flex: "0 0 auto",
  };

  const statsCards = [
    {
      title: "Total Tours",
      value: stats.totalTours,
      sub: "Your published tours",
      icon: FaMapMarkerAlt,
      iconBg: "#73A7FF",
    },
    {
      title: "Active Bookings",
      value: stats.activeBookings,
      sub: "Ongoing bookings",
      icon: FaCalendarAlt,
      iconBg: "#4ADE80",
    },
    {
      title: "Total Revenue",
      value: `₱${stats.totalRevenue.toLocaleString()}`,
      sub: "All confirmed payments",
      icon: FaMoneyBillWave,
      iconBg: "#F59CF3",
    },
    {
      title: "Customer Reviews",
      value: stats.avgRating,
      sub: "Average rating",
      icon: FaStar,
      iconBg: "#FCD34D",
    },
  ];

  return (
    <Container fluid style={{ fontFamily: "Poppins" }}>
      <Row className="mb-3">
        <Col>
          <h2 style={{ fontWeight: 900 }}>Dashboard Overview</h2>
        </Col>
      </Row>

      {loading ? (
        <div className="text-center py-5">
          <Spinner />
        </div>
      ) : (
        <Row className="g-3">
          {statsCards.map((s, idx) => {
            const Icon = s.icon;
            return (
              <Col key={idx} xs="12" md="6" lg="3">
                <Card style={statCardStyle}>
                  <CardBody
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      gap: 14,
                      alignItems: "flex-start",
                      padding: 18,
                    }}
                  >
                    <div>
                      <div style={statTitle}>{s.title}</div>
                      <div style={statValue}>{s.value}</div>
                      <div style={statSub}>{s.sub}</div>
                    </div>

                    <div style={{ ...iconBoxBase, background: s.iconBg }}>
                      <Icon size={20} />
                    </div>
                  </CardBody>
                </Card>
              </Col>
            );
          })}
        </Row>
      )}
    </Container>
  );
}
