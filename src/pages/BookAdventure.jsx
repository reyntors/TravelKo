import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Container,
  Row,
  Col,
  Card,
  CardBody,
  Button,
  Input,
  Label,
  FormGroup,
} from "reactstrap";
import {
  FaUsers,
  FaUserFriends,
  FaMoneyBillWave,
  FaUniversity,
} from "react-icons/fa";

/* ================= HELPERS ================= */

const formatDate = (date) => {
  if (!date) return "";
  return new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

/* ================= COMPONENT ================= */

function BookAdventure() {
  const navigate = useNavigate();
  const { state } = useLocation();

  const API_BASE =
    import.meta.env.VITE_API_BASE_URL || "https://api.travelko.site/";

  const token = localStorage.getItem("auth_token");

  /* ================= DATA FROM TOUR DETAILS ================= */

  const tourId = state?.tourId ? Number(state.tourId) : null;
  const tourTitle = state?.title || "Selected Tour";
  const tourImage = state?.image || "";
  const price = Number(state?.price || 0);
  const selectedDate = state?.selectedDate || null;

  /* ================= STATE ================= */

  const [bookingType, setBookingType] = useState("solo");
  const [people, setPeople] = useState(2);
  const [payment, setPayment] = useState("");
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phoneNumber: "",
    specialRequests: "",
  });

  /* ================= GUARD ================= */

  useEffect(() => {
    if (!tourId || !selectedDate) {
      alert("Invalid booking session. Please select a tour again.");
      navigate("/tours");
    }
  }, [tourId, selectedDate, navigate]);

  /* ================= HELPERS ================= */

  const totalAmount = bookingType === "group" ? price * people : price;

  const onChange = (key) => (e) =>
    setForm((p) => ({ ...p, [key]: e.target.value }));

  /* ================= SUBMIT BOOKING ================= */

  const handleConfirmBooking = async () => {
    if (!payment) {
      alert("Please select payment method");
      return;
    }

    setLoading(true);

    // ❗ tourId is now in the URL
    const payload = {
      bookingType: bookingType === "group" ? "joiner" : "private",
      bookingIndividuals: bookingType === "group" ? people : 1,
      bookingDateSelected: `${formatDate(
        selectedDate.start,
      )} – ${formatDate(selectedDate.end)}`,
      paymentMethod: payment,
      amountPaid: String(totalAmount),
      specialRequests: form.specialRequests,
      fullName: form.fullName,
      email: form.email,
      phoneNumber: form.phoneNumber,
    };

    console.log("🚀 BOOKING PAYLOAD:", payload);

    try {
      await axios.post(
        `${API_BASE}booking/${tourId}`, // ✅ TOUR-SPECIFIC ENDPOINT
        payload,
      );

      alert("✅ Booking successful!");
      navigate("/tours");
    } catch (err) {
      console.error(err);
      alert(err?.response?.data?.message || "Booking failed");
    } finally {
      setLoading(false);
    }
  };

  /* ================= UI ================= */

  return (
    <>
      {/* ================= HERO ================= */}
      <div
        style={{
          backgroundImage: `url(${tourImage})`,
          height: "300px",
          backgroundSize: "cover",
          backgroundPosition: "center",
          position: "relative",
        }}
        className="d-flex align-items-center text-white"
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "rgba(0,0,0,0.45)",
          }}
        />
        <Container style={{ position: "relative" }}>
          <h1 className="fw-bold">Book Your Adventure</h1>
          <p>{tourTitle}</p>
        </Container>
      </div>

      <Container className="my-5">
        <Row className="g-4">
          {/* LEFT */}
          <Col md="8">
            {/* PERSONAL INFO */}
            <Card className="mb-4 shadow-sm">
              <CardBody>
                <h5 className="fw-bold mb-3">Personal Information</h5>

                <FormGroup>
                  <Label>Full Name</Label>
                  <Input
                    value={form.fullName}
                    onChange={onChange("fullName")}
                    placeholder="Enter full name"
                  />
                </FormGroup>

                <FormGroup>
                  <Label>Email</Label>
                  <Input
                    type="email"
                    value={form.email}
                    onChange={onChange("email")}
                    placeholder="Enter email"
                  />
                </FormGroup>

                <FormGroup>
                  <Label>Phone Number</Label>
                  <Input
                    value={form.phoneNumber}
                    onChange={onChange("phoneNumber")}
                    placeholder="+639XXXXXXXXX"
                  />
                </FormGroup>
              </CardBody>
            </Card>

            {/* BOOKING TYPE */}
            <Card className="mb-4 shadow-sm">
              <CardBody>
                <h5 className="fw-bold mb-3">Booking Type</h5>

                <div
                  className={`p-3 rounded mb-3 ${
                    bookingType === "solo" ? "bg-success text-white" : "border"
                  }`}
                  onClick={() => setBookingType("solo")}
                >
                  <FaUsers /> Solo (₱{price})
                </div>

                <div
                  className={`p-3 rounded mb-3 ${
                    bookingType === "group" ? "bg-success text-white" : "border"
                  }`}
                  onClick={() => setBookingType("group")}
                >
                  <FaUserFriends /> Join a Group
                </div>

                {bookingType === "group" && (
                  <FormGroup>
                    <Label>Number of Individuals</Label>
                    <Input
                      type="select"
                      value={people}
                      onChange={(e) => setPeople(Number(e.target.value))}
                    >
                      {[2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((n) => (
                        <option key={n} value={n}>
                          {n}
                        </option>
                      ))}
                    </Input>
                  </FormGroup>
                )}

                <FormGroup>
                  <Label>Special Requests</Label>
                  <Input
                    type="textarea"
                    value={form.specialRequests}
                    onChange={onChange("specialRequests")}
                  />
                </FormGroup>
              </CardBody>
            </Card>

            {/* PAYMENT */}
            <Card className="shadow-sm">
              <CardBody>
                <h5 className="fw-bold mb-3">Payment</h5>

                <div
                  className={`p-3 mb-2 ${
                    payment === "gcash" ? "bg-success text-white" : "border"
                  }`}
                  onClick={() => setPayment("gcash")}
                >
                  <FaMoneyBillWave /> GCash
                </div>

                <div
                  className={`p-3 ${
                    payment === "bank" ? "bg-success text-white" : "border"
                  }`}
                  onClick={() => setPayment("bank")}
                >
                  <FaUniversity /> Bank Transfer
                </div>
              </CardBody>
            </Card>
          </Col>

          {/* SUMMARY */}
          <Col md="4">
            <Card className="shadow-sm sticky-top" style={{ top: 100 }}>
              <CardBody>
                <h5 className="fw-bold mb-3">Booking Summary</h5>

                <p className="fw-bold">{tourTitle}</p>

                <p>
                  <strong>Type:</strong>{" "}
                  {bookingType === "group"
                    ? `Joiner (${people} pax)`
                    : "Private / Solo"}
                </p>

                <p>
                  <strong>Date:</strong>{" "}
                  {selectedDate?.start && selectedDate?.end
                    ? `${formatDate(selectedDate.start)} – ${formatDate(selectedDate.end)}`
                    : "Not selected"}
                </p>

                <p>
                  <strong>Payment:</strong>{" "}
                  {payment ? payment.toUpperCase() : "Not selected"}
                </p>

                <hr />

                <h4 className="text-success fw-bold">
                  ₱{totalAmount.toLocaleString()}
                </h4>

                <Button
                  color="success"
                  className="w-100 mt-3"
                  disabled={loading}
                  onClick={handleConfirmBooking}
                >
                  {loading ? "Processing..." : "Confirm Booking"}
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
