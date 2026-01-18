import React, { useMemo, useState } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  CardBody,
  Button,
  Form,
  FormGroup,
  Label,
  Input,
} from "reactstrap";
import {
  FaUserCog,
  FaMapMarkerAlt,
  FaPlus,
  FaTrash,
  FaPen,
  FaUpload,
  FaRegFileVideo,
  FaRegImages,
} from "react-icons/fa";

export default function CoordinatorPortal() {
  const green = "#16A34A";
  const border = "#E5E7EB";
  const muted = "#6B7280";
  const text = "#111827";
  const bg = "#F9FAFB";

  const [tab, setTab] = useState("account"); // "account" | "tour"
  const [payment, setPayment] = useState("gcash");

  const [eligibility, setEligibility] = useState("");
  const [address, setAddress] = useState("");

  const seedTours = useMemo(
    () => [
      {
        id: 1,
        title: "Mount Pinatubo Trek",
        tag: "Mountain Climbing",
        duration: "May 7 – May 10, 2024",
        meetup: "Tarlac City Hall",
        details:
          "Experience the breathtaking crater lake of Mount Pinatubo with our guided trekking tour.",
        solo: "₱3,500",
        group: "₱2,800 (15 slots)",
        mapUrl:
          "https://www.google.com/maps?q=Tarlac%20City%20Hall&output=embed",
        inclusion: "Transportation, guide, meals, permits, equipment.",
        picturesCount: 0,
        videosCount: 0,
      },
    ],
    [],
  );

  const [tours, setTours] = useState(seedTours);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingId, setEditingId] = useState(null);

  // Tour form fields
  const [tourTitle, setTourTitle] = useState("");
  const [tourTag, setTourTag] = useState("Mountain Climbing");
  const [tourDuration, setTourDuration] = useState("");
  const [tourMeetup, setTourMeetup] = useState("");
  const [tourDetails, setTourDetails] = useState("");
  const [soloPrice, setSoloPrice] = useState("");
  const [groupPrice, setGroupPrice] = useState("");
  const [groupSlots, setGroupSlots] = useState("");
  const [mapEmbed, setMapEmbed] = useState(
    "https://www.google.com/maps?q=Tarlac%20City%20Hall&output=embed",
  );
  const [inclusion, setInclusion] = useState("");
  const [pictures, setPictures] = useState([]);
  const [videos, setVideos] = useState([]);

  const resetTourForm = () => {
    setTourTitle("");
    setTourTag("Mountain Climbing");
    setTourDuration("");
    setTourMeetup("");
    setTourDetails("");
    setSoloPrice("");
    setGroupPrice("");
    setGroupSlots("");
    setMapEmbed(
      "https://www.google.com/maps?q=Tarlac%20City%20Hall&output=embed",
    );
    setInclusion("");
    setPictures([]);
    setVideos([]);
    setEditingId(null);
  };

  const openAdd = () => {
    resetTourForm();
    setShowAddForm(true);
  };

  const openEdit = (t) => {
    setShowAddForm(true);
    setEditingId(t.id);

    setTourTitle(t.title || "");
    setTourTag(t.tag || "Mountain Climbing");
    setTourDuration(t.duration || "");
    setTourMeetup(t.meetup || "");
    setTourDetails(t.details || "");
    setSoloPrice((t.solo || "").replace(/[^\d]/g, "")); // demo
    setGroupPrice((t.group || "").replace(/[^\d]/g, "")); // demo
    setGroupSlots(
      t.group?.includes("(") ? t.group.split("(")[1].replace(/[^\d]/g, "") : "",
    );
    setMapEmbed(t.mapUrl || mapEmbed);
    setInclusion(t.inclusion || "");
    setPictures([]);
    setVideos([]);
  };

  const handleDelete = (id) => {
    setTours((prev) => prev.filter((x) => x.id !== id));
  };

  const safePeso = (n) => {
    const num = Number(n || 0);
    if (!num) return "";
    return `₱${num.toLocaleString("en-PH")}`;
  };

  const buildGroupText = (price, slots) => {
    const p = safePeso(price);
    const s = slots ? ` (${slots} slots)` : "";
    return `${p}${s}`.trim();
  };

  const saveTour = () => {
    // minimal validation (demo)
    if (!tourTitle.trim()) return alert("Tour title is required.");
    if (!tourDuration.trim()) return alert("Duration is required.");
    if (!tourMeetup.trim()) return alert("Meetup is required.");
    if (!tourDetails.trim()) return alert("Details is required.");

    const payload = {
      id: editingId ?? Date.now(),
      title: tourTitle.trim(),
      tag: tourTag,
      duration: tourDuration.trim(),
      meetup: tourMeetup.trim(),
      details: tourDetails.trim(),
      solo: safePeso(soloPrice) || "₱0",
      group: buildGroupText(groupPrice, groupSlots) || "₱0",
      mapUrl: mapEmbed.trim(),
      inclusion: inclusion.trim(),
      picturesCount: pictures?.length || 0,
      videosCount: videos?.length || 0,
    };

    if (editingId) {
      setTours((prev) => prev.map((t) => (t.id === editingId ? payload : t)));
    } else {
      setTours((prev) => [payload, ...prev]);
    }

    setShowAddForm(false);
    resetTourForm();
  };

  const pageWrap = {
    fontFamily: "Poppins",
    background: bg,
    minHeight: "100vh",
  };

  const headerStyle = {
    background: green,
    color: "white",
    padding: "22px 18px",
    borderRadius: 18,
  };

  const tabBar = {
    background: "white",
    border: `1px solid ${border}`,
    borderRadius: 16,
    overflow: "hidden",
  };

  const tabBtn = (active) => ({
    width: "100%",
    padding: "14px 12px",
    border: "none",
    background: "transparent",
    textAlign: "center",
    fontWeight: 900,
    color: active ? green : "#64748B",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    borderBottom: active ? `2px solid ${green}` : "2px solid transparent",
  });

  const sectionCard = {
    borderRadius: 18,
    border: `1px solid ${border}`,
    boxShadow: "0 1px 0 rgba(0,0,0,0.02)",
  };

  const labelStyle = { fontWeight: 800, color: text };
  const helpStyle = { fontSize: 12, color: muted };

  const dashedUpload = {
    border: `2px dashed ${border}`,
    borderRadius: 14,
    padding: "18px 14px",
    textAlign: "center",
    background: "white",
  };

  const pill = (bgc, col) => ({
    backgroundColor: bgc,
    color: col,
    borderRadius: 999,
    padding: "6px 12px",
    fontSize: 12,
    fontWeight: 900,
    display: "inline-block",
  });

  return (
    <div style={pageWrap}>
      <Container fluid style={{ padding: "18px 14px", maxWidth: 540 }}>
        {/* GREEN HEADER */}
        <div style={headerStyle}>
          <div style={{ fontSize: 22, fontWeight: 900 }}>
            Coordinator Portal
          </div>
          <div style={{ marginTop: 6, opacity: 0.95 }}>
            Manage your account and tour packages
          </div>
        </div>

        {/* TABS */}
        <div style={{ marginTop: 14, ...tabBar }}>
          <Row className="g-0">
            <Col xs="6">
              <button
                type="button"
                onClick={() => setTab("account")}
                style={tabBtn(tab === "account")}
              >
                <FaUserCog />
                Account Setup
              </button>
            </Col>
            <Col xs="6">
              <button
                type="button"
                onClick={() => setTab("tour")}
                style={tabBtn(tab === "tour")}
              >
                <FaMapMarkerAlt />
                Tour Setup
              </button>
            </Col>
          </Row>
        </div>

        {/* CONTENT */}
        <div style={{ marginTop: 14 }}>
          {/* ACCOUNT SETUP */}
          {tab === "account" ? (
            <Card style={sectionCard}>
              <CardBody style={{ padding: 16 }}>
                <div style={{ fontWeight: 900, fontSize: 20 }}>
                  Coordinator Account Setup
                </div>
                <div style={{ ...helpStyle, marginTop: 6 }}>
                  Please fill in your information to register as a travel
                  coordinator.
                </div>

                <Form style={{ marginTop: 14 }}>
                  <FormGroup className="mb-3">
                    <Label style={labelStyle}>Full Name *</Label>
                    <Input placeholder="Enter your full name" />
                  </FormGroup>

                  <FormGroup className="mb-3">
                    <Label style={labelStyle}>Email Address *</Label>
                    <Input
                      type="email"
                      placeholder="Enter your email address"
                    />
                  </FormGroup>

                  <FormGroup className="mb-3">
                    <Label style={labelStyle}>Complete Address *</Label>
                    <Input
                      type="textarea"
                      rows="3"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      placeholder="Enter your complete address"
                    />
                    <div style={helpStyle}>{address.length}/500 characters</div>
                  </FormGroup>

                  <FormGroup className="mb-3">
                    <Label style={labelStyle}>Contact Number *</Label>
                    <Input placeholder="+63 9XX XXX XXXX" />
                  </FormGroup>

                  <FormGroup className="mb-3">
                    <Label style={labelStyle}>Payment Registration *</Label>
                    <div style={{ display: "grid", gap: 10, marginTop: 8 }}>
                      <label
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 10,
                        }}
                      >
                        <Input
                          type="radio"
                          name="payment"
                          checked={payment === "gcash"}
                          onChange={() => setPayment("gcash")}
                        />
                        <span style={{ fontWeight: 800 }}>Gcash</span>
                      </label>

                      <label
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 10,
                        }}
                      >
                        <Input
                          type="radio"
                          name="payment"
                          checked={payment === "bank"}
                          onChange={() => setPayment("bank")}
                        />
                        <span style={{ fontWeight: 800 }}>Bank Transfer</span>
                      </label>
                    </div>
                  </FormGroup>

                  <FormGroup className="mb-3">
                    <Label style={labelStyle}>
                      Eligibility (You're a coordinator) *
                    </Label>
                    <Input
                      type="textarea"
                      rows="4"
                      value={eligibility}
                      onChange={(e) => setEligibility(e.target.value)}
                      placeholder="Describe your experience and qualifications as a travel coordinator..."
                    />
                    <div style={helpStyle}>
                      {eligibility.length}/500 characters
                    </div>
                  </FormGroup>

                  <FormGroup className="mb-3">
                    <Label style={labelStyle}>Valid ID *</Label>
                    <div style={dashedUpload}>
                      <div style={{ color: green, fontWeight: 900 }}>
                        Click to upload your valid ID
                      </div>
                      <div style={helpStyle}>PNG, JPG or PDF up to 10MB</div>
                      <Input type="file" style={{ marginTop: 10 }} />
                    </div>
                  </FormGroup>

                  <FormGroup className="mb-4">
                    <Label style={labelStyle}>Post Pictures</Label>
                    <div style={dashedUpload}>
                      <div style={{ color: green, fontWeight: 900 }}>
                        Click to upload images
                      </div>
                      <div style={helpStyle}>
                        Upload multiple images (JPG, PNG)
                      </div>
                      <Input type="file" multiple style={{ marginTop: 10 }} />
                    </div>
                  </FormGroup>

                  <Button
                    type="button"
                    style={{
                      width: "100%",
                      background: green,
                      border: "none",
                      borderRadius: 12,
                      padding: "12px 14px",
                      fontWeight: 900,
                    }}
                  >
                    Register as Coordinator
                  </Button>
                </Form>
              </CardBody>
            </Card>
          ) : (
            /* TOUR SETUP */
            <Card style={sectionCard}>
              <CardBody style={{ padding: 16 }}>
                {/* Header */}
                <Row className="align-items-start">
                  <Col>
                    <div style={{ fontWeight: 900, fontSize: 20 }}>
                      Tour Packages Management
                    </div>
                    <div style={{ ...helpStyle, marginTop: 6 }}>
                      Add, update, or delete your tour packages
                    </div>
                  </Col>

                  <Col xs="auto">
                    <Button
                      onClick={openAdd}
                      style={{
                        background: green,
                        border: "none",
                        borderRadius: 12,
                        fontWeight: 900,
                        padding: "10px 12px",
                        display: "inline-flex",
                        gap: 8,
                        alignItems: "center",
                      }}
                    >
                      <FaPlus />
                      Add new Package
                    </Button>
                  </Col>
                </Row>

                {/* ADD / EDIT FORM */}
                {showAddForm && (
                  <Card
                    style={{
                      marginTop: 14,
                      borderRadius: 16,
                      border: `1px solid ${border}`,
                    }}
                  >
                    <CardBody style={{ padding: 14 }}>
                      <div style={{ fontWeight: 900, fontSize: 16 }}>
                        {editingId ? "Edit Tour Package" : "Add Tour Package"}
                      </div>

                      <Form style={{ marginTop: 12 }}>
                        <FormGroup className="mb-3">
                          <Label style={labelStyle}>Tour Title *</Label>
                          <Input
                            value={tourTitle}
                            onChange={(e) => setTourTitle(e.target.value)}
                            placeholder="e.g. Mount Pinatubo Trek"
                          />
                        </FormGroup>

                        <Row className="g-3">
                          <Col xs="12" md="6">
                            <FormGroup className="mb-0">
                              <Label style={labelStyle}>Category/Tag</Label>
                              <Input
                                type="select"
                                value={tourTag}
                                onChange={(e) => setTourTag(e.target.value)}
                              >
                                <option>Mountain Climbing</option>
                                <option>Island Hopping</option>
                                <option>Scuba Diving</option>
                                <option>Camping</option>
                                <option>City Tour</option>
                              </Input>
                            </FormGroup>
                          </Col>

                          <Col xs="12" md="6">
                            <FormGroup className="mb-0">
                              <Label style={labelStyle}>Meetup *</Label>
                              <Input
                                value={tourMeetup}
                                onChange={(e) => setTourMeetup(e.target.value)}
                                placeholder="e.g. Tarlac City Hall"
                              />
                            </FormGroup>
                          </Col>
                        </Row>

                        <FormGroup className="mt-3">
                          <Label style={labelStyle}>Duration *</Label>
                          <Input
                            value={tourDuration}
                            onChange={(e) => setTourDuration(e.target.value)}
                            placeholder="e.g. May 7 – May 10, 2024"
                          />
                        </FormGroup>

                        <FormGroup className="mb-3">
                          <Label style={labelStyle}>Details *</Label>
                          <Input
                            type="textarea"
                            rows="3"
                            value={tourDetails}
                            onChange={(e) => setTourDetails(e.target.value)}
                            placeholder="Describe the tour..."
                          />
                        </FormGroup>

                        {/* GOOGLE MAP */}
                        <div style={{ fontWeight: 900, marginBottom: 8 }}>
                          Google Map Embed
                        </div>

                        <div
                          style={{
                            borderRadius: 14,
                            overflow: "hidden",
                            border: `1px solid ${border}`,
                            background: "#fff",
                          }}
                        >
                          <iframe
                            title="map"
                            src={mapEmbed}
                            width="100%"
                            height="180"
                            style={{ border: 0, display: "block" }}
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                          />
                        </div>

                        <FormGroup className="mt-2">
                          <Label style={helpStyle}>
                            Paste an embed URL (example:
                            https://www.google.com/maps?q=YOURPLACE&output=embed)
                          </Label>
                          <Input
                            value={mapEmbed}
                            onChange={(e) => setMapEmbed(e.target.value)}
                            placeholder="Paste Google Maps embed URL"
                          />
                        </FormGroup>

                        {/* PACKAGE INCLUSION */}
                        <FormGroup className="mb-3">
                          <Label style={labelStyle}>Package Inclusion *</Label>
                          <Input
                            type="textarea"
                            rows="3"
                            value={inclusion}
                            onChange={(e) => setInclusion(e.target.value)}
                            placeholder="Transportation, guide, meals, permits, equipment..."
                          />
                          <div style={helpStyle}>
                            {inclusion.length}/500 characters
                          </div>
                        </FormGroup>

                        {/* PRICING */}
                        <Row className="g-3">
                          <Col xs="12" md="4">
                            <FormGroup className="mb-0">
                              <Label style={labelStyle}>Solo Price</Label>
                              <Input
                                value={soloPrice}
                                onChange={(e) => setSoloPrice(e.target.value)}
                                placeholder="3500"
                              />
                            </FormGroup>
                          </Col>

                          <Col xs="12" md="4">
                            <FormGroup className="mb-0">
                              <Label style={labelStyle}>Group Price</Label>
                              <Input
                                value={groupPrice}
                                onChange={(e) => setGroupPrice(e.target.value)}
                                placeholder="2800"
                              />
                            </FormGroup>
                          </Col>

                          <Col xs="12" md="4">
                            <FormGroup className="mb-0">
                              <Label style={labelStyle}>Group Slots</Label>
                              <Input
                                value={groupSlots}
                                onChange={(e) => setGroupSlots(e.target.value)}
                                placeholder="15"
                              />
                            </FormGroup>
                          </Col>
                        </Row>

                        {/* UPLOAD PICTURES */}
                        <div style={{ marginTop: 16 }}>
                          <div style={{ fontWeight: 900, marginBottom: 8 }}>
                            Upload Pictures
                          </div>

                          <div style={dashedUpload}>
                            <div
                              style={{
                                display: "grid",
                                placeItems: "center",
                                gap: 8,
                              }}
                            >
                              <div
                                style={{
                                  width: 42,
                                  height: 42,
                                  borderRadius: 12,
                                  background: "#DCFCE7",
                                  display: "grid",
                                  placeItems: "center",
                                  color: green,
                                }}
                              >
                                <FaRegImages />
                              </div>

                              <div style={{ color: green, fontWeight: 900 }}>
                                Click to upload images
                              </div>
                              <div style={helpStyle}>
                                Upload multiple images (JPG, PNG)
                              </div>
                              <Input
                                type="file"
                                multiple
                                accept="image/*"
                                onChange={(e) =>
                                  setPictures(Array.from(e.target.files || []))
                                }
                                style={{ marginTop: 8 }}
                              />
                              {!!pictures.length && (
                                <div style={helpStyle}>
                                  Selected: {pictures.length} file(s)
                                </div>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* UPLOAD VIDEOS */}
                        <div style={{ marginTop: 16 }}>
                          <div style={{ fontWeight: 900, marginBottom: 8 }}>
                            Upload Videos
                          </div>

                          <div style={dashedUpload}>
                            <div
                              style={{
                                display: "grid",
                                placeItems: "center",
                                gap: 8,
                              }}
                            >
                              <div
                                style={{
                                  width: 42,
                                  height: 42,
                                  borderRadius: 12,
                                  background: "#DCFCE7",
                                  display: "grid",
                                  placeItems: "center",
                                  color: green,
                                }}
                              >
                                <FaRegFileVideo />
                              </div>

                              <div style={{ color: green, fontWeight: 900 }}>
                                Click to upload videos
                              </div>
                              <div style={helpStyle}>MP4 recommended</div>
                              <Input
                                type="file"
                                multiple
                                accept="video/*"
                                onChange={(e) =>
                                  setVideos(Array.from(e.target.files || []))
                                }
                                style={{ marginTop: 8 }}
                              />
                              {!!videos.length && (
                                <div style={helpStyle}>
                                  Selected: {videos.length} file(s)
                                </div>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* ACTIONS */}
                        <div
                          style={{
                            display: "flex",
                            gap: 10,
                            marginTop: 16,
                          }}
                        >
                          <Button
                            type="button"
                            onClick={saveTour}
                            style={{
                              flex: 1,
                              background: green,
                              border: "none",
                              borderRadius: 12,
                              padding: "12px 14px",
                              fontWeight: 900,
                              display: "inline-flex",
                              justifyContent: "center",
                              alignItems: "center",
                              gap: 8,
                            }}
                          >
                            <FaUpload />
                            {editingId ? "Save Changes" : "Create Package"}
                          </Button>

                          <Button
                            type="button"
                            outline
                            color="secondary"
                            onClick={() => {
                              setShowAddForm(false);
                              resetTourForm();
                            }}
                            style={{
                              borderRadius: 12,
                              padding: "12px 14px",
                              fontWeight: 900,
                            }}
                          >
                            Cancel
                          </Button>
                        </div>
                      </Form>
                    </CardBody>
                  </Card>
                )}

                {/* EXISTING */}
                <div style={{ marginTop: 16, fontWeight: 900 }}>
                  Existing Tour Packages
                </div>

                <div style={{ marginTop: 12, display: "grid", gap: 14 }}>
                  {tours.map((t) => (
                    <Card
                      key={t.id}
                      style={{
                        borderRadius: 16,
                        border: `1px solid ${border}`,
                        boxShadow: "0 6px 18px rgba(17,24,39,0.08)",
                      }}
                    >
                      <CardBody style={{ padding: 14 }}>
                        <Row>
                          <Col>
                            <div style={{ fontWeight: 900, fontSize: 16 }}>
                              {t.title}
                            </div>
                          </Col>

                          <Col xs="auto" style={{ display: "flex", gap: 10 }}>
                            <button
                              type="button"
                              title="Edit"
                              onClick={() => openEdit(t)}
                              style={{
                                border: "none",
                                background: "transparent",
                                color: "#2563EB",
                                padding: 4,
                              }}
                            >
                              <FaPen />
                            </button>
                            <button
                              type="button"
                              title="Delete"
                              onClick={() => handleDelete(t.id)}
                              style={{
                                border: "none",
                                background: "transparent",
                                color: "#EF4444",
                                padding: 4,
                              }}
                            >
                              <FaTrash />
                            </button>
                          </Col>
                        </Row>

                        {/* TAG */}
                        <div style={{ marginTop: 10 }}>
                          <span style={pill("#DCFCE7", green)}>{t.tag}</span>
                        </div>

                        {/* INFO */}
                        <div style={{ marginTop: 14, display: "grid", gap: 8 }}>
                          <Row className="g-2">
                            <Col
                              xs="4"
                              style={{ color: muted, fontWeight: 800 }}
                            >
                              Duration:
                            </Col>
                            <Col xs="8" style={{ fontWeight: 800 }}>
                              {t.duration}
                            </Col>
                          </Row>

                          <Row className="g-2">
                            <Col
                              xs="4"
                              style={{ color: muted, fontWeight: 800 }}
                            >
                              Meetup:
                            </Col>
                            <Col xs="8" style={{ fontWeight: 800 }}>
                              {t.meetup}
                            </Col>
                          </Row>

                          <Row className="g-2">
                            <Col
                              xs="4"
                              style={{ color: muted, fontWeight: 800 }}
                            >
                              Details:
                            </Col>
                            <Col xs="8" style={{ color: muted }}>
                              {t.details}
                            </Col>
                          </Row>
                        </div>

                        {/* EXTRAS */}
                        <div
                          style={{
                            marginTop: 12,
                            display: "flex",
                            gap: 8,
                            flexWrap: "wrap",
                          }}
                        >
                          {!!t.inclusion && (
                            <span style={pill("#EEF2FF", "#4338CA")}>
                              Inclusion
                            </span>
                          )}
                          {!!t.mapUrl && (
                            <span style={pill("#F0FDFA", "#0F766E")}>Map</span>
                          )}
                          <span style={pill("#F9FAFB", "#374151")}>
                            Photos: {t.picturesCount || 0}
                          </span>
                          <span style={pill("#F9FAFB", "#374151")}>
                            Videos: {t.videosCount || 0}
                          </span>
                        </div>

                        {/* PRICES */}
                        <div style={{ marginTop: 14 }}>
                          <Row className="g-2">
                            <Col
                              xs="5"
                              style={{ color: muted, fontWeight: 900 }}
                            >
                              Solo:
                            </Col>
                            <Col
                              xs="7"
                              style={{ fontWeight: 900, textAlign: "right" }}
                            >
                              {t.solo}
                            </Col>
                          </Row>

                          <Row className="g-2" style={{ marginTop: 6 }}>
                            <Col
                              xs="5"
                              style={{ color: muted, fontWeight: 900 }}
                            >
                              Join a group:
                            </Col>
                            <Col
                              xs="7"
                              style={{ fontWeight: 900, textAlign: "right" }}
                            >
                              {t.group}
                            </Col>
                          </Row>
                        </div>
                      </CardBody>
                    </Card>
                  ))}

                  {tours.length === 0 && (
                    <Card
                      style={{
                        borderRadius: 16,
                        border: `1px solid ${border}`,
                      }}
                    >
                      <CardBody style={{ color: muted }}>
                        No tour packages yet. Click <b>Add new Package</b>.
                      </CardBody>
                    </Card>
                  )}
                </div>
              </CardBody>
            </Card>
          )}
        </div>
      </Container>
    </div>
  );
}
