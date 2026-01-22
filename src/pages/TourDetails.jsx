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

export default function BookAdventure() {
  const navigate = useNavigate();
  const { state } = useLocation();

  const API_BASE =
    import.meta.env.VITE_API_BASE_URL || "https://api.travelko.site/";

  const token = localStorage.getItem("auth_token");

  // ONLY TOUR ID COMES FROM STATE
  const tourId = state?.tourId;
  const selectedDate = state?.selectedDate || null;

  /* ================= STATE ================= */

  const [tour, setTour] = useState(null);
  const [loadingTour, setLoadingTour] = useState(true);

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

  /* ================= FETCH TOUR (FROM /tours) ================= */

  useEffect(() => {
    if (!tourId) {
      alert("Invalid booking session");
      navigate("/tours");
      return;
    }

    const fetchTour = async () => {
      try {
        // 🔑 THIS IS THE IMPORTANT PART
        const res = await axios.get(`${API_BASE}tours`);
        const allTours = res.data;

        const matchedTour = allTours.find(
          (t) => t._id === tourId || t.id === tourId,
        );

        if (!matchedTour) {
          alert("Tour not found");
          navigate("/tours");
          return;
        }

        setTour(matchedTour);
      } catch (err) {
        console.error("Failed to load tours", err);
        alert("Failed to load booking info");
        navigate("/tours");
      } finally {
        setLoadingTour(false);
      }
    };

    fetchTour();
  }, [tourId, navigate]);

  /* ================= GUARDS ================= */

  if (loadingTour) {
    return <p className="text-center mt-5">Loading booking details…</p>;
  }

  if (!tour) {
    return <p className="text-center mt-5">Tour not found</p>;
  }

  /* ================= PRICE LOGIC ================= */

  const unitPrice =
    bookingType === "group"
      ? Number(tour.joinerPrice)
      : Number(tour.privateBookingPrice || tour.joinerPrice);

  const totalAmount = bookingType === "group" ? unitPrice * people : unitPrice;

  const onChange = (key) => (e) =>
    setForm((p) => ({ ...p, [key]: e.target.value }));

  /* ================= CREATE BOOKING ================= */

  const handleConfirmBooking = async () => {
    if (!payment) {
      alert("Please select payment method");
      return;
    }

    setLoading(true);

    const payload = {
      bookingType: bookingType === "group" ? "joiner" : "private",
      bookingIndividuals: bookingType === "group" ? people : 1,
      bookingDateSelected: selectedDate
        ? `${formatDate(selectedDate.start)} – ${formatDate(selectedDate.end)}`
        : "Not selected",
      paymentMethod: payment,
      amountPaid: String(totalAmount),
      specialRequests: form.specialRequests,
      fullName: form.fullName,
      email: form.email,
      phoneNumber: form.phoneNumber,
    };

    try {
      await axios.post(`${API_BASE}booking/${tour._id}`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

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
      {/* HERO */}
      <div
        style={{
          backgroundImage: `url(${tour.pictureUrls?.[0] || ""})`,
          height: "300px",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
        className="d-flex align-items-center text-white"
      >
        <Container>
          <h1 className="fw-bold">Book Your Adventure</h1>
          <p>{tour.title}</p>
        </Container>
      </div>

      <Container className="my-5">
        <Row className="g-4">
          {/* LEFT */}
          <Col md="8">
            <Card className="mb-4 shadow-sm">
              <CardBody>
                <h5 className="fw-bold mb-3">Personal Information</h5>

                <FormGroup>
                  <Label>Full Name</Label>
                  <Input
                    value={form.fullName}
                    onChange={onChange("fullName")}
                  />
                </FormGroup>

                <FormGroup>
                  <Label>Email</Label>
                  <Input
                    type="email"
                    value={form.email}
                    onChange={onChange("email")}
                  />
                </FormGroup>

                <FormGroup>
                  <Label>Phone Number</Label>
                  <Input
                    value={form.phoneNumber}
                    onChange={onChange("phoneNumber")}
                  />
                </FormGroup>
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
