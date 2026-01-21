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

    const qLocation = normalize(applied.location);
    const qType = normalize(applied.adventureType);

    if (qLocation) {
      list = list.filter((t) => normalize(t.address).includes(qLocation));
    }

    if (qType && qType !== "all") {
      list = list.filter((t) =>
        normalize(t.category).includes(qType.replace("-", " ")),
      );
    }

    return list;
  }, [applied, tours]);

  /* ================= ACTIONS ================= */

  const openDetails = (tour) => {
    navigate(`/tours/details/${tour._id}`);
  };

  const bookNow = (tour) => {
    navigate("/book", { state: { tourId: tour._id } });
  };

  const copyTourLink = async (tour) => {
    const url = `${window.location.origin}/tours/details/${tour._id}`;
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

      {/* SEARCH */}
      <section style={{ padding: "3rem 0", background: "#F9FAFB" }}>
        <Container>
          <Form onSubmit={handleSearch}>
            <Row className="g-3 align-items-end">
              <Col md="4">
                <FormGroup>
                  <Label>Date</Label>
                  <Input
                    placeholder="Any"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                  />
                </FormGroup>
              </Col>
              <Col md="4">
                <FormGroup>
                  <Label>Location</Label>
                  <Input
                    placeholder="Enter location"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                  />
                </FormGroup>
              </Col>
              <Col md="4">
                <FormGroup>
                  <Label>Adventure Type</Label>
                  <Input
                    type="select"
                    value={adventureType}
                    onChange={(e) => setAdventureType(e.target.value)}
                  >
                    <option value="all">All</option>
                    <option value="Mountain">Mountain Climbing</option>
                    <option value="Island">Island Hopping</option>
                    <option value="Scuba">Scuba Diving</option>
                    <option value="Camping">Camping</option>
                    <option value="Hiking">Hiking</option>
                  </Input>
                </FormGroup>
              </Col>
            </Row>

            <Row className="mt-3">
              <Col className="d-flex gap-2">
                <Button color="secondary" type="button" onClick={clearAll}>
                  Clear
                </Button>
                <Button color="success" type="submit">
                  Search
                </Button>
              </Col>
            </Row>
          </Form>
        </Container>
      </section>

      {/* TOURS */}
      <section style={{ padding: "3rem 0" }}>
        <Container>
          <h2 className="fw-bold text-center mb-3">Available Tours</h2>
          <p className="text-center text-muted mb-4">
            {filteredTours.length} tours found
          </p>

          <Row className="g-4">
            {filteredTours.map((tour) => {
              const dates = parseAvailableDates(tour.availableDates);

              return (
                <Col md="6" lg="4" key={tour._id || tour.id}>
                  <Card
                    className="h-100 shadow-sm"
                    style={{ borderRadius: 16 }}
                  >
                    <CardImg
                      top
                      src={tour.pictureUrls?.[0] || "/fallback.jpg"}
                      alt={tour.title}
                      style={{ height: 220, objectFit: "cover" }}
                    />

                    <CardBody>
                      <div className="d-flex justify-content-between mb-2">
                        <span className="badge bg-success">
                          {tour.category}
                        </span>
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

                      <p className="small">
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
                        <div className="text-warning">
                          <FaStar /> 4.8
                        </div>
                      </div>

                      <div className="d-flex gap-2 mt-3">
                        <Button
                          color="success"
                          className="w-100"
                          onClick={() => bookNow(tour)}
                        >
                          Book Now
                        </Button>
                        <Button
                          outline
                          color="success"
                          className="w-100"
                          onClick={() => openDetails(tour)}
                        >
                          View Details
                        </Button>
                      </div>
                    </CardBody>
                  </Card>
                </Col>
              );
            })}
          </Row>

          {loading && <p className="text-center mt-4">Loading tours...</p>}
        </Container>
      </section>
    </>
  );
}
