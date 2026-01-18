import React from "react";
import {
  Container,
  Row,
  Col,
  Card,
  CardBody,
  Button,
  Form,
  FormGroup,
  Label,
  Input,
} from "reactstrap";

export default function Profile() {
  const green = "#16A34A";
  const border = "#E5E7EB";
  const muted = "#6B7280";

  const sectionTitle = {
    fontWeight: 800,
    marginBottom: 12,
  };

  const cardStyle = {
    borderRadius: 16,
    border: `1px solid ${border}`,
  };

  return (
    <Container fluid style={{ fontFamily: "Poppins" }}>
      {/* HEADER */}
      <Row className="mb-3 align-items-center">
        <Col>
          <h2 style={{ fontWeight: 900 }}>Profile Settings</h2>
          <p style={{ color: muted }}>
            Manage your personal and account information
          </p>
        </Col>

        <Col xs="auto">
          <Button
            style={{
              background: green,
              border: "none",
              borderRadius: 999,
              fontWeight: 700,
              padding: "10px 18px",
            }}
          >
            ✏️ Edit Profile
          </Button>
        </Col>
      </Row>

      {/* PROFILE INFORMATION */}
      <Card style={cardStyle} className="mb-4">
        <CardBody>
          <h5 style={sectionTitle}>Profile Information</h5>

          <Form>
            <Row className="g-3">
              <Col xs="12" md="6">
                <FormGroup>
                  <Label>First Name</Label>
                  <Input placeholder="John" />
                </FormGroup>
              </Col>

              <Col xs="12" md="6">
                <FormGroup>
                  <Label>Last Name</Label>
                  <Input placeholder="Doe" />
                </FormGroup>
              </Col>

              <Col xs="12" md="6">
                <FormGroup>
                  <Label>Email Address</Label>
                  <Input type="email" placeholder="john@email.com" />
                </FormGroup>
              </Col>

              <Col xs="12" md="6">
                <FormGroup>
                  <Label>Phone Number</Label>
                  <Input placeholder="+63 9XX XXX XXXX" />
                </FormGroup>
              </Col>

              <Col xs="12">
                <FormGroup>
                  <Label>Address</Label>
                  <Input placeholder="City, Province, Philippines" />
                </FormGroup>
              </Col>
            </Row>
          </Form>
        </CardBody>
      </Card>

      {/* PAYMENT & BANKING */}
      <Card style={cardStyle} className="mb-4">
        <CardBody>
          <h5 style={sectionTitle}>Payment & Banking Information</h5>

          <Form>
            <Row className="g-3">
              <Col xs="12" md="6">
                <FormGroup>
                  <Label>Bank Name</Label>
                  <Input placeholder="BDO / BPI / UnionBank" />
                </FormGroup>
              </Col>

              <Col xs="12" md="6">
                <FormGroup>
                  <Label>Account Name</Label>
                  <Input placeholder="John Doe" />
                </FormGroup>
              </Col>

              <Col xs="12">
                <FormGroup>
                  <Label>Bank Account Number</Label>
                  <Input placeholder="XXXX XXXX XXXX" />
                </FormGroup>
              </Col>

              <Col xs="12">
                <FormGroup>
                  <Label>GCash Number</Label>
                  <Input placeholder="09XX XXX XXXX" />
                </FormGroup>
              </Col>
            </Row>
          </Form>
        </CardBody>
      </Card>

      {/* ACCOUNT SETTINGS */}
      <Card style={cardStyle}>
        <CardBody>
          <h5 style={sectionTitle}>Account Settings</h5>

          <Row className="g-3">
            <Col xs="12" md="6">
              <FormGroup>
                <Label>Change Profile Picture</Label>
                <Input type="file" />
              </FormGroup>
            </Col>

            <Col xs="12" md="6">
              <FormGroup>
                <Label>Change Password</Label>
                <Input type="password" placeholder="New password" />
              </FormGroup>
            </Col>
          </Row>

          <div className="mt-4">
            <Button
              style={{
                background: green,
                border: "none",
                borderRadius: 10,
                fontWeight: 700,
                padding: "10px 20px",
              }}
            >
              Save Changes
            </Button>
          </div>
        </CardBody>
      </Card>
    </Container>
  );
}
