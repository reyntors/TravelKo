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

  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("all");
  const [openFilter, setOpenFilter] = useState(false);

  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [typeFilter, setTypeFilter] = useState("all"); // all | private | joiner
  const [openTypeFilter, setOpenTypeFilter] = useState(false);
  const [activeTab, setActiveTab] = useState("approval");
  const [openTour, setOpenTour] = useState(null);

  useEffect(() => {
    setOpenTour(null);
  }, [activeTab]);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        setLoading(true);

        const token = localStorage.getItem("auth_token");

        const res = await api.get(
          `${import.meta.env.VITE_API_BASE_URL}booking`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        const data = res.data;

        const coordinator = JSON.parse(
          localStorage.getItem("auth_user") || "{}",
        );

        const myBookings = Array.isArray(data)
          ? data.filter((b) => b?.tour?.coordinatorId === coordinator?.id)
          : [];

        //  Normalize data for UI
        const normalized = myBookings.map((b) => ({
          id: b.id,
          tourId: b.tour?.id,
          tourTitle: b.tour?.title || "—",
          customer: b.booker?.fullName ?? "—",
          email: b.booker?.email ?? "—",
          phone: b.booker?.phoneNumber ?? "—",
          tourDate: b.bookingDateSelected || "—",
          type: b.bookingType,
          amount: Number(b.amountPaid || 0),
          status: b.status || "pending",
        }));

        setBookings(normalized);
      } catch (err) {
        console.error(err);
        alert(err.response?.data?.message || "Failed to load bookings");
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  const privateApproval = bookings.filter(
    (b) => b.type === "private" && b.status === "pending",
  );

  const privateApproved = bookings.filter(
    (b) => b.type === "private" && b.status === "confirmed",
  );

  const joinerBookings = bookings.filter((b) => b.type === "joiner");

  const joinerByTour = useMemo(() => {
    return joinerBookings.reduce((acc, b) => {
      if (!acc[b.tourId]) {
        acc[b.tourId] = {
          tourTitle: b.tourTitle,
          bookings: [],
        };
      }
      acc[b.tourId].bookings.push(b);
      return acc;
    }, {});
  }, [joinerBookings]);

  const dataToRender =
    activeTab === "approval"
      ? privateApproval
      : activeTab === "private"
        ? privateApproved
        : [];

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
      case "confirmed":
        return pill("#DCFCE7", green);
      case "pending":
        return pill("#FEF3C7", "#B45309");
      case "cancelled":
        return pill("#FEE2E2", "#B91C1C");
      default:
        return pill("#E5E7EB", "#374151");
    }
  };

  const filtered = bookings.filter((b) => {
    const q = query.trim().toLowerCase();
    const matchesQuery =
      !q ||
      b.tourTitle.toLowerCase().includes(q) ||
      b.customer.toLowerCase().includes(q) ||
      b.id.toLowerCase().includes(q);

    const matchesStatus =
      filter === "all" ? true : b.status.toLowerCase() === filter;

    const matchesType =
      typeFilter === "all"
        ? true
        : typeFilter === "private"
          ? b.type.toLowerCase().includes("private")
          : b.type.toLowerCase().includes("join");

    return matchesQuery && matchesStatus && matchesType;
  });

  const updateStatus = async (id, status) => {
    try {
      const token = localStorage.getItem("auth_token");

      await api.patch(
        `${import.meta.env.VITE_API_BASE_URL}booking/${id}`,
        { status }, // ✅ ONLY update status
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      // ✅ Update UI immediately after success
      setBookings((prev) =>
        prev.map((b) => (b.id === id ? { ...b, status } : b)),
      );
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Failed to update booking status");
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
          Private Approval ({privateApproval.length})
        </Button>

        <Button
          color={activeTab === "private" ? "success" : "secondary"}
          onClick={() => setActiveTab("private")}
        >
          Private Bookings ({privateApproved.length})
        </Button>

        <Button
          color={activeTab === "joiner" ? "success" : "secondary"}
          onClick={() => setActiveTab("joiner")}
        >
          Joiner / Group Bookings ({joinerBookings.length})
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
                          <span style={statusPillStyle(b.status)}>
                            {b.status}
                          </span>
                        </td>
                        <td className="text-end">
                          <Button
                            size="sm"
                            outline
                            onClick={() => handleView(b)}
                          >
                            <FaEye />
                          </Button>
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
                          onClick={() => updateStatus(b.id, "confirmed")}
                        >
                          <FaCheck />
                        </Button>

                        <Button
                          size="sm"
                          color="danger"
                          onClick={() => updateStatus(b.id, "cancelled")}
                        >
                          <FaTimes />
                        </Button>
                      </>
                    )}

                    {activeTab === "private" && b.status !== "cancelled" && (
                      <Button
                        size="sm"
                        color="danger"
                        onClick={() => updateStatus(b.id, "cancelled")}
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
          {Object.values(joinerByTour).map((tour) => (
            <Card key={tour.tourTitle} className="mb-3">
              <CardBody>
                <h5 className="fw-bold">{tour.tourTitle}</h5>

                <Button size="sm" outline onClick={() => setOpenTour(tour)}>
                  View Clients ({tour.bookings.length})
                </Button>
              </CardBody>
            </Card>
          ))}

          {openTour && (
            <>
              {/* DESKTOP TABLE */}
              <div className="d-none d-md-block">
                {/* your existing joiner table */}
              </div>

              {/* MOBILE CARDS */}
              <div className="d-md-none">
                {openTour.bookings.map((b) => (
                  <Card key={b.id} className="mb-3">
                    <CardBody>
                      <div className="fw-semibold">{b.customer}</div>
                      <div className="text-muted small">{b.email}</div>
                      <div className="text-muted small">{b.phone}</div>

                      <div className="my-2 fw-bold">{formatPeso(b.amount)}</div>

                      <Button
                        size="sm"
                        color="danger"
                        onClick={() => updateStatus(b.id, "cancelled")}
                      >
                        <FaTimes /> Cancel
                      </Button>
                    </CardBody>
                  </Card>
                ))}
              </div>
            </>
          )}
        </>
      )}
    </Container>
  );
}
