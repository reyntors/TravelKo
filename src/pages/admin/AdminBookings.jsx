import { useState } from "react";
import { Card, CardBody, Button, Badge } from "reactstrap";

const bookings = [
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
];

export default function AdminBookings() {
  const [filter, setFilter] = useState("all");

  const filteredBookings =
    filter === "all"
      ? bookings
      : bookings.filter((b) => b.status.toLowerCase() === filter.toLowerCase());

  return (
    <>
      <h3 className="fw-bold mb-3">Tour Bookings</h3>

      {/* ===== FILTER CONTROLS ===== */}
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

            <Badge color={b.status === "Paid" ? "success" : "danger"}>
              {b.status}
            </Badge>
          </CardBody>
        </Card>
      ))}
    </>
  );
}
