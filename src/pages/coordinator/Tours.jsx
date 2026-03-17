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
import {
  FaPlus,
  FaImage,
  FaTrash,
  FaEdit,
  FaCalendarAlt,
} from "react-icons/fa";
import api from "@/services/api";
import { forwardRef } from "react";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const normalizeToArray = (value) => {
  if (!value) return [];

  // already an array
  if (Array.isArray(value)) return value;

  // stringified JSON array
  if (typeof value === "string") {
    try {
      const parsed = JSON.parse(value);
      if (Array.isArray(parsed)) return parsed;
    } catch {
      // fallback: comma or newline separated
      return value
        .split(/,|\n/)
        .map((v) => v.trim())
        .filter(Boolean);
    }
  }

  return [];
};

const CalendarButton = forwardRef(({ value, onClick }, ref) => (
  <Button
    innerRef={ref}
    onClick={onClick}
    color="success"
    outline
    style={{
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      width: 45,
      height: 45,
      borderRadius: "50%",
    }}
  >
    <FaCalendarAlt />
  </Button>
));

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
  const [privateRange, setPrivateRange] = useState([null, null]);
  const [privateStart, privateEnd] = privateRange;

  const [dateRange, setDateRange] = useState([null, null]);
  const [startDate, endDate] = dateRange;

  const [form, setForm] = useState({
    title: "",
    category: "Mountain Climbing",
    address: "",
    meetupLocations: "",
    details: "",
    packageInclusions: "",
    itinerary: [[""]],
    thingsToBring: "",
    joinerPrice: "",
    joinerMaxSlots: "",
    privateBookingPrice: "",
    pictures: [],
  });

  const [isEdit, setIsEdit] = useState(false);
  const [editingTourId, setEditingTourId] = useState(null);

  const handleEdit = (tour) => {
    setIsEdit(true);
    setEditingTourId(tour._id || tour.id);

    setForm({
      title: tour.title || "",
      category: tour.category || "Mountain Climbing",
      address: tour.address || "",
      meetupLocations: normalizeToArray(tour.meetupLocations).join(", "),
      details: tour.details || "",
      packageInclusions: normalizeToArray(tour.packageInclusions).join(", "),
      itinerary: Array.isArray(tour.itinerary) ? tour.itinerary : [[""]],
      thingsToBring: normalizeToArray(tour.thingsToBring).join("\n"),
      joinerPrice: tour.joinerPrice || "",
      joinerMaxSlots: tour.joinerMaxSlots || "",
      privateBookingPrice: tour.privateBookingPrice || "",
      pictures: [],
    });

    const parsed = parseAvailableDates(tour.availableDates);

    if (parsed.length > 0) {
      setDateRange([parsed[0].start, parsed[0].end]);
    } else {
      setDateRange([null, null]);
    }

    setOpen(true);
  };

  /* ================= DATE HELPERS ================= */

  const parseAvailableDates = (availableDates) => {
    if (!Array.isArray(availableDates) || availableDates.length === 0)
      return [];

    // convert string dates to Date objects
    const dates = availableDates
      .map((d) => new Date(d))
      .filter((d) => !isNaN(d.getTime()));

    if (dates.length === 0) return [];

    // first and last date = range
    return [
      {
        start: dates[0],
        end: dates[dates.length - 1],
      },
    ];
  };

  const formatDate = (date) =>
    date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });

  /* ================= HELPERS ================= */
  const toggle = () => setOpen(!open);

  const resetForm = () => {
    setIsEdit(false);
    setEditingTourId(null);

    setForm({
      title: "",
      category: "Mountain Climbing",
      address: "",
      meetupLocations: "",
      details: "",
      packageInclusions: "",
      itinerary: [[""]],
      thingsToBring: "",
      joinerPrice: "",
      joinerMaxSlots: "",
      privateBookingPrice: "",
      pictures: [],
    });
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
      const res = await api.get(`${API_BASE}tours/my-tours`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTours(res.data || []);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load tours");
    }
  };

  useEffect(() => {
    fetchMyTours();
  }, []);

  /* ================= CREATE TOUR ================= */
  const handleSave = async (e) => {
    e.preventDefault();

    if (!token) {
      toast.error("Unauthorized. Please login again.");
      return;
    }

    setLoading(true);

    const fd = new FormData();

    fd.append("title", form.title);
    fd.append("category", form.category);
    fd.append("address", form.address);
    fd.append("details", form.details);

    let availableDatesPayload = [];

    if (startDate && endDate) {
      const current = new Date(startDate);

      while (current <= endDate) {
        const utcDate = new Date(
          Date.UTC(
            current.getFullYear(),
            current.getMonth(),
            current.getDate(),
          ),
        );

        availableDatesPayload.push(utcDate.toISOString());

        current.setDate(current.getDate() + 1);
      }
    }

    // IMPORTANT: Append ONLY ONCE
    fd.append("availableDates", JSON.stringify(availableDatesPayload));

    // console.log("DATES:", availableDatesPayload);

    fd.append(
      "meetupLocations",
      JSON.stringify(
        form.meetupLocations
          .split(",")
          .map((m) => m.trim())
          .filter(Boolean),
      ),
    );
    fd.append("packageInclusions", form.packageInclusions);

    fd.append("itinerary", JSON.stringify(form.itinerary.map((day) => day[0])));

    fd.append(
      "thingsToBring",
      JSON.stringify(
        form.thingsToBring
          .split("\n")
          .map((i) => i.trim())
          .filter(Boolean),
      ),
    );

    fd.append("joinerPrice", form.joinerPrice);
    fd.append("joinerMaxSlots", form.joinerMaxSlots);
    fd.append("privateBookingPrice", form.privateBookingPrice);

    form.pictures.forEach((file) => fd.append("pictures", file));

    // for (let pair of fd.entries()) {
    //   console.log(pair[0], ":", pair[1]);
    // }

    const toastId = toast.loading(
      isEdit ? "Updating tour..." : "Creating tour...",
    );

    try {
      if (isEdit && editingTourId) {
        await api.put(`${API_BASE}tours/update/${editingTourId}`, fd, {
          headers: { Authorization: `Bearer ${token}` },
        });

        toast.update(toastId, {
          render: "✏️ Tour updated successfully",
          type: "success",
          isLoading: false,
          autoClose: 2000,
        });
      } else {
        await api.post(`${API_BASE}tours/create`, fd, {
          headers: { Authorization: `Bearer ${token}` },
        });

        toast.update(toastId, {
          render: "🎉 Tour created successfully",
          type: "success",
          isLoading: false,
          autoClose: 2000,
        });
      }

      toggle();
      resetForm();
      fetchMyTours();
    } catch (err) {
      console.error(err.response?.data);

      const errorMessage =
        err.response?.data?.message || "Something went wrong.";

      toast.update(toastId, {
        render: `❌ ${errorMessage}`,
        type: "error",
        isLoading: false,
        autoClose: 4000,
      });
    } finally {
      setLoading(false);
    }
  };

  /* ================= DELETE TOUR ================= */
  const handleDelete = (tourId) => {
    if (!token) {
      toast.error("Unauthorized. Please login again.");
      return;
    }

    toast(
      ({ closeToast }) => (
        <div>
          <p style={{ fontWeight: 600 }}>
            Are you sure you want to delete this tour?
          </p>

          <div className="d-flex justify-content-end gap-2 mt-2">
            <Button size="sm" color="secondary" onClick={closeToast}>
              Cancel
            </Button>

            <Button
              size="sm"
              color="danger"
              onClick={async () => {
                closeToast();

                // ✅ SAFE SNAPSHOT
                const previousTours = [...tours];

                // ✅ REAL-TIME UI UPDATE
                setTours((prev) =>
                  prev.filter((t) => (t._id || t.id) !== tourId),
                );

                try {
                  await api.delete(`${API_BASE}tours/${tourId}`, {
                    headers: { Authorization: `Bearer ${token}` },
                  });

                  toast.success("🗑️ Tour deleted successfully");
                } catch (error) {
                  console.error(error);

                  // 🔁 ROLLBACK IF FAILED
                  setTours(previousTours);

                  toast.error(
                    error?.response?.data?.message ||
                      "❌ Failed to delete tour. Restored.",
                  );
                }
              }}
            >
              Delete
            </Button>
          </div>
        </div>
      ),
      {
        autoClose: false,
        closeOnClick: false,
        draggable: false,
      },
    );
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
            onClick={() => {
              resetForm();
              setOpen(true);
            }}
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
                      <Button
                        size="sm"
                        color="link"
                        className="p-0"
                        onClick={() => handleEdit(t)}
                      >
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
                      {dates.length > 0
                        ? dates.map((d, i) => (
                            <div key={i}>
                              {formatDate(d.start)} – {formatDate(d.end)}
                            </div>
                          ))
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
        <ModalHeader toggle={toggle}>
          {isEdit ? "Update Tour" : "Create Tour"}
        </ModalHeader>
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
                <option>Nature & Cultural </option>
                <option>Adventure & Extreme </option>
                <option>Beach & Relaxation </option>
              </Input>
            </FormGroup>

            <FormGroup>
              <Label>Address *</Label>
              <Input
                value={form.address}
                onChange={onChange("address")}
                placeholder="Tour address / general location"
                required
              />
            </FormGroup>

            <FormGroup>
              <Label>Meetup Locations (comma separated)</Label>
              <Input
                value={form.meetupLocations}
                onChange={onChange("meetupLocations")}
                placeholder="MOA, Pasig Covered Court"
              />
            </FormGroup>

            <FormGroup>
              <Label>Available Dates *</Label>

              <DatePicker
                selectsRange
                startDate={startDate}
                endDate={endDate}
                onChange={(update) => setDateRange(update)}
                customInput={<CalendarButton />}
                minDate={new Date()}
                monthsShown={2}
                shouldCloseOnSelect={true}
                dateFormat="MMM d, yyyy"
              />

              {/* Show selected range text */}
              {startDate && endDate && (
                <div className="mt-2 small text-muted">
                  {startDate.toLocaleDateString()} –{" "}
                  {endDate.toLocaleDateString()}
                </div>
              )}
            </FormGroup>

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
              <Label>Itinerary</Label>

              {form.itinerary.map((day, dayIndex) => (
                <div
                  key={dayIndex}
                  style={{
                    border: "1px solid #E5E7EB",
                    padding: 12,
                    borderRadius: 8,
                    marginBottom: 10,
                  }}
                >
                  <strong>Day {dayIndex + 1}</strong>

                  <Input
                    className="mt-2"
                    placeholder="Activity (e.g. Arrival, Summit Trek)"
                    value={day[0]}
                    onChange={(e) => {
                      const updated = [...form.itinerary];
                      updated[dayIndex][0] = e.target.value;
                      setForm((prev) => ({ ...prev, itinerary: updated }));
                    }}
                  />

                  {form.itinerary.length > 1 && (
                    <Button
                      size="sm"
                      color="danger"
                      className="mt-2"
                      onClick={() => {
                        const updated = form.itinerary.filter(
                          (_, i) => i !== dayIndex,
                        );
                        setForm((prev) => ({ ...prev, itinerary: updated }));
                      }}
                    >
                      Remove Day
                    </Button>
                  )}
                </div>
              ))}

              <Button
                type="button"
                color="success"
                outline
                onClick={() =>
                  setForm((prev) => ({
                    ...prev,
                    itinerary: [...prev.itinerary, [""]],
                  }))
                }
              >
                + Add Day
              </Button>
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

            {/* <FormGroup>
              <Label>Private Booking Price</Label>
              <Input
                type="number"
                value={form.privateBookingPrice}
                onChange={onChange("privateBookingPrice")}
                placeholder="Price for private booking"
              />
            </FormGroup> */}

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
                style={{ background: green, border: "none", fontWeight: 700 }}
              >
                {loading ? "Saving..." : isEdit ? "Update Tour" : "Create Tour"}
              </Button>
            </div>
          </Form>
        </ModalBody>
      </Modal>
      <ToastContainer
        position="top-right"
        autoClose={2500}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        pauseOnHover
      />
    </Container>
  );
}
