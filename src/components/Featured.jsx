import React, { useState, useEffect, useCallback } from 'react'

const Featured = () => {

  return (
    <>
      <section className="featured-game">
        <div className="features">
          <div className="container">
            <div className="row">
              <div className="col-lg-12">
                <div className="feature-box">
                  <div className="feature-box-inner">
                    <div className="row">
                      <div className="col-lg-4 col-md-6">
                        <div className="single-feature">
                          <div className="icon one">
                            <img src="assets/images/feature/icon1.gif" alt="" />
                          </div>
                          <div className="content">
                            <h4 className="title">
                              Exclusive Offer
                            </h4>
                            <a href="#" className="link">Read More <i
                              className="fas fa-arrow-right"></i></a>
                          </div>
                        </div>
                      </div>
                      <div className="col-lg-4 col-md-6">
                        <div className="single-feature">
                          <div className="icon two">
                            <img src="assets/images/feature/icon2.gif" alt="" />
                          </div>
                          <div className="content">
                            <h4 className="title">
                              Provably Fair
                            </h4>
                            <a href="#" className="link">Read More <i
                              className="fas fa-arrow-right"></i></a>
                          </div>
                        </div>
                      </div>
                      <div className="col-lg-4 col-md-6">
                        <div className="single-feature">
                          <div className="icon three">
                            <img src="assets/images/feature/icon3.gif" alt="" />
                          </div>
                          <div className="content">
                            <h4 className="title">
                              Full-time Support
                            </h4>
                            <a href="#" className="link">Read More <i
                              className="fas fa-arrow-right"></i></a>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>        
      </section>
    </>
  )
}

export default Featured
