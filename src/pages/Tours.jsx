import { useState } from "react";
import { Container, Row, Col, Input, Button, Form, FormGroup, Label, Card, CardImg, CardBody, CardTitle } from "reactstrap";
import { FaShareAlt } from "react-icons/fa";
import tour1 from "../assets/tour1.jpg";
import tour2 from "../assets/tour2.png";
import tour3 from "../assets/tour3.jpg";
import tour4 from "../assets/tour4.jpg";


const dummyTours = [
  {
    title: "Mount Pinatubo Crater Lake Trek",
    location: "Tarlac, Philippines",
    date: "Jan 25 - Jan 26",
    type: "Adventure Tour",
    description: "Experience the breathtaking crater lake and scenic views on this unforgettable trek.",
    image: tour1,
    rating: 4.8,
    price: 3500,
    slots: 10,
  },
  {
    title: "El Nido Island Hopping",
    location: "Palawan, Philippines",
    date: "Feb 12 - Feb 15",
    type: "Island Hopping",
    description: "Discover hidden lagoons and pristine beaches in El Nido.",
    image: tour2,
    rating: 4.9,
    price: 8900,
    slots: 8,
  },
  {
    title: "Scuba Diving Experience",
    location: "Bohol, Philippines",
    date: "Mar 05 - Mar 07",
    type: "Scuba Diving",
    description: "Explore the underwater world of Bohol and see amazing marine life.",
    image: tour3,
    rating: 5.0,
    price: 7500,
    slots: 5,
  },
  {
    title: "Camping in Sagada",
    location: "Sagada, Philippines",
    date: "Apr 10 - Apr 12",
    type: "Camping",
    description: "Experience nature up close with a camping adventure in Sagada.",
    image: tour4,
    rating: 4.7,
    price: 4000,
    slots: 12,
  },
];

