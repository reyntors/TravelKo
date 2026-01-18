import { Container, Row, Col } from "reactstrap";
import { NavLink } from "react-router-dom";
import { FaFacebookF,
FaInstagram
      } from "react-icons/fa";

      import { FaXTwitter } from 'react-icons/fa6';

export default function Footer() {
  return (
    <footer style={{ background: "#111827", color: "#F9FAFB", fontFamily: "Poppins" }}>
      <Container className="py-5">
        <Row className="mb-4">
          {/* TravelKo Info */}
          <Col xs="12" md="4" className="mb-4 mb-md-0">
            <h5 className="fw-bold " style={{ fontFamily: "Pacifico", color: "#16A34A" }}>TravelKo</h5>
            <p style={{ fontSize: "0.7rem", fontWeight: 300 }}>
              Connecting travelers with amazing adventures. <br />
              Discover, book, and experience the Philippines like never before.
            </p>
          </Col>

          {/* Quick Links */}
          <Col xs="6" md="2" className="mb-4 mb-md-0">
            <h6 className="fw-bold">Quick Links</h6>
            <ul className="list-unstyled" style={{ paddingLeft: 0, fontWeight: 300, fontSize: ".7rem"}}>
              <li><NavLink to="/tours" className="text-white text-decoration-none">Browse Tours</NavLink></li>
              <li><NavLink to="/about" className="text-white text-decoration-none">About Us</NavLink></li>
              <li><NavLink to="/login" className="text-white text-decoration-none">Login</NavLink></li>
              <li><NavLink to="/signup" className="text-white text-decoration-none">Sign Up</NavLink></li>
            </ul>
          </Col>

          {/* Support */}
          <Col xs="6" md="3" className="mb-4 mb-md-0">
            <h6 className="fw-bold">Support</h6>
            <ul className="list-unstyled" style={{ paddingLeft: 0, fontWeight: 300, fontSize: ".7rem"}}>
              <li><NavLink to="/help-center" className="text-white text-decoration-none">Help Center</NavLink></li>
              <li><NavLink to="/contact" className="text-white text-decoration-none">Contact Us</NavLink></li>
              <li><NavLink to="/terms" className="text-white text-decoration-none">Terms of Service</NavLink></li>
              <li><NavLink to="/privacy" className="text-white text-decoration-none">Privacy Policy</NavLink></li>
            </ul>
          </Col>

          {/* Connect */}
          <Col xs="12" md="3" className="text-md-end">
            <h6 className="fw-bold">Connect</h6>
            <div className="d-flex gap-3 justify-content-start justify-content-md-end mt-2">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-white fs-5"><FaFacebookF/></a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-white fs-5"><FaXTwitter/></a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-white fs-5"><FaInstagram/></a>
            </div>
          </Col>
        </Row>

        <hr style={{ borderColor: "#374151" }} />

        <Row>
          <Col className="text-center" style={{ fontSize: "0.85rem", fontWeight: 300 }}>
             {/* Copyright */}
          <div className="text-center mt-4">
            <p className="text-whitesmall " >
              &copy; {new Date().getFullYear()} TravelKo. All rights reserved.
            </p>
          </div>
          </Col>
        </Row>
      </Container>
    </footer>
  );
}
