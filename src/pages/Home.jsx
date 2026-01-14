import "./Home.css";
import hero from "../assets/landingPage.png";
import tour1 from "../assets/tour1.jpg";
import tour2 from "../assets/tour2.png";
import tour3 from "../assets/tour3.jpg";
import tour4 from "../assets/tour4.jpg";
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
  <p className="subtitle">Handpicked experiences for the ultimate adventurer</p>

  <div className="cards">
    {/* Mount Pinatubo Adventure */}
    <div className="card">
      <img src={tour1} alt="Mount Pinatubo Adventure" />
      <h3>Mount Pinatubo Adventure</h3>
      <p className="location">Tarlac, Philippines</p>
      <p className="duration">2 Days, 1 Night</p>
      <p className="private-tour">Book a Private Tour </p>
      <p className="price">₱3,500 /pax</p>
      <div className="card-buttons">
        <button className="btn-book">Book Now</button>
        <button className="btn-view">View Details</button>
      </div>
    </div>

    {/* Palawan Island Hopping */}
    <div className="card">
      <img src={tour2} alt="Palawan Island Hopping" />
      <h3>Palawan Island Hopping</h3>
      <p className="location">El Nido, Palawan</p>
      <p className="duration">4 Days, 3 Nights</p>
      <p className="private-tour">Book a Private Tour </p>
      <p className="price">₱8,900 /pax</p>
      <div className="card-buttons">
        <button className="btn-book">Book Now</button>
        <button className="btn-view">View Details</button>
      </div>
    </div>

    {/* Scuba Diving Experience */}
    <div className="card">
      <img src={tour3} alt="Scuba Diving Experience" />
      <h3>Scuba Diving Experience</h3>
      <p className="location">Bohol, Philippines</p>
      <p className="duration">3 Days, 2 Nights</p>
      <p className="private-tour">Book a Private Tour </p>
      <p className="price">₱6,200 /pax</p>
      <div className="card-buttons">
        <button className="btn-book">Book Now</button>
        <button className="btn-view">View Details</button>
      </div>
    </div>
  </div>
</section>

      {/* HOW IT WORKS */}
<section className="how-it-works">
  <h2>How TravelKo Works</h2>
  <p className="subtitle">
    Your adventure is just four simple steps away
  </p>

  <div className="steps">
    <div className="step-card">
      <div className="step-icon">🔍</div>
      <h4>Browse Adventures</h4>
      <p>Explore our curated collection of tours</p>
    </div>

    <div className="step-card">
      <div className="step-icon">❤️</div>
      <h4>Choose Your Experience</h4>
      <p>Select the perfect tour based on your interests</p>
    </div>

    <div className="step-card">
      <div className="step-icon">🛡️</div>
      <h4>Secure Booking</h4>
      <p>Book with confidence using our secure system</p>
    </div>

    <div className="step-card">
      <div className="step-icon">🗺️</div>
      <h4>Start Your Journey</h4>
      <p>Receive confirmation and enjoy your adventure</p>
    </div>
  </div>
</section>


<section className="cta">
  <h2>Ready to Start Your Adventure?</h2>
  <p>Join thousands of adventurers who trust TravelKo</p>

  <div className="cta-buttons">
    <button className="btn primary">Browse Tours</button>
    <button className="btn outline">Become a Coordinator</button>
  </div>
</section>

<section className="followers">
    <div className="follows-count">
        <h1>2,500+</h1>
        <p>Happy Travelers</p>
    </div>
      <div className="follows-count">
        <h1>150+</h1>
        <p>Tour Package</p>
    </div>
      <div className="follows-count">
        <h1>50+</h1>
        <p>Expert Coordinators</p>
    </div>
      <div className="follows-count">
        <h1>4.9</h1>
        <p>Average Rating</p>
    </div>
</section>

<section className="section">
  <h2>Adventure Categories</h2>
  <p className="subtitle">Choose from our diverse range of adventure</p>

  <div className="adventure-cards">

    <div className="adventure-card">
      <img src={tour1} alt="Mount Pinatubo Adventure" />
      <h3>Mounting Climbing</h3>
      <p className="location">Conquer peaks and enjoy breathtaking views</p>
      <p className="private-tour">45 Tours</p>
    </div>
     <div className="adventure-card">
      <img src={tour3} alt="Mount Pinatubo Adventure" />
      <h3>Scuba Diving</h3>
      <p className="location">Conquer peaks and enjoy breathtaking views</p>
      <p className="private-tour">45 Tours</p>
    </div>
     <div className="adventure-card">
      <img src={tour2} alt="Mount Pinatubo Adventure" />
      <h3>Island Hoppping</h3>
      <p className="location">Conquer peaks and enjoy breathtaking views</p>
      <p className="private-tour">45 Tours</p>
    </div>
     <div className="adventure-card">
      <img src={tour4} alt="Mount Pinatubo Adventure" />
      <h3>Camping</h3>
      <p className="location">Conquer peaks and enjoy breathtaking views</p>
      <p className="private-tour">45 Tours</p>
    </div>

   
   


 
  </div>
</section>

    </>
  );
}

export default Home;
