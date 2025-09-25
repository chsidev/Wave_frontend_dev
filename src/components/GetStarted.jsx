import React, { useState, useEffect, useCallback } from 'react'

const GetStarted = () => {

  return (
    <>
      <section className="get-start">
        <div className="container">
          <div className="row">
            <div className="col-lg-7 d-flex align-self-center">
              <div className="left-area">
                <div className="section-heading">
                  <h5 className="subtitle">
                    Winners Every Day
                  </h5>
                  <h2 className="title ">
                    be one of them
                  </h2>
                  <p className="text">
                    Get started in less than 5 min - no credit card
                    required. Gain early access to Wave Wealth and experience crypto like never before.
                  </p>
                  <a href="#" className="mybtn1">Play Now!</a>
                </div>
              </div>
            </div>
            <div className="col-lg-5">
              <div className="right-image">
                <img src="assets/images/get-start.png" alt=""/>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

export default GetStarted
