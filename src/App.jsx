import Navbar from "./components/Navbar";
import Footer from "./components/Footer"; // ✅ import footer
import { Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Tours from "./pages/Tours";
import About from "./pages/About";
import Login from "./pages/Login";

function App() {
  return (
    <>
      <Navbar />
      
      <main style={{ paddingTop: "80px" }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/tours" element={<Tours />} />
          <Route path="/about" element={<About />} />
          <Route path="/login" element={<Login />} />
        </Routes>
      </main>

      <Footer /> {/* ✅ Footer appears on all pages */}
    </>
  );
}

export default App;
