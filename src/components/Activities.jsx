import React, { useState, useEffect, useCallback } from 'react'
import { gamePlayers, shortenAddress } from '../utils/constants.ts'

const Activities = () => {

  return (
    <>
      <section className="activities">
        <img className="shape shape1" src="assets/images/people/shape1.png" alt="" />
        <img className="shape shape2" src="assets/images/people/shape2.png" alt="" />
        <img className="shape shape3" src="assets/images/people/shape3.png" alt="" />
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-8 col-md-10">
              <div className="section-heading">
                <h5 className="subtitle">
                  The Smarter Way
                </h5>
                <h2 className="title">
                  Wave Raiders
                </h2>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-lg-12">
              <div className="tab-content">
                <div className="tab-pane fade show active" id="all-bets" role="tabpanel" aria-labelledby="all-bets-tab">
                  <div className="responsive-table">
                    <table className="table">
                      <thead>
                        <tr>
                          <th scope="col">USER</th>
                          <th scope="col">XP USED</th>
                          <th scope="col">GAME</th>
                          <th scope="col">PROFIT</th>
                        </tr>
                      </thead>
                      <tbody>
                        {gamePlayers.map((player, index) => (
                          <tr key={index}>
                            <td>
                              {shortenAddress(player.address, 4)}
                            </td>
                            <td>
                              <img src={'/logo.png'} alt="" />
                              {player.xp_used}
                            </td>
                            {/* <td>{player.chance}</td> */}
                            <td>{player.game}</td>
                            <td>
                              <img src={'/logo.png'} alt="" />
                              {player.profit}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
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

export default Activities
