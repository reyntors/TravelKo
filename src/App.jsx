import { Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import ScrollToTop from "./components/ScrollToTop";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

// Public pages
import Home from "./pages/Home";
import Tours from "./pages/Tours";
import About from "./pages/About";
import Login from "./pages/Login";
import BookAdventure from "./pages/BookAdventure";
import TourDetails from "./pages/TourDetails";
import BookPrivateTour from "./pages/BookPrivateTour";

// Coordinator pages
import CoordinatorLayout from "./pages/coordinator/CoordinatorLayout";
import CoordinatorDashboard from "./pages/coordinator/Dashboard";
import CoordinatorTours from "./pages/coordinator/Tours";
import CoordinatorBookings from "./pages/coordinator/Bookings";
import CoordinatorProfile from "./pages/coordinator/Profile";
import CoordinatorPortal from "./pages/CoordinatorPortal";

function App() {
  return (
    <>
      {/* 👇 GLOBAL SCROLL HANDLER */}
      <ScrollToTop />

      <Routes>
        {/* ================= PUBLIC WEBSITE ================= */}
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
          path="/tours/details/:id"
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

        <Route
          path="/tours/book-private"
          element={
            <>
              <Navbar />
              <main style={{ paddingTop: "80px" }}>
                <BookPrivateTour />
              </main>
              <Footer />
            </>
          }
        />

        <Route
          path="/coordinator/register"
          element={
            <>
              <Navbar />
              <main style={{ paddingTop: "80px" }}>
                <CoordinatorPortal />
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

        {/* ================= PROTECTED COORDINATOR AREA ================= */}
        <Route element={<ProtectedRoute />}>
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
        </Route>

        {/* ================= FALLBACK ================= */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}

export default App;
