import React, { useState } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  CardBody,
  Form,
  FormGroup,
  Label,
  Input,
  Button,
  FormText,
  Alert,
} from "reactstrap";
import { useNavigate } from "react-router-dom";

const LoginPage = () => {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // 🔐 DEMO ACCOUNT
  const DEMO_USER = {
    username: "admin",
    password: "admin123",
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    // ⏳ simulate API delay
    setTimeout(() => {
      if (username === DEMO_USER.username && password === DEMO_USER.password) {
        localStorage.setItem("token", "demo-token-123");

        if (rememberMe) {
          localStorage.setItem("rememberMe", "true");
        }

        navigate("/coordinator/dashboard"); // ✅ React Router navigation
      } else {
        setError("Invalid username or password");
      }

      setLoading(false);
    }, 1000);
  };

  return (
    <Container fluid style={{ minHeight: "100vh", padding: "20px" }}>
      <Row className="justify-content-center align-items-center min-vh-100">
        <Col md="5" lg="4">
          {/* BRAND HEADER */}
          <div className="text-center mb-5">
            <h1
              style={{
                fontSize: "2rem",
                fontWeight: "300",
                color: "#16A34A",
                marginBottom: "0.5rem",
                letterSpacing: "2px",
                fontFamily: "Pacifico",
              }}
            >
              TravelKo
            </h1>
          </div>

          {/* LOGIN CARD */}
          <Card
            className="shadow-lg"
            style={{
              borderRadius: "20px",
              border: "none",
            }}
          >
            <CardBody className="p-5">
              {/* HEADER */}
              <div className="text-center mb-4">
                <h3 className="mb-2">Sign in to your account</h3>
                <p className="text-muted mb-0">
                  Or{" "}
                  <a
                    href="coordinator/register"
                    style={{
                      color: "#16A34A",
                      textDecoration: "none",
                      fontWeight: "500",
                    }}
                  >
                    Become a coordinator
                  </a>
                </p>
              </div>

              {/* ERROR */}
              {error && (
                <Alert color="danger" style={{ borderRadius: "10px" }}>
                  {error}
                </Alert>
              )}

              {/* FORM */}
              <Form onSubmit={handleSubmit}>
                <FormGroup className="mb-4">
                  <Label className="fw-semibold">Username</Label>
                  <Input
                    type="text"
                    placeholder="Enter your username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    disabled={loading}
                    required
                  />
                </FormGroup>

                <FormGroup className="mb-4">
                  <Label className="fw-semibold">Password</Label>
                  <Input
                    type="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={loading}
                    required
                  />
                </FormGroup>

                {/* REMEMBER + FORGOT */}
                <div className="d-flex justify-content-between align-items-center mb-4">
                  <FormGroup check>
                    <Input
                      id="rememberMe"
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      disabled={loading}
                    />
                    <Label check htmlFor="rememberMe">
                      Remember me
                    </Label>
                  </FormGroup>

                  <a
                    href="/forgot-password"
                    style={{
                      color: "#16A34A",
                      textDecoration: "none",
                      fontWeight: "500",
                    }}
                  >
                    Forgot password?
                  </a>
                </div>

                {/* SUBMIT */}
                <Button
                  type="submit"
                  size="lg"
                  block
                  disabled={loading}
                  className="mb-4 py-3"
                  style={{
                    background: "#16A34A",
                    border: "none",
                    borderRadius: "10px",
                    fontWeight: "600",
                  }}
                >
                  {loading ? "Signing in..." : "Sign in"}
                </Button>

                {/* TERMS */}
                <FormText className="text-center d-block text-muted small">
                  By proceeding, you agree to our{" "}
                  <a href="/terms" style={{ color: "#16A34A" }}>
                    Terms of Use
                  </a>{" "}
                  and{" "}
                  <a href="/privacy" style={{ color: "#16A34A" }}>
                    Privacy Policy
                  </a>
                  .
                </FormText>

                {/* RECAPTCHA */}
                <FormText className="text-center d-block text-muted small mt-3">
                  This site is protected by reCAPTCHA and the <br />
                  <a
                    href="https://policies.google.com/privacy"
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ color: "#16A34A" }}
                  >
                    Google Privacy Policy
                  </a>{" "}
                  and{" "}
                  <a
                    href="https://policies.google.com/terms"
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ color: "#16A34A" }}
                  >
                    Terms of Service
                  </a>{" "}
                  apply.
                </FormText>
              </Form>
            </CardBody>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default LoginPage;
