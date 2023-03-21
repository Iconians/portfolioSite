import React from "react";
import { useAppContext } from "../../Providers/app.Context";
import "./Nav.css";

const Nav = () => {
  const { modalOpen } = useAppContext();
  return (
    <div>
      <nav className="nav-bar">
        <div className="brand">
          <h2>Clayton Cripe</h2>
        </div>
        <div className="ul-list">
          <ul>
            <li>
              <input
                type="submit"
                name="about"
                onClick={modalOpen}
                value="About Me"
                className="aboutme-Btn"
              />
            </li>
          </ul>
        </div>
      </nav>
    </div>
  );
};

export default Nav;
