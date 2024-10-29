import React from "react";
import logo from "../assets/rs-fitness-lift-logo.png";
import "./Navbar.css";

const Navbar = () => {
  const currentPath = window.location.pathname;

  return (
    <nav className="navbar">
      <div className="container-fluid">
        <h1 className="navbar-brand">
        <a className="nav-link" href="/home/login"><img src={logo} /></a>
          
        </h1>
        <div className="navbar-collapse">
          <ul className="navbar-nav">
            <li className={`nav-item ${currentPath === "/" ? "navactive" : ""}`}>
              <a className="nav-link" href="/">HOME</a>
            </li>
            <li className={`nav-item ${currentPath === "/aboutus" ? "navactive" : ""}`}>
              <a className="nav-link" href="/aboutus">ABOUT</a>
            </li>
            <li className={`nav-item ${currentPath === "/contactus" ? "navactive" : ""}`}>
              <a className="nav-link" href="/contactus">CONTACT US</a>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
