import { useState } from "react";
import {
  Navbar,
  NavbarBrand,
  NavbarToggler,
  Collapse,
  Nav,
  NavItem,
  Button,
} from "reactstrap";
import { NavLink } from "react-router-dom";

function AppNavbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Navbar color="white" light expand="md" fixed="top" className="shadow-sm">
      <NavbarBrand
        tag={NavLink}
        to="/"
        style={{ fontFamily: "Pacifico", color: "#16A34A" }}
      >
        TravelKo
      </NavbarBrand>

      <NavbarToggler
        onClick={() => setIsOpen(!isOpen)}
        style={{
          border: "none",
          boxShadow: "none",
        }}
      />

      <Collapse isOpen={isOpen} navbar>
        <Nav
          className="ms-auto align-items-center gap-2"
          navbar
          style={{ fontFamily: "Poppins" }}
        >
          <NavItem>
            <NavLink className="nav-link" to="/" end>
              Home
            </NavLink>
          </NavItem>

          <NavItem>
            <NavLink className="nav-link" to="/tours">
              Tours
            </NavLink>
          </NavItem>

          <NavItem>
            <NavLink className="nav-link" to="/about">
              About Us
            </NavLink>
          </NavItem>

          <NavItem>
            <Button
              color="success"
              tag={NavLink}
              to="/login"
              className="rounded-pill px-4"
            >
              Login
            </Button>
          </NavItem>
        </Nav>
      </Collapse>
    </Navbar>
  );
}

export default AppNavbar;
