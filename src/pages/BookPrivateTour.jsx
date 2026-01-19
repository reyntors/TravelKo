import React, { useMemo, useState } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  CardBody,
  CardImg,
  CardTitle,
  CardText,
  Form,
  FormGroup,
  Label,
  Input,
  Button,
} from "reactstrap";
import { useLocation, useNavigate } from "react-router-dom";
import { FaUser, FaCheckCircle } from "react-icons/fa";

// ✅ Helper: format money
const peso = (n) =>
  `₱${Number(n || 0).toLocaleString(undefined, { maximumFractionDigits: 0 })}`;

export default function BookPrivateTour() {
  const navigate = useNavigate();
  const location = useLocation();

  // ✅ Pass tour data via navigation state (see Tours button below)
  const tour = location.state?.tour || {
    id: "demo-pinatubo",
    title: "Mount Pinatubo Crater Lake Trek",
    subtitle: "Mount Pinatubo Crater Lake Trek",
    image:
      "https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=1600&q=80",
    price: 3500,
  };

  // ✅ Form state (ready for backend later)
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [bookingType, setBookingType] = useState("private"); // future: group
  const [selectedDate, setSelectedDate] = useState("");
  const [notes, setNotes] = useState("");
  const [agree, setAgree] = useState(false);

  // Demo dates (replace later from backend)
  const availableDates = useMemo(
    () => [
      "2024-02-15",
      "2024-02-22",
      "2024-03-05",
      "2024-03-12",
      "2024-04-10",
    ],
    []
  );

  const totalAmount = useMemo(() => {
    // later: compute based on pax, type, fees, etc.
    return tour.price;
  }, [tour.price]);

  const onSubmit = (e) => {
    e.preventDefault();

    // ✅ Demo validation (backend-ready)
    if (!fullName || !email || !phone) {
      alert("Please fill in your Full Name, Email, and Phone Number.");
      return;
    }
    if (!selectedDate) {
      alert("Please select a date.");
      return;
    }
    if (!agree) {
      alert("Please agree to the Terms and Conditions.");
      return;
    }

    // ✅ Demo success (later replace with API call)
    alert("✅ Booking submitted (demo). Ready for backend integration.");
    // navigate("/some-success-page");
  };

  return (
    <div style={{ background: "#F3F4F6", minHeight: "100vh", padding: "18px 0" }}>
      <Container>
        <Row className="justify-content-center">
          <Col xs="12" md="8" lg="5">
            <Card
              className="shadow-sm"
              style={{
                borderRadius: 16,
                overflow: "hidden",
                border: "1px solid #E5E7EB",
              }}
            >
              {/* HERO */}
              <div style={{ position: "relative" }}>
                <CardImg
                  top
                  src={tour.image}
                  alt={tour.title}
                  style={{
                    height: 170,
                    objectFit: "cover",
                    filter: "brightness(0.75)",
                  }}
                />

                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    padding: 18,
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "flex-end",
                    color: "white",
                  }}
                >
                  <div style={{ fontWeight: 900, fontSize: 22, lineHeight: 1.2 }}>
                    Book Your Private
                    <br />
                    Adventure
                  </div>
                  <div style={{ marginTop: 6, opacity: 0.95, fontSize: 14 }}>
                    {tour.subtitle || tour.title}
                  </div>
                </div>
              </div>

              <CardBody style={{ background: "#fff" }}>
                <Form onSubmit={onSubmit}>
                  {/* PERSONAL INFO */}
                  <div style={{ fontWeight: 900, fontSize: 16, marginBottom: 12 }}>
                    Personal Information
                  </div>

                  <FormGroup className="mb-3">
                    <Label className="fw-semibold">Full Name *</Label>
                    <Input
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="Enter your full name"
                    />
                  </FormGroup>

                  <FormGroup className="mb-3">
                    <Label className="fw-semibold">Email Address *</Label>
                    <Input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email address"
                    />
                  </FormGroup>

                  <FormGroup className="mb-4">
                    <Label className="fw-semibold">Phone Number *</Label>
                    <Input
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+63 92 345 6789"
                    />
                  </FormGroup>

                  {/* BOOKING DETAILS */}
                  <div style={{ fontWeight: 900, fontSize: 16, marginBottom: 12 }}>
                    Booking Details
                  </div>

                  <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 10 }}>
                    Booking Type *
                  </div>

                  {/* Booking Type Card (Private) */}
                  <div
                    role="button"
                    onClick={() => setBookingType("private")}
                    style={{
                      border: bookingType === "private"
                        ? "2px solid #16A34A"
                        : "1px solid #E5E7EB",
                      borderRadius: 14,
                      padding: 14,
                      width: "100%",
                      maxWidth: 240,
                      boxShadow:
                        bookingType === "private"
                          ? "0 8px 20px rgba(0,0,0,0.08)"
                          : "0 4px 12px rgba(0,0,0,0.06)",
                      cursor: "pointer",
                      marginBottom: 18,
                    }}
                  >
                    <div className="d-flex justify-content-between align-items-start">
                      <div
                        style={{
                          width: 34,
                          height: 34,
                          borderRadius: 999,
                          background: "#DCFCE7",
                          display: "grid",
                          placeItems: "center",
                          color: "#16A34A",
                        }}
                      >
                        <FaUser size={16} />
                      </div>

                      <div
                        style={{
                          width: 14,
                          height: 14,
                          borderRadius: 999,
                          border:
                            bookingType === "private"
                              ? "4px solid #16A34A"
                              : "2px solid #D1D5DB",
                          marginTop: 6,
                        }}
                      />
                    </div>

                    <div style={{ marginTop: 10, fontWeight: 900 }}>
                      Private Booking
                    </div>
                    <div style={{ marginTop: 6, fontSize: 12, color: "#6B7280" }}>
                      Exclusive experience just for you and your companions
                    </div>

                    <div style={{ marginTop: 10, color: "#16A34A", fontWeight: 900 }}>
                      {peso(tour.price)}
                    </div>
                    <div style={{ fontSize: 12, color: "#6B7280" }}>1–4 people</div>
                  </div>

                  {/* DATE */}
                  <FormGroup className="mb-3">
                    <Label className="fw-semibold">Select Date *</Label>
                    <Input
                      type="select"
                      value={selectedDate}
                      onChange={(e) => setSelectedDate(e.target.value)}
                    >
                      <option value="">Choose a date</option>
                      {availableDates.map((d) => (
                        <option key={d} value={d}>
                          {d}
                        </option>
                      ))}
                    </Input>
                  </FormGroup>

                  {/* NOTES */}
                  <FormGroup className="mb-2">
                    <Label className="fw-semibold">Special Requests or Notes</Label>
                    <Input
                      type="textarea"
                      value={notes}
                      onChange={(e) => setNotes(e.target.value.slice(0, 500))}
                      placeholder="Any dietary restrictions, medical conditions, or special requirements..."
                      style={{ minHeight: 110 }}
                    />
                  </FormGroup>
                  <div style={{ fontSize: 12, color: "#6B7280", marginBottom: 18 }}>
                    {notes.length}/500 Characters
                  </div>

                  {/* TERMS */}
                  <div className="d-flex align-items-start gap-2 mb-3">
                    <Input
                      type="checkbox"
                      checked={agree}
                      onChange={(e) => setAgree(e.target.checked)}
                      style={{ marginTop: 4 }}
                    />
                    <div style={{ fontSize: 13, color: "#374151" }}>
                      I hereby read and agree on the{" "}
                      <span style={{ textDecoration: "underline", cursor: "pointer" }}>
                        Terms and Conditions
                      </span>{" "}
                      stated by TravelKo
                      <div style={{ marginTop: 10, fontSize: 12, color: "#6B7280" }}>
                        For international hikes, all payments should be settled 30 days
                        before the hike date.
                      </div>
                    </div>
                  </div>

                  {/* SUMMARY */}
                  <div style={{ fontWeight: 900, fontSize: 16, margin: "18px 0 10px" }}>
                    Booking Summary
                  </div>

                  <div
                    style={{
                      borderTop: "1px solid #E5E7EB",
                      paddingTop: 12,
                      fontSize: 13,
                      color: "#111827",
                    }}
                  >
                    <Row className="gy-2">
                      <Col xs="4" style={{ color: "#6B7280" }}>
                        Tour:
                      </Col>
                      <Col xs="8" className="text-end fw-semibold">
                        {tour.title}
                      </Col>

                      <Col xs="4" style={{ color: "#6B7280" }}>
                        Type:
                      </Col>
                      <Col xs="8" className="text-end fw-semibold">
                        {bookingType === "private" ? "Private" : "Group"}
                      </Col>

                      <Col xs="4" style={{ color: "#6B7280" }}>
                        Date:
                      </Col>
                      <Col xs="8" className="text-end fw-semibold">
                        {selectedDate || "Not selected"}
                      </Col>
                    </Row>

                    <div style={{ borderTop: "1px solid #E5E7EB", margin: "14px 0" }} />

                    <div className="d-flex justify-content-between align-items-center">
                      <div style={{ fontWeight: 900, fontSize: 20 }}>Total Amount:</div>
                      <div style={{ fontWeight: 900, fontSize: 20, color: "#16A34A" }}>
                        {peso(totalAmount)}
                      </div>
                    </div>
                  </div>

                  {/* ACTION BUTTONS */}
                  <div className="d-grid gap-2 mt-4">
                    <Button
                      color="success"
                      size="lg"
                      className="fw-semibold"
                      style={{ borderRadius: 10 }}
                      type="submit"
                    >
                      Confirm Booking
                    </Button>

                    <Button
                      color="secondary"
                      outline
                      className="fw-semibold"
                      style={{ borderRadius: 10 }}
                      type="button"
                      onClick={() => navigate("/tours")}
                    >
                      Back to Tours
                    </Button>
                  </div>

                  {/* Small “demo-ready” hint */}
              
                </Form>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
}