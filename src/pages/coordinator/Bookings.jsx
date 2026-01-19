import React, { useMemo, useState } from "react";
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

export default function Bookings() {
  const green = "#16A34A";
  const border = "#E5E7EB";
  const muted = "#6B7280";
  const text = "#111827";

  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("all");
  const [openFilter, setOpenFilter] = useState(false);

  const initialBookings = useMemo(
    () => [
      {
        id: "BKG-1001",
        tourTitle: "Mt. Pinatubo Crater Lake Trek",
        customer: "Clifford Halasan",
        tourDate: "2024-02-15",
        type: "Join a group",
        amount: 2500,
        status: "confirmed",
      },
      {
        id: "BKG-1002",
        tourTitle: "Palawan Island Hopping",
        customer: "Mary Grace Gallardo",
        tourDate: "2024-03-01",
        type: "Private tour",
        amount: 8900,
        status: "pending",
      },
      {
        id: "BKG-1003",
        tourTitle: "Scuba Diving Experience",
        customer: "Karl Borromeo",
        tourDate: "2024-02-20",
        type: "Join a group",
        amount: 6200,
        status: "pending",
      },
      {
        id: "BKG-1004",
        tourTitle: "Mount Pinatubo Trek",
        customer: "James Perez",
        tourDate: "2024-02-28",
        type: "Private tour",
        amount: 3500,
        status: "cancelled",
      },
    ],
    [],
  );

  const [bookings, setBookings] = useState(initialBookings);

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

    const matchesFilter =
      filter === "all" ? true : b.status.toLowerCase() === filter;

    return matchesQuery && matchesFilter;
  });

  const setStatus = (id, status) => {
    setBookings((prev) =>
      prev.map((b) => (b.id === id ? { ...b, status } : b)),
    );
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

      {/* Controls */}
      <Card
        style={{ ...headerCardStyle, overflow: "visible" }}
        className="mb-3"
      >
        <CardBody>
          <Row className="g-2 align-items-center">
            <Col
              xs="12"
              md="5"
              className="d-flex justify-content-md-end"
              style={{
                position: "relative",
                zIndex: 1200,
                overflow: "visible",
              }}
            >
              <Dropdown
                isOpen={openFilter}
                toggle={() => setOpenFilter((v) => !v)}
              >
                <DropdownToggle
                  caret
                  style={{
                    borderRadius: 12,
                    border: `1px solid ${border}`,
                    background: "#fff",
                    color: text,
                    fontWeight: 700,
                    padding: "10px 12px",
                    minWidth: 190,
                    textAlign: "left",
                  }}
                >
                  Status:{" "}
                  <span style={{ textTransform: "capitalize" }}>{filter}</span>
                </DropdownToggle>

                <DropdownMenu end style={{ zIndex: 1300}}>
                  <DropdownItem onClick={() => setFilter("all")}>
                    All bookings
                  </DropdownItem>
                  <DropdownItem onClick={() => setFilter("confirmed")}>
                    Confirmed
                  </DropdownItem>
                  <DropdownItem onClick={() => setFilter("pending")}>
                    Pending
                  </DropdownItem>
                  <DropdownItem onClick={() => setFilter("cancelled")}>
                    Cancelled
                  </DropdownItem>
                </DropdownMenu>
              </Dropdown>
            </Col>
          </Row>
        </CardBody>
      </Card>

      {/* Desktop table (hidden on mobile) */}
      <div className="d-none d-md-block mt-5">
        <Card style={headerCardStyle}>
          <CardBody style={{ padding: 0 }}>
            <Table responsive hover className="mb-0" style={{ margin: 0 }}>
              <thead>
                <tr style={{ background: "#F9FAFB" }}>
                  <th style={{ padding: 14 }}>Booking Details</th>
                  <th style={{ padding: 14 }}>Customer</th>
                  <th style={{ padding: 14 }}>Tour Date</th>
                  <th style={{ padding: 14 }}>Type</th>
                  <th style={{ padding: 14, textAlign: "right" }}>Amount</th>
                  <th style={{ padding: 14 }}>Status</th>
                  <th style={{ padding: 14, textAlign: "right" }}>Actions</th>
                </tr>
              </thead>

              <tbody>
                {filtered.map((b) => (
                  <tr key={b.id}>
                    <td style={{ padding: 14 }}>
                      <div style={{ fontWeight: 900, color: text }}>{b.id}</div>
                      <div style={{ color: muted }}>{b.tourTitle}</div>
                    </td>

                    <td style={{ padding: 14, color: text, fontWeight: 700 }}>
                      {b.customer}
                    </td>

                    <td style={{ padding: 14, color: muted }}>{b.tourDate}</td>

                    <td style={{ padding: 14 }}>
                      <span style={typePillStyle(b.type)}>{b.type}</span>
                    </td>

                    <td style={{ padding: 14, textAlign: "right" }}>
                      <span style={{ fontWeight: 900, color: text }}>
                        {formatPeso(b.amount)}
                      </span>
                    </td>

                    <td style={{ padding: 14 }}>
                      <span style={statusPillStyle(b.status)}>{b.status}</span>
                    </td>

                    <td style={{ padding: 14, textAlign: "right" }}>
                      <div
                        style={{
                          display: "inline-flex",
                          gap: 8,
                          alignItems: "center",
                        }}
                      >
                        <Button
                          size="sm"
                          outline
                          onClick={() => handleView(b)}
                          style={{ borderRadius: 10 }}
                          title="View"
                        >
                          <FaEye />
                        </Button>

                        <Button
                          size="sm"
                          color="success"
                          onClick={() => setStatus(b.id, "confirmed")}
                          style={{
                            borderRadius: 10,
                            background: green,
                            border: "none",
                            display:
                              b.status === "confirmed" ? "none" : "inline-flex",
                            alignItems: "center",
                            gap: 6,
                          }}
                          title="Confirm"
                        >
                          <FaCheck />
                        </Button>

                        <Button
                          size="sm"
                          color="danger"
                          onClick={() => setStatus(b.id, "cancelled")}
                          style={{
                            borderRadius: 10,
                            display:
                              b.status === "cancelled" ? "none" : "inline-flex",
                            alignItems: "center",
                            gap: 6,
                          }}
                          title="Cancel"
                        >
                          <FaTimes />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}

                {filtered.length === 0 && (
                  <tr>
                    <td colSpan="7" style={{ padding: 18, color: muted }}>
                      No bookings found.
                    </td>
                  </tr>
                )}
              </tbody>
            </Table>
          </CardBody>
        </Card>
      </div>

      {/* Mobile list (shown only on mobile) */}
      <div className="d-md-none" style={{ marginTop: "5rem" }}>
        <Row className="g-3">
          {filtered.map((b) => (
            <Col xs="12" key={b.id}>
              <Card style={headerCardStyle}>
                <CardBody>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      gap: 10,
                    }}
                  >
                    <div style={{ minWidth: 0 }}>
                      <div style={{ fontWeight: 900, color: text }}>
                        {b.tourTitle}
                      </div>
                      <div style={{ color: muted, marginTop: 4 }}>
                        {b.customer}
                      </div>
                      <div
                        style={{ color: "#9CA3AF", marginTop: 6, fontSize: 12 }}
                      >
                        {b.id} • {b.tourDate}
                      </div>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <div style={{ fontWeight: 900, color: text }}>
                        {formatPeso(b.amount)}
                      </div>
                      <div style={{ marginTop: 8 }}>
                        <span style={statusPillStyle(b.status)}>
                          {b.status}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div
                    style={{
                      marginTop: 12,
                      display: "flex",
                      gap: 10,
                      flexWrap: "wrap",
                    }}
                  >
                    <span style={typePillStyle(b.type)}>{b.type}</span>
                  </div>

                  <div style={{ marginTop: 14, display: "flex", gap: 8 }}>
                    <Button
                      outline
                      size="sm"
                      onClick={() => handleView(b)}
                      style={{ borderRadius: 10 }}
                    >
                      <FaEye style={{ marginRight: 6 }} />
                      View
                    </Button>

                    {b.status !== "confirmed" && (
                      <Button
                        size="sm"
                        onClick={() => setStatus(b.id, "confirmed")}
                        style={{
                          borderRadius: 10,
                          background: green,
                          border: "none",
                        }}
                      >
                        <FaCheck style={{ marginRight: 6 }} />
                        Confirm
                      </Button>
                    )}

                    {b.status !== "cancelled" && (
                      <Button
                        size="sm"
                        color="danger"
                        onClick={() => setStatus(b.id, "cancelled")}
                        style={{ borderRadius: 10 }}
                      >
                        <FaTimes style={{ marginRight: 6 }} />
                        Cancel
                      </Button>
                    )}
                  </div>
                </CardBody>
              </Card>
            </Col>
          ))}

          {filtered.length === 0 && (
            <Col xs="12">
              <Card style={headerCardStyle}>
                <CardBody style={{ color: muted }}>No bookings found.</CardBody>
              </Card>
            </Col>
          )}
        </Row>
      </div>
    </Container>
  );
}
