import { useEffect, useMemo, useState } from "react";
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
} from "reactstrap";
import { FaShareAlt, FaStar } from "react-icons/fa";

import tour1 from "../assets/tour1.jpg";
import tour2 from "../assets/tour2.png";
import tour3 from "../assets/tour3.jpg";
import tour4 from "../assets/tour4.jpg";

/* ================= HELPERS ================= */

const normalize = (str = "") => String(str).trim().toLowerCase();

const parseAvailableDates = (availableDates) => {
  if (!availableDates || !availableDates.length) return null;

  let raw = availableDates[0];

  // backend sends stringified JSON
  if (typeof raw === "string") {
    try {
      raw = JSON.parse(raw);
    } catch {
      return null;
    }
  }

  if (!Array.isArray(raw) || raw.length < 2) return null;

  const start = new Date(raw[0]);
  const end = new Date(raw[raw.length - 1]);

  if (isNaN(start) || isNaN(end)) return null;

  return { start, end };
};

const formatDate = (d) =>
  d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

export default function Tours() {
  const navigate = useNavigate();

  const API_BASE =
    import.meta.env.VITE_API_BASE_URL || "https://api.travelko.site/";

  /* ================= STATE ================= */

  const [tours, setTours] = useState([]);
  const [loading, setLoading] = useState(false);

  // filters
  const [date, setDate] = useState("");
  const [location, setLocation] = useState("");
  const [adventureType, setAdventureType] = useState("all");

  const [applied, setApplied] = useState({
    date: "",
    location: "",
    adventureType: "all",
  });

  /* ================= FETCH PUBLIC TOURS ================= */

  const fetchPublicTours = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE}tours`);
      const data = await res.json();
      setTours(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to fetch tours", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPublicTours();
  }, []);

  /* ================= FILTER ================= */

  const handleSearch = (e) => {
    e.preventDefault();
    setApplied({ date, location, adventureType });
  };

  const clearAll = () => {
    setDate("");
    setLocation("");
    setAdventureType("all");
    setApplied({ date: "", location: "", adventureType: "all" });
  };

  const filteredTours = useMemo(() => {
    let list = [...tours];

    const qLocation = normalize(location);
    const qType = normalize(adventureType);
    const qDate = normalize(date);

    // LOCATION FILTER
    if (qLocation) {
      list = list.filter((t) => normalize(t.address).includes(qLocation));
    }

    // ADVENTURE TYPE FILTER
    if (qType && qType !== "all") {
      list = list.filter((t) => normalize(t.category).includes(qType));
    }

    // DATE FILTER (basic string match)
    if (qDate) {
      list = list.filter((t) => {
        const parsed = parseAvailableDates(t.availableDates);
        if (!parsed) return false;

        const rangeText =
          `${formatDate(parsed.start)} ${formatDate(parsed.end)}`.toLowerCase();
        return rangeText.includes(qDate);
      });
    }

    return list;
  }, [tours, location, adventureType, date]);

  /* ================= ACTIONS ================= */

  const openDetails = (tour) => {
    navigate(`/tours/details/${tour.id}`);
  };

  const bookNow = (tour) => {
    const parsedDate = parseAvailableDates(tour.availableDates);

    if (!parsedDate) {
      alert("This tour has no available dates.");
      return;
    }

    navigate("/book", {
      state: {
        tourId: tour.id,
        selectedDate: parsedDate,
      },
    });
  };

  const copyTourLink = async (tour) => {
    const url = `${window.location.origin}/tours/${tour.id}`;
    try {
      await navigator.clipboard.writeText(url);
      alert("Link copied!");
    } catch {
      window.prompt("Copy this link:", url);
    }
  };

  /* ================= UI ================= */

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
        {" "}
        <Container fluid className="h-100 p-0">
          {" "}
          <Row className="h-100 g-0 justify-content-center">
            {" "}
            <Col xs="12" style={{ maxWidth: 1400, height: "100%" }}>
              {" "}
              <Row className="h-100 g-0">
                {" "}
                <Col xs="6" className="h-50">
                  {" "}
                  <img
                    src={tour1}
                    alt="Tour 1"
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                  />{" "}
                </Col>{" "}
                <Col xs="6" className="h-50">
                  {" "}
                  <img
                    src={tour2}
                    alt="Tour 2"
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                  />{" "}
                </Col>{" "}
                <Col xs="6" className="h-50">
                  {" "}
                  <img
                    src={tour3}
                    alt="Tour 3"
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                  />{" "}
                </Col>{" "}
                <Col xs="6" className="h-50">
                  {" "}
                  <img
                    src={tour4}
                    alt="Tour 4"
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                  />{" "}
                </Col>{" "}
              </Row>{" "}
            </Col>{" "}
          </Row>{" "}
        </Container>{" "}
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundColor: "rgba(0,0,0,0.55)",
            zIndex: 1,
          }}
        />{" "}
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
          {" "}
          <h1
            style={{
              fontWeight: 700,
              fontSize: "clamp(1.8rem, 3.5vw, 3rem)",
              marginBottom: 10,
            }}
          >
            {" "}
            Discover Amazing Tours{" "}
          </h1>{" "}
          <p
            style={{
              fontSize: "clamp(0.95rem, 1.4vw, 1.2rem)",
              marginTop: 0,
              opacity: 0.95,
            }}
          >
            {" "}
            Find your perfect adventure with our expert coordinators{" "}
          </p>{" "}
        </div>{" "}
      </section>

      <section style={{ padding: "3rem 0", background: "#F9FAFB" }}>
        <Container fluid="lg">
          <Row className="g-4">
            {/* ================= LEFT SEARCH PANEL ================= */}
            <Col md="3">
              <Card className="shadow-sm sticky-top" style={{ top: 90 }}>
                <CardBody>
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <h6 className="fw-bold mb-0">Search Tours</h6>
                    <Button
                      color="link"
                      className="p-0 text-success"
                      onClick={clearAll}
                    >
                      Clear All
                    </Button>
                  </div>

                  <Form onSubmit={handleSearch}>
                    {/* DATE */}
                    <FormGroup className="mb-3">
                      <Label className="small fw-semibold">
                        Search by Date
                      </Label>
                      <Input
                        placeholder="e.g. May 1 - May 15"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                      />
                      <small className="text-muted">
                        Format: Month Day – Month Day
                      </small>
                    </FormGroup>

                    {/* LOCATION */}
                    <FormGroup className="mb-3">
                      <Label className="small fw-semibold">
                        Search by Location
                      </Label>
                      <Input
                        placeholder="e.g. Mt. Pinatubo"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                      />
                    </FormGroup>

                    {/* POPULAR LOCATIONS */}
                    <div className="mb-3">
                      <Label className="small fw-semibold">
                        Popular Locations
                      </Label>
                      <div className="d-flex flex-column gap-1 mt-2">
                        {[
                          "Mount Pinatubo",
                          "El Nido, Palawan",
                          "Bohol",
                          "Baguio",
                          "Mount Pulag",
                          "Boracay",
                          "Siargao",
                          "Cebu",
                        ].map((loc) => (
                          <Button
                            key={loc}
                            color=""
                            className="p-0 text-start text-success"
                            onClick={() => setLocation(loc)}
                          >
                            {loc}
                          </Button>
                        ))}
                      </div>
                    </div>

                    {/* ADVENTURE TYPE */}
                    <FormGroup className="mb-4">
                      <Label className="small fw-semibold">
                        Adventure Type
                      </Label>
                      <Input
                        type="select"
                        value={adventureType}
                        onChange={(e) => setAdventureType(e.target.value)}
                      >
                        <option value="all">All Types</option>
                        <option value="Mountain">Mountain Climbing</option>
                        <option value="Island">Island Hopping</option>
                        <option value="Scuba">Scuba Diving</option>
                        <option value="Camping">Camping</option>
                        <option value="Hiking">Hiking</option>
                      </Input>
                    </FormGroup>

                    {/* <Button color="success" className="w-100" type="submit">
                      Search
                    </Button> */}
                  </Form>
                </CardBody>
              </Card>
            </Col>

            {/* ================= RIGHT TOUR LIST ================= */}
            <Col md="9">
              <div className="mb-4">
                <h4 className="fw-bold mb-1">Available Tours</h4>
                <p className="text-muted mb-0">
                  {filteredTours.length} tours found
                </p>
              </div>

              <div className="d-flex flex-column gap-4">
                {filteredTours.map((tour) => {
                  const dates = parseAvailableDates(tour.availableDates);

                  return (
                    <Card
                      key={tour.id}
                      className="shadow-sm"
                      style={{ borderRadius: 16 }}
                    >
                      <Row className="g-0">
                        {/* IMAGE */}
                        <Col md="5">
                          <img
                            src={tour.pictureUrls?.[0] || "/fallback.jpg"}
                            alt={tour.title}
                            style={{
                              width: "100%",
                              height: "100%",
                              objectFit: "cover",
                              borderRadius: "16px 0 0 16px",
                            }}
                          />
                        </Col>

                        {/* CONTENT */}
                        <Col md="7">
                          <CardBody>
                            <div className="d-flex justify-content-between mb-2">
                              <span
                                style={{
                                  backgroundColor: "#b2ffcf",
                                  color: "#16A34A",
                                  padding: "4px 10px",
                                  borderRadius: 12,
                                  fontSize: 12,
                                  fontWeight: 600,
                                  lineHeight: 1,
                                  display: "inline-flex",
                                  alignItems: "center",
                                }}
                              >
                                {tour.category}
                              </span>
                              <div
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                  gap: 4,
                                  fontSize: 15,
                                  fontWeight: 600,
                                  color: "#F59E0B",
                                  marginRight: "15rem",
                                }}
                              >
                                <FaStar size={12} />
                                4.8
                              </div>

                              <Button
                                size="sm"
                                color="light"
                                onClick={() => copyTourLink(tour)}
                              >
                                <FaShareAlt />
                              </Button>
                            </div>

                            <h5 className="fw-bold">{tour.title}</h5>

                            <p className="text-muted mb-1">{tour.address}</p>

                            <p className="small mb-2">
                              {dates
                                ? `${formatDate(dates.start)} – ${formatDate(
                                    dates.end,
                                  )}`
                                : "—"}
                            </p>

                            <p className="small text-muted">{tour.details}</p>

                            <div className="d-flex justify-content-between align-items-center mt-3">
                              <div className="fw-bold text-success">
                                ₱{Number(tour.joinerPrice).toLocaleString()}
                                <small className="text-muted">
                                  {" "}
                                  / pax • {tour.joinerMaxSlots} slots
                                </small>
                              </div>
                            </div>

                            <div className="d-flex gap-2 mt-3">
                              <Button
                                color="success"
                                onClick={() => bookNow(tour)}
                              >
                                Book Now
                              </Button>

                              <Button
                                outline
                                color="success"
                                onClick={() => openDetails(tour)}
                              >
                                View Details
                              </Button>
                            </div>
                          </CardBody>
                        </Col>
                      </Row>
                    </Card>
                  );
                })}
              </div>

              {loading && <p className="text-center mt-4">Loading tours...</p>}
            </Col>
          </Row>
        </Container>
      </section>
    </>
  );
}
