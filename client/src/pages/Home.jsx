
import React from "react";
import { Link } from "react-router-dom";
import "./Home.css";

function Home() {
  return (
    <div className="home">
      {/* Hero Section */}
      <div className="hero">
        <img
          src="https://www.shutterstock.com/image-vector/full-stack-developer-programmer-who-260nw-2273927175.jpg"
          alt="SkillBridge Hero"
          className="hero-image"
        />
        <div className="hero-text">
          <h1>Welcome to SkillBridge</h1>
          <p>Your trusted partner in building modern, scalable web applications.</p>
          <Link to="/clientrequest" className="cta-button">Request a Service</Link>
        </div>
      </div>

      {/* About Section */}
      <section className="about">
        <h2>About SkillBridge</h2>
        <p>
          SkillBridge is a project by <strong>Hiltech</strong>, designed to connect clients
          with top-rated freelance developers. Whether you need a simple website or a
          fully-fledged SaaS platform, our team delivers with excellence.
        </p>
      </section>

      {/* Skills Section */}
      <section className="skills">
        <h2>Services We Offer</h2>
        <ul>
          <li>✅ Frontend Development (React, HTML, CSS, JS)</li>
          <li>✅ Backend Development (Flask, Node.js, Django)</li>
          <li>✅ Fullstack Web Applications</li>
          <li>✅ RESTful API Design</li>
          <li>✅ UI/UX Design & Prototyping</li>
          <li>✅ Mobile-Responsive Websites</li>
          <li>✅ E-Commerce Platforms</li>
          <li>✅ Portfolio & Resume Websites</li>
          <li>✅ CMS Integration (e.g. WordPress)</li>
          <li>✅ Hosting & Deployment (Netlify, Vercel, Heroku)</li>
        </ul>
      </section>

      {/* Why Us Section */}
      <section className="why-us">
        <h2>Why Choose Hiltech?</h2>
        <ul>
          <li> Experienced & Certified Developers</li>
          <li> On-time Delivery, Every Time</li>
          <li> Transparent & Fair Pricing</li>
          <li> Clean, Maintainable Code</li>
          <li> Dedicated Support After Delivery</li>
          <li> 100% Confidentiality & Trust</li>
        </ul>
      </section>

      {/* Call to Action */}
      <section className="cta">
        <h3>Ready to bring your idea to life?</h3>
        <Link to="/clientrequest" className="cta-button">Get Started Now</Link>
      </section>
    </div>
  );
}

export default Home;
