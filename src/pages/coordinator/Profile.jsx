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
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const [isEditing, setIsEditing] = useState(false);

  // ✅ profile state (edit this shape to match backend)
  const [profile, setProfile] = useState({
    fullName: "",
    email: "",
    phone: "",
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
      setError("");
      setSuccessMsg("");

      try {
        if (!token) throw new Error("Missing token. Please login again.");

        const res = await fetch(`${API_BASE}auth/coordinator`, {
          method: "GET",
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json().catch(() => null);
        console.log(data);

        if (!res.ok) {
          throw new Error(data?.message || data?.error || `HTTP ${res.status}`);
        }

        // ✅ Map backend response into your form fields
        // Adjust mapping based on backend keys
        const mapped = {
          fullName: data?.fullName || data?.fullName || "",
          gender: data?.gender || data?.gender || "",
          email: data?.email || "",
          phoneNumber: data?.phoneNumber || data?.mobileNumber || "",
          address: data?.address || "",
          bankName: data?.bankName || "",
          accountName: data?.accountName || "",
          accountNumber: data?.accountNumber || data?.accountNumber || "",
          gcashNumber: data?.gcashNumber || data?.gcash || "",
        };

        setProfile(mapped);
        setOriginalProfile(mapped);
      } catch (err) {
        setError(err?.message || "Failed to load profile.");
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
    setSuccessMsg("");
    setError("");
    setIsEditing(true);
    setOriginalProfile(profile); // snapshot
  };

  const cancelEdit = () => {
    setSuccessMsg("");
    setError("");
    if (originalProfile) setProfile(originalProfile);
    setIsEditing(false);
  };

  const saveProfile = async () => {
    setSaving(true);
    setError("");
    setSuccessMsg("");

    try {
      if (!token) throw new Error("Missing token. Please login again.");

      const res = await fetch(`${API_BASE}auth/coordinator`, {
        method: "PUT", // or PATCH depending on backend
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(profile),
      });

      const data = await res.json().catch(() => null);

      if (!res.ok) {
        throw new Error(data?.message || data?.error || `HTTP ${res.status}`);
      }

      // If backend returns updated profile, map it again (optional)
      setOriginalProfile(profile);
      setIsEditing(false);
      setSuccessMsg("Profile updated successfully.");
    } catch (err) {
      setError(err?.message || "Failed to save changes.");
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

      {error && (
        <Alert color="danger" style={{ borderRadius: 12 }}>
          {error}
        </Alert>
      )}

      {successMsg && (
        <Alert color="success" style={{ borderRadius: 12 }}>
          {successMsg}
        </Alert>
      )}

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
                    onChange={onChange("firstName")}
                    disabled={!isEditing}
                    style={!isEditing ? disabledInputStyle : enabledInputStyle}
                    placeholder="First name"
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
                    placeholder="Email"
                  />
                </FormGroup>
              </Col>

              <Col xs="12" md="6">
                <FormGroup>
                  <Label>Phone Number</Label>
                  <Input
                    value={profile.phoneNumber}
                    onChange={onChange("phone")}
                    disabled={!isEditing}
                    style={!isEditing ? disabledInputStyle : enabledInputStyle}
                    placeholder="+63 9XX XXX XXXX"
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
                    placeholder="BDO / BPI / UnionBank"
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
                    placeholder="Account name"
                  />
                </FormGroup>
              </Col>

              <Col xs="12">
                <FormGroup>
                  <Label>Bank Account Number</Label>
                  <Input
                    value={profile.accountNumber}
                    onChange={onChange("bankAccountNumber")}
                    disabled={!isEditing}
                    style={!isEditing ? disabledInputStyle : enabledInputStyle}
                    placeholder="XXXX XXXX XXXX"
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
                    placeholder="09XX XXX XXXX"
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
    </Container>
  );
}
