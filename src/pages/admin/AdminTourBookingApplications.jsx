import { useState, useEffect } from "react";
import api from "@/services/api";
import {
  Table,
  Button,
  Badge,
  Input,
  Row,
  Col,
  Modal,
  ModalHeader,
  ModalBody,
  Spinner,
} from "reactstrap";

// ================= JOINER STATUS AGGREGATOR =================
const computeJoinerTourStatus = (tour) => {
  const statuses = tour.bookings.map((b) => b.status);

  if (statuses.every((s) => s === "cancelled")) return "cancelled";
  if (statuses.every((s) => s === "refunded")) return "refunded";
  if (statuses.some((s) => s === "refunded")) return "pending refund";
  if (statuses.every((s) => s === "completed")) return "completed";
  if (statuses.every((s) => s === "paid")) return "paid";

  return "ongoing";
};

export default function AdminBookingsManagement() {
  const [activeType, setActiveType] = useState("private");
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(false);

  const [bookings, setBookings] = useState([]);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [detailsOpen, setDetailsOpen] = useState(false);

  const toggleDetails = () => setDetailsOpen(!detailsOpen);

  // ================= FETCH DATA =================
  useEffect(() => {
    const fetchBookings = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("auth_token");

        if (activeType === "private") {
          const res = await api.get("/booking/private/find-all", {
            headers: { Authorization: `Bearer ${token}` },
          });

          const normalized = res.data.map((b) => ({
            id: b.id,
            bookingType: "private",
            tour: b.tour?.title || "—",
            name: b.booker?.fullName || "—",
            email: b.booker?.email || "—",
            phone: b.booker?.phoneNumber || "—",
            participants: b.bookingIndividuals || 0,
            amount: b.amount || 0,
            status: b.status,
            createdAt: b.createdAt,
            raw: b,
          }));

          setBookings(normalized);
        }

        if (activeType === "joiner") {
          const res = await api.get("/booking/joiner/find-all", {
            headers: { Authorization: `Bearer ${token}` },
          });

          const normalized = res.data.map((tour) => ({
            id: tour.id,
            bookingType: "joiner",
            tour: tour.title,
            participants: tour.joinerBookedSlots,
            amount: tour.joinerPrice,
            status: computeJoinerTourStatus(tour), // 🔥 changed
            createdAt: tour.createdAt,
            raw: tour,
          }));

          setBookings(normalized);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, [activeType]);

  // ================= STATUS UPDATE (LOCAL ONLY FOR NOW) =================
  // ================= PRIVATE UPDATE =================
  const updatePrivateStatus = async (id, status) => {
    try {
      await api.put(`/booking/private/update-status/${id}`, { status });

      setBookings((prev) =>
        prev.map((b) => (b.id === id ? { ...b, status } : b)),
      );

      setSelectedBooking((prev) => (prev ? { ...prev, status } : prev));
    } catch (err) {
      console.error(err);
    }
  };

  // ================= JOINER MASS UPDATE =================
  const updateJoinerStatus = async (tourId, status) => {
    console.log(tourId);
    try {
      await api.patch(`/booking/joiner/update-status-to-paid/${tourId}`, {
        status,
      });

      setBookings((prev) =>
        prev.map((b) => (b.id === tourId ? { ...b, status } : b)),
      );

      setSelectedBooking((prev) => (prev ? { ...prev, status } : prev));
    } catch (err) {
      console.error(err.response?.data);
    }
  };

  const formatPeso = (n) =>
    new Intl.NumberFormat("en-PH", {
      style: "currency",
      currency: "PHP",
      maximumFractionDigits: 0,
    }).format(n);

  const formatDateTime = (dateString) => {
    if (!dateString) return "—";

    return new Date(dateString).toLocaleString("en-PH", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const badgeColor = (status) => {
    switch (status) {
      case "request":
        return "secondary";
      case "approved":
        return "success";
      case "ongoing":
        return "primary";
      case "completed":
        return "dark";
      case "paid":
        return "success";
      case "cancelled":
      case "rejected":
        return "danger";
      case "refunded":
        return "warning";
      default:
        return "light";
    }
  };

  const filteredBookings = bookings.filter((b) =>
    filter === "all" ? true : b.status === filter,
  );

  return (
    <>
      <h3 className="fw-bold mb-4">Bookings Management</h3>

      {/* FILTER BAR */}
      <Row className="mb-4">
        <Col md="3">
          <label className="fw-semibold mb-1">Booking Type</label>
          <Input
            type="select"
            value={activeType}
            onChange={(e) => setActiveType(e.target.value)}
          >
            <option value="private">Private</option>
            <option value="joiner">Joiner</option>
          </Input>
        </Col>

        <Col md="3">
          <label className="fw-semibold mb-1">Status</label>
          <Input
            type="select"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          >
            <option value="all">All</option>
            <option value="request">Request</option>
            <option value="approved">Approved</option>
            <option value="ongoing">Ongoing</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
            <option value="rejected">Rejected</option>
            <option value="refunded">Refunded</option>
          </Input>
        </Col>
      </Row>

      {loading ? (
        <div className="text-center py-5">
          <Spinner />
        </div>
      ) : (
        <div className="table-responsive">
          <Table bordered hover>
            <thead className="table-light">
              <tr>
                <th>ID</th>

                <th>Tour</th>
                <th>Customer</th>
                <th>Pax</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Date</th>
                <th width="280">Actions</th>
              </tr>
            </thead>

            <tbody>
              {filteredBookings.length === 0 && (
                <tr>
                  <td colSpan="7" className="text-center text-muted">
                    No bookings found
                  </td>
                </tr>
              )}

              {filteredBookings.map((b) => (
                <tr key={b.id}>
                  <td>{b.id}</td>
                  <td>{b.tour}</td>

                  <td>
                    {b.bookingType === "private" ? (
                      <>
                        <div className="fw-semibold">{b.name}</div>
                        <div className="text-muted small">{b.email}</div>
                      </>
                    ) : (
                      <div className="fw-semibold text-primary">
                        Joiner Group
                      </div>
                    )}
                  </td>

                  <td>{b.participants}</td>
                  <td>{formatPeso(b.amount)}</td>

                  <td>
                    <Badge color={badgeColor(b.status)}>
                      {b.status?.toUpperCase()}
                    </Badge>
                  </td>
                  <td>{formatDateTime(b.createdAt)}</td>

                  <td>
                    <div className="d-flex gap-2 flex-wrap">
                      <Button
                        size="sm"
                        color="info"
                        onClick={() => {
                          setSelectedBooking(b);
                          setDetailsOpen(true);
                        }}
                      >
                        View
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>

          {/* DETAILS MODAL */}
          <Modal isOpen={detailsOpen} toggle={toggleDetails} size="lg">
            <ModalHeader toggle={toggleDetails}>Booking Details</ModalHeader>

            <ModalBody>
              {selectedBooking && (
                <>
                  <h5 className="fw-bold mb-3">Tour Information</h5>

                  <p>
                    <strong>Tour:</strong> {selectedBooking.tour}
                  </p>
                  <p>
                    <strong>Type:</strong> {selectedBooking.bookingType}
                  </p>
                  <p>
                    <strong>Status:</strong> {selectedBooking.status}
                  </p>
                  <p>
                    <strong>Amount:</strong>{" "}
                    {formatPeso(selectedBooking.amount)}
                  </p>
                  <p>
                    <strong>Participants:</strong>{" "}
                    {selectedBooking.participants}
                  </p>

                  <hr />

                  {selectedBooking.bookingType === "private" && (
                    <>
                      <h6 className="fw-bold">Booker Information</h6>
                      <p>
                        <strong>Name:</strong> {selectedBooking.name}
                      </p>
                      <p>
                        <strong>Email:</strong> {selectedBooking.email}
                      </p>
                      <p>
                        <strong>Phone:</strong> {selectedBooking.phone}
                      </p>
                      {/* PRIVATE ACTIONS */}
                      {/* {selectedBooking.status === "rejected" && (
                        <Button
                          color="warning"
                          className="me-2"
                          onClick={() =>
                            updatePrivateStatus(selectedBooking.id, "refunded")
                          }
                        >
                          Mark as Refunded
                        </Button>
                      )} */}

                      {selectedBooking.status === "approved" && (
                        <Button
                          color="success"
                          className="me-2"
                          onClick={() =>
                            updatePrivateStatus(selectedBooking.id, "paid")
                          }
                        >
                          Mark as Paid
                        </Button>
                      )}

                      {selectedBooking.status === "refunded" && (
                        <Button
                          color="secondary"
                          onClick={() =>
                            updatePrivateStatus(selectedBooking.id, "approved")
                          }
                        >
                          Undo
                        </Button>
                      )}
                    </>
                  )}

                  {selectedBooking.bookingType === "joiner" && (
                    <>
                      <h6 className="fw-bold mt-3">All Joiners</h6>
                      <Table bordered size="sm">
                        <thead>
                          <tr>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Phone</th>
                            <th>Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          {selectedBooking.raw.bookings.map((j) => (
                            <tr key={j.id}>
                              <td>{j.booker.fullName}</td>
                              <td>{j.booker.email}</td>
                              <td>{j.booker.phoneNumber}</td>
                              <td>{j.status}</td>
                            </tr>
                          ))}
                        </tbody>
                      </Table>
                      {/* JOINER ACTIONS */}
                      {selectedBooking.status === "cancelled" && (
                        <Button
                          color="warning"
                          className="me-2"
                          onClick={() =>
                            updateJoinerStatus(selectedBooking.id, "refunded")
                          }
                        >
                          Mark All Refunded
                        </Button>
                      )}

                      {selectedBooking.status === "completed" && (
                        <Button
                          color="success"
                          className="me-2"
                          onClick={() =>
                            updateJoinerStatus(selectedBooking.id, "paid")
                          }
                        >
                          Mark All Paid
                        </Button>
                      )}

                      {selectedBooking.status === "refunded" && (
                        <Button
                          color="secondary"
                          onClick={() =>
                            updateJoinerStatus(selectedBooking.id, "approved")
                          }
                        >
                          Undo
                        </Button>
                      )}
                    </>
                  )}
                </>
              )}
            </ModalBody>
          </Modal>
        </div>
      )}
    </>
  );
}
