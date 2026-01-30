import { useParams } from "react-router-dom";
import { Card, CardBody, Row, Col, Button } from "reactstrap";

export default function CoordinatorDetails() {
  const { id } = useParams();

  // ✅ Dummy coordinator data
  const coordinator = {
    id,
    name: "Juan Dela Cruz",
    email: "juan@email.com",
    phone: "09123456789",
    status: "Active",
  };

  const tours = [
    { id: 1, title: "Mt. Apo Climb", bookings: 12, revenue: 24000 },
    { id: 2, title: "Dahican Surf Camp", bookings: 8, revenue: 16000 },
  ];

  const totalRevenue = tours.reduce((sum, t) => sum + t.revenue, 0);

  return (
    <>
      <h3 className="fw-bold mb-3">Coordinator Details</h3>

      {/* ACCOUNT DETAILS */}
      <Card className="mb-4 shadow-sm">
        <CardBody>
          <h5>Account Information</h5>
          <p>
            <strong>Name:</strong> {coordinator.name}
          </p>
          <p>
            <strong>Email:</strong> {coordinator.email}
          </p>
          <p>
            <strong>Phone:</strong> {coordinator.phone}
          </p>
          <p>
            <strong>Status:</strong> {coordinator.status}
          </p>

          <Button color="danger" size="sm">
            Delete Coordinator
          </Button>
        </CardBody>
      </Card>

      {/* TOURS */}
      <Card className="shadow-sm">
        <CardBody>
          <h5>All Tours</h5>

          {tours.map((t) => (
            <Row key={t.id} className="border-bottom py-2">
              <Col>{t.title}</Col>
              <Col>Bookings: {t.bookings}</Col>
              <Col>₱{t.revenue.toLocaleString()}</Col>
            </Row>
          ))}

          <hr />
          <h6 className="fw-bold">
            Total Revenue: ₱{totalRevenue.toLocaleString()}
          </h6>
        </CardBody>
      </Card>
    </>
  );
}
