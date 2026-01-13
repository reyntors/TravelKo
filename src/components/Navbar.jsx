import { NavLink } from "react-router-dom";
import "./Navbar.css";

function Navbar() {
  return (
    <nav className="navbar">
      <h1 className="logo">TravelKo</h1>

      <ul className="nav-links">
        <li>
          <NavLink to="/" end>
            Home
          </NavLink>
        </li>

        <li>
          <NavLink to="/tours">
            Tours
          </NavLink>
        </li>

        <li>
          <NavLink to="/about">
            About Us
          </NavLink>
        </li>

        <li>
            <NavLink to="/login" className="button">
                Login
            </NavLink>
            </li>

      </ul>
    </nav>
  );
}

export default Navbar;
