import { Row, Col, Card, CardBody } from "reactstrap";

export default function AdminDashboard() {
  const stats = [
    { title: "Total Coordinators", value: 8 },
    { title: "Pending Applications", value: 2 },
    { title: "Active Tours", value: 21 },
    { title: "Total Bookings", value: 134 },
  ];

  return (
    <>
      <h2 className="fw-bold mb-4">Admin Dashboard</h2>

      <Row>
        {stats.map((s, i) => (
          <Col md="3" key={i}>
            <Card className="shadow-sm">
              <CardBody>
                <h6 className="text-muted">{s.title}</h6>
                <h2 className="fw-bold">{s.value}</h2>
              </CardBody>
            </Card>
          </Col>
        ))}
      </Row>
    </>
  );
}
