import { useState } from "react";
import { Table, Badge, Button, Input, Row, Col } from "reactstrap";

export default function AdminTourBookingsApplications() {
  const [filter, setFilter] = useState("all");

  const [bookings, setBookings] = useState([
    {
      id: 1,
      tour: "Mt. Apo Climb",
      name: "Maria Santos",
      email: "maria@email.com",
      phone: "09123400000",
      status: "Paid",
    },
    {
      id: 2,
      tour: "Mt. Apo Climb",
      name: "John Cruz",
      email: "john@email.com",
      phone: "0999999999",
      status: "Cancelled",
    },
  ]);

  const updateStatus = (id, newStatus) => {
    setBookings((prev) =>
      prev.map((b) => (b.id === id ? { ...b, status: newStatus } : b)),
    );
  };

  const filteredBookings =
    filter === "all"
      ? bookings
      : bookings.filter((b) => b.status.toLowerCase() === filter.toLowerCase());

  const badgeColor = (status) => {
    switch (status) {
      case "Paid":
        return "success";
      case "Cancelled":
        return "danger";
      case "Refunded":
        return "warning";
      default:
        return "secondary";
    }
  };

  return (
    <>
      <h3 className="fw-bold mb-4">Tour Management</h3>

      {/* 🔥 CLEAN FILTER BAR */}
      <Row className="mb-4">
        <Col md="3">
          <label className="fw-semibold mb-1">Filter Status</label>
          <Input
            type="select"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          >
            <option value="all">All</option>
            <option value="paid">Paid</option>
            <option value="cancelled">Cancelled</option>
            <option value="refunded">Refunded</option>
          </Input>
        </Col>
      </Row>

      {/* 🔥 PROFESSIONAL TABLE */}
      <div className="table-responsive">
        <Table bordered hover>
          <thead className="table-light">
            <tr>
              <th>ID</th>
              <th>Tour</th>
              <th>Customer</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Status</th>
              <th width="250">Actions</th>
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
                  <div className="fw-semibold">{b.name}</div>
                  <div className="text-muted small">{b.email}</div>
                </td>
                <td>{b.email}</td>
                <td>{b.phone}</td>
                <td>
                  <Badge color={badgeColor(b.status)}>{b.status}</Badge>
                </td>
                <td>
                  <div className="d-flex gap-2 flex-wrap">
                    {b.status !== "Paid" && (
                      <Button
                        size="sm"
                        color="success"
                        onClick={() => updateStatus(b.id, "Paid")}
                      >
                        Mark Paid
                      </Button>
                    )}

                    {b.status !== "Cancelled" && (
                      <Button
                        size="sm"
                        color="danger"
                        onClick={() => updateStatus(b.id, "Cancelled")}
                      >
                        Cancel
                      </Button>
                    )}

                    {b.status === "Paid" && (
                      <Button
                        size="sm"
                        color="warning"
                        onClick={() => updateStatus(b.id, "Refunded")}
                      >
                        Refund
                      </Button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
    </>
  );
}
