import React, { useEffect, useRef, useState } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  CardBody,
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  Form,
  FormGroup,
  Label,
  Input,
} from "reactstrap";
import { FaPlus, FaImage, FaTrash, FaEdit } from "react-icons/fa";
import axios from "axios";

export default function CoordinatorTours() {
  const API_BASE =
    import.meta.env.VITE_API_BASE_URL || "https://api.travelko.site/";

  const token = localStorage.getItem("auth_token");

  const green = "#16A34A";
  const border = "#E5E7EB";
  const muted = "#6B7280";
  const text = "#111827";

  const picturesInputRef = useRef(null);

  /* ================= STATE ================= */
  const [tours, setTours] = useState([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const [dateRange, setDateRange] = useState({
    startDate: "",
    endDate: "",
  });

  const [form, setForm] = useState({
    title: "",
    category: "Mountain Climbing",
    address: "",
    details: "",
    packageInclusions: "",
    itinerary: "",
    thingsToBring: "",
    joinerPrice: "",
    joinerMaxSlots: "",
    pictures: [],
  });

  /* ================= DATE HELPERS ================= */

  // ✅ FIX: parse backend availableDates (string OR array)
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

    if (isNaN(start.getTime()) || isNaN(end.getTime())) return null;

    return { start, end };
  };

  const formatDate = (date) =>
    date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });

  const toStartOfDayISO = (date) =>
    new Date(`${date}T00:00:00.000Z`).toISOString();

  const toEndOfDayISO = (date) =>
    new Date(`${date}T23:59:59.999Z`).toISOString();

  /* ================= HELPERS ================= */
  const toggle = () => setOpen(!open);

  const resetForm = () => {
    setForm({
      title: "",
      category: "Mountain Climbing",
      address: "",
      details: "",
      packageInclusions: "",
      itinerary: "",
      thingsToBring: "",
      joinerPrice: "",
      joinerMaxSlots: "",
      pictures: [],
    });
    setDateRange({ startDate: "", endDate: "" });
  };

  const onChange = (key) => (e) =>
    setForm((prev) => ({ ...prev, [key]: e.target.value }));

  const handlePictures = (e) => {
    const files = Array.from(e.target.files || []);
    setForm((prev) => ({
      ...prev,
      pictures: [...prev.pictures, ...files],
    }));
  };

  const removePicture = (idx) => {
    setForm((prev) => {
      const next = [...prev.pictures];
      next.splice(idx, 1);
      return { ...prev, pictures: next };
    });
  };

  /* ================= FETCH TOURS ================= */
  const fetchMyTours = async () => {
    try {
      const res = await axios.get(`${API_BASE}tours/my-tours`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTours(res.data || []);
    } catch (err) {
      console.error(err);
      alert("Failed to load tours");
    }
  };

  useEffect(() => {
    fetchMyTours();
  }, []);

  /* ================= CREATE TOUR ================= */
  const handleSave = async (e) => {
    e.preventDefault();

    if (!token) {
      alert("Unauthorized. Please login again.");
      return;
    }

    setLoading(true);

    const fd = new FormData();

    fd.append("title", form.title);
    fd.append("category", form.category);
    fd.append("address", form.address);
    fd.append("details", form.details);

    fd.append(
      "availableDates",
      JSON.stringify([
        [
          toStartOfDayISO(dateRange.startDate),
          toEndOfDayISO(dateRange.endDate),
        ],
      ]),
    );

    fd.append("meetupLocations", JSON.stringify([form.address]));
    fd.append(
      "packageInclusions",
      JSON.stringify(form.packageInclusions.split(",").map((i) => i.trim())),
    );
    fd.append(
      "itinerary",
      JSON.stringify(form.itinerary.split("\n").map((i) => i.trim())),
    );
    fd.append(
      "thingsToBring",
      JSON.stringify(form.thingsToBring.split("\n").map((i) => i.trim())),
    );

    fd.append("joinerPrice", Number(form.joinerPrice));
    fd.append("joinerMaxSlots", Number(form.joinerMaxSlots));

    form.pictures.forEach((file) => fd.append("pictures", file));

    try {
      await axios.post(`${API_BASE}tours/create`, fd, {
        headers: { Authorization: `Bearer ${token}` },
      });

      alert("✅ Tour created successfully");
      toggle();
      resetForm();
      fetchMyTours();
    } catch (err) {
      console.error(err);
      alert("❌ Failed to create tour");
    } finally {
      setLoading(false);
    }
  };
  /* ================= DELETE TOUR ================= */
  const handleDelete = async (tourId) => {
    if (!token) {
      alert("Unauthorized. Please login again.");
      return;
    }

    const confirmDelete = window.confirm(
      "Are you sure you want to delete this tour?",
    );

    if (!confirmDelete) return;

    try {
      await axios.delete(`${API_BASE}tours/${tourId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // ✅ remove from UI instantly
      setTours((prev) => prev.filter((t) => t._id !== tourId));

      alert("✅ Tour deleted successfully");
    } catch (error) {
      console.error(error);
      alert(error?.response?.data?.message || "❌ Failed to delete tour");
    }
  };

  /* ================= UI ================= */
  return (
    <Container fluid style={{ fontFamily: "Poppins" }}>
      {/* HEADER */}
      <Row className="mb-3">
        <Col>
          <h2 style={{ fontWeight: 900 }}>Tour Package Management</h2>
        </Col>
        <Col className="text-end">
          <Button
            style={{ background: green, border: "none" }}
            onClick={toggle}
          >
            <FaPlus /> Add new Package
          </Button>
        </Col>
      </Row>

      {/* TOUR LIST */}
      <Row className="g-3">
        {tours.map((t) => {
          const dates = parseAvailableDates(t.availableDates);

          return (
            <Col md="4" key={t._id || t.id}>
              <Card style={{ border: `1px solid ${border}`, borderRadius: 16 }}>
                <CardBody style={{ padding: 18 }}>
                  <div className="d-flex justify-content-between">
                    <div>
                      <h5 style={{ fontWeight: 900 }}>{t.title}</h5>
                      <span
                        style={{
                          background: "#DCFCE7",
                          color: green,
                          padding: "6px 12px",
                          borderRadius: 999,
                          fontSize: 12,
                          fontWeight: 700,
                        }}
                      >
                        {t.category}
                      </span>
                    </div>

                    <div className="d-flex gap-2">
                      <Button size="sm" color="link" className="p-0">
                        <FaEdit />
                      </Button>
                      <Button
                        size="sm"
                        color="link"
                        className="p-0 text-danger"
                        onClick={() => handleDelete(t._id || t.id)}
                      >
                        <FaTrash />
                      </Button>
                    </div>
                  </div>

                  <div
                    style={{
                      marginTop: 16,
                      display: "grid",
                      gridTemplateColumns: "80px 1fr",
                      rowGap: 10,
                      fontSize: 13,
                    }}
                  >
                    <div style={{ color: muted, fontWeight: 700 }}>
                      Duration:
                    </div>
                    <div>
                      {dates
                        ? `${formatDate(dates.start)} – ${formatDate(
                            dates.end,
                          )}`
                        : "—"}
                    </div>

                    <div style={{ color: muted, fontWeight: 700 }}>Meetup:</div>
                    <div>{t.address}</div>

                    <div style={{ color: muted, fontWeight: 700 }}>
                      Details:
                    </div>
                    <div>{t.details}</div>
                  </div>

                  <div
                    style={{
                      marginTop: 18,
                      display: "flex",
                      justifyContent: "space-between",
                      fontSize: 13,
                    }}
                  >
                    <div style={{ color: muted, fontWeight: 700 }}>
                      Join a group:
                    </div>
                    <div style={{ fontWeight: 900 }}>
                      ₱{Number(t.joinerPrice).toLocaleString()}{" "}
                      <span style={{ color: muted }}>
                        ({t.joinerMaxSlots} slots)
                      </span>
                    </div>
                  </div>
                </CardBody>
              </Card>
            </Col>
          );
        })}
      </Row>

      {/* CREATE TOUR MODAL */}
      <Modal isOpen={open} toggle={toggle} centered size="lg">
        <ModalHeader toggle={toggle}>Create Tour</ModalHeader>
        <ModalBody>
          <Form onSubmit={handleSave}>
            <FormGroup>
              <Label>Title *</Label>
              <Input value={form.title} onChange={onChange("title")} required />
            </FormGroup>

            <FormGroup>
              <Label>Category</Label>
              <Input
                type="select"
                value={form.category}
                onChange={onChange("category")}
              >
                <option>Mountain Climbing</option>
                <option>Island Hopping</option>
                <option>Scuba Diving</option>
                <option>Camping</option>
                <option>Hiking</option>
              </Input>
            </FormGroup>

            <FormGroup>
              <Label>Address / Meetup *</Label>
              <Input
                value={form.address}
                onChange={onChange("address")}
                required
              />
            </FormGroup>

            {/* DATE RANGE */}
            <Row>
              <Col md="6">
                <FormGroup>
                  <Label>Start Date *</Label>
                  <Input
                    type="date"
                    value={dateRange.startDate}
                    onChange={(e) =>
                      setDateRange((p) => ({
                        ...p,
                        startDate: e.target.value,
                      }))
                    }
                    required
                  />
                </FormGroup>
              </Col>
              <Col md="6">
                <FormGroup>
                  <Label>End Date *</Label>
                  <Input
                    type="date"
                    min={dateRange.startDate}
                    value={dateRange.endDate}
                    onChange={(e) =>
                      setDateRange((p) => ({
                        ...p,
                        endDate: e.target.value,
                      }))
                    }
                    required
                  />
                </FormGroup>
              </Col>
            </Row>

            <FormGroup>
              <Label>Details *</Label>
              <Input
                type="textarea"
                rows="3"
                value={form.details}
                onChange={onChange("details")}
                required
              />
            </FormGroup>

            <FormGroup>
              <Label>Package Inclusions (comma separated)</Label>
              <Input
                type="textarea"
                value={form.packageInclusions}
                onChange={onChange("packageInclusions")}
              />
            </FormGroup>

            <FormGroup>
              <Label>Itinerary (one per line)</Label>
              <Input
                type="textarea"
                value={form.itinerary}
                onChange={onChange("itinerary")}
              />
            </FormGroup>

            <FormGroup>
              <Label>Things to Bring (one per line)</Label>
              <Input
                type="textarea"
                value={form.thingsToBring}
                onChange={onChange("thingsToBring")}
              />
            </FormGroup>

            <Row>
              <Col md="6">
                <FormGroup>
                  <Label>Joiner Price</Label>
                  <Input
                    type="number"
                    value={form.joinerPrice}
                    onChange={onChange("joinerPrice")}
                    required
                  />
                </FormGroup>
              </Col>
              <Col md="6">
                <FormGroup>
                  <Label>Max Slots</Label>
                  <Input
                    type="number"
                    value={form.joinerMaxSlots}
                    onChange={onChange("joinerMaxSlots")}
                    required
                  />
                </FormGroup>
              </Col>
            </Row>

            {/* IMAGE UPLOAD */}
            <FormGroup>
              <Label>Pictures</Label>
              <input
                ref={picturesInputRef}
                type="file"
                multiple
                accept="image/*"
                hidden
                onChange={handlePictures}
              />
              <Button
                type="button"
                outline
                onClick={() => picturesInputRef.current.click()}
              >
                <FaImage /> Upload Images
              </Button>

              {form.pictures.map((file, idx) => (
                <div
                  key={idx}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginTop: 8,
                    border: `1px solid ${border}`,
                    padding: 8,
                    borderRadius: 8,
                  }}
                >
                  <span>{file.name}</span>
                  <Button
                    size="sm"
                    color="danger"
                    onClick={() => removePicture(idx)}
                  >
                    <FaTrash />
                  </Button>
                </div>
              ))}
            </FormGroup>

            <div className="text-end mt-4">
              <Button
                type="submit"
                disabled={loading}
                style={{
                  background: green,
                  border: "none",
                  fontWeight: 700,
                }}
              >
                {loading ? "Saving..." : "Create Tour"}
              </Button>
            </div>
          </Form>
        </ModalBody>
      </Modal>
    </Container>
  );
}
