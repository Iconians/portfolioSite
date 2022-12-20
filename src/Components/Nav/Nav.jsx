import React from "react";
import "./Nav.css";

const Nav = () => (
  <div>
    <nav className="nav-bar">
      <div className="brand">
        <h2>Handy Websites</h2>
      </div>
      <div className="ul-list">
        <ul>
          <li>About Me</li>
          <li>Contact</li>
        </ul>
      </div>
    </nav>
  </div>
);

export default Nav;
