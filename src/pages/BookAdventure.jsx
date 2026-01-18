import { useState } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  CardBody,
  Button,
  Input,
  Label,
  FormGroup
} from "reactstrap";
import {
  FaUsers,
  FaUserFriends,
  FaMoneyBillWave,
  FaUniversity
} from "react-icons/fa";
import tour1 from "../assets/tour1.jpg";

const tour = {
  title: "Mount Pinatubo Crater Lake Trek",
  description: "A breathtaking trek to the iconic crater lake.",
  image: tour1,
  price: 3500,
};

function BookAdventure() {
  const [bookingType, setBookingType] = useState("solo");
  const [people, setPeople] = useState(2);
  const [date, setDate] = useState("");
  const [payment, setPayment] = useState("");

  const totalAmount =
    bookingType === "group" ? tour.price * people : tour.price;

  return (
    <>
      {/* HERO */}
      <div
        style={{
          backgroundImage: `url(${tour.image})`,
          height: "300px",
          backgroundSize: "cover",
          backgroundPosition: "center"
        }}
        className="d-flex align-items-center text-white"
      >
        <Container>
          <h1 className="fw-bold">Book Your Adventure</h1>
          <p>{tour.description}</p>
        </Container>
      </div>

      <Container className="my-5">
        <Row className="g-4">
          {/* LEFT SIDE */}
          <Col md="8">
            {/* PERSONAL INFO */}
            <Card className="mb-4 shadow-sm">
              <CardBody>
                <h5 className="fw-bold mb-3">Personal Information</h5>

                <FormGroup>
                  <Label>Full Name</Label>
                  <Input placeholder="Enter full name" />
                </FormGroup>

                <FormGroup>
                  <Label>Email Address</Label>
                  <Input type="email" placeholder="Enter email" />
                </FormGroup>

                <FormGroup>
                  <Label>Phone Number</Label>
                  <Input placeholder="09XXXXXXXXX" />
                </FormGroup>
              </CardBody>
            </Card>

            {/* BOOKING DETAILS */}
            <Card className="mb-4 shadow-sm">
              <CardBody>
                <h5 className="fw-bold mb-3">Booking Details</h5>

                {/* SOLO */}
                <div
                  className={`p-3 rounded mb-3 d-flex align-items-center ${
                    bookingType === "solo"
                      ? "bg-success text-white"
                      : "border"
                  }`}
                  style={{ cursor: "pointer" }}
                  onClick={() => setBookingType("solo")}
                >
                  <div className="bg-white text-success rounded-circle p-2 me-3">
                    <FaUsers />
                  </div>
                  <div>
                    <strong>Solo</strong>
                    <p className="mb-0 small">
                      Enjoy a private and personalized adventure
                    </p>
                    <small>₱{tour.price} · 1 person</small>
                  </div>
                </div>

                {/* GROUP */}
                <div
                  className={`p-3 rounded mb-3 d-flex align-items-center ${
                    bookingType === "group"
                      ? "bg-success text-white"
                      : "border"
                  }`}
                  style={{ cursor: "pointer" }}
                  onClick={() => setBookingType("group")}
                >
                  <div className="bg-white text-success rounded-circle p-2 me-3">
                    <FaUserFriends />
                  </div>
                  <div>
                    <strong>Join a Group</strong>
                    <p className="mb-0 small">
                      Share the experience with other adventurous travelers
                    </p>
                    <small>₱{tour.price} · 2–12 people</small>
                  </div>
                </div>

                {/* PEOPLE */}
                <FormGroup>
                  <Label>
                    <FaUserFriends className="me-2" /> Number of Individuals
                  </Label>
                  <Input
                    type="select"
                    value={people}
                    disabled={bookingType !== "group"}
                    onChange={(e) => setPeople(Number(e.target.value))}
                  >
                    {[2,3,4,5,6,7,8,9,10,11,12].map((n) => (
                      <option key={n} value={n}>
                        {n}
                      </option>
                    ))}
                  </Input>
                </FormGroup>

                {/* DATE */}
                <FormGroup>
                  <Label>Select Date</Label>
                  <Input
                    type="select"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                  >
                    <option value="">Choose date</option>
                    <option>May 7–10, 2026</option>
                    <option>June 12–15, 2026</option>
                    <option>July 20–23, 2026</option>
                  </Input>
                </FormGroup>
              </CardBody>
            </Card>

            {/* PAYMENT */}
            <Card className="shadow-sm">
              <CardBody>
                <h5 className="fw-bold mb-3">Payment Method</h5>

                <div
                  className={`p-3 rounded mb-2 d-flex align-items-center ${
                    payment === "gcash"
                      ? "bg-success text-white"
                      : "border"
                  }`}
                  style={{ cursor: "pointer" }}
                  onClick={() => setPayment("gcash")}
                >
                  <FaMoneyBillWave className="me-3" />
                  GCash
                </div>

                <div
                  className={`p-3 rounded d-flex align-items-center ${
                    payment === "bank"
                      ? "bg-success text-white"
                      : "border"
                  }`}
                  style={{ cursor: "pointer" }}
                  onClick={() => setPayment("bank")}
                >
                  <FaUniversity className="me-3" />
                  Bank Transfer
                </div>

                <FormGroup className="mt-3">
                  <Label>Special Requests / Notes</Label>
                  <Input
                    type="textarea"
                    placeholder="Any special requests or notes..."
                  />
                </FormGroup>
              </CardBody>
            </Card>
          </Col>

          {/* RIGHT SUMMARY */}
          <Col md="4">
            <Card className="shadow-sm sticky-top" style={{ top: "100px" }}>
              <CardBody>
                <h5 className="fw-bold mb-3">Booking Summary</h5>

                <p><strong>Tour:</strong> {tour.title}</p>
                <p>
                  <strong>Type:</strong>{" "}
                  {bookingType === "solo"
                    ? "Solo"
                    : `Group (${people} pax)`}
                </p>
                <p><strong>Date:</strong> {date || "Not selected"}</p>
                <p><strong>Payment:</strong> {payment || "Not selected"}</p>

                <hr />

                <h5 className="fw-bold text-success">
                  Total: ₱{totalAmount.toLocaleString()}
                </h5>

                <Button color="success" className="w-100 mt-3">
                  Confirm Booking
                </Button>

                <Button outline color="secondary" className="w-100 mt-2">
                  Back to Tours
                </Button>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
}

export default BookAdventure;
