import React, { useMemo, useRef, useState } from "react";
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
import { FaPlus, FaEdit, FaTrash, FaImage, FaVideo } from "react-icons/fa";

export default function CoordinatorTours() {
  const green = "#16A34A";
  const border = "#E5E7EB";
  const muted = "#6B7280";
  const text = "#111827";

  const cardStyle = {
    border: `1px solid ${border}`,
    borderRadius: 16,
    boxShadow: "0 1px 0 rgba(0,0,0,0.02)",
  };

  const tagStyle = {
    backgroundColor: "#DCFCE7",
    color: green,
    borderRadius: 999,
    padding: "6px 12px",
    fontSize: 12,
    fontWeight: 700,
    display: "inline-block",
  };

  const iconBtn = (color) => ({
    width: 34,
    height: 34,
    borderRadius: 10,
    display: "grid",
    placeItems: "center",
    border: `1px solid ${border}`,
    background: "#fff",
    color,
  });

  const dropzoneStyle = {
    border: `2px dashed ${border}`,
    borderRadius: 14,
    padding: "18px 14px",
    background: "#fff",
    display: "grid",
    placeItems: "center",
    textAlign: "center",
    cursor: "pointer",
  };

  const dropHintStyle = {
    marginTop: 8,
    fontSize: 12,
    color: green,
    fontWeight: 700,
  };

  const initialPackages = useMemo(
    () => [
      {
        id: crypto.randomUUID(),
        title: "Mount Pinatubo Trek",
        category: "Mountain Climbing",
        duration: "May 7 - May 10, 2024",
        meetup: "Tarlac City Hall",
        details:
          "Experience the breathtaking crater lake of Mount Pinatubo with our guided trekking tour.",
        inclusion: "Transportation, guide, meals, permits, equipment.",
        mapEmbedUrl:
          "https://www.google.com/maps?q=Mount%20Pinatubo&output=embed",
        joinType: "Join a group",
        price: 2800,
        slots: 15,
        pictures: [],
        videos: [],
      },
    ],
    []
  );

  const [packages, setPackages] = useState(initialPackages);

  // Modal + form state
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState("add"); // "add" | "edit"
  const [editId, setEditId] = useState(null);

  const picturesInputRef = useRef(null);
  const videosInputRef = useRef(null);

  const [form, setForm] = useState({
    title: "",
    category: "Mountain Climbing",
    duration: "",
    meetup: "",
    details: "",
    inclusion: "",
    mapEmbedUrl: "https://www.google.com/maps?q=Mount%20Pinatubo&output=embed",
    joinType: "Join a group",
    price: "",
    slots: "",
    pictures: [],
    videos: [],
  });

  const toggle = () => setOpen((v) => !v);

  const resetForm = () => {
    setForm({
      title: "",
      category: "Mountain Climbing",
      duration: "",
      meetup: "",
      details: "",
      inclusion: "",
      mapEmbedUrl: "https://www.google.com/maps?q=Mount%20Pinatubo&output=embed",
      joinType: "Join a group",
      price: "",
      slots: "",
      pictures: [],
      videos: [],
    });
  };

  const openAdd = () => {
    setMode("add");
    setEditId(null);
    resetForm();
    setOpen(true);
  };

  const openEdit = (pkg) => {
    setMode("edit");
    setEditId(pkg.id);
    setForm({
      title: pkg.title,
      category: pkg.category,
      duration: pkg.duration,
      meetup: pkg.meetup,
      details: pkg.details,
      inclusion: pkg.inclusion || "",
      mapEmbedUrl:
        pkg.mapEmbedUrl ||
        "https://www.google.com/maps?q=Mount%20Pinatubo&output=embed",
      joinType: pkg.joinType,
      price: String(pkg.price),
      slots: String(pkg.slots),
      pictures: pkg.pictures || [],
      videos: pkg.videos || [],
    });
    setOpen(true);
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

  const handleVideos = (e) => {
    const files = Array.from(e.target.files || []);
    setForm((prev) => ({
      ...prev,
      videos: [...prev.videos, ...files],
    }));
  };

  const removeFile = (type, idx) => {
    setForm((prev) => {
      const next = [...prev[type]];
      next.splice(idx, 1);
      return { ...prev, [type]: next };
    });
  };

  const handleSave = (e) => {
    e.preventDefault();

    if (!form.title.trim()) return alert("Title is required.");
    if (!form.duration.trim()) return alert("Duration is required.");
    if (!form.meetup.trim()) return alert("Meetup is required.");
    if (!form.details.trim()) return alert("Details is required.");

    const payload = {
      id: mode === "edit" ? editId : crypto.randomUUID(),
      title: form.title.trim(),
      category: form.category,
      duration: form.duration.trim(),
      meetup: form.meetup.trim(),
      details: form.details.trim(),
      inclusion: form.inclusion.trim(),
      mapEmbedUrl: form.mapEmbedUrl.trim(),
      joinType: form.joinType,
      price: Number(form.price || 0),
      slots: Number(form.slots || 0),
      pictures: form.pictures,
      videos: form.videos,
    };

    if (mode === "add") {
      setPackages((prev) => [payload, ...prev]);
    } else {
      setPackages((prev) => prev.map((p) => (p.id === editId ? payload : p)));
    }

    setOpen(false);
    resetForm();
  };

  const handleDelete = (id) => {
    const ok = window.confirm("Delete this tour package?");
    if (!ok) return;
    setPackages((prev) => prev.filter((p) => p.id !== id));
  };

  const formatPeso = (n) =>
    new Intl.NumberFormat("en-PH", {
      style: "currency",
      currency: "PHP",
      maximumFractionDigits: 0,
    }).format(n);

  const inclusionMax = 500;

  return (
    <Container fluid style={{ fontFamily: "Poppins" }}>
      {/* Header */}
      <Row className="align-items-start mb-3">
        <Col xs="8">
          <h2 style={{ fontWeight: 900, letterSpacing: "-0.5px" }}>
            Tour Package <br className="d-sm-none" />
            Management
          </h2>
        </Col>

        <Col xs="4" className="text-end">
          <Button
            color="success"
            onClick={openAdd}
            style={{
              borderRadius: 12,
              fontWeight: 700,
              backgroundColor: green,
              border: "none",
              padding: "10px 12px",
              whiteSpace: "nowrap",
            }}
          >
            <FaPlus style={{ marginRight: 8 }} />
            Add new Package
          </Button>
        </Col>
      </Row>

      {/* List */}
      <Row className="g-3">
        {packages.map((pkg) => (
          <Col key={pkg.id} xs="12" md="6" lg="4">
            <Card style={cardStyle}>
              <CardBody style={{ padding: 18 }}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    gap: 10,
                    alignItems: "flex-start",
                  }}
                >
                  <div style={{ minWidth: 0 }}>
                    <div
                      style={{
                        fontWeight: 900,
                        fontSize: 16,
                        color: text,
                        lineHeight: 1.2,
                      }}
                    >
                      {pkg.title}
                    </div>
                  </div>

                  <div style={{ display: "flex", gap: 8 }}>
                    <Button
                      color="link"
                      className="p-0"
                      onClick={() => openEdit(pkg)}
                      style={iconBtn("#2563EB")}
                      title="Edit"
                    >
                      <FaEdit />
                    </Button>

                    <Button
                      color="link"
                      className="p-0"
                      onClick={() => handleDelete(pkg.id)}
                      style={iconBtn("#DC2626")}
                      title="Delete"
                    >
                      <FaTrash />
                    </Button>
                  </div>
                </div>

                <div style={{ marginTop: 12 }}>
                  <span style={tagStyle}>{pkg.category}</span>
                </div>

                <div style={{ marginTop: 16 }}>
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "80px 1fr",
                      rowGap: 10,
                      columnGap: 10,
                      fontSize: 13,
                    }}
                  >
                    <div style={{ color: muted, fontWeight: 700 }}>Duration:</div>
                    <div style={{ color: text }}>{pkg.duration}</div>

                    <div style={{ color: muted, fontWeight: 700 }}>Meetup:</div>
                    <div style={{ color: text }}>{pkg.meetup}</div>

                    <div style={{ color: muted, fontWeight: 700 }}>Details:</div>
                    <div style={{ color: text, lineHeight: 1.4 }}>{pkg.details}</div>
                  </div>
                </div>

                <div
                  style={{
                    marginTop: 16,
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    gap: 10,
                    fontSize: 13,
                  }}
                >
                  <div style={{ color: muted, fontWeight: 700 }}>{pkg.joinType}:</div>

                  <div style={{ color: text, fontWeight: 900 }}>
                    {formatPeso(pkg.price)}{" "}
                    <span style={{ color: muted, fontWeight: 600 }}>
                      ({pkg.slots} slots)
                    </span>
                  </div>
                </div>
              </CardBody>
            </Card>
          </Col>
        ))}
      </Row>

      {/* Modal */}
      <Modal isOpen={open} toggle={toggle} centered size="lg">
        <ModalHeader toggle={toggle}>
          {mode === "add" ? "Add Tour Package" : "Edit Tour Package"}
        </ModalHeader>

        <ModalBody>
          <Form onSubmit={handleSave}>
            {/* Basic info */}
            <Row className="g-3">
              <Col xs="12">
                <FormGroup>
                  <Label className="fw-semibold">Title</Label>
                  <Input
                    value={form.title}
                    onChange={onChange("title")}
                    placeholder="e.g. Mount Pinatubo Trek"
                    required
                  />
                </FormGroup>
              </Col>

              <Col xs="12" md="6">
                <FormGroup>
                  <Label className="fw-semibold">Category</Label>
                  <Input
                    type="select"
                    value={form.category}
                    onChange={onChange("category")}
                  >
                    <option>Mountain Climbing</option>
                    <option>Scuba Diving</option>
                    <option>Island Hopping</option>
                    <option>Camping</option>
                    <option>Hiking</option>
                  </Input>
                </FormGroup>
              </Col>

              <Col xs="12" md="6">
                <FormGroup>
                  <Label className="fw-semibold">Duration</Label>
                  <Input
                    value={form.duration}
                    onChange={onChange("duration")}
                    placeholder="e.g. May 7 - May 10, 2024"
                    required
                  />
                </FormGroup>
              </Col>

              <Col xs="12" md="6">
                <FormGroup>
                  <Label className="fw-semibold">Meetup</Label>
                  <Input
                    value={form.meetup}
                    onChange={onChange("meetup")}
                    placeholder="e.g. Tarlac City Hall"
                    required
                  />
                </FormGroup>
              </Col>

              <Col xs="12" md="6">
                <FormGroup>
                  <Label className="fw-semibold">Join Type</Label>
                  <Input
                    type="select"
                    value={form.joinType}
                    onChange={onChange("joinType")}
                  >
                    <option>Join a group</option>
                    <option>Private tour</option>
                  </Input>
                </FormGroup>
              </Col>

              <Col xs="6" md="3">
                <FormGroup>
                  <Label className="fw-semibold">Price</Label>
                  <Input
                    type="number"
                    min="0"
                    value={form.price}
                    onChange={onChange("price")}
                    placeholder="2800"
                  />
                </FormGroup>
              </Col>

              <Col xs="6" md="3">
                <FormGroup>
                  <Label className="fw-semibold">Slots</Label>
                  <Input
                    type="number"
                    min="0"
                    value={form.slots}
                    onChange={onChange("slots")}
                    placeholder="15"
                  />
                </FormGroup>
              </Col>

              <Col xs="12">
                <FormGroup>
                  <Label className="fw-semibold">Details</Label>
                  <Input
                    type="textarea"
                    rows="3"
                    value={form.details}
                    onChange={onChange("details")}
                    placeholder="Tour description..."
                    required
                  />
                </FormGroup>
              </Col>
            </Row>

            {/* Map embed */}
            <div style={{ marginTop: 18 }}>
              <Label className="fw-semibold">Google Map Embed</Label>
              <div
                style={{
                  marginTop: 8,
                  border: `1px solid ${border}`,
                  borderRadius: 14,
                  overflow: "hidden",
                  background: "#fff",
                }}
              >
                <iframe
                  title="map"
                  src={form.mapEmbedUrl}
                  width="100%"
                  height="170"
                  style={{ border: 0, display: "block" }}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>

              <div style={{ marginTop: 10 }}>
                <Input
                  value={form.mapEmbedUrl}
                  onChange={onChange("mapEmbedUrl")}
                  placeholder="Paste Google maps embed URL (…output=embed)"
                />
                <div style={{ fontSize: 12, color: muted, marginTop: 6 }}>
                  Tip: Use this format: https://www.google.com/maps?q=YOUR_PLACE&output=embed
                </div>
              </div>
            </div>

            {/* Package inclusion */}
            <div style={{ marginTop: 18 }}>
              <Label className="fw-semibold">
                Package Inclusion <span style={{ color: "#DC2626" }}>*</span>
              </Label>

              <div style={{ marginTop: 8 }}>
                <Input
                  type="textarea"
                  rows="4"
                  value={form.inclusion}
                  onChange={(e) => {
                    const val = e.target.value.slice(0, inclusionMax);
                    setForm((p) => ({ ...p, inclusion: val }));
                  }}
                  placeholder="Transportation, guide, meals, permits, equipment..."
                  style={{
                    borderRadius: 14,
                    padding: 14,
                    borderColor: border,
                  }}
                />
                <div style={{ fontSize: 12, color: muted, marginTop: 6 }}>
                  {form.inclusion.length}/{inclusionMax} characters
                </div>
              </div>
            </div>

            {/* Upload pictures */}
            <div style={{ marginTop: 18 }}>
              <Label className="fw-semibold">Upload Pictures</Label>

              <input
                ref={picturesInputRef}
                type="file"
                accept="image/*"
                multiple
                hidden
                onChange={handlePictures}
              />

              <div
                style={{ ...dropzoneStyle, marginTop: 8 }}
                onClick={() => picturesInputRef.current?.click()}
              >
                <FaImage size={20} color={muted} />
                <div style={dropHintStyle}>Click to upload images</div>
              </div>

              {/* Selected images */}
              {form.pictures.length > 0 && (
                <div style={{ marginTop: 10, display: "grid", gap: 8 }}>
                  {form.pictures.map((file, idx) => (
                    <div
                      key={idx}
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        gap: 10,
                        alignItems: "center",
                        padding: "10px 12px",
                        border: `1px solid ${border}`,
                        borderRadius: 12,
                        fontSize: 13,
                      }}
                    >
                      <div style={{ color: text, overflow: "hidden", textOverflow: "ellipsis" }}>
                        {file.name}
                      </div>
                      <Button
                        size="sm"
                        outline
                        color="danger"
                        onClick={() => removeFile("pictures", idx)}
                      >
                        Remove
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Upload videos */}
            <div style={{ marginTop: 18 }}>
              <Label className="fw-semibold">Upload Videos</Label>

              <input
                ref={videosInputRef}
                type="file"
                accept="video/*"
                multiple
                hidden
                onChange={handleVideos}
              />

              <div
                style={{ ...dropzoneStyle, marginTop: 8 }}
                onClick={() => videosInputRef.current?.click()}
              >
                <FaVideo size={20} color={muted} />
                <div style={dropHintStyle}>Click to upload videos</div>
              </div>

              {/* Selected videos */}
              {form.videos.length > 0 && (
                <div style={{ marginTop: 10, display: "grid", gap: 8 }}>
                  {form.videos.map((file, idx) => (
                    <div
                      key={idx}
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        gap: 10,
                        alignItems: "center",
                        padding: "10px 12px",
                        border: `1px solid ${border}`,
                        borderRadius: 12,
                        fontSize: 13,
                      }}
                    >
                      <div style={{ color: text, overflow: "hidden", textOverflow: "ellipsis" }}>
                        {file.name}
                      </div>
                      <Button
                        size="sm"
                        outline
                        color="danger"
                        onClick={() => removeFile("videos", idx)}
                      >
                        Remove
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer buttons */}
            <div className="d-flex justify-content-end gap-2 mt-4">
              <Button type="button" outline onClick={toggle}>
                Cancel
              </Button>
              <Button
                type="submit"
                color="success"
                style={{ backgroundColor: green, border: "none", fontWeight: 700 }}
              >
                {mode === "add" ? "Create Package" : "Save Changes"}
              </Button>
            </div>
          </Form>
        </ModalBody>
      </Modal>
    </Container>
  );
}
