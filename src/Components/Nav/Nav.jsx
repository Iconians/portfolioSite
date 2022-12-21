import React from "react";
import { useAppContext } from "../../../Providers/app.Context";
import "./Nav.css";

const Nav = () => {
  const { modalOpen } = useAppContext();
  return (
    <div>
      <nav className="nav-bar">
        <div className="brand">
          <h2>Handy Websites</h2>
        </div>
        <div className="ul-list">
          <ul>
            <li>
              <input
                type="submit"
                name="about"
                onClick={modalOpen}
                value="About Me"
              />
            </li>
            <li name="contact" onClick={modalOpen}>
              <input
                type="submit"
                name="contact"
                onClick={modalOpen}
                value="Contact"
              />
            </li>
          </ul>
        </div>
      </nav>
    </div>
  );
};

export default Nav;
