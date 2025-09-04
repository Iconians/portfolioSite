"use client";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faTimes } from "@fortawesome/free-solid-svg-icons";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import Link from "next/link";
import styles from "./Nav.module.css";

export const Nav = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className={styles.navWrapper}>
      <nav className={styles.navBar}>
        {/* Brand */}
        <div className={styles.brand}>
          <h2>Clayton Cripe</h2>
        </div>

        {/* Hamburger */}
        <button
          className={styles.hamburger}
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle Menu"
        >
          <FontAwesomeIcon icon={isOpen ? faTimes : faBars} />
        </button>

        {/* Links (desktop only) */}
        <div className={styles.desktopMenu}>
          <Link className={styles.linkBtn} href="/">
            Home
          </Link>
          <Link className={styles.linkBtn} href="/About">
            About
          </Link>
          <Link className={styles.linkBtn} href="/blogs">
            Blog
          </Link>
        </div>

        {/* Mobile Drawer + Backdrop */}
        <AnimatePresence>
          {isOpen && (
            <>
              {/* Backdrop */}
              <motion.div
                className={styles.backdrop}
                onClick={() => setIsOpen(false)}
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.5 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              />

              {/* Drawer */}
              <motion.div
                className={styles.mobileDrawer}
                initial={{ x: "100%" }}
                animate={{ x: 0 }}
                exit={{ x: "100%" }}
                transition={{ type: "spring", duration: 1.2 }}
              >
                <Link
                  className={styles.linkBtn}
                  href="/"
                  onClick={() => setIsOpen(false)}
                >
                  Home
                </Link>
                <Link
                  className={styles.linkBtn}
                  href="/About"
                  onClick={() => setIsOpen(false)}
                >
                  About
                </Link>
                <Link
                  className={styles.linkBtn}
                  href="/blogs"
                  onClick={() => setIsOpen(false)}
                >
                  Blog
                </Link>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </nav>
    </div>

    // <div className={styles.navWrapper}>
    //   <nav className={styles.navBar}>
    //     <div className={styles.brand}>
    //       <h2>Clayton Cripe</h2>
    //     </div>
    //     <div className={styles.ulList}>
    //       <Link className={styles.linkBtn} href="/">
    //         Home
    //       </Link>
    //       <Link className={styles.linkBtn} href="/About">
    //         About
    //       </Link>
    //       <Link className={styles.linkBtn} href="/blogs">
    //         Blog
    //       </Link>
    //     </div>
    //   </nav>
    // </div>
  );
};

export default Nav;
