import "./Home.css";
import hero from "../assets/landingPage.png";
import tour1 from "../assets/tour1.jpg";
import tour2 from "../assets/tour2.png";
import tour3 from "../assets/tour3.jpg";
import tour4 from "../assets/tour4.jpg";
import { NavLink } from "react-router-dom";
import {
  Container,
  Row,
  Col,
  Card,
  CardImg,
  CardBody,
  CardTitle,
  Button,
} from "reactstrap";
import { useState, useRef, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";

import {
  FaStar,
  FaMapMarkerAlt,
  FaCheckCircle,
  FaChevronLeft,
  FaChevronRight,
  FaUser,
  FaPhone,
  FaClock,
  FaSearch,
  FaShieldAlt,
  FaHeart,
  FaMapMarkedAlt,
  FaThumbsUp,
} from "react-icons/fa";

const featuredTours = [
  {
    id: 1,
    title: "Mount Apo Adventure",
    image: tour1,
    location: "Davao, Philippines",
    duration: "3 Days / 2 Nights",
    rating: 4.8,
    reviews: 124,
    price: 3500,
    isPrivate: true,
  },
  {
    id: 2,
    title: "Samal Island Escape",
    image: tour2,
    location: "Samal Island",
    duration: "1 Day Tour",
    rating: 4.7,
    reviews: 98,
    price: 2800,
    isPrivate: false,
  },
  {
    id: 3,
    title: "Bukidnon Highlands Trek",
    image: tour3,
    location: "Bukidnon",
    duration: "2 Days / 1 Night",
    rating: 4.9,
    reviews: 156,
    price: 4200,
    isPrivate: true,
  },
];

const testimonials = [
  {
    name: "Mary Grace Gallardo",
    location: "Davao City, Philippines",
    rating: 5,
    comment:
      "TravelKo made our trip smooth and unforgettable. Super easy booking and great coordinators!",
    avatar: "https://i.pravatar.cc/100?img=32",
    verified: true,
  },
  {
    name: "Juan Dela Cruz",
    location: "Cebu City, Philippines",
    rating: 4,
    comment: "Highly recommended! The experience was worth every peso.",
    avatar: "https://i.pravatar.cc/100?img=12",
    verified: true,
  },
  {
    name: "Angela Reyes",
    location: "Manila, Philippines",
    rating: 5,
    comment:
      "Best travel platform so far. Friendly coordinators and clear itineraries.",
    avatar: "https://i.pravatar.cc/100?img=47",
    verified: false,
  },
];

// Helper to render stars
const renderStars = (rating) => "⭐".repeat(rating) + "☆".repeat(5 - rating);

function Home() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [likes, setLikes] = useState(testimonials.map(() => 0));
  // const [featuredTours, setFeaturedTours] = useState([]);
  const swiperRef = useRef(null);

  const handleLike = (index) => {
    const updated = [...likes];
    updated[index]++;
    setLikes(updated);
  };

  const goToSlide = (index) => {
    if (swiperRef.current) {
      swiperRef.current.slideToLoop(index); // works with looping slides
    }
  };

  //   useEffect(() => {
  //   fetch("/api/featured-tours")
  //     .then((res) => res.json())
  //     .then((data) => setFeaturedTours(data));
  // }, []);

  return (
    <>
      {/* HERO SECTION */}
      <section className="hero" style={{ backgroundImage: `url(${hero})` }}>
        <div className="hero-overlay p-3 text-center">
          <h1
            style={{
              fontFamily: "Poppins",
              fontWeight: 600,
              fontSize: "2.5rem",
              color: "white",
            }}
          >
            Discover Your Next <br />
            <span style={{ color: "#00ff5e" }}>Adventure</span> with{" "}
            <span className="brand">TravelKo</span>
          </h1>

          <div className="d-flex flex-column flex-md-row justify-content-center align-items-center gap-3 mt-4">
            <NavLink to="/tours" className="w-100 w-md-auto">
              <Button color="success" className="w-100 px-5 rounded-pill">
                Explore Tours
              </Button>
            </NavLink>

            <Button
              outline
              color="light"
              className="w-100 w-md-auto px-5 rounded-pill"
            >
              Learn More
            </Button>
          </div>
        </div>
      </section>
      <section className="section" style={{ fontFamily: "Poppins" }}>
        <Container>
          <Row className="text-center mb-5">
            <Col>
              <h2 className="fw-bold">Featured Adventures</h2>
              <p className="text-muted">
                Handpicked experiences for the ultimate adventurer
              </p>
            </Col>
          </Row>

          <Row className="g-4">
            {featuredTours.map((tour) => (
              <Col xs="12" md="6" lg="4" key={tour.id}>
                <Card className="adventure-card h-100">
                  <CardImg top src={tour.image} alt={tour.title} />

                  <CardBody>
                    <CardTitle tag="h5" className="fw-bold">
                      {tour.title}
                    </CardTitle>

                    <p className="text-muted mb-1">
                      <FaMapMarkerAlt /> {tour.location}
                    </p>
                    <p className="text-muted mb-2">
                      <FaClock /> {tour.duration} <FaStar /> {tour.rating} (
                      {tour.reviews})
                    </p>

                    <p className="text-success mb-3">
                      Book a Private Tour &gt;&gt;
                    </p>

                    <div className="d-flex justify-content-between align-items-center">
                      <h5 className="text-success fw-bold mb-0">
                        ₱{tour.price.toLocaleString()}{" "}
                        <small className="text-muted">/pax</small>
                      </h5>

                      <div className="d-flex gap-2">
                        <Button
                          color="success"
                          size="sm"
                          tag={NavLink}
                          // to={`/book/${tour.id}`}
                          to="/book"
                        >
                          Book now!
                        </Button>
                        <Button
                          outline
                          color="secondary"
                          size="sm"
                          tag={NavLink}
                          to="/tours/details"
                        >
                          View Details
                        </Button>
                      </div>
                    </div>
                  </CardBody>
                </Card>
              </Col>
            ))}
          </Row>
        </Container>
      </section>
      <section className="how-it-works py-5">
        <Container>
          {" "}
          {/* Title */}
          <Row className="text-center mb-5">
            <Col>
              {" "}
              <h2 className="fw-bold">How TravelKo Works</h2>
              <p className="text-muted">
                {" "}
                Your adventure is just four simple steps away{" "}
              </p>
            </Col>
          </Row>{" "}
          {/* Steps */}
          <Row className="g-4 text-center">
            {/* STEP 1 */}
            <Col xs="12" md="6" lg="3">
              <div className="step-wrapper">
                <div className="step-number">01</div>
                <div className="step-icon">
                  <FaSearch />
                </div>
                <h5 className="fw-bold mt-3">Browse Adventures</h5>
                <p className="text-muted">
                  {" "}
                  Explore our curated collection of tours and activities.{" "}
                </p>
              </div>{" "}
            </Col>{" "}
            {/* STEP 2 */}
            <Col xs="12" md="6" lg="3">
              <div className="step-wrapper">
                <div className="step-number">02</div>
                <div className="step-icon">
                  <FaHeart />
                </div>
                <h5 className="fw-bold mt-3">Choose your experience</h5>
                <p className="text-muted">
                  {" "}
                  Select the perfect tour based on your interests.{" "}
                </p>
              </div>
            </Col>{" "}
            {/* STEP 3 */}
            <Col xs="12" md="6" lg="3">
              <div className="step-wrapper">
                <div className="step-number">03</div>
                <div className="step-icon">
                  <FaShieldAlt />
                </div>
                <h5 className="fw-bold mt-3">Secure Booking</h5>
                <p className="text-muted">
                  {" "}
                  Book with confidence using our secure system.{" "}
                </p>
              </div>{" "}
            </Col>{" "}
            {/* STEP 4 */}{" "}
            <Col xs="12" md="6" lg="3">
              <div className="step-wrapper">
                {" "}
                <div className="step-number">04</div>
                <div className="step-icon">
                  <FaMapMarkedAlt />
                </div>
                <h5 className="fw-bold mt-3">Start your journey</h5>
                <p className="text-muted">
                  {" "}
                  Receive confirmation and enjoy your adventure.{" "}
                </p>
              </div>
            </Col>
          </Row>
        </Container>
      </section>{" "}
      <section className="cta py-5">
        <Container>
          <Row className="text-center">
            <Col lg="8" className="mx-auto">
              <h2 className="fw-bold mb-3">Ready to Start Your Adventure?</h2>
              <p className="text-muted mb-4">
                {" "}
                Join thousands of adventurers who trust TravelKo{" "}
              </p>
              <div className="cta-buttons d-flex flex-column flex-sm-row justify-content-center gap-3">
                <Button color="success" size="lg">
                  {" "}
                  Browse Tours{" "}
                </Button>
                <Button outline color="success" size="lg">
                  {" "}
                  Become a Coordinator{" "}
                </Button>
              </div>
            </Col>
          </Row>
        </Container>
      </section>
      <section className="followers py-5 ">
        <Container>
          <Row className="text-center">
            <Col xs="12" md="3" className="mb-4">
              <h1 className="fw-bold text-white">2,500+</h1>
              <p className="text-white">Happy Travelers</p>
            </Col>
            <Col xs="12" md="3" className="mb-4">
              <h1 className="fw-bold text-white">150+</h1>
              <p className="text-white">Tour Packages</p>
            </Col>
            <Col xs="12" md="3" className="mb-4">
              <h1 className="fw-bold text-white">50+</h1>
              <p className="text-white">Expert Coordinators</p>
            </Col>{" "}
            <Col xs="12" md="3" className="mb-4">
              <h1 className="fw-bold text-white">
                4.9 <FaStar />
              </h1>
              <p className="text-white">Average Rating</p>
            </Col>
          </Row>
        </Container>
      </section>{" "}
      <section className="section py-5">
        <Container>
          {" "}
          <div className="text-center mb-4">
            <h2>Adventure Categories</h2>
            <p className="subtitle text-muted">
              {" "}
              Choose from our diverse range of adventure{" "}
            </p>
          </div>
          <Row>
            {/* Card 1 */}
            <Col xs="12" sm="6" lg="3" className="mb-4">
              <Card className="adventure-card h-100">
                <img
                  src={tour1}
                  alt="Mountaineering"
                  className="adventure-img"
                />
                <CardBody>
                  <h5>Mountain Climbing</h5>
                  <p className="location">
                    {" "}
                    Conquer peaks and enjoy breathtaking views{" "}
                  </p>
                  <p className="private-tour">45 Tours</p>
                </CardBody>
              </Card>
            </Col>
            {/* Card 2 */}
            <Col xs="12" sm="6" lg="3" className="mb-4">
              <Card className="adventure-card h-100">
                <img src={tour3} alt="Scuba Diving" className="adventure-img" />
                <CardBody>
                  {" "}
                  <h5>Scuba Diving</h5>
                  <p className="location"> Explore underwater beauty </p>
                  <p className="private-tour">45 Tours</p>
                </CardBody>
              </Card>
            </Col>
            {/* Card 3 */}
            <Col xs="12" sm="6" lg="3" className="mb-4">
              <Card className="adventure-card h-100">
                <img
                  src={tour2}
                  alt="Island Hopping"
                  className="adventure-img"
                />
                <CardBody>
                  {" "}
                  <h5>Island Hopping</h5>{" "}
                  <p className="location"> Discover tropical islands </p>
                  <p className="private-tour">45 Tours</p>
                </CardBody>
              </Card>
            </Col>
            {/* Card 4 */}
            <Col xs="12" sm="6" lg="3" className="mb-4">
              <Card className="adventure-card h-100">
                <img src={tour4} alt="Camping" className="adventure-img" />
                <CardBody>
                  {" "}
                  <h5>Camping</h5>
                  <p className="location"> Experience nature up close </p>
                  <p className="private-tour">45 Tours</p>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </Container>
      </section>
      {/* WHAT TRAVELERS SAY */}
      <section style={{ background: "#F9FAFB", padding: "3rem 0" }}>
        <Container>
          <h2 className="text-center fw-bold">What Travelers Say</h2>
          <p className="text-center text-muted mb-4">
            Real experiences from our amazing community of adventurers
          </p>

          <Swiper
            onSwiper={(swiper) => (swiperRef.current = swiper)}
            slidesPerView={1}
            loop={true}
            onSlideChange={(swiper) => setActiveIndex(swiper.realIndex)}
          >
            {testimonials.map((item, index) => (
              <SwiperSlide key={index}>
                <Row className="justify-content-center">
                  <Col xs="12" md="8" lg="6">
                    <Card
                      className="shadow-sm"
                      style={{
                        borderRadius: "14px",
                        border: "1px solid #E5E7EB",
                      }}
                    >
                      <CardBody>
                        <div className="d-flex align-items-center gap-2">
                          <img
                            src={item.avatar}
                            alt={item.name}
                            style={{
                              width: 40,
                              height: 40,
                              borderRadius: "50%",
                              objectFit: "cover",
                            }}
                          />
                          <div>
                            <h6 className="mb-0 fw-semibold">
                              {item.name}{" "}
                              {item.verified && (
                                <span style={{ color: "#22C55E" }}>✔</span>
                              )}
                            </h6>
                            <small className="text-muted">
                              {item.location}
                            </small>
                          </div>
                        </div>

                        <div className="mt-1">
                          <small>{renderStars(item.rating)}</small>
                        </div>

                        <p
                          className="mt-2"
                          style={{
                            fontSize: "0.9rem",
                            color: "#374151",
                            lineHeight: "1.5",
                          }}
                        >
                          {item.comment}
                        </p>

                        <div
                          className="d-flex gap-3"
                          style={{
                            fontSize: "0.8rem",
                            color: "#6B7280",
                            cursor: "pointer",
                          }}
                        >
                          <span onClick={() => handleLike(index)}>
                            <FaThumbsUp /> Helpful ({likes[index]})
                          </span>
                          <span>💬 Comment</span>
                          <span>· 2 days ago</span>
                        </div>
                      </CardBody>
                    </Card>
                  </Col>
                </Row>
              </SwiperSlide>
            ))}
          </Swiper>

          {/* CUSTOM INDICATOR DOTS */}
          <div className="d-flex justify-content-center mt-4 gap-2">
            {testimonials.map((_, index) => (
              <span
                key={index}
                onClick={() => goToSlide(index)}
                style={{
                  width: 10,
                  height: 10,
                  borderRadius: "50%",
                  background: activeIndex === index ? "#2563EB" : "#D1D5DB",
                  cursor: "pointer",
                  transition: "background 0.3s",
                }}
              />
            ))}
          </div>
        </Container>
      </section>
      <section
        className="section py-5"
        style={{ fontFamily: "Poppins", background: "#F9FAFB" }}
      >
        <Container>
          {/* Title */}
          <div className="text-center mb-5">
            <h2 className="fw-bold">Why Choose TravelKo?</h2>
            <p className="text-muted">
              We’re committed to providing the best adventure experiences
            </p>
          </div>

          {/* Features */}
          <Row className="g-4 text-center">
            {/* Verified Coordinators */}
            <Col xs="12" sm="6" md="4" lg="2">
              <div className="feature-card p-3 h-100">
                <div className="feature-icon mb-2" style={{ fontSize: "2rem" }}>
                  ✅
                </div>
                <h6 className="fw-bold">Verified Coordinators</h6>
                <p className="text-muted" style={{ fontSize: "0.85rem" }}>
                  Travel with peace of mind knowing our coordinators are
                  verified and experienced.
                </p>
              </div>
            </Col>

            {/* Secure Payments */}
            <Col xs="12" sm="6" md="4" lg="2">
              <div className="feature-card p-3 h-100">
                <div className="feature-icon mb-2" style={{ fontSize: "2rem" }}>
                  💳
                </div>
                <h6 className="fw-bold">Secure Payments</h6>
                <p className="text-muted" style={{ fontSize: "0.85rem" }}>
                  All transactions are encrypted and secure for a hassle-free
                  booking.
                </p>
              </div>
            </Col>

            {/* 24/7 Support */}
            <Col xs="12" sm="6" md="4" lg="2">
              <div className="feature-card p-3 h-100">
                <div className="feature-icon mb-2" style={{ fontSize: "2rem" }}>
                  🕒
                </div>
                <h6 className="fw-bold">24/7 Support</h6>
                <p className="text-muted" style={{ fontSize: "0.85rem" }}>
                  Our team is available around the clock to help you anytime.
                </p>
              </div>
            </Col>

            {/* Best Prices */}
            <Col xs="12" sm="6" md="4" lg="2">
              <div className="feature-card p-3 h-100">
                <div className="feature-icon mb-2" style={{ fontSize: "2rem" }}>
                  💰
                </div>
                <h6 className="fw-bold">Best Prices</h6>
                <p className="text-muted" style={{ fontSize: "0.85rem" }}>
                  Enjoy competitive pricing without compromising on quality.
                </p>
              </div>
            </Col>

            {/* Quality Assurance */}
            <Col xs="12" sm="6" md="4" lg="2">
              <div className="feature-card p-3 h-100">
                <div className="feature-icon mb-2" style={{ fontSize: "2rem" }}>
                  🏆
                </div>
                <h6 className="fw-bold">Quality Assurance</h6>
                <p className="text-muted" style={{ fontSize: "0.85rem" }}>
                  We ensure every adventure meets our high standards of
                  excellence.
                </p>
              </div>
            </Col>

            {/* Easy Booking */}
            <Col xs="12" sm="6" md="4" lg="2">
              <div className="feature-card p-3 h-100">
                <div className="feature-icon mb-2" style={{ fontSize: "2rem" }}>
                  📲
                </div>
                <h6 className="fw-bold">Easy Booking</h6>
                <p className="text-muted" style={{ fontSize: "0.85rem" }}>
                  Quickly book your next adventure in just a few clicks.
                </p>
              </div>
            </Col>
          </Row>
        </Container>
      </section>
      <section
        className="section py-5"
        style={{ background: "#16A34A", fontFamily: "Poppins" }}
      >
        <Container>
          <Row className="justify-content-center text-center">
            <Col xs="12" md="8">
              <h2 className="fw-bold text-white mb-3">Stay Updated</h2>
              <p className="text-white mb-4">
                Get the latest adventure deals and travel tips delivered to your
                inbox
              </p>

              {/* Email Input + Subscribe Button */}
              <div className="d-flex flex-column flex-sm-row justify-content-center gap-2 mb-3">
                <input
                  type="email"
                  placeholder="Enter your email address"
                  style={{
                    padding: "0.75rem 1rem",
                    borderRadius: "50px",
                    border: "none",
                    flex: 1,
                    maxWidth: "400px",
                  }}
                />
                <Button
                  color="white"
                  style={{
                    borderRadius: "50px",
                    backgroundColor: "#ffffff",
                    color: "#22C55E",
                    fontWeight: 600,
                    padding: "0.75rem 2rem",
                  }}
                >
                  Subscribe
                </Button>
              </div>

              {/* Description */}
              <p className="text-white-50" style={{ fontSize: "0.85rem" }}>
                No spam, unsubscribe anytime. We respect your privacy.
              </p>
            </Col>
          </Row>
        </Container>
      </section>
    </>
  );
}

export default Home;
