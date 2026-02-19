import { useState } from "react";
import { Card, CardBody, Button, Badge } from "reactstrap";

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
      <h3 className="fw-bold mb-3">Bookings Management</h3>

      {/* ===== FILTER BUTTONS ===== */}
      <div className="d-flex gap-2 mb-4">
        <Button
          size="sm"
          color={filter === "all" ? "dark" : "secondary"}
          onClick={() => setFilter("all")}
        >
          All
        </Button>

        <Button
          size="sm"
          color={filter === "paid" ? "success" : "secondary"}
          onClick={() => setFilter("paid")}
        >
          Paid
        </Button>

        <Button
          size="sm"
          color={filter === "cancelled" ? "danger" : "secondary"}
          onClick={() => setFilter("cancelled")}
        >
          Cancelled
        </Button>

        <Button
          size="sm"
          color={filter === "refunded" ? "warning" : "secondary"}
          onClick={() => setFilter("refunded")}
        >
          Refunded
        </Button>
      </div>

      {/* ===== BOOKINGS LIST ===== */}
      {filteredBookings.length === 0 && (
        <p className="text-muted">No bookings found.</p>
      )}

      {filteredBookings.map((b) => (
        <Card key={b.id} className="mb-3 shadow-sm">
          <CardBody>
            <h6 className="fw-bold">{b.tour}</h6>

            <p className="mb-1">
              <strong>Name:</strong> {b.name}
            </p>
            <p className="mb-1">
              <strong>Email:</strong> {b.email}
            </p>
            <p className="mb-2">
              <strong>Phone:</strong> {b.phone}
            </p>

            {/* STATUS BADGE */}
            <Badge color={badgeColor(b.status)} className="me-2">
              {b.status}
            </Badge>

            {/* ACTION BUTTONS */}
            <div className="mt-3 d-flex gap-2 flex-wrap">
              {b.status !== "Paid" && (
                <Button
                  size="sm"
                  color="success"
                  onClick={() => updateStatus(b.id, "Paid")}
                >
                  Mark as Paid
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
          </CardBody>
        </Card>
      ))}
    </>
  );
}
