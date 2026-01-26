import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import {
  Container,
  Row,
  Col,
  Button,
  Card,
  CardBody,
  Badge,
  Modal,
} from "reactstrap";
import {
  FaStar,
  FaMapMarkerAlt,
  FaChevronLeft,
  FaChevronRight,
  FaUser,
  FaPhone,
} from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { Swiper, SwiperSlide } from "swiper/react";

import {
  Pagination,
  Navigation,
  Autoplay,
  EffectFade,
  Zoom,
  Thumbs,
} from "swiper/modules";

import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import "swiper/css/effect-fade";
import "swiper/css/zoom";
import "swiper/css/thumbs";

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

  const [showReviewModal, setShowReviewModal] = useState(false);

  const [reviewForm, setReviewForm] = useState({
    fullName: "",
    rating: 5,
    content: "",
  });

  const [showGalleryModal, setShowGalleryModal] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [thumbsSwiper, setThumbsSwiper] = useState(null);

  /* ================= FETCH REVIEWS ================= */

  const submitReview = async () => {
    if (!reviewForm.fullName || !reviewForm.content) {
      toast.warning("Please complete all fields");
      return;
    }

    try {
      await axios.post(`${API_BASE}reviews/${id}`, {
        fullName: reviewForm.fullName,
        rating: String(reviewForm.rating),
        content: reviewForm.content,
      });

      // 🔄 REFRESH TOUR (this refreshes reviews too)
      const res = await axios.get(`${API_BASE}tours/${id}`);
      setTour((prev) => ({
        ...prev,
        reviews: Array.isArray(res.data.reviews) ? res.data.reviews : [],
      }));

      toast.success("Review submitted successfully! 🎉");

      setShowReviewModal(false);
      setReviewForm({ fullName: "", rating: 5, content: "" });
    } catch (err) {
      toast.error("Failed to submit review");
      console.error(err);
    }
  };

  const { reviews = [] } = tour || {};

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
          pictureUrls: normalizeArray(tourDetails.pictureUrls),
          packageInclusions: normalizeArray(tourDetails.packageInclusions),
          itinerary: normalizeArray(tourDetails.itinerary),
          thingsToBring: normalizeArray(tourDetails.thingsToBring),
          reviews: Array.isArray(tourDetails.reviews)
            ? tourDetails.reviews
            : [],
          coordinator,
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

  // const dateRanges = parseAvailableDates(tour.availableDates);

  const images = Array.isArray(tour.pictureUrls) ? tour.pictureUrls : [];

  const heroImage =
    images.length > 0 &&
    typeof images[0] === "string" &&
    images[0].startsWith("http")
      ? images[0]
      : "https://via.placeholder.com/1600x500?text=TravelKo+Adventure";

  // const nextImage = () => setImageIndex((p) => (p + 1) % images.length);
  // const prevImage = () =>
  //   setImageIndex((p) => (p - 1 + images.length) % images.length);

  /* ================= UI ================= */

  return (
    <>
      {/* ================= HERO ================= */}
      <div
        style={{
          backgroundImage: `url(${heroImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          padding: "120px 0",
          color: "#fff",
          position: "relative",
        }}
      >
        {/* overlay for readability */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "rgba(0,0,0,0.45)",
          }}
        />

        <Container style={{ position: "relative" }}>
          <Badge color="success" pill className="mb-2 px-3 py-2">
            {tour.category}
          </Badge>

          <h1 className="fw-bold">{tour.title}</h1>

          <div className="d-flex gap-3 mt-2">
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
        <h4 className="fw-bold">Gallery</h4>

        <Card className="shadow-sm mb-5">
          <CardBody>
            <Swiper
              modules={[Navigation, Pagination]}
              spaceBetween={12}
              slidesPerView={1}
              pagination={{ clickable: true }}
              onSlideChange={(swiper) => setActiveIndex(swiper.activeIndex)}
              onClick={() => setShowGalleryModal(true)}
              style={{ cursor: "zoom-in" }}
            >
              {images.map((img, idx) => (
                <SwiperSlide key={idx}>
                  <img
                    src={img}
                    alt=""
                    style={{
                      height: 220, // 👈 smaller height
                      width: "100%",
                      maxWidth: 520, // 👈 prevents oversized images
                      objectFit: "cover",
                      margin: "0 auto", // 👈 centers image
                      display: "block",
                      borderRadius: 12,
                    }}
                  />
                </SwiperSlide>
              ))}
            </Swiper>
          </CardBody>
        </Card>

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
        <Row className="mb-4 mt-4">
          <Col>
            <div
              className="d-flex justify-content-between align-items-center"
              style={{ padding: "0 4px" }}
            >
              <h4 className="fw-bold mb-0">Reviews & Comments</h4>

              <Button
                color="success"
                size="sm"
                className="px-3 py-2"
                onClick={() => setShowReviewModal(true)}
              >
                + Leave Review
              </Button>
            </div>

            {reviews.length === 0 && (
              <p className="text-muted mt-3">No reviews yet.</p>
            )}

            {reviews.length > 0 && (
              <Swiper
                modules={[Pagination]}
                spaceBetween={16}
                slidesPerView={1}
                pagination={{ clickable: true }}
                breakpoints={{
                  768: {
                    slidesPerView: 2,
                  },
                  1200: {
                    slidesPerView: 3,
                  },
                }}
                style={{ paddingBottom: 30 }}
              >
                {reviews.map((r) => (
                  <SwiperSlide key={r.id}>
                    <Card className="h-100 shadow-sm">
                      <CardBody>
                        <div className="d-flex justify-content-between align-items-start">
                          <strong>{r.fullName}</strong>
                          <small className="text-muted">
                            {new Date(r.createdAt).toLocaleDateString()}
                          </small>
                        </div>

                        {/* Stars */}
                        <div className="text-warning mt-1">
                          {[...Array(Number(r.rating))].map((_, i) => (
                            <FaStar key={i} />
                          ))}
                        </div>

                        <p className="mt-2 mb-0" style={{ fontSize: 14 }}>
                          {r.content}
                        </p>
                      </CardBody>
                    </Card>
                  </SwiperSlide>
                ))}
              </Swiper>
            )}
          </Col>
        </Row>

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

      <Modal
        isOpen={showReviewModal}
        centered
        toggle={() => setShowReviewModal(false)}
      >
        <CardBody style={{ padding: "24px" }}>
          <h5 className="fw-bold mb-3">Leave a Review</h5>

          <div className="mb-3">
            <label className="fw-semibold">Full Name</label>
            <input
              className="form-control"
              value={reviewForm.fullName}
              onChange={(e) =>
                setReviewForm((p) => ({ ...p, fullName: e.target.value }))
              }
            />
          </div>

          <div className="mb-3">
            <label className="fw-semibold mb-1 d-block">Rating</label>

            <div className="d-flex gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <FaStar
                  key={star}
                  size={24}
                  style={{
                    cursor: "pointer",
                    transition: "transform 0.15s",
                  }}
                  color={star <= reviewForm.rating ? "#FACC15" : "#E5E7EB"}
                  onClick={() => setReviewForm((p) => ({ ...p, rating: star }))}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.transform = "scale(1.15)")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.transform = "scale(1)")
                  }
                />
              ))}
            </div>

            <small className="text-muted">{reviewForm.rating} out of 5</small>
          </div>

          <div className="mb-3">
            <label className="fw-semibold">Comment</label>
            <textarea
              className="form-control"
              rows="3"
              value={reviewForm.content}
              onChange={(e) =>
                setReviewForm((p) => ({ ...p, content: e.target.value }))
              }
            />
          </div>

          <div className="d-flex justify-content-end gap-2 mt-4">
            <Button outline onClick={() => setShowReviewModal(false)}>
              Cancel
            </Button>

            <Button color="success" onClick={submitReview}>
              Submit Review
            </Button>
          </div>
        </CardBody>
      </Modal>
      <Modal
        isOpen={showGalleryModal}
        toggle={() => setShowGalleryModal(false)}
        size="xl"
        centered
      >
        <CardBody style={{ background: "#000", padding: 12 }}>
          {/* MAIN SLIDER */}
          <Swiper
            modules={[Zoom, Navigation, Thumbs]}
            zoom
            navigation
            initialSlide={activeIndex}
            thumbs={
              thumbsSwiper && !thumbsSwiper.destroyed
                ? { swiper: thumbsSwiper }
                : undefined
            }
            style={{ height: "70vh" }}
          >
            {images.map((img, idx) => (
              <SwiperSlide key={idx}>
                <div className="swiper-zoom-container">
                  <img
                    src={img}
                    alt=""
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "contain",
                    }}
                  />
                </div>
              </SwiperSlide>
            ))}
          </Swiper>

          {/* THUMBNAILS */}
          <Swiper
            modules={[Thumbs]}
            onSwiper={setThumbsSwiper}
            spaceBetween={10}
            slidesPerView={Math.min(images.length, 6)}
            watchSlidesProgress
            style={{ marginTop: 12 }}
          >
            {images.map((img, idx) => (
              <SwiperSlide key={idx}>
                <img
                  src={img}
                  alt=""
                  style={{
                    height: 70,
                    width: "100%",
                    objectFit: "cover",
                    borderRadius: 6,
                    cursor: "pointer",
                  }}
                />
              </SwiperSlide>
            ))}
          </Swiper>

          {/* CLOSE */}
          <Button
            color="light"
            size="sm"
            onClick={() => setShowGalleryModal(false)}
            style={{
              position: "absolute",
              top: 10,
              right: 10,
              zIndex: 9999,
            }}
          >
            ✕
          </Button>
        </CardBody>
      </Modal>

      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        pauseOnHover
      />
    </>
  );
}
