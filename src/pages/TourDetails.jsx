import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { Container, Row, Col, Button, Card, CardBody, Badge } from "reactstrap";
import {
  FaStar,
  FaMapMarkerAlt,
  FaChevronLeft,
  FaChevronRight,
  FaUser,
  FaPhone,
} from "react-icons/fa";

/* ================= HELPERS ================= */

const normalizeArray = (value) => {
  if (!value) return [];

  if (Array.isArray(value)) return value;

  if (typeof value === "string") {
    try {
      const parsed = JSON.parse(value);
      if (Array.isArray(parsed)) return parsed;
    } catch {
      return value
        .split(/,|\n/)
        .map((v) => v.trim())
        .filter(Boolean);
    }
  }

  return [];
};

const formatDate = (date) =>
  date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

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

const formatRange = (range) =>
  `${formatDate(range.start)} – ${formatDate(range.end)}`;

/* ================= COMPONENT ================= */

export default function AdventureDetails() {
  const [coordinator, setCoordinator] = useState(null);
  const { id } = useParams();
  const navigate = useNavigate();

  const API_BASE =
    import.meta.env.VITE_API_BASE_URL || "https://api.travelko.site/";

  const [tour, setTour] = useState(null);
  const [loading, setLoading] = useState(true);
  const [imageIndex, setImageIndex] = useState(0);
  // const [selectedDateIndex, setSelectedDateIndex] = useState(0);

  /* ================= FETCH TOUR ================= */

  useEffect(() => {
    const fetchTour = async () => {
      try {
        // 1️⃣ get single tour (details)
        const res = await axios.get(`${API_BASE}tours/${id}`);
        const tourDetails = res.data;

        // 2️⃣ get all tours (with createdBy.phoneNumber)
        const res2 = await axios.get(`${API_BASE}tours`);
        const allTours = res2.data;

        // 3️⃣ find matching tour
        const matchedTour = allTours.find((t) => t._id === tourDetails._id);

        // 4️⃣ extract coordinator phone
        const coordinator = matchedTour?.createdBy || null;

        setTour({
          ...tourDetails,
          packageInclusions: normalizeArray(tourDetails.packageInclusions),
          itinerary: normalizeArray(tourDetails.itinerary),
          thingsToBring: normalizeArray(tourDetails.thingsToBring),
          coordinator, // ✅ attach coordinator here
        });
      } catch (err) {
        console.error("Failed to load tour", err);
      } finally {
        setLoading(false);
      }
    };

    fetchTour();
  }, [id]);

  if (loading) {
    return <p className="text-center mt-5">Loading tour...</p>;
  }

  if (!tour) {
    return <p className="text-center mt-5">Tour not found</p>;
  }

  const dateRanges = parseAvailableDates(tour.availableDates);

  const images = tour.pictureUrls || [];

  const nextImage = () => setImageIndex((p) => (p + 1) % images.length);
  const prevImage = () =>
    setImageIndex((p) => (p - 1 + images.length) % images.length);

  /* ================= UI ================= */

  return (
    <>
      {/* ================= HERO ================= */}
      <div
        style={{
          backgroundImage: `url(${images[0]})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          padding: "120px 0",
          color: "#fff",
        }}
      >
        <Container>
          <Badge color="success" pill className="mb-2 px-3 py-2">
            {tour.category}
          </Badge>

          <h1 className="fw-bold">{tour.title}</h1>

          <div className="d-flex gap-3 mt-2">
            <span>
              <FaStar className="text-warning" /> 4.8 (124)
            </span>
            <span>
              <FaMapMarkerAlt /> {tour.address}
            </span>
          </div>
        </Container>
      </div>

      <Container className="my-5">
        {/* ================= GALLERY ================= */}
        <h4 className="fw-bold">Gallery</h4>
        <Row className="mb-5">
          <Col className="text-center position-relative">
            <img
              src={images[imageIndex]}
              alt="Gallery"
              className="img-fluid rounded shadow"
              style={{ maxHeight: 300, objectFit: "cover" }}
            />

            {images.length > 1 && (
              <>
                <Button
                  color="success"
                  className="position-absolute top-50 start-0 translate-middle-y"
                  onClick={prevImage}
                >
                  <FaChevronLeft />
                </Button>

                <Button
                  color="success"
                  className="position-absolute top-50 end-0 translate-middle-y"
                  onClick={nextImage}
                >
                  <FaChevronRight />
                </Button>
              </>
            )}
          </Col>
        </Row>

        {/* ================= ABOUT ================= */}
        <Row className="mb-5">
          <Col>
            <h4 className="fw-bold">About this tour</h4>
            <p>{tour.details}</p>
          </Col>
        </Row>

        {/* ================= ITINERARY ================= */}
        <Row className="mb-5">
          <Col>
            <h4 className="fw-bold mb-3">Itinerary</h4>

            {tour.itinerary?.map((item, idx) => (
              <div key={idx} className="d-flex gap-3 mb-2">
                <Badge color="success" pill>
                  Day {idx + 1}
                </Badge>
                <span>{item}</span>
              </div>
            ))}
          </Col>
        </Row>

        {/* ================= REVIEWS ================= */}
        <Row className="mb-5">
          <Col>
            <div className="d-flex justify-content-between align-items-center">
              <h4 className="fw-bold">Reviews & Comments</h4>
              <Button color="success" size="sm">
                + Leave Review
              </Button>
            </div>

            <Card className="mt-3 shadow-sm">
              <CardBody>
                <strong>Mary Grace Gallardo</strong>{" "}
                <Badge color="success">Verified</Badge>
                <div className="text-warning mt-1">
                  <FaStar /> <FaStar /> <FaStar /> <FaStar /> <FaStar />
                </div>
                <p className="mt-2">
                  Amazing experience! The coordinator was very professional.
                </p>
              </CardBody>
            </Card>
          </Col>
        </Row>

        {/* ================= AVAILABLE DATES ================= */}
        {/* <Row className="mb-5">
          <Col>
            <h4 className="fw-bold">Available Dates</h4>

            <Card className="mt-3">
              <CardBody>
                {dateRanges.length === 0 ? (
                  <p className="text-muted">No available dates</p>
                ) : (
                  <>
                    <label className="fw-semibold mb-2">
                      Select your preferred date
                    </label>

                    <select
                      className="form-select"
                      value={selectedDateIndex}
                      onChange={(e) =>
                        setSelectedDateIndex(Number(e.target.value))
                      }
                    >
                      {dateRanges.map((range, index) => (
                        <option key={index} value={index}>
                          {formatRange(range)}
                        </option>
                      ))}
                    </select>

                    <div className="mt-3 text-success fw-semibold">
                      Selected:
                      <br />
                      {formatRange(dateRanges[selectedDateIndex])}
                    </div>
                  </>
                )}
              </CardBody>
            </Card>
          </Col>
        </Row> */}

        {/* ================= INCLUDED / BRING ================= */}
        <Row className="mb-5">
          <Col md="6">
            <h5 className="fw-bold">What’s included</h5>
            <ul>
              {tour.packageInclusions?.map((i, idx) => (
                <li key={idx}>{i}</li>
              ))}
            </ul>
          </Col>

          <Col md="6">
            <h5 className="fw-bold">Things to bring (Optional)</h5>
            <ul>
              {tour.thingsToBring?.map((i, idx) => (
                <li key={idx}>{i}</li>
              ))}
            </ul>
          </Col>
        </Row>

        {/* ================= COORDINATOR ================= */}
        <Row className="mb-4">
          <Col>
            <h4 className="fw-bold">Coordinator</h4>

            <p className="mb-1">
              <FaUser className="me-2" />
              {tour.coordinator?.businessName || "Adventure Pro Tour"}
            </p>

            <p>
              <FaPhone className="me-2" />
              {tour.coordinator?.phoneNumber || "Phone not available"}
            </p>

            <p className="text-success">Book a Private Tour »</p>
          </Col>
        </Row>

        {/* ================= ACTIONS ================= */}
        <div className="d-flex flex-column align-items-center gap-2">
          <Button
            color="success"
            size="lg"
            className="px-5"
            onClick={() =>
              navigate("/book", {
                state: {
                  tourId: tour._id || tour.id,
                  // selectedDate: dateRanges[selectedDateIndex],
                },
              })
            }
          >
            Book Now!
          </Button>

          <Button
            outline
            color="secondary"
            size="lg"
            className="px-5"
            onClick={() => navigate("/tours")}
          >
            Back to Tours
          </Button>
        </div>
      </Container>
    </>
  );
}
