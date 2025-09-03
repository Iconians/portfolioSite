import Link from "next/link";
// import "./Nav.css";
import styles from "./Nav.module.css";

export const Nav = () => {
  return (
    <div className={styles.navWrapper}>
      <nav className={styles.navBar}>
        <div className={styles.brand}>
          <h2>Clayton Cripe</h2>
        </div>
        <div className={styles.ulList}>
          <Link className={styles.linkBtn} href="/">
            Home
          </Link>
          <Link className={styles.linkBtn} href="/About">
            About
          </Link>
          <Link className={styles.linkBtn} href="/blogs">
            Blog
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
