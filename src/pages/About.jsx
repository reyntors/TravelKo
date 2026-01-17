import { Container, Row, Col, Card, CardBody } from "reactstrap";
import aboutBg from "../assets/landingPage.png"; 
import { useState } from "react";
import followersImg from "../assets/traveler.jpg";
import { FaMapMarkerAlt, FaBullseye, FaShieldAlt, 
        FaCheckCircle, FaBuilding, FaRegBuilding, 
        FaRibbon, FaCreditCard, FaGlobe,
        FaUmbrella, FaBriefcase, FaCar ,
        FaUsers
      } from "react-icons/fa";

const missionVisionData = [
  {
    title: "Our Mission",
    icon: <FaBullseye />,
    points: [
      "To democratize adventure travel by connecting passionate travelers with trusted local coordinators, providing seamless booking experiences, and offering premium travel equipment - all while ensuring the highest standards of safety and customer satisfaction.",
      "Enable accessible adventure experiences for all travelers",
      "Support local tourism coordinators and communities",
      "Promote sustainable and responsible tourism practices",
    ],
  },
  {
    title: "Our Vision",
    icon: <FaBullseye />,
    points: [
      "To become Southeast Asia's leading adventure travel ecosystem, where every journey is safe, memorable, and transformative. We envision a world where adventure travel is accessible, sustainable, and enriching for both travelers and local communities.",
      "Pioneer innovative travel technology solutions",
      "Expand to serve the entire Southeast Asian market",
      "Create positive economic impact in rural communities",
    ],
  },
];

const coreValuesData = [
  {
    title: "Safety First",
    description:
      "We prioritize the safety of our travelers and coordinators in every adventure.",
    icon: <FaShieldAlt />,
  },
  {
    title: "Authenticity",
    description:
      "We ensure genuine and memorable experiences that reflect local culture and traditions.",
    icon: <FaShieldAlt />,
  },
  {
    title: "Sustainability",
    description:
      "We promote responsible tourism that protects the environment and supports local communities.",
    icon: <FaShieldAlt />,
  },
  {
    title: "Excellence",
    description:
      "We strive to provide the highest quality service and exceptional adventure experiences.",
    icon: <FaShieldAlt />,
  },
];

 const certifications = [
  {
    name: 'Department of Tourism (DOT)',
    description: "License No: DOT-2024-TK-001234 Authorized travel agency license for domestic and international tour operations, valid until December 2025.",
    icon: <FaRibbon className="text-white" size={24} />,
    bg: 'bg-success',
  },
  {
    name: 'Bureau of Internal Revenue (BIR)',
    description: 'TIN: 123-456-789-000 Registered business entity authorized to collect taxes and issue official receipts for tourism services.',
    icon: <FaCreditCard className="text-white" size={20} />,
    bg: 'bg-success',
  },
  {
    name: 'Securitues and Exchange Commission (SEC)',
    description: 'Registration No: CS202400987654 Corporate registration as TravelKo Travel Services Corporation, authorized to operate nationwide.',
    icon: <FaGlobe className="text-white" size={20} />,
    bg: 'bg-success',
  },
];

  const accreditations = [
  {
    name: 'Philippine Travel Agencies Association (PTAA)',
    description:
      'Member ID: PTAA-2024-001856. Active member of the national association ensuring ethical business practices and professional standards.',
    icon: <FaRibbon className="text-white" size={22} />,
    bg: 'bg-success',
  },
  {
    name: 'Payment Card Industry (PCI DSS)',
    description:
      'Compliance Level: PCI DSS Level 1. Certified secure payment processing system protecting customer financial information and transactions.',
    icon: <FaCreditCard className="text-white" size={22} />,
    bg: 'bg-success',
  },
  {
    name: 'International Air Transport Association (IATA)',
    description:
      'Agent Code: 12345678. Authorized to issue airline tickets and provide flight booking services for international travel.',
    icon: <FaGlobe className="text-white" size={22} />,
    bg: 'bg-success',
  },
];

