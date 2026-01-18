import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Container,
  Row,
  Col,
  Input,
  Button,
  Form,
  FormGroup,
  Label,
  Card,
  CardImg,
  CardBody,
  CardTitle,
} from "reactstrap";
import { FaStar } from "react-icons/fa";
import { FaRegCopy } from "react-icons/fa";

import tour1 from "../assets/tour1.jpg";
import tour2 from "../assets/tour2.png";
import tour3 from "../assets/tour3.jpg";
import tour4 from "../assets/tour4.jpg";

// ✅ demo data now, later you can replace with API response
const dummyTours = [
  {
    id: "pinatubo-001",
    title: "Mount Pinatubo Crater Lake Trek",
    location: "Tarlac, Philippines",
    dateLabel: "Jan 25 - Jan 26",
    month: "jan",
    type: "Adventure Tour",
    description:
      "Experience the breathtaking crater lake and scenic views on this unforgettable trek.",
    image: tour1,
    rating: 4.8,
    price: 3500,
    slots: 10,
  },
  {
    id: "elnido-002",
    title: "El Nido Island Hopping",
    location: "Palawan, Philippines",
    dateLabel: "Feb 12 - Feb 15",
    month: "feb",
    type: "Island Hopping",
    description: "Discover hidden lagoons and pristine beaches in El Nido.",
    image: tour2,
    rating: 4.9,
    price: 8900,
    slots: 8,
  },
  {
    id: "bohol-003",
    title: "Scuba Diving Experience",
    location: "Bohol, Philippines",
    dateLabel: "Mar 05 - Mar 07",
    month: "mar",
    type: "Scuba Diving",
    description:
      "Explore the underwater world of Bohol and see amazing marine life.",
    image: tour3,
    rating: 5.0,
    price: 7500,
    slots: 5,
  },
  {
    id: "sagada-004",
    title: "Camping in Sagada",
    location: "Sagada, Philippines",
    dateLabel: "Apr 10 - Apr 12",
    month: "apr",
    type: "Camping",
    description:
      "Experience nature up close with a camping adventure in Sagada.",
    image: tour4,
    rating: 4.7,
    price: 4000,
    slots: 12,
  },
];

function normalize(str = "") {
  return String(str).trim().toLowerCase();
}

// Demo parser: accepts "Jan 25", "January", "Feb", "Mar 5"
function parseMonthFromInput(input = "") {
  const t = normalize(input);
  if (!t) return "";
  const months = [
    ["jan", "january"],
    ["feb", "february"],
    ["mar", "march"],
    ["apr", "april"],
    ["may"],
    ["jun", "june"],
    ["jul", "july"],
    ["aug", "august"],
    ["sep", "sept", "september"],
    ["oct", "october"],
    ["nov", "november"],
    ["dec", "december"],
  ];
  for (const names of months) {
    if (names.some((m) => t.includes(m))) return names[0];
  }
  return ""; // unknown (demo)
}

