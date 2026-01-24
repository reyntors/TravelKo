import React, { useEffect, useMemo, useState } from "react";
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
  Spinner,
  Alert,
} from "reactstrap";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Profile() {
  const green = "#16A34A";
  const border = "#E5E7EB";
  const muted = "#6B7280";
  const text = "#111827";

  const cardStyle = useMemo(
    () => ({
      borderRadius: 16,
      border: `1px solid ${border}`,
    }),
    [border],
  );

  const sectionTitle = { fontWeight: 800, marginBottom: 12 };

  // ✅ Disabled input look
  const disabledInputStyle = {
    backgroundColor: "#F3F4F6", // gray
    borderColor: "#E5E7EB",
    color: "#111827",
    cursor: "not-allowed",
  };

  const enabledInputStyle = {
    backgroundColor: "#FFFFFF",
    borderColor: "#E5E7EB",
    color: "#111827",
  };

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [isEditing, setIsEditing] = useState(false);

  // ✅ profile state (edit this shape to match backend)
  const [profile, setProfile] = useState({
    fullName: "",
    email: "",
    phoneNumber: "",
    address: "",
    bankName: "",
    accountName: "",
    accountNumber: "",
    gcashNumber: "",
    gender: "",
  });

  // Keep a copy for cancel
  const [originalProfile, setOriginalProfile] = useState(null);

  const token = localStorage.getItem("auth_token");

  const API_BASE = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);

      try {
        const res = await fetch(`${API_BASE}auth/coordinator`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data?.message || "Failed to load profile");
        }

        setProfile({
          fullName: data.fullName || "",
          email: data.email || "",
          phoneNumber: data.phoneNumber || "",
          address: data.address || "",
          bankName: data.bankName || "",
          accountName: data.accountName || "",
          accountNumber: data.accountNumber || "",
          gcashNumber: data.gcashNumber || "",
          gender: data.gender || "",
        });

        setOriginalProfile(data);
      } catch (err) {
        toast.error(err.message || "Failed to load profile");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [token]);

  const onChange = (key) => (e) => {
    setProfile((prev) => ({ ...prev, [key]: e.target.value }));
  };

  const startEdit = () => {
    toast.info("Edit mode enabled");
    setIsEditing(true);
    setOriginalProfile(profile);
  };

  const cancelEdit = () => {
    if (originalProfile) setProfile(originalProfile);
    setIsEditing(false);
    toast.info("Changes discarded");
  };

  const saveProfile = async () => {
    setSaving(true);

    try {
      const res = await fetch(`${API_BASE}auth/coordinator`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(profile),
      });

      const text = await res.text(); // backend returns plain text
      console.log("SERVER RESPONSE:", text);

      if (!res.ok) {
        // backend sends error as text too
        throw new Error(text || "Failed to save profile");
      }

      // ✅ SUCCESS
      setOriginalProfile(profile);
      setIsEditing(false);
      toast.success("Profile updated successfully!");
    } catch (err) {
      console.error(err);
      toast.error(err.message || "Failed to save changes");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <Container fluid style={{ fontFamily: "Poppins" }}>
        <div className="py-5 d-flex justify-content-center">
          <Spinner />
        </div>
      </Container>
    );
  }

  return (
    <Container fluid style={{ fontFamily: "Poppins" }}>
      {/* HEADER */}
      <Row className="mb-3 align-items-center">
        <Col>
          <h2 style={{ fontWeight: 900, color: text }}>Profile Settings</h2>
          <p style={{ color: muted, marginBottom: 0 }}>
            Manage your personal and account information
          </p>
        </Col>

        <Col xs="auto" className="d-flex gap-2">
          {!isEditing ? (
            <Button
              onClick={startEdit}
              style={{
                background: green,
                border: "none",
                borderRadius: 999,
                fontWeight: 700,
                padding: "10px 18px",
              }}
            >
              ✏️ Edit Profile
            </Button>
          ) : (
            <Button
              onClick={cancelEdit}
              outline
              color="secondary"
              style={{
                borderRadius: 999,
                fontWeight: 700,
                padding: "10px 18px",
              }}
            >
              Cancel
            </Button>
          )}
        </Col>
      </Row>

      {/* PROFILE INFORMATION */}
      <Card style={cardStyle} className="mb-4">
        <CardBody>
          <h5 style={sectionTitle}>Profile Information</h5>

          <Form>
            <Row className="g-3">
              <Col xs="12" md="6">
                <FormGroup>
                  <Label>Full Name</Label>
                  <Input
                    value={profile.fullName}
                    onChange={onChange("fullName")}
                    disabled={!isEditing}
                    style={!isEditing ? disabledInputStyle : enabledInputStyle}
                  />
                </FormGroup>
              </Col>

              <Col xs="12" md="6">
                <FormGroup>
                  <Label>Email Address</Label>
                  <Input
                    type="email"
                    value={profile.email}
                    onChange={onChange("email")}
                    disabled={!isEditing}
                    style={!isEditing ? disabledInputStyle : enabledInputStyle}
                  />
                </FormGroup>
              </Col>

              <Col xs="12" md="6">
                <FormGroup>
                  <Label>Phone Number</Label>
                  <Input
                    value={profile.phoneNumber}
                    onChange={onChange("phoneNumber")}
                    disabled={!isEditing}
                    style={!isEditing ? disabledInputStyle : enabledInputStyle}
                  />
                </FormGroup>
              </Col>

              <Col xs="12">
                <FormGroup>
                  <Label>Address</Label>
                  <Input
                    value={profile.address}
                    onChange={onChange("address")}
                    disabled={!isEditing}
                    style={!isEditing ? disabledInputStyle : enabledInputStyle}
                    placeholder="City, Province, Philippines"
                  />
                </FormGroup>
              </Col>
              <Col xs="12" md="6">
                <FormGroup>
                  <Label>Gender</Label>
                  <Input
                    type="select"
                    value={profile.gender}
                    onChange={onChange("gender")}
                    disabled={!isEditing}
                    style={!isEditing ? disabledInputStyle : enabledInputStyle}
                  >
                    <option value="">Select gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                    <option value="Prefer not to say">Prefer not to say</option>
                  </Input>
                </FormGroup>
              </Col>
            </Row>
          </Form>
        </CardBody>
      </Card>

      {/* PAYMENT & BANKING */}
      <Card style={cardStyle} className="mb-4">
        <CardBody>
          <h5 style={sectionTitle}>Payment & Banking Information</h5>

          <Form>
            <Row className="g-3">
              <Col xs="12" md="6">
                <FormGroup>
                  <Label>Bank Name</Label>
                  <Input
                    value={profile.bankName}
                    onChange={onChange("bankName")}
                    disabled={!isEditing}
                    style={!isEditing ? disabledInputStyle : enabledInputStyle}
                  />
                </FormGroup>
              </Col>

              <Col xs="12" md="6">
                <FormGroup>
                  <Label>Account Name</Label>
                  <Input
                    value={profile.accountName}
                    onChange={onChange("accountName")}
                    disabled={!isEditing}
                    style={!isEditing ? disabledInputStyle : enabledInputStyle}
                  />
                </FormGroup>
              </Col>

              <Col xs="12">
                <FormGroup>
                  <Label>Bank Account Number</Label>
                  <Input
                    value={profile.accountNumber}
                    onChange={onChange("accountNumber")}
                    disabled={!isEditing}
                    style={!isEditing ? disabledInputStyle : enabledInputStyle}
                  />
                </FormGroup>
              </Col>

              <Col xs="12">
                <FormGroup>
                  <Label>GCash Number</Label>
                  <Input
                    value={profile.gcashNumber}
                    onChange={onChange("gcashNumber")}
                    disabled={!isEditing}
                    style={!isEditing ? disabledInputStyle : enabledInputStyle}
                  />
                </FormGroup>
              </Col>
            </Row>
          </Form>
        </CardBody>
      </Card>

      {/* ACCOUNT SETTINGS */}
      <Card style={cardStyle}>
        <CardBody>
          <h5 style={sectionTitle}>Account Settings</h5>

          <Row className="g-3">
            <Col xs="12" md="6">
              <FormGroup>
                <Label>Change Profile Picture</Label>
                <Input
                  type="file"
                  disabled={!isEditing}
                  style={!isEditing ? disabledInputStyle : enabledInputStyle}
                />
              </FormGroup>
            </Col>

            <Col xs="12" md="6">
              <FormGroup>
                <Label>Change Password</Label>
                <Input
                  type="password"
                  disabled={!isEditing}
                  style={!isEditing ? disabledInputStyle : enabledInputStyle}
                  placeholder="New password"
                />
              </FormGroup>
            </Col>
          </Row>

          {/* Save only when editing */}
          {isEditing && (
            <div className="mt-4 d-flex gap-2">
              <Button
                onClick={saveProfile}
                disabled={saving}
                style={{
                  background: green,
                  border: "none",
                  borderRadius: 10,
                  fontWeight: 800,
                  padding: "10px 18px",
                  minWidth: 160,
                }}
              >
                {saving ? (
                  <>
                    <Spinner size="sm" className="me-2" />
                    Saving...
                  </>
                ) : (
                  "Save Changes"
                )}
              </Button>

              <Button
                type="button"
                outline
                color="secondary"
                onClick={cancelEdit}
                style={{
                  borderRadius: 10,
                  fontWeight: 800,
                  padding: "10px 18px",
                }}
              >
                Cancel
              </Button>
            </div>
          )}
        </CardBody>
      </Card>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        pauseOnHover
        theme="light"
      />
    </Container>
  );
}
