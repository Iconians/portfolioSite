import Link from "next/link";
import "./Nav.css";

export const Nav = () => {
  return (
    <div className="nav-wrapper">
      <nav className="nav-bar">
        <div className="brand">
          <h2>Clayton Cripe</h2>
        </div>
        <div className="ul-list">
          <Link className="home-Btn" href="/">
            Home
          </Link>
          <Link className="about-Btn" href="/About">
            About
          </Link>
          {/* <Link className="schedule-Btn" to="/schedule">
            Schedule
          </Link> */}
        </div>
      </nav>
    </div>
  );
};

export default Nav;
