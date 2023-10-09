import React from "react";
import { Link } from "react-router-dom";
import "./Nav.css";

export const Nav = () => {
  return (
    <div>
      <nav className="nav-bar">
        <div className="brand">
          <h2>Clayton Cripe</h2>
        </div>
        <div className="ul-list">
          <Link className="about-Btn" to="/about">
            About
          </Link>
          <Link className="schedule-Btn" to="/schedule">
            Schedule
          </Link>
        </div>
      </nav>
    </div>
  );
};

export default Nav;
