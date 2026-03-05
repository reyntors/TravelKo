import React from "react";
import { Container, Row, Col, Card, CardBody, Badge, Button } from "reactstrap";
import {
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaMoneyBillWave,
  FaStar,
} from "react-icons/fa";
import api from "@/services/api";

import { useEffect, useState } from "react";
import { Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";

export default function Dashboard() {
  const [recentBookings, setRecentBookings] = useState([]);
  const [viewOpen, setViewOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [stats, setStats] = useState({
    totalTours: 0,
    activeBookings: 0,
    totalRevenue: 0,
    avgRating: 0, // placeholder for now
  });
  const [profilePicture, setProfilePicture] = useState(
    localStorage.getItem("profilePicture"),
  );

  useEffect(() => {
    const handleProfileUpdated = (event) => {
      const newImage = event.detail?.profileImageUrl;

      if (newImage) {
        setProfilePicture(newImage);
      }
    };

    window.addEventListener("profile-updated", handleProfileUpdated);

    return () => {
      window.removeEventListener("profile-updated", handleProfileUpdated);
    };
  }, []);

  useEffect(() => {
    const fetchCoordinatorStats = async () => {
      try {
        const token = localStorage.getItem("auth_token");
        if (!token) return;

        const res = await api.get(
          `${import.meta.env.VITE_API_BASE_URL}auth/coordinator/stats`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        const data = res.data;

        setStats({
          totalTours: data.totalTours || 0,
          activeBookings: data.activeBookings || 0,
          totalRevenue: Number(data.totalRevenue || 0),
          avgRating: data.avgRating || 0,
        });
      } catch (err) {
        console.error("Failed to load coordinator stats", err.response?.data);
      }
    };

    fetchCoordinatorStats();
  }, []);

  const openViewModal = (booking) => {
    setSelectedBooking(booking);
    setViewOpen(true);
  };

  useEffect(() => {
    const fetchRecentBookings = async () => {
      try {
        const token = localStorage.getItem("auth_token");
        const coordinator = JSON.parse(
          localStorage.getItem("auth_user") || "{}",
        );

        const res = await api.get(
          `${import.meta.env.VITE_API_BASE_URL}booking`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        const myBookings = res.data.filter(
          (b) => b?.tour?.coordinatorId === coordinator?.id,
        );

        const sorted = myBookings.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
        );

        const recent = sorted.slice(0, 5).map((b) => ({
          id: b.id,
          title: b.tour?.title || "—",
          name: b.booker?.fullName || "—",
          date: b.bookingDateSelected || "—",
          price: new Intl.NumberFormat("en-PH", {
            style: "currency",
            currency: "PHP",
            maximumFractionDigits: 0,
          }).format(b.amountPaid || 0),
          status: b.status || "pending",
        }));

        setRecentBookings(recent);
      } catch (err) {
        console.error(err);
      }
    };

    fetchRecentBookings();
  }, []);

  useEffect(() => {
    const fetchProfileImage = async () => {
      try {
        const token = localStorage.getItem("auth_token");
        if (!token) return;

        const res = await api.get(
          `${import.meta.env.VITE_API_BASE_URL}auth/coordinator`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        const data = res.data;

        if (data?.profileImageUrl) {
          // save to localStorage
          localStorage.setItem("profilePicture", data.profileImageUrl);

          // update dashboard state
          setProfilePicture(data.profileImageUrl);

          // notify navbar / other components
          window.dispatchEvent(
            new CustomEvent("profile-updated", {
              detail: {
                profileImageUrl: data.profileImageUrl,
              },
            }),
          );
        }
      } catch (err) {
        console.error("Failed to fetch profile image", err);
      }
    };

    fetchProfileImage();
  }, []);

  const green = "#16A34A";
  const border = "#E5E7EB";
  const muted = "#806c6b";
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
      sub: "Pending & confirmed",
      icon: FaCalendarAlt,
      iconBg: "#4ADE80",
    },
    {
      title: "Total Revenue",
      value: `₱${stats.totalRevenue.toLocaleString()}`,
      sub: "Confirmed bookings",
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
          backgroundColor: "#f1a9a9",
          color: "#f30000",
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
            {recentBookings.length === 0 && (
              <div style={{ color: muted, padding: "12px 0" }}>
                No recent bookings yet.
              </div>
            )}

            <CardBody style={{ padding: 0 }}>
              {recentBookings.map((b, i) => (
                <div
                  key={i}
                  onClick={() => openViewModal(b)}
                  style={{
                    padding: "14px 0",
                    borderBottom:
                      i === recentBookings.length - 1
                        ? "none"
                        : `1px solid ${border}`,
                    display: "flex",
                    alignItems: "flex-start",
                    justifyContent: "space-between",
                    gap: 14,
                    cursor: "pointer",
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

                    <div style={{ color: muted, marginTop: 6 }}>{b.name}</div>

                    <div
                      style={{ color: "#9caf9f", marginTop: 6, fontSize: 12 }}
                    >
                      {b.date}
                    </div>
                  </div>

                  {/* Right */}
                  <div style={{ textAlign: "right" }}>
                    <div style={{ fontWeight: 900, color: text }}>
                      {b.price}
                    </div>

                    <span
                      style={{ ...statusBadgeStyle(b.status), marginTop: 10 }}
                    >
                      {b.status}
                    </span>
                  </div>
                </div>
              ))}
            </CardBody>
          </Card>
          <Modal isOpen={viewOpen} toggle={() => setViewOpen(false)} centered>
            <ModalHeader toggle={() => setViewOpen(false)}>
              Booking Details
            </ModalHeader>

            <ModalBody>
              {selectedBooking && (
                <>
                  <p>
                    <strong>Tour:</strong> {selectedBooking.title}
                  </p>
                  <p>
                    <strong>Customer:</strong> {selectedBooking.name}
                  </p>
                  <p>
                    <strong>Date:</strong> {selectedBooking.date}
                  </p>
                  <p>
                    <strong>Amount:</strong> {selectedBooking.price}
                  </p>
                  <p>
                    <strong>Status:</strong>{" "}
                    <span style={statusBadgeStyle(selectedBooking.status)}>
                      {selectedBooking.status}
                    </span>
                  </p>
                </>
              )}
            </ModalBody>

            <ModalFooter>
              <Button color="secondary" onClick={() => setViewOpen(false)}>
                Close
              </Button>
            </ModalFooter>
          </Modal>
        </Col>
      </Row>
    </Container>
  );
}
