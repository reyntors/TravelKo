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
  return (
    <>
      <h3 className="fw-bold mb-3">Tour Bookings</h3>

      {bookings.map((b) => (
        <Card key={b.id} className="mb-3 shadow-sm">
          <CardBody>
            <h6>{b.tour}</h6>

            <p>
              <strong>Name:</strong> {b.name}
            </p>
            <p>
              <strong>Email:</strong> {b.email}
            </p>
            <p>
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
