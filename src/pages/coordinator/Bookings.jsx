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
  Modal,
  ModalHeader,
  ModalBody,
  Spinner,
} from "reactstrap";
import { FaSearch, FaEye, FaCheck, FaTimes } from "react-icons/fa";
import api from "@/services/api";

export default function Bookings() {
  const green = "#16A34A";
  const border = "#E5E7EB";
  const muted = "#6B7280";
  const text = "#111827";
  const [approveModalOpen, setApproveModalOpen] = useState(false);
  const [approvePrice, setApprovePrice] = useState("");
  const [approveBooking, setApproveBooking] = useState(null);
  const [approveLoading, setApproveLoading] = useState(false);
  const [approveRemarks, setApproveRemarks] = useState("");
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [typeFilter, setTypeFilter] = useState("all"); // all | private | joiner
  const [openTypeFilter, setOpenTypeFilter] = useState(false);
  const [activeTab, setActiveTab] = useState("approval");
  const [openTour, setOpenTour] = useState(null);
  const [joinerCounts, setJoinerCounts] = useState({});
  const [joinerDetails, setJoinerDetails] = useState({});
  const [statusFilter, setStatusFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [selectedTour, setSelectedTour] = useState(null);
  const [viewLoading, setViewLoading] = useState(false);
  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [rejectBooking, setRejectBooking] = useState(null);
  const [rejectRemarks, setRejectRemarks] = useState("");
  const [rejectLoading, setRejectLoading] = useState(false);
  const [rejectError, setRejectError] = useState("");
  const [clientsModalOpen, setClientsModalOpen] = useState(false);
  const [selectedTourClients, setSelectedTourClients] = useState(null);
  const [selectedClient, setSelectedClient] = useState(null);
  const [clientDetailModal, setClientDetailModal] = useState(false);
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
    let filtered = bookings;

    if (activeTab === "approval") {
      filtered = filtered.filter(
        (b) => b.type === "private" && b.status === "request",
      );
    }

    // if (activeTab === "private") {
    //   filtered = filtered.filter(
    //     (b) => b.type === "private" && b.status === "approved",
    //   );
    // }

    if (activeTab === "private") {
      filtered = filtered.filter((b) => b.type === "private");
    }
    if (activeTab === "joiner") {
      filtered = filtered.filter((b) => b.mode === "joiner");
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter((b) => b.status === statusFilter);
    }

    if (search) {
      filtered = filtered.filter((b) =>
        b.tourTitle?.toLowerCase().includes(search.toLowerCase()),
      );
    }

    return filtered;
  }, [bookings, activeTab, statusFilter, search]);

  useEffect(() => {
    setOpenTour(null);
  }, [activeTab]);

  const handleView = async (b) => {
    try {
      setViewLoading(true);
      setViewModalOpen(true);
      setSelectedBooking(b);

      const token = localStorage.getItem("auth_token");

      const res = await api.get(`/tours/${b.tourId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setSelectedTour(res.data);
    } catch (err) {
      console.error("Failed to fetch tour", err);
    } finally {
      setViewLoading(false);
    }
  };

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
            bookings: tour.bookings || [], // ✅ VERY IMPORTANT
          }));
        } else {
          normalized = data.map((b) => ({
            mode: "private",
            id: b.id,
            tourId: b.tour?.id,
            tourTitle: selectedTour?.title,
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
            amount: Number(b.amount),
            status: b.status,
            displayStatus: b.status,
            remarks: b.remarks,
            specialRequests: b.specialRequests,
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

  useEffect(() => {
    if (activeTab === "joiner" && bookings.length > 0) {
      bookings.forEach((tour) => {
        if (!joinerCounts[tour.tourId]) {
          fetchJoinerCount(tour.tourId);
        }
      });
    }
  }, [activeTab, bookings]);

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
      case "rejected":
        return pill("#FEE2E2", "#B91C1C");
      default:
        return pill("#E5E7EB", "#374151");
    }
  };

  const rejectPrivate = async () => {
    if (!rejectRemarks || rejectRemarks.trim().length < 10) {
      setRejectError("Remarks must be at least 10 characters long.");
      return;
    }

    try {
      setRejectLoading(true);
      setRejectError("");

      const token = localStorage.getItem("auth_token");

      await api.put(
        `/booking/private/reject/${rejectBooking.id}`,
        {
          remarks: rejectRemarks.trim(),
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      // ✅ Update state instantly
      setBookings((prev) =>
        prev.map((b) =>
          b.id === rejectBooking.id ? { ...b, status: "cancelled" } : b,
        ),
      );

      // reset modal
      setRejectModalOpen(false);
      setRejectBooking(null);
      setRejectRemarks("");
    } catch (err) {
      setRejectError(
        err.response?.data?.message || "Failed to reject booking.",
      );
    } finally {
      setRejectLoading(false);
    }
  };

  const cancelJoinerBookings = async (tourId) => {
    try {
      const token = localStorage.getItem("auth_token");

      await api.patch(
        `/booking/cancel/${tourId}/joiners`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      // ✅ update nested bookings
      setBookings((prev) =>
        prev.map((tour) =>
          tour.tourId === tourId
            ? {
                ...tour,
                bookings: tour.bookings.map((b) => ({
                  ...b,
                  status: "cancelled",
                })),
              }
            : tour,
        ),
      );
    } catch (err) {
      console.error("Cancel Error:", err.response?.data || err.message);
    }
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

  const approvePrivate = async () => {
    if (!approvePrice || isNaN(approvePrice)) return;

    try {
      setApproveLoading(true);

      const token = localStorage.getItem("auth_token");

      await api.put(
        `/booking/private/approve/${approveBooking.id}`,
        {
          price: Number(approvePrice),
          remarks: approveRemarks || "", // ✅ required by backend
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      // ✅ Update state instantly
      setBookings((prev) =>
        prev.map((b) =>
          b.id === approveBooking.id
            ? {
                ...b,
                status: "approved",
                displayStatus: "ongoing",
                amount: Number(approvePrice),
              }
            : b,
        ),
      );

      setApproveModalOpen(false);
      setApproveBooking(null);
      setApproveRemarks("");
    } catch (err) {
      console.error("APPROVE ERROR:", err.response?.data);
    } finally {
      setApproveLoading(false);
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
      {/* 🔥 CLEAN MODERN FILTER BAR */}
      <Card className="mb-4 shadow-sm" style={{ borderRadius: 14 }}>
        <CardBody>
          <Row className="g-3 align-items-end">
            <Col md="3">
              <label className="fw-semibold mb-1">View</label>
              <Input
                type="select"
                value={activeTab}
                onChange={(e) => setActiveTab(e.target.value)}
              >
                <option value="approval">Private Approval</option>
                <option value="private">Private Bookings</option>
                <option value="joiner">Joiner / Group</option>
              </Input>
            </Col>

            {activeTab !== "joiner" && (
              <Col md="3">
                <label className="fw-semibold mb-1">Status</label>
                <Input
                  type="select"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <option value="all">All</option>
                  <option value="request">Request</option>
                  <option value="approved">Approved</option>
                  <option value="cancelled">Cancelled</option>
                  <option value="refunded">Refunded</option>
                  <option value="paid">Paid</option>
                  <option value="completed">Completed</option>
                  <option value="rejected">Rejected</option>
                  <option value="ongoing">Ongoing</option>
                </Input>
              </Col>
            )}

            <Col md="4">
              <label className="fw-semibold mb-1">Search</label>
              <Input
                type="text"
                placeholder="Search tour..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </Col>
          </Row>
        </CardBody>
      </Card>

      {/* ================= PRIVATE APPROVAL + PRIVATE LIST ================= */}
      {activeTab !== "joiner" && (
        <>
          {/* ================= DESKTOP TABLE ================= */}
          <div className="d-none d-md-block">
            <Card style={headerCardStyle}>
              <CardBody style={{ padding: 0 }}>
                <Table hover responsive className="mb-0 align-middle">
                  <thead className="table-light">
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
                                    setApproveBooking(b);
                                    setApprovePrice("");
                                    setApproveModalOpen(true);
                                  }}
                                >
                                  <FaCheck />
                                </Button>

                                <Button
                                  size="sm"
                                  color="danger"
                                  onClick={() => {
                                    setRejectBooking(b);
                                    setRejectRemarks("");
                                    setRejectError("");
                                    setRejectModalOpen(true);
                                  }}
                                >
                                  <FaTimes />
                                </Button>
                              </>
                            )}

                            {/* PRIVATE TAB → CANCEL ONLY */}
                            {/* {activeTab === "private" &&
                              b.status !== "cancelled" && (
                                <Button
                                  size="sm"
                                  color="danger"
                                  onClick={() => rejectPrivate(b.id)}
                                >
                                  <FaTimes />
                                </Button>
                              )} */}
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
        <Card style={headerCardStyle}>
          <CardBody style={{ padding: 0 }}>
            <Table hover responsive className="mb-0 align-middle">
              <thead className="table-light">
                <tr>
                  <th>Tour</th>
                  <th>Category</th>
                  <th className="text-center">Booked</th>
                  <th className="text-center">Max Slots</th>
                  <th className="text-end">Actions</th>
                </tr>
              </thead>

              <tbody>
                {dataToRender.map((tour) => (
                  <tr key={tour.tourId}>
                    <td>
                      <strong>{tour.tourTitle}</strong>
                    </td>

                    <td>{tour.category}</td>

                    <td className="text-center">
                      {joinerCounts[tour.tourId] ?? 0}
                    </td>

                    <td className="text-center">{tour.joinerMaxSlots}</td>

                    <td className="text-end">
                      <div className="d-inline-flex gap-2">
                        <Button
                          size="sm"
                          color="primary"
                          onClick={() => {
                            setSelectedTourClients(tour);
                            setClientsModalOpen(true);
                          }}
                        >
                          View Clients
                        </Button>

                        <Button
                          size="sm"
                          color="danger"
                          disabled={!joinerCounts[tour.tourId]}
                          onClick={() => cancelJoinerBookings(tour.tourId)}
                        >
                          Cancel All Joiners
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}

                {dataToRender.length === 0 && (
                  <tr>
                    <td colSpan="5" className="text-center text-muted p-4">
                      No joiner tours found
                    </td>
                  </tr>
                )}
              </tbody>
            </Table>
          </CardBody>
        </Card>
      )}
      <Modal
        isOpen={clientsModalOpen}
        toggle={() => setClientsModalOpen(false)}
        size="lg"
        centered
      >
        <ModalHeader toggle={() => setClientsModalOpen(false)}>
          Clients - {selectedTourClients?.tourTitle}
        </ModalHeader>

        <ModalBody>
          {!selectedTourClients?.bookings ? (
            <div className="text-center text-muted">No clients found</div>
          ) : (
            <Table responsive hover>
              <thead className="table-light">
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Slots</th>
                  <th>Status</th>
                  <th className="text-end">Action</th>
                </tr>
              </thead>

              <tbody>
                {selectedTourClients.bookings.map((b) => (
                  <tr key={b.id}>
                    <td>{b.booker?.fullName}</td>
                    <td>{b.booker?.email}</td>
                    <td>{b.booker?.phoneNumber}</td>
                    <td>{b.bookingIndividuals}</td>
                    <td>
                      <span style={statusPillStyle(b.status)}>{b.status}</span>
                    </td>

                    <td className="text-end">
                      <Button
                        size="sm"
                        outline
                        onClick={() => {
                          setSelectedClient(b);
                          setClientDetailModal(true);
                        }}
                      >
                        <FaEye /> View
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}
        </ModalBody>
      </Modal>
      <Modal
        isOpen={clientDetailModal}
        toggle={() => setClientDetailModal(false)}
        centered
      >
        <ModalHeader toggle={() => setClientDetailModal(false)}>
          Client Details
        </ModalHeader>

        <ModalBody>
          {selectedClient && (
            <>
              <p>
                <strong>Name:</strong> {selectedClient.booker?.fullName}
              </p>
              <p>
                <strong>Email:</strong> {selectedClient.booker?.email}
              </p>
              <p>
                <strong>Phone:</strong> {selectedClient.booker?.phoneNumber}
              </p>

              <p>
                <strong>Slots:</strong> {selectedClient.bookingIndividuals}
              </p>

              <p>
                <strong>Date:</strong>{" "}
                {selectedClient.bookingDateSelected
                  ?.map((d) => new Date(d).toLocaleDateString())
                  .join(", ")}
              </p>

              <p>
                <strong>Payment:</strong> {selectedClient.paymentMethod}
              </p>

              <p>
                <strong>Special Request:</strong>{" "}
                {selectedClient.specialRequests || "—"}
              </p>

              <p>
                <strong>Remarks:</strong> {selectedClient.remarks || "—"}
              </p>

              <p>
                <strong>Status:</strong>{" "}
                <span style={statusPillStyle(selectedClient.status)}>
                  {selectedClient.status}
                </span>
              </p>
            </>
          )}
        </ModalBody>
      </Modal>

      {/* ===== VIEW BOOKING MODAL ===== */}
      <Modal
        isOpen={viewModalOpen}
        toggle={() => setViewModalOpen(false)}
        centered
        size="lg"
      >
        <ModalHeader toggle={() => setViewModalOpen(false)}>
          Booking Details
        </ModalHeader>

        <ModalBody>
          {viewLoading ? (
            <div className="text-center py-5">
              <Spinner style={{ width: "3rem", height: "3rem" }} />
              <div className="mt-3 text-muted">Loading tour details...</div>
            </div>
          ) : (
            selectedBooking && (
              <Row className="g-3">
                {/* LEFT SIDE */}
                <Col md="6">
                  <h5 className="fw-bold mb-3">{selectedTour?.title || "—"}</h5>

                  <p>
                    <strong>Customer:</strong> {selectedBooking.customer}
                  </p>

                  <p>
                    <strong>Email:</strong> {selectedBooking.email}
                  </p>

                  <p>
                    <strong>Phone:</strong> {selectedBooking.phone}
                  </p>
                  <p>
                    <strong>Address:</strong> {selectedBooking.address}
                  </p>
                  <p>
                    <strong>Tour Date:</strong> {selectedBooking.tourDate}
                  </p>

                  <p>
                    <strong>Booking Type:</strong> {selectedBooking.type}
                  </p>
                  <p>
                    <strong>Special Request:</strong>{" "}
                    {selectedBooking.specialRequests}
                  </p>
                  <p>
                    <strong>Remarks:</strong> {selectedBooking.remarks}
                  </p>

                  <p>
                    <strong>Status:</strong>{" "}
                    <span style={statusPillStyle(selectedBooking.status)}>
                      {selectedBooking.status}
                    </span>
                  </p>

                  <h5 className="fw-bold mt-3">
                    {formatPeso(selectedBooking.amount)}
                  </h5>
                </Col>

                {/* RIGHT SIDE */}
                <Col md="6">
                  <Card className="shadow-sm">
                    <CardBody>
                      <h6 className="fw-bold mb-2">Tour Information</h6>

                      <p>
                        <strong>Category:</strong>{" "}
                        {selectedTour?.category || "—"}
                      </p>

                      <p>
                        <strong>Joiner Price:</strong>{" "}
                        {selectedTour?.joinerPrice
                          ? formatPeso(selectedTour.joinerPrice)
                          : "—"}
                      </p>

                      <p>
                        <strong>Max Slots:</strong>{" "}
                        {selectedTour?.joinerMaxSlots || "—"}
                      </p>

                      {/* <p>
                        <strong>Private Price:</strong>{" "}
                        {selectedTour?.privateBookingPrice
                          ? formatPeso(selectedTour.privateBookingPrice)
                          : "—"}
                      </p> */}
                    </CardBody>
                  </Card>
                </Col>
              </Row>
            )
          )}
        </ModalBody>
      </Modal>

      {/* ===== APPROVE PRIVATE MODAL ===== */}
      <Modal
        isOpen={approveModalOpen}
        toggle={() => setApproveModalOpen(false)}
        centered
      >
        <ModalHeader toggle={() => setApproveModalOpen(false)}>
          Approve Booking
        </ModalHeader>

        <ModalBody>
          {approveBooking && (
            <>
              <div className="mb-3">
                <strong>Tour:</strong> {selectedTour?.title}
              </div>

              <div className="mb-3">
                <strong>Customer:</strong> {approveBooking.customer}
              </div>

              <label className="fw-semibold mb-1">Enter Price</label>
              <Input
                type="number"
                placeholder="Enter approved price"
                value={approvePrice}
                onChange={(e) => setApprovePrice(e.target.value)}
              />
              <label className="fw-semibold mt-3 mb-1">
                Remarks (Optional)
              </label>
              <Input
                type="textarea"
                rows="3"
                placeholder="Enter remarks..."
                value={approveRemarks}
                onChange={(e) => setApproveRemarks(e.target.value)}
              />

              <Button
                color="success"
                className="w-100 mt-3"
                onClick={approvePrivate}
                disabled={approveLoading}
              >
                {approveLoading ? (
                  <>
                    <Spinner size="sm" className="me-2" />
                    Processing...
                  </>
                ) : (
                  "Confirm Approval"
                )}
              </Button>
            </>
          )}
        </ModalBody>
      </Modal>
      {/* ===== REJECT PRIVATE MODAL ===== */}
      <Modal
        isOpen={rejectModalOpen}
        toggle={() => setRejectModalOpen(false)}
        centered
      >
        <ModalHeader toggle={() => setRejectModalOpen(false)}>
          Reject Booking
        </ModalHeader>

        <ModalBody>
          {rejectBooking && (
            <>
              <div className="mb-3">
                <strong>Tour:</strong> {rejectBooking.tourTitle}
              </div>

              <div className="mb-3">
                <strong>Customer:</strong> {rejectBooking.customer}
              </div>

              <label className="fw-semibold mb-1">Reason for Rejection</label>

              <Input
                type="textarea"
                rows="4"
                placeholder="Please provide a clear reason for rejection..."
                value={rejectRemarks}
                onChange={(e) => setRejectRemarks(e.target.value)}
              />

              {rejectError && (
                <div className="text-danger mt-2">{rejectError}</div>
              )}

              <Button
                color="danger"
                className="w-100 mt-3"
                onClick={rejectPrivate}
                disabled={rejectLoading}
              >
                {rejectLoading ? (
                  <>
                    <Spinner size="sm" className="me-2" />
                    Processing...
                  </>
                ) : (
                  "Confirm Rejection"
                )}
              </Button>
            </>
          )}
        </ModalBody>
      </Modal>
    </Container>
  );
}
