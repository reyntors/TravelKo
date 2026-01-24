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
  FaCheckCircle,
} from "react-icons/fa";

import { Modal, ModalBody } from "reactstrap";

import { QRCodeCanvas } from "qrcode.react";

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

  /* ================= DATA FROM PREVIOUS PAGE ================= */

  const tourId = state?.tourId ?? null;
  const parseAvailableDates = (availableDates) => {
    if (!Array.isArray(availableDates)) return [];

    return availableDates
      .map((item) => {
        let range = item;

        if (typeof item === "string") {
          try {
            range = JSON.parse(item);
          } catch {
            return null;
          }
        }

        if (!Array.isArray(range) || range.length < 2) return null;

        const start = new Date(range[0]);
        const end = new Date(range[range.length - 1]);

        if (isNaN(start.getTime()) || isNaN(end.getTime())) return null;

        return { start, end };
      })
      .filter(Boolean);
  };

  /* ================= STATE ================= */

  const [tour, setTour] = useState(null);
  const [loadingTour, setLoadingTour] = useState(true);

  const [bookingType, setBookingType] = useState("solo");
  const [people, setPeople] = useState(2);
  const [payment, setPayment] = useState("");
  const [loading, setLoading] = useState(false);
  const [dateRanges, setDateRanges] = useState([]);
  const [selectedDateIndex, setSelectedDateIndex] = useState(0);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [bookingRef, setBookingRef] = useState("");

  const selectedDate = dateRanges[selectedDateIndex] || null;

  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phoneNumber: "",
    specialRequests: "",
  });

  /* ================= GUARD ================= */

  useEffect(() => {
    if (!tourId) {
      alert("Invalid booking session. Please select a tour again.");
      navigate("/tours");
      return;
    }

    const fetchTour = async () => {
      try {
        const res = await axios.get(`${API_BASE}tours`);
        const allTours = res.data;

        const matchedTour = allTours.find((t) => t.id === tourId);

        if (!matchedTour) {
          alert("Tour not found.");
          navigate("/tours");
          return;
        }

        setTour(matchedTour);

        const parsed = parseAvailableDates(matchedTour.availableDates);
        setDateRanges(parsed);
        setSelectedDateIndex(0);
      } catch (err) {
        console.error("Failed to fetch tour", err);
        navigate("/tours");
      } finally {
        setLoadingTour(false);
      }
    };

    fetchTour();
  }, [tourId, navigate]);

  /* ================= HELPERS ================= */

  const onChange = (key) => (e) =>
    setForm((p) => ({ ...p, [key]: e.target.value }));

  const unitPrice =
    bookingType === "group"
      ? Number(tour?.joinerPrice || 0)
      : Number(tour?.privateBookingPrice || tour?.joinerPrice || 0);

  const totalAmount = bookingType === "group" ? unitPrice * people : unitPrice;

  /* ================= SUBMIT BOOKING ================= */

  const handleConfirmBooking = async () => {
    if (!agreeTerms) {
      alert("Please agree to the Terms and Conditions before proceeding.");
      return;
    }

    if (!payment) {
      alert("Please select payment method");
      return;
    }

    if (!selectedDate) {
      alert("Please select a date");
      return;
    }

    setLoading(true);

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

    try {
      await axios.post(`${API_BASE}booking/${tourId}`, payload);

      // ✅ show modal AFTER success
      setBookingRef(`BK-${Date.now()}`);
      setShowSuccess(true);
    } catch (err) {
      console.error(err);
      alert(err?.response?.data?.message || "Booking failed");
    } finally {
      setLoading(false);
    }
  };

  /* ================= LOADING ================= */

  if (loadingTour || !tour) {
    return <p className="text-center mt-5">Loading booking...</p>;
  }

  /* ================= UI ================= */

  return (
    <>
      {/* ================= HERO ================= */}
      <div
        style={{
          backgroundImage: `url(${tour.pictureUrls?.[0] || ""})`,
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
          <p>{tour.title}</p>
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
                    placeholder="Enter your fullname"
                  />
                </FormGroup>

                <FormGroup>
                  <Label>Email</Label>
                  <Input
                    type="email"
                    value={form.email}
                    onChange={onChange("email")}
                    placeholder="Enter your email"
                  />
                </FormGroup>

                <FormGroup>
                  <Label>Contact Number</Label>
                  <Input
                    value={form.phoneNumber}
                    onChange={onChange("phoneNumber")}
                    placeholder="Enter your number"
                  />
                </FormGroup>
              </CardBody>
            </Card>

            {/*SELECT A DATE*/}
            <Card className="mb-4 shadow-sm">
              <CardBody>
                <h5 className="fw-bold mb-3">Available Dates</h5>

                {dateRanges.length === 0 ? (
                  <p className="text-muted">No available dates</p>
                ) : (
                  <>
                    <Label className="fw-semibold mb-2">
                      Select your preferred date
                    </Label>

                    <Input
                      type="select"
                      value={selectedDateIndex}
                      onChange={(e) =>
                        setSelectedDateIndex(Number(e.target.value))
                      }
                    >
                      {dateRanges.map((range, index) => (
                        <option key={index} value={index}>
                          {formatDate(range.start)} – {formatDate(range.end)}
                        </option>
                      ))}
                    </Input>

                    <div className="mt-3 text-success fw-semibold">
                      Selected:
                      <br />
                      {formatDate(selectedDate.start)} –{" "}
                      {formatDate(selectedDate.end)}
                    </div>
                  </>
                )}
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
                  <FaUsers /> Private / Solo (₱{tour.privateBookingPrice})
                </div>

                <div
                  className={`p-3 rounded mb-3 ${
                    bookingType === "group" ? "bg-success text-white" : "border"
                  }`}
                  onClick={() => setBookingType("group")}
                >
                  <FaUserFriends /> Join a Group (₱{tour.joinerPrice})
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

                <p className="fw-bold">{tour.title}</p>

                <p>
                  <strong>Type:</strong>{" "}
                  {bookingType === "group"
                    ? `Joiner (${people} pax)`
                    : "Private / Solo"}
                </p>

                <p>
                  <strong>Date:</strong>{" "}
                  {selectedDate
                    ? `${formatDate(selectedDate.start)} – ${formatDate(
                        selectedDate.end,
                      )}`
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
                  disabled={loading || !agreeTerms}
                  onClick={handleConfirmBooking}
                >
                  {loading ? "Processing..." : "Confirm Booking"}
                </Button>
              </CardBody>
            </Card>
          </Col>
          {/* TERMS & CONDITIONS */}
          <Card className="mb-4 shadow-sm">
            <CardBody>
              <FormGroup check>
                <Input
                  type="checkbox"
                  checked={agreeTerms}
                  onChange={(e) => setAgreeTerms(e.target.checked)}
                />
                <Label check className="ms-2">
                  I hereby read and agree on the{" "}
                  <span className="text-success fw-semibold">
                    Terms and Conditions
                  </span>{" "}
                  stated by Travelko
                </Label>
              </FormGroup>

              <p
                className="text-muted mt-2 mb-0"
                style={{ fontSize: "0.85rem" }}
              >
                For international Adventure Tours, all payments should be
                settled
                <strong> 30 days before </strong>
                the adventure date.
              </p>
            </CardBody>
          </Card>
        </Row>
      </Container>

      <Modal isOpen={showSuccess} centered backdrop="static" keyboard={false}>
        <ModalBody className="text-center p-5">
          {/* ICON */}
          <FaCheckCircle size={80} className="text-success mb-3" />

          {/* TITLE */}
          <h4 className="fw-bold mb-2">Request has been sent!</h4>

          <p className="text-muted mb-4">
            We will review your request within <strong>24 hours</strong>
          </p>

          {/* QR PLACEHOLDER */}
          <div className="d-flex justify-content-center mb-3">
            <QRCodeCanvas
              value={`https://travelko.site/booking/${bookingRef}`}
              size={140}
              bgColor="#ffffff"
              fgColor="#000000"
              level="H"
              includeMargin
            />
          </div>

          <p className="text-muted" style={{ fontSize: "0.85rem" }}>
            Scan for booking details
          </p>

          <p className="fw-semibold text-success">Reference: {bookingRef}</p>

          <p className="text-muted" style={{ fontSize: "0.85rem" }}>
            Scan for booking details
          </p>

          {/* ACTION BUTTONS */}
          <div className="d-flex justify-content-center gap-3 mt-4">
            <Button
              color="success"
              onClick={() => {
                setShowSuccess(false);
                navigate("/tours");
              }}
            >
              Browse More Tours
            </Button>

            <Button
              color="secondary"
              outline
              onClick={() => setShowSuccess(false)}
            >
              Close
            </Button>
          </div>
        </ModalBody>
      </Modal>
    </>
  );
}

export default BookAdventure;
