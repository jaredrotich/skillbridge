
import React from "react";
import "./Footer.css";

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-content">
        <h3>SkillBridge</h3>
        <p>Your trusted platform for skills and services. Reach out anytime.</p>

        <div className="footer-contacts">
          <p><strong>Email:</strong> support@skillbridge.co.ke</p>
          <p><strong>Call:</strong> 0723 467 198</p>
          <p><strong>WhatsApp:</strong> +254 723 467 198</p>
        </div>

        <p className="copyright">
          &copy; {new Date().getFullYear()} SkillBridge. All rights reserved.
        </p>
      </div>
    </footer>
  );
}

export default Footer;