const insuranceData = [
  {
    title: "Travel Insurance",
    description:
      "Coverage for medical emergencies, trip cancellations, delays, and unforeseen incidents to protect travelers throughout their journey.",
    icon: <FaUmbrella />,
  },
  {
    title: "Business Liability Insurance",
    description:
      "Protects TravelKo against legal liabilities, property damage, and third-party claims arising from business operations.",
    icon: <FaBriefcase />,
  },
  {
    title: "Vehicle Fleet Insurance",
    description:
      "Comprehensive insurance coverage for company-operated and partner vehicles used in tours, transfers, and logistics.",
    icon: <FaCar />,
  },
];



function About() {

   const [activeIndex, setActiveIndex] = useState(0);
   const [activeIndex2, setActiveIndex2] = useState(0);
   const [activeIndexInsurance, setActiveIndexInsurance] = useState(0);

const nextInsurance = () => {
  setActiveIndexInsurance((prev) =>
    prev === insuranceData.length - 1 ? 0 : prev + 1
  );
};

const previousInsurance = () => {
  setActiveIndexInsurance((prev) =>
    prev === 0 ? insuranceData.length - 1 : prev - 1
  );
};




  const next = () =>
    setActiveIndex((prev) => (prev + 1) % missionVisionData.length);
  const previous = () =>
    setActiveIndex((prev) =>
      prev === 0 ? missionVisionData.length - 1 : prev - 1
    );

      const next2 = () =>
    setActiveIndex2((prev) => (prev + 1) % coreValuesData.length);
  const previous2 = () =>
    setActiveIndex2((prev) =>
      prev === 0 ? coreValuesData.length - 1 : prev - 1
    );
  return (
    <>
    <section style={{ position: "relative", height: "70vh" }}>
      {/* Background Image */}
      <div
        style={{
          backgroundImage: `url(${aboutBg})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          width: "100%",
          height: "100%",
          position: "absolute",
          top: 0,
          left: 0,
          zIndex: 1,
        }}
      />

      {/* Dark Overlay */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundColor: "rgba(0, 0, 0, 0.5)",
          zIndex: 2,
        }}
      />

      {/* Content */}
      <Container
        className="h-100 d-flex justify-content-center align-items-center"
        style={{ position: "relative", zIndex: 3 }}
      >
        <Row>
          <Col xs="12" className="text-center text-white">
            <h1 style={{ fontFamily: "Poppins", fontWeight: 600, fontSize: "3rem" }}>
              About <br></br><span style={{fontFamily: "Pacifico", fontWeight: 300, color: '#16A34A'}}>TravelKo</span>
            </h1>
            <p
              style={{
                fontWeight: "300",
                fontFamily: "Poppins",
                fontSize: "1rem",
                marginTop: "1rem",
                maxWidth: "700px",
                marginLeft: "auto",
                marginRight: "auto",
                lineHeight: "1.6",
              }}
            >
              Connecting adventurers with experienced coordinators to create unforgettable travel experiences. Your trusted partner for adventure tours and premium travel gear.
            </p>
          </Col>
        </Row>
      </Container>
    </section>

     <section style={{ padding: "4rem 0", background: "#F9FAFB" }}>
      <Container>
        {/* About TravelKo Text */}
        <Row className="mb-5">
          <Col xs="12" className="text-center">
            <h2 className="fw-bold mb-3">About TravelKo</h2>
            <p style={{ maxWidth: "700px", margin: "0 auto", lineHeight: "1.6", fontSize: "1rem" }}>
              TravelKo is the Philippines' premier platform designed to bring together passionate travelers 
              and experienced travel coordinators in one central location. We revolutionize how adventure enthusiasts 
              discover, plan, and experience their dream journeys.
            </p>
            <p style={{ maxWidth: "700px", margin: "1rem auto 0", lineHeight: "1.6", fontSize: "1rem" }}>
              Founded with the vision of making adventure travel accessible to everyone, TravelKo provides a comprehensive 
              ecosystem that includes tour booking, travel gear shopping, and secure payment solutions. 
              We bridge the gap between wanderlust and reality.
            </p>
          </Col>
        </Row>

        {/* Stats with Icon */}
        <Row className="text-center mb-5 g-4">
          <Col xs="12" md="4">
            <div
              style={{
                width: "80px",
                height: "80px",
                borderRadius: "50%",
                backgroundColor: "#16A34A",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                margin: "0 auto 1rem auto",
                color: "white",
                fontSize: "1.5rem",
              }}
            >
              <FaMapMarkerAlt />
            </div>
            <h4 className="fw-bold">200+ Destinations</h4>
            <p className="text-muted">Across the Philippines</p>
          </Col>

          <Col xs="12" md="4">
            <div
              style={{
                width: "80px",
                height: "80px",
                borderRadius: "50%",
                backgroundColor: "#16A34A",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                margin: "0 auto 1rem auto",
                color: "white",
                fontSize: "1.5rem",
              }}
            >
              {/* You can add another icon here, e.g., user or verified */}
              <FaUsers/>
            </div>
            <h4 className="fw-bold">500+ Coordinators</h4>
            <p className="text-muted">Verified travel experts</p>
          </Col>

          <Col xs="12" md="4" className="position-relative">
  {/* Image background */}
  <div
    style={{
      width: "100%",
      height: "200px",
      borderRadius: "12px",
      overflow: "hidden",
      position: "relative",
    }}
  >
    <img
      src={followersImg}
      alt="Happy Followers"
      style={{
        width: "100%",
        height: "100%",
        objectFit: "cover",
      }}
    />
  </div>

  {/* Green Box outside image */}
  <div
    style={{
      position: "absolute",
      bottom: "-20px", // partially outside the image
      left: "20px",
      backgroundColor: "#16A34A",
      color: "white",
      padding: "0.8rem 1.2rem",
      borderRadius: "12px",
      fontWeight: "bold",
      boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
      zIndex: 5,
      textAlign: "center",
    }}
  >
    10,000+ <br /> Happy Followers
  </div>
</Col>

        </Row>
      </Container>
    </section>

     <section style={{ padding: "4rem 0", background: "#F9FAFB" }}>
      <Container>
        <Row className="text-center mb-5">
          <Col>
            <h2 className="fw-bold display-3">Our Mission & Vision</h2>
            <p style={{ maxWidth: "700px", margin: "0 auto", fontSize: "1.1rem" }}>
              Driving the future of adventure travel through innovation, safety, and exceptional experiences
            </p>
          </Col>
        </Row>

        {/* Carousel / Swipe Section */}
        <div style={{ position: "relative" }}>
          <Row className="justify-content-center">
            <Col xs="12" md="8">
              <Card
                className="shadow-sm"
                style={{
                  borderRadius: "14px",
                  border: "1px solid #E5E7EB",
                  minHeight: "350px",
                  overflow: "hidden",
                  position: "relative",
                }}
              >
                <CardBody>
                  {/* Icon */}
                  <div
                    style={{
                      width: "60px",
                      height: "60px",
                      borderRadius: "50%",
                      backgroundColor: "#16A34A",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      color: "white",
                      fontSize: "1.5rem",
                      marginBottom: "1rem",
                    }}
                  >
                    {missionVisionData[activeIndex].icon}
                  </div>

                  {/* Title */}
                  <h4 className="fw-bold mb-3">
                    {missionVisionData[activeIndex].title}
                  </h4>

                  {/* Points */}
                  <ul style={{ paddingLeft: "1.2rem", lineHeight: 1.6 }}>
                    {missionVisionData[activeIndex].points.map((point, idx) => (
                      <li key={idx}>{point}</li>
                    ))}
                  </ul>
                </CardBody>
              </Card>
            </Col>
          </Row>

          {/* Navigation Buttons */}
          <div
            className="d-flex justify-content-between mt-3"
            style={{ maxWidth: "400px", margin: "0 auto" }}
          >
            <button
              onClick={previous}
              style={{
                border: "none",
                background: "#16A34A",
                color: "white",
                padding: "0.5rem 1rem",
                borderRadius: "8px",
                cursor: "pointer",
              }}
            >
              Prev
            </button>
            <button
              onClick={next}
              style={{
                border: "none",
                background: "#16A34A",
                color: "white",
                padding: "0.5rem 1rem",
                borderRadius: "8px",
                cursor: "pointer",
              }}
            >
              Next
            </button>
          </div>

          {/* Indicator Dots */}
          <div className="d-flex justify-content-center mt-4 gap-2">
            {missionVisionData.map((_, index) => (
              <span
                key={index}
                onClick={() => setActiveIndex(index)}
                style={{
                  width: 12,
                  height: 12,
                  borderRadius: "50%",
                  background:
                    activeIndex === index ? "#16A34A" : "#D1D5DB",
                  cursor: "pointer",
                  transition: "background 0.3s",
                }}
              />
            ))}
          </div>
        </div>
      </Container>
    </section>





    <section style={{ padding: "4rem 0", background: "#FFFFFF" }}>
      <Container>
        <Row className="text-center mb-5">
          <Col>
            <h2 className="fw-bold">Our Core Values</h2>
            <p style={{ maxWidth: "700px", margin: "0 auto", fontSize: "1.1rem" }}>
              The principles that guide every adventure and decision at TravelKo
            </p>
          </Col>
        </Row>

        {/* Carousel / Swipe Section */}
        <div style={{ position: "relative" }}>
          <Row className="justify-content-center">
            <Col xs="12" md="6">
              <Card
                className="shadow-sm"
                style={{
                  borderRadius: "14px",
                  border: "1px solid #E5E7EB",
                  minHeight: "250px",
                  overflow: "hidden",
                  position: "relative",
                }}
              >
                <CardBody className="text-center">
                  {/* Icon */}
                  <div
                    style={{
                      width: "60px",
                      height: "60px",
                      borderRadius: "50%",
                      backgroundColor: "#16A34A",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      color: "white",
                      fontSize: "1.5rem",
                      margin: "0 auto 1rem auto",
                    }}
                  >
                    {coreValuesData[activeIndex2].icon}
                  </div>

                  {/* Title */}
                  <h4 className="fw-bold mb-3">
                    {coreValuesData[activeIndex2].title}
                  </h4>

                  {/* Description */}
                  <p style={{ fontSize: "1rem", lineHeight: 1.5 }}>
                    {coreValuesData[activeIndex2].description}
                  </p>
                </CardBody>
              </Card>
            </Col>
          </Row>

          {/* Navigation Buttons */}
          <div
            className="d-flex justify-content-between mt-3"
            style={{ maxWidth: "300px", margin: "0 auto" }}
          >
            <button
              onClick={previous2}
              style={{
                border: "none",
                background: "#16A34A",
                color: "white",
                padding: "0.5rem 1rem",
                borderRadius: "8px",
                cursor: "pointer",
              }}
            >
              Prev
            </button>
            <button
              onClick={next2}
              style={{
                border: "none",
                background: "#16A34A",
                color: "white",
                padding: "0.5rem 1rem",
                borderRadius: "8px",
                cursor: "pointer",
              }}
            >
              Next
            </button>
          </div>

          {/* Indicator Dots */}
          <div className="d-flex justify-content-center mt-4 gap-2">
            {coreValuesData.map((_, index) => (
              <span
                key={index}
                onClick={() => setActiveIndex2(index)}
                style={{
                  width: 12,
                  height: 12,
                  borderRadius: "50%",
                  background: activeIndex2 === index ? "#16A34A" : "#D1D5DB",
                  cursor: "pointer",
                  transition: "background 0.3s",
                }}
              />
            ))}
          </div>
        </div>
      </Container>
    </section>

     <section className="my-5 px-3" style={{fontFamily: "Poppins"}}>
      <Row className="justify-content-center">
        <Col xs="12" md="8" lg="6">
          <h2 className="mb-3 text-center">Permits & Licenses</h2>
          <p className="text-center">
            TravelKo operates under full legal compliance with all Philippine tourism
            and business regulations, ensuring safe and legitimate travel services for
            our customers.
          </p>
        </Col>
      </Row>
    </section>


     <section className="my-5 px-3">
      <Row className="justify-content-center">
        <Col xs="12" md="8" lg="6" className="text-center">
          

         {/* Government Certifications */}
<h4 className="mb-3" style={{fontFamily: "Poppins", fontWeight: 600}}>Government Certifications</h4>
<Row className="mb-4 justify-content-center g-3">
  {certifications.map((cert, idx) => (
    <Col
      key={idx}
      xs="12"
      sm="6"
      className="p-3 rounded"
      style={{ background: '#8beeafad' }}
    >
      <div className="d-flex align-items-start">
        {/* Icon */}
        <div
          className={`rounded-circle d-flex align-items-center justify-content-center me-3 ${cert.bg}`}
          style={{ width: '50px', height: '50px', flexShrink: 0 }}
        >
          {cert.icon}
        </div>

        {/* Text */}
        <div className="text-start">
          <h6 className="mb-1 fw-bold">{cert.name}</h6>
          <small className="text-muted d-block">
            {cert.description}
          </small>
        </div>
      </div>
    </Col>
  ))}
</Row>

         {/* Industry Accreditations */}
<h4 className="mb-3">Industry Accreditations</h4>
<Row className="mb-4 justify-content-center g-3">
  {accreditations.map((cert, idx) => (
    <Col
      key={idx}
      xs="12"
      sm="6"
      className="p-3 rounded"
      style={{ background: '#8beeafad' }}
    >
      <div className="d-flex align-items-start">
        {/* Icon */}
        <div
          className={`rounded-circle d-flex align-items-center justify-content-center me-3 ${cert.bg}`}
          style={{ width: '50px', height: '50px', flexShrink: 0 }}
        >
          {cert.icon}
        </div>

        {/* Text */}
        <div className="text-start">
          <h6 className="mb-1 fw-bold">{cert.name}</h6>
          <small className="text-muted d-block">
            {cert.description}
          </small>
        </div>
      </div>
    </Col>
  ))}
</Row>


        </Col>
      </Row>
    </section>

    <section style={{ padding: "4rem 0", background: "#FFFFFF" }}>
  <Container>
    <Row className="text-center mb-5">
      <Col>
        <h2 className="fw-bold">Insurance Coverage</h2>
        <p style={{ maxWidth: "700px", margin: "0 auto", fontSize: "1.1rem" }}>
          Comprehensive insurance protection to ensure safety, reliability, and peace of mind
        </p>
      </Col>
    </Row>

    {/* Carousel / Swipe Section */}
    <div style={{ position: "relative" }}>
      <Row className="justify-content-center">
        <Col xs="12" md="6">
          <Card
            className="shadow-sm"
            style={{
              borderRadius: "14px",
              border: "1px solid #E5E7EB",
              minHeight: "260px",
              overflow: "hidden",
              position: "relative",
            }}
          >
            <CardBody className="text-center">
              {/* Icon */}
              <div
                style={{
                  width: "60px",
                  height: "60px",
                  borderRadius: "50%",
                  backgroundColor: "#16A34A",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  color: "white",
                  fontSize: "1.5rem",
                  margin: "0 auto 1rem auto",
                }}
              >
                {insuranceData[activeIndexInsurance].icon}
              </div>

              {/* Title */}
              <h4 className="fw-bold mb-3">
                {insuranceData[activeIndexInsurance].title}
              </h4>

              {/* Description */}
              <p style={{ fontSize: "1rem", lineHeight: 1.5 }}>
                {insuranceData[activeIndexInsurance].description}
              </p>
            </CardBody>
          </Card>
        </Col>
      </Row>

      {/* Navigation Buttons */}
      <div
        className="d-flex justify-content-between mt-3"
        style={{ maxWidth: "300px", margin: "0 auto" }}
      >
        <button
          onClick={previousInsurance}
          style={{
            border: "none",
            background: "#16A34A",
            color: "white",
            padding: "0.5rem 1rem",
            borderRadius: "8px",
            cursor: "pointer",
          }}
        >
          Prev
        </button>
        <button
          onClick={nextInsurance}
          style={{
            border: "none",
            background: "#16A34A",
            color: "white",
            padding: "0.5rem 1rem",
            borderRadius: "8px",
            cursor: "pointer",
          }}
        >
          Next
        </button>
      </div>

      {/* Indicator Dots */}
      <div className="d-flex justify-content-center mt-4 gap-2">
        {insuranceData.map((_, index) => (
          <span
            key={index}
            onClick={() => setActiveIndexInsurance(index)}
            style={{
              width: 12,
              height: 12,
              borderRadius: "50%",
              background:
                activeIndexInsurance === index ? "#16A34A" : "#D1D5DB",
              cursor: "pointer",
              transition: "background 0.3s",
            }}
          />
        ))}
      </div>
    </div>
    <Row className="text-center mb-5">
      <Col>
       
        <p style={{ maxWidth: "700px", margin: "0 auto", fontSize: ".8rem", marginTop: "1.5rem", fontFamily:"Poppins" }}>
          All permits and licenses are regularly renewed and updated. For verification of any certification, please contact our customer serivce team.
        </p>
      </Col>
    </Row>
  </Container>
</section>


    </>
  );
}

export default About;
