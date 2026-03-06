import { NavLink, useNavigate, useLocation } from "react-router-dom";
import { useState } from "react";
import {
  FaTachometerAlt,
  FaUsers,
  FaUserCheck,
  FaSignOutAlt,
  FaCalendarAlt,
  FaBars,
} from "react-icons/fa";
import { Modal, ModalBody, Spinner } from "reactstrap";

export default function AdminNav() {
  const navigate = useNavigate();
  const location = useLocation();

  const [collapsed, setCollapsed] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  const green = "#16A34A";

  const handleLogout = () => {
    setLoggingOut(true);

    setTimeout(() => {
      // Remove only auth-related data
      localStorage.removeItem("auth_token");
      localStorage.removeItem("auth_user");
      localStorage.removeItem("auth_role");
      localStorage.removeItem("profilePicture");
      localStorage.removeItem("rememberMe");

      setLoggingOut(false);
      navigate("/");
    }, 1200);
  };

  const menu = [
    { label: "Dashboard", to: "/admin/dashboard", icon: FaTachometerAlt },
    { label: "Coordinators", to: "/admin/coordinators", icon: FaUsers },
    {
      label: "Bookings",
      to: "/admin/booking-applications",
      icon: FaCalendarAlt,
    },
    {
      label: "Coordinator Applications",
      to: "/admin/applications",
      icon: FaUserCheck,
    },
  ];

  const isActive = (path) => location.pathname.startsWith(path);

  return (
    <>
      {/* ===== SIDEBAR ===== */}
      <div
        style={{
          width: collapsed ? 72 : 240,
          background: "#111827",
          color: "#fff",
          minHeight: "100vh",
          padding: "16px 12px",
          display: "flex",
          flexDirection: "column",
          transition: "width 0.25s ease",
        }}
      >
        {/* HEADER */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: collapsed ? "center" : "space-between",
            marginBottom: 24,
          }}
        >
          {!collapsed && <h5 className="m-0 fw-bold">Admin Panel</h5>}

          <button
            onClick={() => setCollapsed(!collapsed)}
            className="btn btn-sm btn-dark"
            style={{ border: "none" }}
          >
            <FaBars />
          </button>
        </div>

        {/* MENU */}
        <div
          style={{ flex: 1, display: "flex", flexDirection: "column", gap: 6 }}
        >
          {menu.map((m) => {
            const Icon = m.icon;
            const active = isActive(m.to);

            return (
              <NavLink
                key={m.to}
                to={m.to}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  padding: "10px 12px",
                  borderRadius: 10,
                  color: active ? "#16A34A" : "#D1D5DB",
                  background: active ? "#064E3B" : "transparent",
                  textDecoration: "none",
                  fontWeight: 600,
                  transition: "all 0.2s ease",
                }}
              >
                <Icon size={18} />
                {!collapsed && <span>{m.label}</span>}
              </NavLink>
            );
          })}
        </div>

        {/* LOGOUT BUTTON */}
        <button
          onClick={handleLogout}
          style={{
            marginTop: 12,
            display: "flex",
            alignItems: "center",
            gap: 12,
            padding: "10px 12px",
            borderRadius: 10,
            border: "none",
            background: "#7F1D1D",
            color: "#fff",
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          <FaSignOutAlt />
          {!collapsed && <span>Logout</span>}
        </button>
      </div>

      {/* ===== LOGOUT MODAL ===== */}
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
