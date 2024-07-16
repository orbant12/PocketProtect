"use client";

import React, { Ref, useRef } from 'react';
import "../../cancer_app/css/navbar.css";
import { useAuth } from '@/Context/UserAuthContext';


const NavBar = () => {
  const navRef = useRef<HTMLElement | null>(null);
  const { currentuser } = useAuth()

  const handleBurgerMenuOpen2 = () => {
    if (navRef.current) {
      navRef.current.classList.add("active");
    }
  };

  const handleBurgerMenuClose2 = () => {
    if (navRef.current) {
      navRef.current.classList.remove("active");
    }
  };

  return (
    <>
    {!currentuser &&
      <LoggedOff_NavBar 
        navRef={navRef}
        handleBurgerMenuClose2={handleBurgerMenuClose2}
        handleBurgerMenuOpen2={handleBurgerMenuOpen2}
      />
    }
    </>
  );
};

export default NavBar;


const LoggedOff_NavBar = ({
  navRef,
  handleBurgerMenuClose2,
  handleBurgerMenuOpen2
}:{
  navRef: Ref<any>;
  handleBurgerMenuClose2:() => void;
  handleBurgerMenuOpen2:() => void;

}) => {
  return(
    <>
    <div className='add-bar'>
      <span>Get 20% off on all services</span>
    </div>
    <nav ref={navRef} className='sticky'>
      <div className="nav-bar active">
        <i className='bx bx-menu sidebarOpen' onClick={handleBurgerMenuOpen2} />
        <span className="logo navLogo"><a href="/">Pocket Protect</a></span>
        <div className="menu show">
          <div className="logo-toggle ">
            <span className="logo"><a href="#">betterByte</a></span>
            <i className='bx bx-x siderbarClose' onClick={handleBurgerMenuClose2}></i>
          </div>
          <ul className="nav-links">
            <li><a href="/mobile-projects">Home</a></li>
            <li><a href="/fullstack-projects">Services</a></li>
            <li><a href="/cyber_security-projects">Clients</a></li>
          </ul>
        </div>

        <div className="nav-more">
          <a href="/about-me">Contact</a>
          <a>|</a>
          <a href="/auth/login">Login</a>
        </div>
      </div>
    </nav>
  </>
  )
}

