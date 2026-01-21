import { useEffect, useState } from "react";
import { Container, Row, Col, Button, Card, CardBody, Badge } from "reactstrap";
import {
  FaStar,
  FaMapMarkerAlt,
  FaChevronLeft,
  FaChevronRight,
  FaUser,
  FaPhone,
} from "react-icons/fa";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

export default function AdventureDetails() {
  const { id } = useParams(); // 🔑 tour id
  const navigate = useNavigate();

  const API_BASE =
    import.meta.env.VITE_API_BASE_URL || "https://api.travelko.site/";

  const [tour, setTour] = useState(null);
  const [imageIndex, setImageIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  /* ================= DATE HELPERS ================= */
  const parseAvailableDates = (availableDates) => {
    if (!availableDates || !availableDates.length) return [];

    let raw = availableDates[0];

    if (typeof raw === "string") {
      try {
        raw = JSON.parse(raw);
      } catch {
        return [];
      }
    }

    if (!Array.isArray(raw) || raw.length < 2) return [];

    return [
      {
        start: new Date(raw[0]),
        end: new Date(raw[raw.length - 1]),
      },
    ];
  };

  const formatDate = (date) =>
    date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });

  /* ================= FETCH TOUR ================= */
  useEffect(() => {
    const fetchTour = async () => {
      try {
        const res = await axios.get(`${API_BASE}tours/${id}`);
        setTour(res.data);
      } catch (err) {
        console.error(err);
        alert("Failed to load tour details");
      } finally {
        setLoading(false);
      }
    };

    fetchTour();
  }, [id]);

  if (loading) return <div className="text-center my-5">Loading...</div>;
  if (!tour) return <div className="text-center my-5">Tour not found</div>;

  const gallery = tour.pictureUrls || [];
  const dates = parseAvailableDates(tour.availableDates);

  const nextImage = () => setImageIndex((prev) => (prev + 1) % gallery.length);

  const prevImage = () =>
    setImageIndex((prev) => (prev - 1 + gallery.length) % gallery.length);

  return (
    <>
      {/* HERO */}
      <div
        style={{
          backgroundImage: `url(${gallery[0]})`,
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

          <div className="d-flex align-items-center gap-3 mt-2">
            <span>
              <FaStar className="text-warning" /> 4.8
            </span>
            <span>
              <FaMapMarkerAlt /> {tour.address}
            </span>
          </div>
        </Container>
      </div>

      <Container className="my-5">
        {/* GALLERY */}
        {gallery.length > 0 && (
          <Row className="mb-5">
            <Col className="text-center position-relative">
              <img
                src={gallery[imageIndex]}
                alt="Gallery"
                className="img-fluid rounded shadow"
                style={{ maxHeight: 400, objectFit: "cover" }}
              />

              {gallery.length > 1 && (
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
        )}

        {/* ABOUT */}
        <Row className="mb-5">
          <Col>
            <h4 className="fw-bold">About this tour</h4>
            <p>{tour.details}</p>
          </Col>
        </Row>

        {/* ITINERARY */}
        <Row className="mb-5">
          <Col>
            <h4 className="fw-bold mb-3">Itinerary</h4>
            {tour.itinerary?.map((item, idx) => (
              <div key={idx} className="mb-2">
                <Badge color="success" pill className="me-2">
                  Day {idx + 1}
                </Badge>
                {item}
              </div>
            ))}
          </Col>
        </Row>

        {/* AVAILABLE DATES */}
        <Row className="mb-5">
          <Col>
            <h4 className="fw-bold">Available Dates</h4>
            <Card className="shadow-sm mt-3">
              <CardBody className="d-flex justify-content-between">
                <span>
                  Join a group <br />
                  <small className="text-muted">
                    {dates.length
                      ? `${formatDate(dates[0].start)} – ${formatDate(
                          dates[0].end,
                        )}`
                      : "—"}
                  </small>
                </span>
                <strong>{tour.joinerMaxSlots} slots available</strong>
              </CardBody>
            </Card>
          </Col>
        </Row>

        {/* INCLUDED / THINGS */}
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
            <h5 className="fw-bold">Things to bring</h5>
            <ul>
              {tour.thingsToBring?.map((i, idx) => (
                <li key={idx}>{i}</li>
              ))}
            </ul>
          </Col>
        </Row>

        {/* COORDINATOR */}
        <h4 className="fw-bold mb-2">Coordinator</h4>
        <p className="mb-1">
          <FaUser className="me-2" /> {tour.coordinator?.fullName || "—"}
        </p>
        <p className="mb-4">
          <FaPhone className="me-2" /> {tour.coordinator?.phoneNumber || "—"}
        </p>

        {/* ACTIONS */}
        <div className="d-flex flex-column align-items-center gap-2 mt-4">
          <Button color="success" size="lg" className="px-5 py-3 fw-bold">
            Book Now!
          </Button>

          <Button
            outline
            color="secondary"
            size="lg"
            className="px-5 py-3"
            onClick={() => navigate("/tours")}
          >
            Back to Tours
          </Button>
        </div>
      </Container>
    </>
  );
}
