import React from 'react'

const Hero = () => {
  return (
    <>
      <div className="hero-area">
        <div className="container">
          <div className="row">
            <div className="col-lg-5 d-flex align-self-center">
              <div className="left-content">
                <div className="content">
                  <h5 className="subtitle">
                    Wave Wealth Prize Pool
                  </h5>
                  <h1 className="title">
                    <span className="play-text">PLAY</span>
                    <span className="to-win-text">TO WIN</span>
                  </h1>
                  <p className="text">
                  For generations, people have pooled money together: susu, tanda, call it what you want. Everyone puts in, and when it’s your turn, you take the pot. Simple. Fair. Built on trust.
                  That’s Wave Wealth. A global version where anyone can win.
                  </p>
                  <div className="links">
                    <a href="/prize" className="join-prize-pool-btn">
                      JOIN THE PRIZE POOL
                    </a>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-lg-7">
              <div className="hero-img2 d-block d-md-none">
                <img src="assets/images/hero.svg" alt="" />
              </div>
              <div className="hero-img d-none d-md-block">
                <img className="shape man" src="assets/images/hero.svg" alt="" />
              </div>
            </div>
          </div>
        </div>
      </div>
      
    </>
  )
}

export default Hero
