/* eslint-disable no-unused-vars */
/* eslint-disable no-mixed-operators */
/* eslint-disable no-undef */
/* eslint-disable jsx-a11y/alt-text */
import React from 'react'

const NotFound = () => {
  return (
    <div>

      <section className="four-zero-four">
        <img className="bg-img z-0" src="assets/images/404-bg.png" alt="" />
        <div className="container z-1">
          <div className="row">
            <div className="col-lg-12">
              <div className="content">
                <img src="assets/images/404.png" alt="" />
                <div className="inner-content">
                  <h4 className="title">
                    Oops,
                    Something went wrong !
                  </h4>
                  <a href="/" className="mybtn1"><i className="fas fa-angle-double-left"></i> BACK TO HOME</a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default NotFound
