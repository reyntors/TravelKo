import { Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

// Public pages
import Home from "./pages/Home";
import Tours from "./pages/Tours";
import About from "./pages/About";
import Login from "./pages/Login";
import BookAdventure from "./pages/BookAdventure";
import TourDetails from "./pages/TourDetails";

// Coordinator pages
import CoordinatorLayout from "./pages/coordinator/CoordinatorLayout";
import CoordinatorDashboard from "./pages/coordinator/Dashboard";
import CoordinatorTours from "./pages/coordinator/Tours";
import CoordinatorBookings from "./pages/coordinator/Bookings";
import CoordinatorProfile from "./pages/coordinator/Profile";

function App() {
  return (
    <Routes>
      {/* ✅ PUBLIC WEBSITE (with Navbar + Footer) */}
      <Route
        path="/"
        element={
          <>
            <Navbar />
            <main style={{ paddingTop: "80px" }}>
              <Home />
            </main>
            <Footer />
          </>
        }
      />

      <Route
        path="/tours"
        element={
          <>
            <Navbar />
            <main style={{ paddingTop: "80px" }}>
              <Tours />
            </main>
            <Footer />
          </>
        }
      />

      <Route
        path="/about"
        element={
          <>
            <Navbar />
            <main style={{ paddingTop: "80px" }}>
              <About />
            </main>
            <Footer />
          </>
        }
      />

      <Route
        path="/login"
        element={
          <>
            <Navbar />
            <main style={{ paddingTop: "80px" }}>
              <Login />
            </main>
            <Footer />
          </>
        }
      />

      <Route
        path="/book"
        element={
          <>
            <Navbar />
            <main style={{ paddingTop: "80px" }}>
              <BookAdventure />
            </main>
            <Footer />
          </>
        }
      />

      <Route
        path="/tours/details"
        element={
          <>
            <Navbar />
            <main style={{ paddingTop: "80px" }}>
              <TourDetails />
            </main>
            <Footer />
          </>
        }
      />

      {/* ✅ COORDINATOR DASHBOARD (no public navbar/footer) */}
      <Route
        path="/coordinator/dashboard"
        element={
          <CoordinatorLayout>
            <CoordinatorDashboard />
          </CoordinatorLayout>
        }
      />

      <Route
        path="/coordinator/tours"
        element={
          <CoordinatorLayout>
            <CoordinatorTours />
          </CoordinatorLayout>
        }
      />

      <Route
        path="/coordinator/bookings"
        element={
          <CoordinatorLayout>
            <CoordinatorBookings />
          </CoordinatorLayout>
        }
      />

      <Route
        path="/coordinator/profile"
        element={
          <CoordinatorLayout>
            <CoordinatorProfile />
          </CoordinatorLayout>
        }
      />
    </Routes>
  );
}

export default App;
