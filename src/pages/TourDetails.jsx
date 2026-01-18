import { useState } from "react";
import {
  Container,
  Row,
  Col,
  Button,
  Card,
  CardBody,
  Badge,
} from "reactstrap";
import {
  FaStar,
  FaMapMarkerAlt,
  FaCheckCircle,
  FaChevronLeft,
  FaChevronRight,
  FaUser,
  FaPhone
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";

import tour1 from "../assets/tour1.jpg";
import tour2 from "../assets/tour2.png";
import tour3 from "../assets/tour3.jpg";


const galleryImages = [tour1, tour2, tour3];


const reviews = [
  {
    name: "Juan Dela Cruz",
    date: "March 2026",
    rating: 5,
    comment: "Amazing experience! Well organized and safe.",
  },
  {
    name: "Maria Santos",
    date: "March 2026",
    rating: 4,
    comment: "Beautiful views and friendly guides.",
  },
  {
    name: "Carlos Reyes",
    date: "February 2026",
    rating: 5,
    comment: "Worth every peso. Highly recommended!",
  },
];

function AdventureDetails() {
  const navigate = useNavigate();
  const [imageIndex, setImageIndex] = useState(0);
  const [reviewIndex, setReviewIndex] = useState(0);

  const nextImage = () =>
    setImageIndex((prev) => (prev + 1) % galleryImages.length);
  const prevImage = () =>
    setImageIndex(
      (prev) => (prev - 1 + galleryImages.length) % galleryImages.length
    );

  const nextReview = () =>
    setReviewIndex((prev) => (prev + 1) % reviews.length);

  return (
    <>
      {/* HERO */}
      <div
        style={{
          backgroundImage: `url(${galleryImages[0]})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          padding: "120px 0",
          color: "#fff",
        }}
      >
        <Container>
          <Badge color="success" pill className="mb-2 px-3 py-2">
            Mountain Climbing
          </Badge>
          <h1 className="fw-bold">Mount Pinatubo Crater Lake Trek</h1>

          <div className="d-flex align-items-center gap-3 mt-2">
            <span>
              <FaStar className="text-warning" /> 4.8 (124)
            </span>
            <span>
              <FaMapMarkerAlt /> Zambales, Philippines
            </span>
          </div>
        </Container>
      </div>

      <Container className="my-5">
        {/* GALLERY */}
        <Row className="mb-5">
          <Col className="text-center position-relative">
            <img
              src={galleryImages[imageIndex]}
              alt="Gallery"
              className="img-fluid rounded shadow"
              style={{ maxHeight: "400px", objectFit: "cover" }}
            />

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
          </Col>
        </Row>

        {/* ABOUT */}
        <Row className="mb-5">
          <Col>
            <h4 className="fw-bold">About this tour</h4>
            <p>
              Experience the breathtaking Mount Pinatubo Crater Lake trek.
              Perfect for adventure seekers who want scenic views, fresh air,
              and an unforgettable journey.
            </p>
          </Col>
        </Row>

        {/* ITINERARY */}
<Row className="mb-5">
  <Col>
    <h4 className="fw-bold mb-4">Itinerary</h4>

    {/* DAY 1 */}
    <div className="d-flex align-items-start gap-3 mb-3">
      <Badge color="success" pill className="px-3 py-2">
        Day 1
      </Badge>

      <div>
        <h6 className="fw-bold mb-1">Departure & Base Camp Arrival</h6>
        <p className="text-muted mb-0">
          Early departure from Manila, travel to the jump-off point,
          arrival at base camp, registration, orientation, and trek briefing.
        </p>
      </div>
    </div>

    {/* DAY 2 */}
    <div className="d-flex align-items-start gap-3 mb-3">
      <Badge color="success" pill className="px-3 py-2">
        Day 2
      </Badge>

      <div>
        <h6 className="fw-bold mb-1">Summit Trek & Crater Exploration</h6>
        <p className="text-muted mb-0">
          Sunrise trek to the summit, exploration of the crater lake,
          photography session, and return to camp for rest.
        </p>
      </div>
    </div>

    {/* DAY 3 */}
    <div className="d-flex align-items-start gap-3">
      <Badge color="success" pill className="px-3 py-2">
        Day 3
      </Badge>

      <div>
        <h6 className="fw-bold mb-1">Descent & Return to Manila</h6>
        <p className="text-muted mb-0">
          Break camp, descend to jump-off point, lunch stop,
          and safe return trip to Manila.
        </p>
      </div>
    </div>
  </Col>
</Row>


        {/* REVIEWS */}
        <Row className="mb-5">
          <Col>
            <div className="d-flex justify-content-between align-items-center">
              <h4 className="fw-bold">Reviews & Comments</h4>
              <Button color="success" size="sm">+ Leave a Review</Button>
            </div>

            <Card className="mt-3 shadow-sm">
              <CardBody>
                <h6 className="fw-bold mb-0">
                  {reviews[reviewIndex].name}{" "}
                  <FaCheckCircle className="text-success" size={14} />
                </h6>
                <small className="text-muted">
                  {reviews[reviewIndex].date}
                </small>

                <div className="mt-1">
                  {[...Array(reviews[reviewIndex].rating)].map((_, i) => (
                    <FaStar key={i} className="text-warning" />
                  ))}
                </div>

                <p className="mt-2">{reviews[reviewIndex].comment}</p>

                {/* Dots */}
                <div className="text-center mt-3">
                  {reviews.map((_, i) => (
                    <span
                      key={i}
                      onClick={() => setReviewIndex(i)}
                      style={{
                        display: "inline-block",
                        width: "10px",
                        height: "10px",
                        margin: "0 5px",
                        borderRadius: "50%",
                        background:
                          reviewIndex === i ? "#198754" : "#ccc",
                        cursor: "pointer",
                      }}
                    />
                  ))}
                </div>
              </CardBody>
            </Card>
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
                    May 7–10, 2026 | May 15–18, 2026
                  </small>
                </span>
                <strong>15 slots available</strong>
              </CardBody>
            </Card>
          </Col>
        </Row>

        {/* INCLUDED / THINGS TO BRING */}
        <Row className="mb-5">
          <Col md="6">
            <h5 className="fw-bold">What’s included</h5>
            <ul>
              <li>Transportation from Manila</li>
              <li>Professional guide</li>
              <li>Camping equipment</li>
              <li>All meals</li>
              <li>Safety gear & first aid kit</li>
            </ul>
          </Col>

          <Col md="6">
            <h5 className="fw-bold">Things to bring (optional)</h5>
            <ul>
              <li>Clothes & shoes</li>
              <li>Head light</li>
              <li>Water & snacks</li>
              <li>Personal medication</li>
              <li>Trekking pole</li>
            </ul>
          </Col>
        </Row>

        {/* COORDINATOR */}
            <h4 className="fw-bold mb-2">Coordinator</h4>
            <p className="mb-1">
              <FaUser className="me-2" />  Adventure Pro Tours <br />
             
            </p>
            <p className="mb-4">
              <FaPhone className="me-2" /> 0912 345 6789
            </p>

            <p className="text-success mb-4">
              Book a private tour &gt;&gt;
            </p>

           {/* ACTION BUTTONS */}
<div className="d-flex flex-column align-items-center gap-2 mt-4">
  <Button
    color="success"
    size="lg"
    className="px-5 py-3 fw-bold"
  >
    Book Now!
  </Button>

  <Button
    outline
    color="secondary"
    size="lg"
    className="px-5 py-3"
  >
    Back to Tours
  </Button>
</div>

 
      </Container>
    </>
  );
}

export default AdventureDetails;
