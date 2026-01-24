import React, { useMemo, useState } from "react";
import {
  Navbar,
  Container,
  Offcanvas,
  OffcanvasHeader,
  OffcanvasBody,
  Nav,
  NavItem,
  Button,
} from "reactstrap";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import {
  FaTachometerAlt,
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaUser,
  FaSignOutAlt,
  FaBars,
} from "react-icons/fa";

import { Modal, ModalBody, Spinner } from "reactstrap";

export default function CoordinatorNav() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(true);
  const [loggingOut, setLoggingOut] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  const toggleDrawer = () => setDrawerOpen((v) => !v);
  const toggleCollapsed = () => setCollapsed((v) => !v);

  const handleLogout = () => {
    setLoggingOut(true);

    setTimeout(() => {
      localStorage.removeItem("auth_token");
      localStorage.removeItem("rememberMe");
      navigate("/");
    }, 1200);
  };

  const menu = useMemo(
    () => [
      {
        label: "Dashboard",
        to: "/coordinator/dashboard",
        icon: FaTachometerAlt,
      },
      {
        label: "Tour Packages",
        to: "/coordinator/tours",
        icon: FaMapMarkerAlt,
      },
      { label: "Bookings", to: "/coordinator/bookings", icon: FaCalendarAlt },
      { label: "Profile", to: "/coordinator/profile", icon: FaUser },
    ],
    [],
  );

  const isActivePath = (to) => location.pathname === to;

  // Sidebar sizes
  const sidebarWidth = collapsed ? 72 : 230;

  // Colors
  const green = "#16A34A";
  const text = "#111827";
  const muted = "#6B7280";
  const border = "#E5E7EB";
  const activeBg = "#F0FDF4";

  const iconBtnStyle = (active) => ({
    width: 46,
    height: 46,
    borderRadius: 14,
    display: "grid",
    placeItems: "center",
    background: active ? activeBg : "transparent",
    color: active ? green : muted,
    cursor: "pointer",
    transition: "all 200ms ease",
    flex: "0 0 auto",
  });

  const itemRowStyle = (active) => ({
    display: "flex",
    alignItems: "center",
    gap: 12,
    width: "100%",
    padding: "8px 10px",
    borderRadius: 14,
    background: active ? activeBg : "transparent",
    color: active ? green : text,
    textDecoration: "none",
    fontWeight: 600,
    transition: "all 200ms ease",
  });

  const labelStyle = {
    whiteSpace: "nowrap",
    overflow: "hidden",
    opacity: collapsed ? 0 : 1,
    width: collapsed ? 0 : "auto",
    transition: "all 220ms ease",
  };

  return (
    <>
      {/* ===== DESKTOP / TABLET SIDEBAR (collapsible) ===== */}
      <div
        className="d-none d-md-flex"
        style={{
          position: "fixed",
          left: 0,
          top: 0,
          height: "100vh",
          width: sidebarWidth,
          background: "#fff",
          borderRight: `1px solid ${border}`,
          paddingTop: 76, // space for top navbar
          zIndex: 1020,
          transition: "width 220ms ease",
        }}
      >
        <div style={{ width: "100%", padding: "12px 10px" }}>
          {/* Collapse/Expand toggle */}
          <Button
            color="link"
            onClick={toggleCollapsed}
            className="p-0"
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              color: text,
              textDecoration: "none",
              marginBottom: 12,
            }}
          >
            <div style={iconBtnStyle(false)}>
              <FaBars size={18} />
            </div>
            <span style={labelStyle}>Menu</span>
          </Button>

          {/* Menu items */}
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {menu.map((m) => {
              const active = isActivePath(m.to);
              const Icon = m.icon;

              return (
                <NavLink key={m.to} to={m.to} style={itemRowStyle(active)}>
                  <div style={iconBtnStyle(active)} title={m.label}>
                    <Icon size={18} />
                  </div>
                  <span style={labelStyle}>{m.label}</span>
                </NavLink>
              );
            })}

            {/* Logout */}
            <Button
              color="link"
              onClick={handleLogout}
              className="p-0"
              style={itemRowStyle(false)}
            >
              <div style={iconBtnStyle(false)} title="Logout">
                <FaSignOutAlt size={18} />
              </div>
              <span style={labelStyle}>Logout</span>
            </Button>
          </div>
        </div>
      </div>

      {/* ===== MOBILE ICON RAIL (icons only) ===== */}
      <div
        className="d-flex d-md-none"
        style={{
          position: "fixed",
          left: 10,
          top: 90,
          zIndex: 1020,
          display: "flex",
          flexDirection: "column",
          gap: 10,
        }}
      >
        {menu.map((m) => {
          const active = isActivePath(m.to);
          const Icon = m.icon;

          return (
            <div
              key={m.to}
              onClick={() => navigate(m.to)}
              style={{
                ...iconBtnStyle(active),
                background: active ? activeBg : "#fff",
                border: `1px solid ${border}`,
                boxShadow: "0 2px 6px rgba(0,0,0,0.08)",
              }}
              title={m.label}
            >
              <Icon size={18} />
            </div>
          );
        })}

        <div
          onClick={handleLogout}
          style={{
            ...iconBtnStyle(false),
            background: "#fff",
            border: `1px solid ${border}`,
            boxShadow: "0 2px 6px rgba(0,0,0,0.08)",
          }}
          title="Logout"
        >
          <FaSignOutAlt size={18} />
        </div>
      </div>

      {/* ===== TOP BAR ===== */}
      <Navbar
        light
        style={{
          background: "#ffffff",
          borderBottom: `1px solid ${border}`,
          position: "sticky",
          top: 0,
          zIndex: 1030,
        }}
      >
        <Container
          fluid
          className="d-flex align-items-center justify-content-between"
          style={{ minHeight: 64 }}
        >
          {/* Left: avatar + hamburger overlay (opens mobile drawer) */}
          <Button
            color="link"
            onClick={toggleDrawer}
            className="p-0 d-md-none"
            style={{ textDecoration: "none" }}
            aria-label="Open menu"
          >
            <div style={{ position: "relative", width: 44, height: 44 }}>
              <img
                src="https://i.pravatar.cc/100?img=32"
                alt="Coordinator"
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: "50%",
                  objectFit: "cover",
                }}
              />
              <div
                style={{
                  position: "absolute",
                  right: -2,
                  bottom: -2,
                  width: 18,
                  height: 18,
                  borderRadius: "50%",
                  background: green,
                  border: "2px solid white",
                  display: "grid",
                  placeItems: "center",
                  color: "white",
                  fontSize: 10,
                  lineHeight: 1,
                }}
              >
                ≡
              </div>
            </div>
          </Button>

          {/* On desktop we don't need the avatar button (sidebar already there) */}
          <div className="d-none d-md-block" style={{ width: 44 }} />

          {/* Center: TravelKo */}
          <div
            style={{
              fontFamily: "Pacifico",
              color: green,
              fontSize: 22,
              fontWeight: 400,
            }}
          >
            TravelKo
          </div>

          {/* Right: Coordinator Dashboard */}
          <div
            style={{
              color: muted,
              fontSize: 13,
              fontWeight: 500,
              whiteSpace: "nowrap",
            }}
          >
            Coordinator Dashboard
          </div>
        </Container>
      </Navbar>

      {/* ===== MOBILE OFFCANVAS MENU (labels) ===== */}
      <Offcanvas isOpen={drawerOpen} toggle={toggleDrawer} direction="start">
        <OffcanvasHeader toggle={toggleDrawer}>Menu</OffcanvasHeader>
        <OffcanvasBody>
          <Nav vertical style={{ gap: 10 }}>
            {menu.map((m) => {
              const active = isActivePath(m.to);
              const Icon = m.icon;

              return (
                <NavItem key={m.to}>
                  <NavLink
                    to={m.to}
                    onClick={toggleDrawer}
                    style={({ isActive }) => ({
                      ...itemRowStyle(isActive || active),
                      padding: "10px 12px",
                    })}
                  >
                    <div style={iconBtnStyle(active)}>
                      <Icon size={18} />
                    </div>
                    {m.label}
                  </NavLink>
                </NavItem>
              );
            })}

            <NavItem>
              <Button
                color="link"
                onClick={handleLogout}
                style={{
                  ...itemRowStyle(false),
                  padding: "10px 12px",
                }}
              >
                <div style={iconBtnStyle(false)}>
                  <FaSignOutAlt size={18} />
                </div>
                Logout
              </Button>
            </NavItem>
          </Nav>
        </OffcanvasBody>
      </Offcanvas>

      {/* ===== Spacer so content doesn’t hide behind top navbar ===== */}
      <div style={{ height: 12 }} />

      {/* ===== OPTIONAL: recommended content wrapper spacing ===== */}
      <div
        style={{
          // push content right on desktop due to fixed sidebar
          marginLeft: 0,
        }}
        className="d-md-none"
      />

      <Modal
        isOpen={loggingOut}
        centered
        backdrop="static"
        keyboard={false}
        contentClassName="border-0"
      >
        <ModalBody className="text-center py-5">
          <Spinner
            style={{
              width: "3rem",
              height: "3rem",
              color: green,
            }}
            className="mb-3"
          />

          <h5 className="fw-bold mb-1">Logging out…</h5>

          <p className="text-muted mb-0" style={{ fontSize: 14 }}>
            Please wait a moment
          </p>
        </ModalBody>
      </Modal>
    </>
  );
}
