import React, { useState } from 'react';
import textLogo from '../icons/logo.png';
import Cookies from 'universal-cookie';

const Footer = () => {
  const [modalIsOpen, setModalIsOpen] = useState(false)
  const cookies = new Cookies();
  // Modal Section
  const toggleModal = () => {
    setModalIsOpen(!modalIsOpen)
    cookies.set("show-how-it-works", "true")
  }

  const closeModal = e => {
    if (e.target.id === 'modal') {
      setModalIsOpen(false)
      cookies.set("show-how-it-works", "true")
    }
  }


  return (
    <footer className="footer" id="footer">
      {/* <div className="subscribe-area">
        <div className="container">
          <div className="row">
            <div className="col-lg-12">
              <div className="subscribe-box">
                <form action="#">
                  <div className="row">
                    <div className="col-lg-12">
                      <div className="heading-area">
                        <h5 className="sub-title">
                          subscribe to Wave Wealth
                        </h5>
                        <h4 className="title">
                          Get Early Access to Pools + Bonus Entries
                        </h4>
                      </div>
                    </div>
                    <div className="col-lg-3 col-4 d-flex align-self-center">
                      <div className="icon">
                        <img src="assets/images/mail-box.png" alt="" />
                      </div>
                    </div>
                    <div className="col-lg-6 col-8 d-flex align-self-center">
                      <div className="form-area">
                        <input type="text" placeholder="Your Email Address" />
                      </div>
                    </div>
                    <div className="col-lg-3 d-flex align-self-center">
                      <div className="button-area">
                        <button className="mybtn1" type="submit">Subscribe
                          <span><i className="fas fa-paper-plane"></i></span>
                        </button>
                      </div>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div> */}
      {/* <div className="container">
        <div className="row">
          <div className="col-sm-6 col-lg-3">
            <div className="footer-widget info-link-widget">
              <h4 className="title">
                About
              </h4>
              <ul className="link-list">
                <li>
                  <a href="#">
                    <i className="fas fa-angle-double-right"></i> About Us
                  </a>
                </li>
                <li>
                  <a href="#">
                    <i className="fas fa-angle-double-right"></i> Contact Us
                  </a>
                </li>
                <li>
                  <a href="#">
                    <i className="fas fa-angle-double-right"></i> Latest Blog
                  </a>
                </li>
                <li>
                  <a href="#">
                    <i className="fas fa-angle-double-right"></i> Authenticity Guarantee
                  </a>
                </li>
                <li>
                  <a href="#">
                    <i className="fas fa-angle-double-right"></i> Customer Reviews
                  </a>
                </li>
                <li>
                  <a href="#">
                    <i className="fas fa-angle-double-right"></i> Privacy Policy

                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="col-sm-6 col-lg-3">
            <div className="footer-widget info-link-widget">
              <h4 className="title">
                My Account
              </h4>
              <ul className="link-list">
                <li>
                  <a href="#">
                    <i className="fas fa-angle-double-right"></i> Manage Your Account
                  </a>
                </li>
                <li>
                  <a href="#">
                    <i className="fas fa-angle-double-right"></i> How to Deposit
                  </a>
                </li>
                <li>
                  <a href="#">
                    <i className="fas fa-angle-double-right"></i> How to Withdraw
                  </a>
                </li>
                <li>
                  <a href="#">
                    <i className="fas fa-angle-double-right"></i> Account Varification
                  </a>
                </li>
                <li>
                  <a href="#">
                    <i className="fas fa-angle-double-right"></i> Safety & Security
                  </a>
                </li>
                <li>
                  <a href="#">
                    <i className="fas fa-angle-double-right"></i> Membership Level

                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="col-sm-6 col-lg-3">
            <div className="footer-widget info-link-widget">
              <h4 className="title">
                help center
              </h4>
              <ul className="link-list">
                <li>
                  <a href="#">
                    <i className="fas fa-angle-double-right"></i>Help centre
                  </a>
                </li>
                <li>
                  <a href="#">
                    <i className="fas fa-angle-double-right"></i>FAQ
                  </a>
                </li>
                <li>
                  <a href="#">
                    <i className="fas fa-angle-double-right"></i>Quick Start Guide
                  </a>
                </li>
                <li>
                  <a href="#">
                    <i className="fas fa-angle-double-right"></i>Tutorials
                  </a>
                </li>
                <li>
                  <a href="#">
                    <i className="fas fa-angle-double-right"></i>Borrow
                  </a>
                </li>
                <li>
                  <a href="#">
                    <i className="fas fa-angle-double-right"></i>Lend

                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="col-sm-6 col-lg-3">
            <div className="footer-widget info-link-widget">
              <h4 className="title">
                Legal Info
              </h4>
              <ul className="link-list">
                <li>
                  <a href="#">
                    <i className="fas fa-angle-double-right"></i>Risk Warnings
                  </a>
                </li>
                <li>
                  <a href="#">
                    <i className="fas fa-angle-double-right"></i>Privacy Notice
                  </a>
                </li>
                <li>
                  <a href="#">
                    <i className="fas fa-angle-double-right"></i>Security
                  </a>
                </li>
                <li>
                  <a href="#">
                    <i className="fas fa-angle-double-right"></i>Terms of Service
                  </a>
                </li>
                <li>
                  <a href="#">
                    <i className="fas fa-angle-double-right"></i>Become Affiliate
                  </a>
                </li>
                <li>
                  <a href="#">
                    <i className="fas fa-angle-double-right"></i>Complaints Policy

                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div> */}
      <div className="copy-bg">
        <div className="container">
          <div className="row">
            <div className="col-lg-5">
              <div className="left-area">
                <p>Copyright © <span className="currentYear"></span>.All Rights Reserved By <a href="#">Wave Wealth</a>
                </p>
              </div>
            </div>
            <div className="col-lg-7">
              <ul className="copright-area-links">
                <li>
                  <a href="#">Terms Of Use</a>
                </li>
                <li>
                  <a href="#">Privacy Policy</a>
                </li>
                <li>
                  <a href="/prize">Play</a>
                </li>
                {/* <li>
                  <a href="#">Aware</a>
                </li>
                <li>
                  <a href="#">Help Cente</a>
                </li> */}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;