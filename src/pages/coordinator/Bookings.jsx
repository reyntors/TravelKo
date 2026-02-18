import React, { useMemo, useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  CardBody,
  Button,
  Input,
  Table,
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from "reactstrap";
import { FaSearch, FaEye, FaCheck, FaTimes } from "react-icons/fa";
import api from "@/services/api";

export default function Bookings() {
  const green = "#16A34A";
  const border = "#E5E7EB";
  const muted = "#6B7280";
  const text = "#111827";

  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [typeFilter, setTypeFilter] = useState("all"); // all | private | joiner
  const [openTypeFilter, setOpenTypeFilter] = useState(false);
  const [activeTab, setActiveTab] = useState("approval");
  const [openTour, setOpenTour] = useState(null);
  const [joinerCounts, setJoinerCounts] = useState({});
  const [joinerDetails, setJoinerDetails] = useState({});

  const fetchJoinerDetails = async (tourId) => {
    try {
      const token = localStorage.getItem("auth_token");

      const res = await api.get(`/booking/joiners/${tourId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setJoinerDetails((prev) => ({
        ...prev,
        [tourId]: res.data || [],
      }));
    } catch (err) {
      console.error("Failed to fetch joiner details", err);
    }
  };

  const fetchJoinerCount = async (tourId) => {
    try {
      const token = localStorage.getItem("auth_token");

      const res = await api.get(`/booking/joiners/${tourId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const count = Array.isArray(res.data) ? res.data.length : 0;

      setJoinerCounts((prev) => ({
        ...prev,
        [tourId]: count,
      }));
    } catch (err) {
      console.error("Failed to fetch joiner count", err);
    }
  };

  const dataToRender = useMemo(() => {
    if (activeTab === "approval") {
      return bookings.filter(
        (b) => b.type === "private" && b.status === "request",
      );
    }

    if (activeTab === "private") {
      return bookings.filter(
        (b) => b.type === "private" && b.status === "approved",
      );
    }

    if (activeTab === "joiner") {
      return bookings.filter((b) => b.type === "joiner");
    }

    return bookings;
  }, [bookings, activeTab]);

  useEffect(() => {
    setOpenTour(null);
  }, [activeTab]);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("auth_token");

        let endpoint = "";

        if (activeTab === "joiner") {
          endpoint = "booking/tours/joiners";
        } else {
          endpoint = "booking/tours/private";
        }

        const res = await api.get(`/${endpoint}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = Array.isArray(res.data) ? res.data : [];

        let normalized = [];

        if (activeTab === "joiner") {
          // ✅ JOINER STRUCTURE (tour-based)
          normalized = data.map((tour) => ({
            mode: "joiner",
            tourId: tour.id,
            tourTitle: tour.title || "—",
            category: tour.category || "—",
            joinerPrice: tour.joinerPrice || 0,
            joinerBookedSlots: tour.joinerBookedSlots || 0,
            joinerMaxSlots: tour.joinerMaxSlots || 0,
          }));
        } else {
          // ✅ PRIVATE + APPROVAL STRUCTURE (booking-based)
          normalized = data.map((b) => ({
            mode: "private",
            id: b.id,
            tourId: b.tour?.id,
            tourTitle: b.tour?.title || "—",
            customer: b.booker?.fullName ?? "—",
            email: b.booker?.email ?? "—",
            phone: b.booker?.phoneNumber ?? "—",
            tourDate: Array.isArray(b.bookingDateSelected)
              ? `${new Date(b.bookingDateSelected[0]).toLocaleDateString()} - ${
                  b.bookingDateSelected[1]
                    ? new Date(b.bookingDateSelected[1]).toLocaleDateString()
                    : ""
                }`
              : "—",
            type: b.bookingType,
            amount: Number(b.amountPaid || 0),
            status: b.status || "request",
            displayStatus: b.status === "approved" ? "ongoing" : b.status,
          }));
        }

        setBookings(normalized);
      } catch (err) {
        console.error(err);
        alert(err.response?.data?.message || "Failed to load bookings");
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, [activeTab]);

  const formatPeso = (n) =>
    new Intl.NumberFormat("en-PH", {
      style: "currency",
      currency: "PHP",
      maximumFractionDigits: 0,
    }).format(n);

  const pill = (bg, color) => ({
    backgroundColor: bg,
    color,
    borderRadius: 999,
    padding: "6px 12px",
    fontSize: 12,
    fontWeight: 700,
    display: "inline-block",
    textTransform: "capitalize",
    whiteSpace: "nowrap",
  });

  const typePillStyle = (type) => {
    if (type.toLowerCase().includes("private")) {
      return pill("#DBEAFE", "#1D4ED8"); // blue
    }
    return pill("#DCFCE7", green); // green
  };

  const statusPillStyle = (status) => {
    switch (status?.toLowerCase()) {
      case "approved":
        return pill("#DCFCE7", green);
      case "request":
        return pill("#FEF3C7", "#B45309");
      case "cancelled":
        return pill("#FEE2E2", "#B91C1C");
      default:
        return pill("#E5E7EB", "#374151");
    }
  };

  const rejectPrivate = async (id) => {
    try {
      const token = localStorage.getItem("auth_token");

      const remarks = prompt("Enter rejection remarks:");
      if (!remarks) return;
      if (remarks.trim().length < 10) {
        alert("Remarks must be at least 10 characters long.");
        return;
      }

      await api.put(
        `/booking/private/reject/${id}`,
        {
          remarks: remarks,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      // update state immediately
      setBookings((prev) =>
        prev.map((b) => (b.id === id ? { ...b, status: "cancelled" } : b)),
      );
    } catch (err) {
      console.error("FULL ERROR:", err.response?.data);
    }
  };

  const cancelJoinerBookings = async (tourId) => {
    try {
      const token = localStorage.getItem("auth_token");

      await api.patch(
        `${import.meta.env.VITE_API_BASE_URL}booking/cancel/${tourId}/joiners`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      setBookings((prev) =>
        prev.map((b) =>
          b.tourId === tourId ? { ...b, status: "cancelled" } : b,
        ),
      );
    } catch (err) {
      console.error(err);
    }
  };

  const handleView = (b) => {
    alert(
      `Booking ${b.id}\n\nTour: ${b.tourTitle}\nCustomer: ${b.customer}\nDate: ${b.tourDate}\nType: ${b.type}\nAmount: ${formatPeso(
        b.amount,
      )}\nStatus: ${b.status}`,
    );
  };

  const headerCardStyle = {
    border: `1px solid ${border}`,
    borderRadius: 16,
    boxShadow: "0 1px 0 rgba(0,0,0,0.02)",
  };

  if (loading) {
    return (
      <Container fluid>
        <p className="text-center mt-5">Loading bookings...</p>
      </Container>
    );
  }

  const approvePrivate = async (id, price, remarks = "") => {
    try {
      const token = localStorage.getItem("auth_token");

      await api.put(
        `/booking/private/approve/${id}`,
        {
          price: Number(price),
          remarks: remarks,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      // 🔥 update state immediately
      setBookings((prev) =>
        prev.map((b) =>
          b.id === id ? { ...b, status: "ongoing", amount: Number(price) } : b,
        ),
      );
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Container fluid style={{ fontFamily: "Poppins" }}>
      {/* Header */}
      <Row className="mb-3">
        <Col>
          <h2 style={{ fontWeight: 900, letterSpacing: "-0.5px" }}>
            Bookings Management
          </h2>
          <div style={{ color: muted }}>
            Search, filter, and manage bookings
          </div>
        </Col>
      </Row>

      {/* Tabs */}
      <div className="d-flex gap-2 mb-4">
        <Button
          color={activeTab === "approval" ? "success" : "secondary"}
          onClick={() => setActiveTab("approval")}
        >
          Private Approval ({activeTab === "approval" ? bookings.length : ""})
        </Button>

        <Button
          color={activeTab === "private" ? "success" : "secondary"}
          onClick={() => setActiveTab("private")}
        >
          Private Bookings ({activeTab === "private" ? bookings.length : ""})
        </Button>

        <Button
          color={activeTab === "joiner" ? "success" : "secondary"}
          onClick={() => setActiveTab("joiner")}
        >
          Joiner / Group Bookings (
          {activeTab === "joiner" ? bookings.length : ""})
        </Button>
      </div>

      {/* ================= PRIVATE APPROVAL + PRIVATE LIST ================= */}
      {activeTab !== "joiner" && (
        <>
          {/* ================= DESKTOP TABLE ================= */}
          <div className="d-none d-md-block">
            <Card style={headerCardStyle}>
              <CardBody style={{ padding: 0 }}>
                <Table hover responsive className="mb-0">
                  <thead>
                    <tr>
                      <th>Booking</th>
                      <th>Customer</th>
                      <th>Tour Date</th>
                      <th className="text-end">Amount</th>
                      <th>Status</th>
                      <th className="text-end">Actions</th>
                    </tr>
                  </thead>

                  <tbody>
                    {dataToRender.map((b) => (
                      <tr key={b.id}>
                        <td>
                          <strong>{b.id}</strong>
                          <div className="text-muted">{b.tourTitle}</div>
                        </td>
                        <td>{b.customer}</td>
                        <td>{b.tourDate}</td>
                        <td className="text-end">{formatPeso(b.amount)}</td>
                        <td>
                          <span style={statusPillStyle(b.displayStatus)}>
                            {b.displayStatus}
                          </span>
                        </td>
                        <td className="text-end">
                          <div className="d-inline-flex gap-2">
                            {/* VIEW */}
                            <Button
                              size="sm"
                              outline
                              onClick={() => handleView(b)}
                            >
                              <FaEye />
                            </Button>

                            {/* APPROVAL TAB → APPROVE + CANCEL */}
                            {activeTab === "approval" && (
                              <>
                                <Button
                                  size="sm"
                                  color="success"
                                  onClick={() => {
                                    const price = prompt("Enter price:");
                                    if (!price) return;

                                    const remarks =
                                      prompt("Remarks (optional):") || "";
                                    approvePrivate(b.id, price, remarks);
                                  }}
                                >
                                  <FaCheck />
                                </Button>

                                <Button
                                  size="sm"
                                  color="danger"
                                  onClick={() => rejectPrivate(b.id)}
                                >
                                  <FaTimes />
                                </Button>
                              </>
                            )}

                            {/* PRIVATE TAB → CANCEL ONLY */}
                            {activeTab === "private" &&
                              b.status !== "cancelled" && (
                                <Button
                                  size="sm"
                                  color="danger"
                                  onClick={() => rejectPrivate(b.id)}
                                >
                                  <FaTimes />
                                </Button>
                              )}
                          </div>
                        </td>
                      </tr>
                    ))}

                    {dataToRender.length === 0 && (
                      <tr>
                        <td colSpan="6" className="text-center text-muted p-4">
                          No bookings found
                        </td>
                      </tr>
                    )}
                  </tbody>
                </Table>
              </CardBody>
            </Card>
          </div>

          {/* ================= MOBILE CARDS ================= */}
          <div className="d-block d-md-none">
            {dataToRender.map((b) => (
              <Card key={b.id} className="mb-3 shadow-sm">
                <CardBody>
                  <div className="d-flex justify-content-between mb-2">
                    <div>
                      <strong>#{b.id}</strong>
                      <div className="text-muted small">{b.tourTitle}</div>
                    </div>
                    <span style={statusPillStyle(b.status)}>{b.status}</span>
                  </div>

                  <div className="fw-semibold">{b.customer}</div>
                  <div className="text-muted small">{b.tourDate}</div>

                  <div className="my-2 fw-bold">{formatPeso(b.amount)}</div>

                  {/* ACTIONS */}
                  <div className="d-flex gap-2">
                    <Button size="sm" outline onClick={() => handleView(b)}>
                      <FaEye />
                    </Button>

                    {activeTab === "approval" && (
                      <>
                        <Button
                          size="sm"
                          color="success"
                          onClick={() => approvePrivate(b.id, "confirmed")}
                        >
                          <FaCheck />
                        </Button>

                        <Button
                          size="sm"
                          color="danger"
                          onClick={() => rejectPrivate(b.id, "cancelled")}
                        >
                          <FaTimes />
                        </Button>
                      </>
                    )}

                    {activeTab === "private" && b.status !== "cancelled" && (
                      <Button
                        size="sm"
                        color="danger"
                        onClick={() => rejectPrivate(b.id, "cancelled")}
                      >
                        <FaTimes />
                      </Button>
                    )}
                  </div>
                </CardBody>
              </Card>
            ))}

            {dataToRender.length === 0 && (
              <Card className="text-center text-muted p-4">
                No bookings found
              </Card>
            )}
          </div>
        </>
      )}

      {/* ================= JOINER / GROUP VIEW ================= */}
      {activeTab === "joiner" && (
        <>
          {bookings
            .filter((b) => b.mode === "joiner")
            .map((tour) => {
              if (!joinerCounts[tour.tourId]) {
                fetchJoinerCount(tour.tourId);
              }

              return (
                <div key={tour.tourId}>
                  <Card className="mb-3">
                    <CardBody>
                      <h5 className="fw-bold">{tour.tourTitle}</h5>

                      <div>
                        Joiners Booked:{" "}
                        <strong>{joinerCounts[tour.tourId] ?? 0}</strong>
                      </div>

                      <div>Max Slots: {tour.joinerMaxSlots}</div>

                      <Button
                        size="sm"
                        color="primary"
                        className="mt-2 me-2"
                        onClick={() => {
                          setOpenTour(tour.tourId);
                          fetchJoinerDetails(tour.tourId);
                        }}
                      >
                        View Clients
                      </Button>

                      <Button
                        size="sm"
                        color="danger"
                        onClick={() => cancelJoinerBookings(tour.tourId)}
                      >
                        Cancel All Joiners
                      </Button>
                    </CardBody>
                  </Card>

                  {/* 👇 EXPANDED DETAILS INSIDE MAP */}
                  {openTour === tour.tourId && joinerDetails[tour.tourId] && (
                    <>
                      {/* DESKTOP */}
                      <div className="d-none d-md-block mt-3">
                        <Table hover responsive>
                          <thead>
                            <tr>
                              <th>Client</th>
                              <th>Email</th>
                              <th>Phone</th>
                              <th>Status</th>
                            </tr>
                          </thead>
                          <tbody>
                            {joinerDetails[tour.tourId].map((client) => (
                              <tr key={client.id}>
                                <td>{client.fullName}</td>
                                <td>{client.email}</td>
                                <td>{client.phoneNumber}</td>
                                <td>
                                  {client.isVerified
                                    ? "Verified"
                                    : "Not Verified"}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </Table>
                      </div>

                      {/* MOBILE */}
                      <div className="d-md-none mt-3">
                        {joinerDetails[tour.tourId].map((client) => (
                          <Card key={client.id} className="mb-2">
                            <CardBody>
                              <div className="fw-semibold">
                                {client.fullName}
                              </div>
                              <div className="text-muted small">
                                {client.email}
                              </div>
                              <div className="text-muted small">
                                {client.phoneNumber}
                              </div>
                              <div>
                                Status:{" "}
                                {client.isVerified
                                  ? "Verified"
                                  : "Not Verified"}
                              </div>
                            </CardBody>
                          </Card>
                        ))}
                      </div>
                    </>
                  )}
                </div>
              );
            })}
        </>
      )}
    </Container>
  );
}
