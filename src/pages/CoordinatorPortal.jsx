import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Container,
  Card,
  CardBody,
  Button,
  Form,
  FormGroup,
  Label,
  Input,
  Modal,
  ModalBody,
  Spinner,
} from "reactstrap";
import { FaUserCog, FaCheckCircle } from "react-icons/fa";
import axios from "axios";

export default function CoordinatorPortal() {
  const navigate = useNavigate();

  const green = "#16A34A";
  const border = "#E5E7EB";
  const text = "#111827";
  const bg = "#F9FAFB";

  const [form, setForm] = useState({
    fullName: "",
    username: "",
    email: "",
    gender: "",
    phoneNumber: "",
    password: "",
    confirmPassword: "",
  });

  const [passwordError, setPasswordError] = useState("");
  const [loading, setLoading] = useState(false);
  const [successOpen, setSuccessOpen] = useState(false);

  const API_BASE =
    import.meta.env.VITE_API_BASE_URL || "https://api.travelko.site/";

  const validatePassword = (pwd, confirmPwd) => {
    const errors = [];

    if (pwd.length < 8) errors.push("Min 8 characters");
    if (!/[A-Z]/.test(pwd)) errors.push("1 uppercase letter");
    if (!/[0-9]/.test(pwd)) errors.push("1 number");
    if (!/[!@#$%^&*(),.?\":{}|<>]/.test(pwd))
      errors.push("1 special character");
    if (pwd !== confirmPwd) errors.push("Passwords do not match");

    return errors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleRegister = async () => {
    const errors = validatePassword(form.password, form.confirmPassword);
    if (errors.length) {
      setPasswordError(errors.join(", "));
      return;
    }

    setLoading(true);

    try {
      await axios.post(`${API_BASE}auth/coordinator`, {
        fullName: form.fullName,
        username: form.username,
        email: form.email,
        gender: form.gender,
        phoneNumber: form.phoneNumber,
        password: form.password,
      });

      setSuccessOpen(true);

      // Auto redirect after 2 seconds
      setTimeout(() => {
        navigate("/login", { replace: true });
      }, 2000);
    } catch (error) {
      setPasswordError(
        error?.response?.data?.message ||
          error?.message ||
          "Registration failed",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div
        style={{ fontFamily: "Poppins", background: bg, minHeight: "100vh" }}
      >
        <Container fluid style={{ padding: 18, maxWidth: 540 }}>
          <div
            style={{
              background: green,
              color: "white",
              padding: 22,
              borderRadius: 18,
            }}
          >
            <div style={{ fontSize: 22, fontWeight: 900 }}>
              Coordinator Registration
            </div>
            <div style={{ marginTop: 6 }}>Create your coordinator account</div>
          </div>

          <Card
            style={{
              marginTop: 16,
              borderRadius: 18,
              border: `1px solid ${border}`,
            }}
          >
            <CardBody>
              <Form>
                <FormGroup>
                  <Label style={{ fontWeight: 800 }}>Full Name *</Label>
                  <Input
                    name="fullName"
                    value={form.fullName}
                    onChange={handleChange}
                  />
                </FormGroup>

                <FormGroup>
                  <Label style={{ fontWeight: 800 }}>Username *</Label>
                  <Input
                    name="username"
                    value={form.username}
                    onChange={handleChange}
                  />
                </FormGroup>

                <FormGroup>
                  <Label style={{ fontWeight: 800 }}>Email *</Label>
                  <Input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                  />
                </FormGroup>

                <FormGroup>
                  <Label style={{ fontWeight: 800 }}>Gender *</Label>
                  <Input
                    type="select"
                    name="gender"
                    value={form.gender}
                    onChange={handleChange}
                  >
                    <option value="">Select</option>
                    <option>Male</option>
                    <option>Female</option>
                    <option>Prefer not to say</option>
                  </Input>
                </FormGroup>

                <FormGroup>
                  <Label style={{ fontWeight: 800 }}>Contact Number *</Label>
                  <Input
                    name="phoneNumber"
                    value={form.phoneNumber}
                    onChange={handleChange}
                  />
                </FormGroup>

                <FormGroup>
                  <Label style={{ fontWeight: 800 }}>Password *</Label>
                  <Input
                    type="password"
                    name="password"
                    value={form.password}
                    onChange={handleChange}
                  />
                </FormGroup>

                <FormGroup>
                  <Label style={{ fontWeight: 800 }}>Confirm Password *</Label>
                  <Input
                    type="password"
                    name="confirmPassword"
                    value={form.confirmPassword}
                    onChange={(e) => {
                      handleChange(e);
                      const errors = validatePassword(
                        form.password,
                        e.target.value,
                      );
                      setPasswordError(errors.join(", "));
                    }}
                  />
                  {passwordError && (
                    <div
                      style={{ fontSize: 12, color: "#DC2626", marginTop: 6 }}
                    >
                      ⚠ {passwordError}
                    </div>
                  )}
                </FormGroup>

                <Button
                  type="button"
                  onClick={handleRegister}
                  disabled={loading}
                  style={{
                    width: "100%",
                    background: green,
                    border: "none",
                    borderRadius: 12,
                    padding: 12,
                    fontWeight: 900,
                  }}
                >
                  {loading ? (
                    <>
                      <Spinner size="sm" className="me-2" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <FaUserCog /> Register as Coordinator
                    </>
                  )}
                </Button>
              </Form>
            </CardBody>
          </Card>
        </Container>
      </div>

      {/* SUCCESS MODAL */}
      <Modal isOpen={successOpen} centered backdrop="static" keyboard={false}>
        <ModalBody className="text-center py-5">
          <FaCheckCircle
            size={80}
            style={{
              color: green,
              animation: "pop 0.4s ease",
            }}
            className="mb-3"
          />

          <h4 className="fw-bold">Registration Successful!</h4>

          <p className="text-muted">
            Your coordinator account has been created.
          </p>

          <p style={{ fontSize: 14, color: "#6B7280" }}>
            Redirecting to login...
          </p>
        </ModalBody>
      </Modal>

      {/* Animation Style */}
      <style>
        {`
          @keyframes pop {
            0% { transform: scale(0.6); opacity: 0; }
            100% { transform: scale(1); opacity: 1; }
          }
        `}
      </style>
    </>
  );
}
