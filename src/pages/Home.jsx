import "./Home.css";
import hero from "../assets/landingPage.png";
import tour1 from "../assets/tour1.jpg";
import tour2 from "../assets/tour2.png";
import tour3 from "../assets/tour3.jpg";
import { NavLink } from "react-router-dom";

function Home() {
  return (
    <>
      <section
        className="hero"
        style={{ backgroundImage: `url(${hero})` }}
      >
        <div className="hero-overlay">
          <h1>
            Discover Your Next <br />
            <span>Adventure</span> with <span className="brand">TravelKo</span>
          </h1>
          <div className="hero-buttons">
            <NavLink to="/tours">
            <button className="btn primary">Explore Tours</button>
            </NavLink>
            <button className="btn secondary">Learn More</button>
          </div>
        </div>
      </section>

  
      <section className="section">
        <h2>Featured Adventure</h2>
        <p className="subtitle">Handpicked experiences for the ultimate adventure</p>

        <div className="cards">
          <div className="card">
            <img src={tour1} />
            <h3>Mountain Paradise</h3>
            <p>₱5,500</p>
            <button>View</button>
          </div>

          <div className="card">
            <img src={tour2} />
            <h3>Island Hopping</h3>
            <p>₱3,500</p>
            <button>View</button>
          </div>

          <div className="card">
            <img src={tour3} />
            <h3>Scuba Diving</h3>
            <p>₱6,500</p>
            <button>View</button>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="section light">
        <h2>How TravelKo Works</h2>

        <div className="steps">
          <div className="step">Browse Adventures</div>
          <div className="step">Choose Your Experience</div>
          <div className="step">Secure Booking</div>
          <div className="step">Start Your Journey</div>
        </div>
      </section>

      {/* CTA */}
      <section className="cta">
        <h2>Ready to Start Your Adventure?</h2>
        <button className="btn primary">Get Started</button>
      </section>
    </>
  );
}

export default Home;
