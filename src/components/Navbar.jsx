import { useState, useEffect } from "react";
import {
  Navbar,
  NavbarBrand,
  NavbarToggler,
  Collapse,
  Nav,
  NavItem,
  Button,
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from "reactstrap";
import { NavLink } from "react-router-dom";
import {
  FaTachometerAlt,
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaUser,
  FaSignOutAlt,
  FaBars,
} from "react-icons/fa";

import defaultProfile from "../assets/defaultUser.png";

function AppNavbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [profilePicture, setProfilePicture] = useState(null);

  const toggleProfile = () => setProfileOpen((v) => !v);

  useEffect(() => {
    setIsLoggedIn(!!localStorage.getItem("auth_token"));
    setProfilePicture(localStorage.getItem("profilePicture"));
  }, []);

  const fallback = defaultProfile;

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/login";
  };

  return (
    <Navbar color="white" light expand="md" fixed="top" className="shadow-sm">
      <NavbarBrand
        tag={NavLink}
        to="/"
        style={{ fontFamily: "Pacifico", color: "#16A34A" }}
      >
        TravelKo
      </NavbarBrand>

      <NavbarToggler onClick={() => setIsOpen(!isOpen)} />

      <Collapse isOpen={isOpen} navbar>
        <Nav className="ms-auto align-items-center gap-2" navbar>
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

          {isLoggedIn ? (
            <Dropdown nav inNavbar isOpen={profileOpen} toggle={toggleProfile}>
              <DropdownToggle nav caret className="p-0">
                <img
                  src={profilePicture || fallback}
                  alt="Profile"
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: "50%",
                    objectFit: "cover",
                    border: "2px solid #16A34A",
                    cursor: "pointer",
                  }}
                />
              </DropdownToggle>

              <DropdownMenu
                end
                container="body"
                strategy="fixed"
                className="shadow"
              >
                <DropdownItem
                  tag={NavLink}
                  to="/coordinator/dashboard"
                  className="succeed"
                >
                  <FaTachometerAlt size={18} />
                </DropdownItem>

                <DropdownItem tag={NavLink} to="/coordinator/profile">
                  <FaUser size={18} />
                </DropdownItem>

                <DropdownItem divider />

                <DropdownItem onClick={handleLogout} className="text-danger">
                  <FaSignOutAlt size={18} />
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
          ) : (
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
          )}
        </Nav>
      </Collapse>
    </Navbar>
  );
}

export default AppNavbar;
