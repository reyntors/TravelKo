import React, { useState } from "react";
import {
  Container,
  Card,
  CardBody,
  Button,
  Form,
  FormGroup,
  Label,
  Input,
} from "reactstrap";
import { FaUserCog } from "react-icons/fa";
// import axios from "axios"; // ← enable when backend is ready

export default function CoordinatorPortal() {
  const green = "#16A34A";
  const border = "#E5E7EB";
  const text = "#111827";
  const bg = "#F9FAFB";

  /* ================= STATE ================= */
  const [form, setForm] = useState({
    fullName: "",
    username: "",
    email: "",
    gender: "",
    contact: "",
    password: "",
    confirmPassword: "",
  });


  const [passwordError, setPasswordError] = useState("");

  /* ================= PASSWORD VALIDATION ================= */
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

  /* ================= INPUT HANDLER ================= */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  /* ================= SUBMIT ================= */
  const handleRegister = async () => {
    const errors = validatePassword(form.password, form.confirmPassword);
    if (errors.length) {
      setPasswordError(errors.join(", "));
      return;
    }

    // 🔥 BACKEND-READY PAYLOAD
    const payload = new FormData();
    payload.append("fullName", form.fullName);
    payload.append("username", form.username);
    payload.append("email", form.email);
    payload.append("gender", form.gender);
    payload.append("contact", form.contact);
    payload.append("password", form.password);

    if (validId) payload.append("validId", validId);
    photos.forEach((file) => payload.append("photos", file));

    // ✅ Ready for backend
    console.log("Submitting payload:");
    for (let pair of payload.entries()) {
      console.log(pair[0], pair[1]);
    }

    /* === ENABLE WHEN BACKEND IS READY ===
    await axios.post("/api/coordinator/register", payload, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    */

    alert("Coordinator registration ready for backend 🚀");
  };

  /* ================= UI ================= */
  return (
    <div style={{ fontFamily: "Poppins", background: bg, minHeight: "100vh" }}>
      <Container fluid style={{ padding: 18, maxWidth: 540 }}>
        {/* HEADER */}
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
          <div style={{ marginTop: 6 }}>
            Create your coordinator account
          </div>
        </div>

        <Card style={{ marginTop: 16, borderRadius: 18, border: `1px solid ${border}` }}>
          <CardBody>
            <Form>
              {/* FULL NAME */}
              <FormGroup>
                <Label style={{ fontWeight: 800, color: text }}>
                  Full Name *
                </Label>
                <Input
                  name="fullName"
                  value={form.fullName}
                  onChange={handleChange}
                />
              </FormGroup>

              {/* USERNAME */}
              <FormGroup>
                <Label style={{ fontWeight: 800 }}>Username *</Label>
                <Input
                  name="username"
                  value={form.username}
                  onChange={handleChange}
                />
              </FormGroup>

              {/* EMAIL */}
              <FormGroup>
                <Label style={{ fontWeight: 800 }}>Email *</Label>
                <Input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                />
              </FormGroup>

              {/* GENDER */}
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

              {/* CONTACT */}
              <FormGroup>
                <Label style={{ fontWeight: 800 }}>Contact *</Label>
                <Input
                  name="contact"
                  value={form.contact}
                  onChange={handleChange}
                />
              </FormGroup>

              {/* PASSWORD */}
              <FormGroup>
                <Label style={{ fontWeight: 800 }}>Password *</Label>
                <Input
                  type="password"
                  name="password"
                  value={form.password}
                  onChange={(e) => {
                    handleChange(e);
                    setPasswordError("");
                  }}
                />
              </FormGroup>

              {/* CONFIRM PASSWORD */}
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
                      e.target.value
                    );
                    setPasswordError(errors.join(", "));
                  }}
                />
                {passwordError && (
                  <div style={{ fontSize: 12, color: "#DC2626", marginTop: 6 }}>
                    ⚠ {passwordError}
                  </div>
                )}
              </FormGroup>

            

              {/* SUBMIT */}
              <Button
                type="button"
                onClick={handleRegister}
                style={{
                  width: "100%",
                  background: green,
                  border: "none",
                  borderRadius: 12,
                  padding: 12,
                  fontWeight: 900,
                }}
              >
                <FaUserCog /> Register as Coordinator
              </Button>
            </Form>
          </CardBody>
        </Card>
      </Container>
    </div>
  );
}