export default function Tours() {
  const navigate = useNavigate();

  // UI inputs
  const [date, setDate] = useState("");
  const [location, setLocation] = useState("");
  const [adventureType, setAdventureType] = useState("all");

  // demo: results after pressing Search
  const [applied, setApplied] = useState({
    date: "",
    location: "",
    adventureType: "all",
    quick: "",
  });

  const popularLocations = [
    "Mount Pinatubo",
    "El Nido, Palawan",
    "Bohol",
    "Cebu",
    "Sagada",
    "Coron",
    "Siargao",
    "Banaue",
  ];

  const quickFilters = ["This Weekend", "Next Week", "This Month"];

  const clearAll = () => {
    setDate("");
    setLocation("");
    setAdventureType("all");
    setApplied({ date: "", location: "", adventureType: "all", quick: "" });
  };

  // ✅ demo backend-ready submit
  const handleSearch = (e) => {
    e.preventDefault();

    // Later: replace with API call like:
    // fetch(`/api/tours?date=${...}&location=${...}&type=${...}`)
    // For now: apply client-side filters
    setApplied({
      date,
      location,
      adventureType,
      quick: "",
    });
  };

  const applyQuick = (filterLabel) => {
    // demo logic: just set quick filter
    setApplied((prev) => ({ ...prev, quick: filterLabel }));
  };

  const filteredTours = useMemo(() => {
    const qLocation = normalize(applied.location);
    const qType = normalize(applied.adventureType);
    const qMonth = parseMonthFromInput(applied.date);

    let list = [...dummyTours];

    // location filter
    if (qLocation) {
      list = list.filter((t) => normalize(t.location).includes(qLocation));
    }

    // type filter
    if (qType && qType !== "all") {
      // your select uses keys like "mountain-climbing" etc.
      // demo mapping: match by words
      const typeMap = {
        "mountain-climbing": "mountain",
        "island-hopping": "island",
        "scuba-diving": "scuba",
        camping: "camping",
        hiking: "hiking",
        "beach-tour": "beach",
        "cultural-tour": "cultural",
        "city-tour": "city",
      };
      const needle = typeMap[qType] || qType;
      list = list.filter((t) => normalize(t.type).includes(needle));
    }

    // month filter (demo)
    if (qMonth) {
      list = list.filter((t) => t.month === qMonth);
    }

    // quick filter (demo only)
    if (applied.quick === "This Weekend") {
      // demo: return first 2
      list = list.slice(0, 2);
    }
    if (applied.quick === "Next Week") {
      // demo: return middle
      list = list.slice(1, 3);
    }
    if (applied.quick === "This Month") {
      // demo: all (no change)
      list = list;
    }

    return list;
  }, [applied]);

  const copyTourLink = async (tour) => {
    // backend-ready: use real tour id slug
    const url = `${window.location.origin}/tours/details/${tour.id}`;
    try {
      await navigator.clipboard.writeText(url);
      // simple feedback (no CSS)
      alert("Link copied!");
    } catch (err) {
      // fallback
      window.prompt("Copy this link:", url);
    }
  };

  const openDetails = (tour) => {
    // Recommended route:
    navigate(`/tours/details/${tour.id}`);
    // If your app currently uses "/tours/details" only, use:
    // navigate("/tours/details");
  };

  const bookNow = (tour) => {
    // Option A: pass tour data via state (demo now, backend later)
    navigate("/book", { state: { tourId: tour.id } });
  };

  return (
    <>
      {/* Hero Section with 2x2 Image Collage */}
      <section
        style={{
          position: "relative",
          height: "clamp(320px, 60vh, 560px)",
          width: "100%",
          overflow: "hidden",
          fontFamily: "Poppins",
        }}
      >
        <Container fluid className="h-100 p-0">
          <Row className="h-100 g-0 justify-content-center">
            <Col xs="12" style={{ maxWidth: 1400, height: "100%" }}>
              <Row className="h-100 g-0">
                <Col xs="6" className="h-50">
                  <img
                    src={tour1}
                    alt="Tour 1"
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                  />
                </Col>
                <Col xs="6" className="h-50">
                  <img
                    src={tour2}
                    alt="Tour 2"
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                  />
                </Col>
                <Col xs="6" className="h-50">
                  <img
                    src={tour3}
                    alt="Tour 3"
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                  />
                </Col>
                <Col xs="6" className="h-50">
                  <img
                    src={tour4}
                    alt="Tour 4"
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                  />
                </Col>
              </Row>
            </Col>
          </Row>
        </Container>

        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundColor: "rgba(0,0,0,0.55)",
            zIndex: 1,
          }}
        />

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
            width: "min(92%, 900px)",
          }}
        >
          <h1
            style={{
              fontWeight: 700,
              fontSize: "clamp(1.8rem, 3.5vw, 3rem)",
              marginBottom: 10,
            }}
          >
            Discover Amazing Tours
          </h1>
          <p
            style={{
              fontSize: "clamp(0.95rem, 1.4vw, 1.2rem)",
              marginTop: 0,
              opacity: 0.95,
            }}
          >
            Find your perfect adventure with our expert coordinators
          </p>
        </div>
      </section>

      {/* Search */}
      <section
        style={{
          padding: "3rem 0",
          background: "#F9FAFB",
          fontFamily: "Poppins",
        }}
      >
        <Container>
          <h2 className="fw-bold text-center mb-4">Search Tours</h2>

          <Form onSubmit={handleSearch}>
            <Row className="g-3 align-items-end">
              <Col xs="12" md="6" lg="3">
                <FormGroup className="mb-0">
                  <Label for="searchDate" className="fw-semibold">
                    Search by Date
                  </Label>
                  <Input
                    type="text"
                    id="searchDate"
                    placeholder="Month Day (e.g. Jan 25)"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                  />
                </FormGroup>
              </Col>

              <Col xs="12" md="6" lg="3">
                <FormGroup className="mb-0">
                  <Label for="searchLocation" className="fw-semibold">
                    Search by Location
                  </Label>
                  <Input
                    type="text"
                    id="searchLocation"
                    placeholder="Enter location"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                  />
                </FormGroup>

                <div className="mt-2 small text-muted">
                  <span className="fw-semibold">Popular:</span>{" "}
                  <span style={{ wordBreak: "break-word" }}>
                    {popularLocations.join(", ")}
                  </span>
                </div>
              </Col>

              <Col xs="12" md="6" lg="3">
                <FormGroup className="mb-0">
                  <Label for="adventureType" className="fw-semibold">
                    Adventure Type
                  </Label>
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

              <Col xs="12" md="6" lg="3">
                <div className="d-grid d-md-flex gap-2">
                  <Button
                    color="secondary"
                    className="w-100 w-md-50"
                    onClick={clearAll}
                    type="button"
                  >
                    Clear All
                  </Button>
                  <Button
                    color="success"
                    className="w-100 w-md-50"
                    type="submit"
                  >
                    Search
                  </Button>
                </div>
              </Col>
            </Row>

            <Row className="mt-3">
              <Col xs="12">
                <div className="d-flex flex-wrap justify-content-center justify-content-md-start gap-2">
                  {quickFilters.map((filter, idx) => (
                    <Button
                      key={idx}
                      color="success"
                      outline
                      size="sm"
                      className="rounded-pill px-3"
                      type="button"
                      onClick={() => applyQuick(filter)}
                    >
                      {filter}
                    </Button>
                  ))}
                </div>
              </Col>
            </Row>
          </Form>
        </Container>
      </section>

      {/* Available Tours */}
      <section
        style={{
          padding: "3rem 0",
          background: "#F9FAFB",
          fontFamily: "Poppins",
        }}
      >
        <Container>
          <h2 className="fw-bold text-center mb-2">Available Tours</h2>
          <p className="text-center text-muted mb-4">
            {filteredTours.length} tours found
          </p>

          <Row className="g-4">
            {filteredTours.map((tour) => (
              <Col xs="12" md="6" key={tour.id}>
                <Card
                  className="h-100 shadow-sm"
                  style={{ borderRadius: 16, overflow: "hidden" }}
                >
                  <div style={{ position: "relative" }}>
                    <CardImg
                      top
                      src={tour.image}
                      alt={tour.title}
                      style={{ height: 220, objectFit: "cover" }}
                    />

                    {/* ✅ Gradient overlay */}
                    <div
                      style={{
                        position: "absolute",
                        inset: 0,
                        background:
                          "linear-gradient(to top, rgba(0,0,0,0.55), rgba(0,0,0,0.15), rgba(0,0,0,0))",
                      }}
                    />

                    {/* Rating badge */}
                    <div
                      style={{
                        position: "absolute",
                        top: 12,
                        left: 12,
                        background: "rgba(0,0,0,0.55)",
                        color: "white",
                        padding: "6px 10px",
                        borderRadius: 999,
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 6,
                        fontSize: 13,
                        fontWeight: 700,
                      }}
                    >
                      <FaStar color="#FCD34D" />
                      {tour.rating}
                    </div>

                    {/* Copy link button */}
                    <Button
                      type="button"
                      color="light"
                      onClick={() => copyTourLink(tour)}
                      style={{
                        position: "absolute",
                        top: 10,
                        right: 10,
                        borderRadius: 999,
                        padding: "8px 10px",
                        border: "none",
                        opacity: 0.95,
                      }}
                      title="Copy link"
                    >
                      <FaRegCopy />
                    </Button>

                    {/* Title overlay */}
                    <div
                      style={{
                        position: "absolute",
                        left: 12,
                        right: 12,
                        bottom: 12,
                        color: "white",
                      }}
                    >
                      <div
                        style={{
                          fontWeight: 800,
                          fontSize: 16,
                          lineHeight: 1.2,
                        }}
                      >
                        {tour.title}
                      </div>
                      <div style={{ opacity: 0.9, fontSize: 13 }}>
                        {tour.location}
                      </div>
                    </div>
                  </div>

                  <CardBody>
                    <div className="d-flex flex-wrap gap-2 mb-2">
                      <span
                        style={{
                          background: "#DCFCE7",
                          color: "#16A34A",
                          fontWeight: 700,
                          fontSize: 12,
                          padding: "6px 10px",
                          borderRadius: 999,
                        }}
                      >
                        {tour.type}
                      </span>
                      <span
                        style={{
                          background: "#E5E7EB",
                          color: "#111827",
                          fontWeight: 700,
                          fontSize: 12,
                          padding: "6px 10px",
                          borderRadius: 999,
                        }}
                      >
                        {tour.dateLabel}
                      </span>
                    </div>

                    <p style={{ fontSize: 14, color: "#374151" }}>
                      {tour.description}
                    </p>

                    <div className="d-flex justify-content-between align-items-center mt-3">
                      <div
                        style={{
                          fontWeight: 900,
                          color: "#16A34A",
                          fontSize: 18,
                        }}
                      >
                        ₱{tour.price.toLocaleString()}{" "}
                        <small
                          className="text-muted"
                          style={{ fontWeight: 600 }}
                        >
                          /pax • {tour.slots} slots
                        </small>
                      </div>
                    </div>

                    <div className="d-flex flex-column flex-sm-row gap-2 mt-3">
                      <Button
                        color="success"
                        className="w-100 w-sm-auto rounded-pill"
                        onClick={() => bookNow(tour)}
                        type="button"
                      >
                        Book Now
                      </Button>

                      <Button
                        outline
                        color="success"
                        className="w-100 w-sm-auto rounded-pill"
                        onClick={() => openDetails(tour)}
                        type="button"
                      >
                        View Details
                      </Button>
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
