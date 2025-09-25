import React, { useState, useEffect, useCallback } from 'react'
import { shortenAddress } from '../utils/constants.ts'

const RecentWinner = () => {

  return (
    <>
      <section className="recent-winners">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-8 col-md-10">
              <div className="section-heading">
                <h5 className="subtitle">
                  Try to Check out our
                </h5>
                <h2 className="title">
                  Recent Winners
                </h2>
                <p className="text">
                  We update our site regularly; more and more winners are added every day! To locate the most
                  recent winner's information
                </p>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-lg-4">
              <div className="single-winer">
                <div className="top-area">
                  <div className="left">
                    <h4 className="name">
                      {shortenAddress("0x1234567890abcdef1234567890abcdef12345678", 3)}
                    </h4>
                    <p className="date">
                      08.06.2025
                    </p>
                  </div>
                  <div className="right">
                    <a className="id" href="https://testnet.bscscan.com/tx/0xcf87b709d4093475731087c32ff8bf0200e1a0d2ba917a7fea39e49031ee5154">Transaction</a>
                  </div>
                </div>
                <div className="bottom-area">
                  <div className="left">
                    100,000 WAVE
                  </div>
                  <div className="right">
                    <img src="/logo.png" width={40} alt="" />
                  </div>
                </div>
              </div>
            </div>
            <div className="col-lg-4">
              <div className="single-winer">
                <div className="top-area">
                  <div className="left">
                    <h4 className="name">
                      {shortenAddress("0x1234567890abcdef1234567890abcdef12345678", 3)}
                    </h4>
                    <p className="date">
                      08.06.2025
                    </p>
                  </div>
                  <div className="right">
                    <a className="id" href="https://testnet.bscscan.com/tx/0xcf87b709d4093475731087c32ff8bf0200e1a0d2ba917a7fea39e49031ee5154">Transaction</a>
                  </div>
                </div>
                <div className="bottom-area">
                  <div className="left">
                    100,000 WAVE
                  </div>
                  <div className="right">
                    <img src="/logo.png" width={40} alt="" />
                  </div>
                </div>
              </div>
            </div>
            <div className="col-lg-4">
              <div className="single-winer">
                <div className="top-area">
                  <div className="left">
                    <h4 className="name">
                      {shortenAddress("0x1234567890abcdef1234567890abcdef12345678", 3)}
                    </h4>
                    <p className="date">
                      08.06.2025
                    </p>
                  </div>
                  <div className="right">
                    <a className="id" href="https://testnet.bscscan.com/tx/0xcf87b709d4093475731087c32ff8bf0200e1a0d2ba917a7fea39e49031ee5154">Transaction</a>
                  </div>
                </div>
                <div className="bottom-area">
                  <div className="left">
                    100,000 WAVE
                  </div>
                  <div className="right">
                    <img src="/logo.png" width={40} alt="" />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-lg-12 text-xl-center">
              <a className="mybtn2" href="#">View All </a>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

export default RecentWinner