function Tours() {

  const [date, setDate] = useState("");
  const [location, setLocation] = useState("");
  const [adventureType, setAdventureType] = useState("all");

  const popularLocations = [
    "Mount Pinatubo",
    "El Nido, Palawan",
    "Bohol",
    "Cebu",
    "Sagada",
    "Coron",
    "Siargao",
    "Banaue"
  ];

  const quickFilters = ["This Weekend", "Next Week", "This Month"];

  const clearAll = () => {
    setDate("");
    setLocation("");
    setAdventureType("all");
  };

  return (
    <>
      {/* Hero Section with 2x2 Image Collage */}
      <section style={{ position: "relative", height: "70vh" }}>
        <Container fluid className="h-100 p-0">
          <Row className="h-100 g-0">
            {/* Top Left */}
            <Col xs="6" className="position-relative">
              <img
                src={tour1}
                alt="Tour 1"
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            </Col>

            {/* Top Right */}
            <Col xs="6" className="position-relative">
              <img
                src={tour2}
                alt="Tour 2"
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            </Col>

            {/* Bottom Left */}
            <Col xs="6" className="position-relative">
              <img
                src={tour3}
                alt="Tour 3"
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            </Col>

            {/* Bottom Right */}
            <Col xs="6" className="position-relative">
              <img
                src={tour4}
                alt="Tour 4"
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            </Col>
          </Row>
        </Container>

        {/* Overlay Text */}
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            textAlign: "center",
            color: "white",
            zIndex: 2,
            padding: "0 1rem",
          }}
        >
          <h1 style={{ fontFamily: "Poppins", fontWeight: 600, fontSize: "3rem" }}>
            Discover Amazing Tours
          </h1>
          <p style={{ fontFamily: "Poppins", fontSize: "1.2rem", marginTop: "0.5rem" }}>
            Find your perfect adventure with our expert coordinators
          </p>
        </div>

        {/* Dark Overlay */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundColor: "rgba(0,0,0,0.5)",
            zIndex: 1,
          }}
        />
      </section>

       <section style={{ padding: "3rem 0", background: "#F9FAFB" }}>
      <Container>
        <h2 className="fw-bold text-center mb-4">Search Tours</h2>

        {/* Search Form */}
        <Form>
          <Row className="g-3 align-items-end">
            {/* Search by Date */}
            <Col xs="12" md="3">
              <FormGroup>
                <Label for="searchDate" className="fw-semibold">Search by Date</Label>
                <Input
                  type="text"
                  id="searchDate"
                  placeholder="Month Day (e.g. Jan 25)"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                />
              </FormGroup>
            </Col>

            {/* Search by Location */}
            <Col xs="12" md="3">
              <FormGroup>
                <Label for="searchLocation" className="fw-semibold">Search by Location</Label>
                <Input
                  type="text"
                  id="searchLocation"
                  placeholder="Enter location"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                />
              </FormGroup>
              <div style={{ marginTop: "0.5rem", fontSize: "0.85rem" }}>
                <strong>Popular Locations:</strong> {popularLocations.join(", ")}
              </div>
            </Col>

            {/* Adventure Type */}
            <Col xs="12" md="3">
              <FormGroup>
                <Label for="adventureType" className="fw-semibold">Adventure Type</Label>
                <Input
                  type="select"
                  id="adventureType"
                  value={adventureType}
                  onChange={(e) => setAdventureType(e.target.value)}
                >
                  <option value="all">All Types</option>
                  <option value="mountain-climbing">Mountain Climbing</option>
                  <option value="island-hopping">Island Hopping</option>
                  <option value="scuba-diving">Scuba Diving</option>
                  <option value="camping">Camping</option>
                  <option value="hiking">Hiking</option>
                  <option value="beach-tour">Beach Tour</option>
                  <option value="cultural-tour">Cultural Tour</option>
                  <option value="city-tour">City Tour</option>
                </Input>
              </FormGroup>
            </Col>

            {/* Clear All Button */}
            <Col xs="12" md="3" className="d-flex gap-2">
              <Button color="secondary" className="w-50" onClick={clearAll}>
                Clear All
              </Button>
              <Button color="success" className="w-50">
                Search
              </Button>
            </Col>
          </Row>

          {/* Quick Filters */}
          <Row className="mt-3">
            <Col xs="12">
              <div className="d-flex flex-wrap gap-2">
                {quickFilters.map((filter, idx) => (
                  <Button key={idx} color="outline-success" size="sm">
                    {filter}
                  </Button>
                ))}
              </div>
            </Col>
          </Row>
        </Form>
      </Container>
    </section>

                <section style={{ padding: "3rem 0", background: "#F9FAFB" }}>
      <Container>
        <h2 className="fw-bold text-center mb-4">Available Tours</h2>
        <p className="text-center text-muted mb-4">{dummyTours.length} tours found</p>

        <Row className="g-4">
          {dummyTours.map((tour, idx) => (
            <Col xs="12" md="6" lg="6" key={idx}>
              <Card className="h-100 shadow-sm">
                <div style={{ position: "relative" }}>
                  <CardImg
                    top
                    src={tour.image}
                    alt={tour.title}
                    style={{ height: "200px", objectFit: "cover" }}
                  />
                  {/* Rating and Share Icon */}
                  <div
                    style={{
                      position: "absolute",
                      top: "10px",
                      right: "10px",
                      background: "rgba(0,0,0,0.5)",
                      color: "white",
                      padding: "0.3rem 0.6rem",
                      borderRadius: "6px",
                      display: "flex",
                      alignItems: "center",
                      gap: "0.5rem",
                      fontSize: "0.85rem",
                    }}
                  >
                    ⭐ {tour.rating} <FaShareAlt style={{ cursor: "pointer" }} />
                  </div>
                </div>

                <CardBody>
                  <CardTitle tag="h5" className="fw-bold">
                    {tour.title}
                  </CardTitle>
                  <p className="text-muted mb-1">{tour.location}</p>
                  <p className="text-muted mb-1">{tour.date}</p>
                  <p className="text-success mb-2">{tour.type}</p>
                  <p style={{ fontSize: "0.9rem", color: "#374151" }}>{tour.description}</p>

                  <div className="d-flex flex-wrap gap-3 mt-2 mb-2">
                    <a href="#" style={{ fontSize: "0.85rem", color: "#2563EB" }}>Join a Group</a>
                    <a href="#" style={{ fontSize: "0.85rem", color: "#2563EB" }}>Book a Private Tour &gt;&gt;</a>
                  </div>

                  <div className="d-flex justify-content-between align-items-center mt-3">
                    <h5 className="text-success fw-bold mb-0">
                      ₱{tour.price.toLocaleString()} <small className="text-muted">/pax ({tour.slots} slots)</small>
                    </h5>

                    <div className="d-flex gap-2">
                      <Button color="success">Book Now</Button>
                      <Button color="secondary" outline>View Details</Button>
                    </div>
                  </div>
                </CardBody>
              </Card>
            </Col>
          ))}
        </Row>
      </Container>
    </section>

    </>
  );
}

export default Tours;
