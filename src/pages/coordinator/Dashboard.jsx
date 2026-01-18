import React from "react";
import { Container, Row, Col, Card, CardBody, Badge } from "reactstrap";
import {
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaMoneyBillWave,
  FaStar,
} from "react-icons/fa";


export default function Dashboard() {
  const green = "#16A34A";
  const border = "#E5E7EB";
  const muted = "#6B7280";
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

  const stats = [
    {
      title: "Total Tours",
      value: "12",
      sub: "+2 this month",
      icon: FaMapMarkerAlt,
      iconBg: "#73A7FF",
    },
    {
      title: "Active Bookings",
      value: "48",
      sub: "+12 this week",
      icon: FaCalendarAlt,
      iconBg: "#4ADE80",
    },
    {
      title: "Total Revenue",
      value: "₱125,400",
      sub: "+15% this month",
      icon: FaMoneyBillWave,
      iconBg: "#F59CF3",
    },
    {
      title: "Customer Reviews",
      value: "4.8",
      sub: "246 reviews",
      icon: FaStar,
      iconBg: "#FCD34D",
    },
  ];

  const bookings = [
    {
      title: "Mt. Pinatubo Crater Lake Treek",
      name: "Clifford Halasan",
      date: "2024-02-15",
      price: "₱2,500",
      status: "confirmed",
    },
    {
      title: "Mt. Pinatubo Crater Lake Treek",
      name: "Clifford Halasan",
      date: "2024-02-15",
      price: "₱2,500",
      status: "pending",
    },
    {
      title: "Mt. Pinatubo Crater Lake Treek",
      name: "Clifford Halasan",
      date: "2024-02-15",
      price: "₱2,500",
      status: "confirmed",
    },
    {
      title: "Mt. Pinatubo Crater Lake Treek",
      name: "Clifford Halasan",
      date: "2024-02-15",
      price: "₱2,500",
      status: "confirmed",
    },
  ];

const statusBadgeStyle = (status) => {
  const base = {
    borderRadius: 999,
    padding: "6px 12px",
    fontSize: 12,
    fontWeight: 600,
    display: "inline-block",
  };

  switch (status?.toLowerCase()) {
    case "confirmed":
      return {
        ...base,
        backgroundColor: "#DCFCE7",
        color: "#16A34A",
      };

    case "pending":
      return {
        ...base,
        backgroundColor: "#FEF3C7",
        color: "#B45309",
      };

    default:
      return {
        ...base,
        backgroundColor: "#E5E7EB",
        color: "#374151",
      };
  }
};

  return (
    <Container fluid style={{ fontFamily: "Poppins" }}>
      {/* Title */}
      <Row className="mb-3">
        <Col>
          <h2 style={{ fontWeight: 900, letterSpacing: "-0.5px" }}>
            Dashboard Overview
          </h2>
        </Col>
      </Row>

      {/* Stats */}
      <Row className="g-3">
        {stats.map((s, idx) => {
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

      {/* Recent Bookings */}
      <Row className="mt-4">
        <Col xs="12" lg="6">
          <h3 style={{ fontWeight: 900, marginBottom: 14 }}>Recent Bookings</h3>

          <Card
            style={{
              border: "none",
              borderRadius: 16,
              boxShadow: "none",
              background: "transparent",
            }}
          >
            <CardBody style={{ padding: 0 }}>
              {bookings.map((b, i) => (
                <div
                  key={i}
                  style={{
                    padding: "14px 0",
                    borderBottom: i === bookings.length - 1 ? "none" : `1px solid ${border}`,
                    display: "flex",
                    alignItems: "flex-start",
                    justifyContent: "space-between",
                    gap: 14,
                  }}
                >
                  {/* Left */}
                  <div style={{ minWidth: 0 }}>
                    <div
                      style={{
                        fontWeight: 800,
                        color: text,
                        fontSize: 14,
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        maxWidth: 260,
                      }}
                    >
                      {b.title}
                    </div>

                    <div style={{ color: muted, marginTop: 6 }}>
                      {b.name}
                    </div>

                    <div style={{ color: "#9caf9f", marginTop: 6, fontSize: 12 }}>
                      {b.date}
                    </div>
                  </div>

                  {/* Right */}
                  <div style={{ textAlign: "right" }}>
                    <div style={{ fontWeight: 900, color: text }}>
                      {b.price}
                    </div>

                    <span style={{ ...statusBadgeStyle(b.status), marginTop: 10 }}>
                        {b.status}
                        </span>

                  </div>
                </div>
              ))}
            </CardBody>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}
