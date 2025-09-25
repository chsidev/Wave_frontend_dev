
import React, { useState, useEffect, useRef } from 'react'
import TopBar from '../components/TopBar'
import Featured from '../components/Featured'
import Activities from '../components/Activities'
import GetStarted from '../components/GetStarted'
import RecentWinner from '../components/RecentWinner'
import Footer from '../components/Footer'
import Hero from '../components/Hero'

function History() {
  return (
    <>

      <TopBar />
      <section className="tournaments">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-8 col-md-10">
              <div className="section-heading">
                <h5 className="subtitle">
                  Try to check out our
                </h5>
                <h2 className="title">
                  Tournaments!
                </h2>
                <p className="text">
                  Dooplo Tournaments are exciting slot competitions. The goal is to win as many points within
                  a
                  certain amount of time. Player with the most points at the end wins.
                </p>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-lg-6">
              <div className="tournament-time-box">
                <div className="top-area">
                  <div className="status">
                    In Progress
                  </div>
                  <h4 className="title">
                    All Players (Excl VIP's)
                  </h4>
                  <p className="sub-title">
                    Slots Tournament
                  </p>
                </div>
                <div className="timer-area">
                  <h4 className="title">
                    Ending in
                  </h4>
                  <div className="clock"></div>
                </div>
              </div>
            </div>
            <div className="col-lg-6">
              <div className="tournament-time-box">
                <div className="top-area">
                  <div className="status">
                    In Progress
                  </div>
                  <h4 className="title">
                    VIP Only
                  </h4>
                  <p className="sub-title">
                    Slots Tournament
                  </p>
                </div>
                <div className="timer-area">
                  <h4 className="title">
                    Ending in
                  </h4>
                  <div className="clock2"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="info-table">
          <div className="container">
            <div className="row">
              <div className="col-lg-12">
                <div className="main-box">
                  <div className="main-header-area">
                    <ul className="nav" role="tablist">
                      <li className="nav-item" role="presentation">
                        <button className="nav-link active" id="all-player-tab" data-bs-toggle="tab" data-bs-target="#all-player" type="button"
                          role="tab" aria-controls="all-player" aria-selected="true">All Player</button>
                      </li>
                      <li className="nav-item" role="presentation">
                        <button className="nav-link" id="vip-only-tab" data-bs-toggle="tab" data-bs-target="#vip-only" type="button"
                          role="tab" aria-controls="vip-only" aria-selected="false">Vip Only</button>
                      </li>
                    </ul>
                  </div>
                  <div className="tab-content">
                    <div className="tab-pane fade show active" id="all-player" role="tabpanel" aria-labelledby="all-player-tab">
                      <div className="inner-table-content">
                        <div className="header-area">
                          <ul className="nav nav-lend mb-3" role="tablist">
                            <li className="nav-item" role="presentation">
                              <button className="nav-link active" id="leaderboard-tab" data-bs-toggle="tab" data-bs-target="#leaderboard" type="button"
                                role="tab" aria-controls="leaderboard" aria-selected="true">Leaderboard</button>
                            </li>
                            <li className="nav-item" role="presentation">
                              <button className="nav-link" id="more-info-tab" data-bs-toggle="tab" data-bs-target="#more-info" type="button"
                                role="tab" aria-controls="more-info" aria-selected="false">More Info</button>
                            </li>
                          </ul>
                        </div>
                        <div className="tab-content">
                          <div className="tab-pane fade show active" id="leaderboard" role="tabpanel" aria-labelledby="leaderboard-tab">
                            <div className="inner-table">
                              <div className="responsive-table">
                                <table className="table">
                                  <thead>
                                    <tr>
                                      <th scope="col">USER</th>
                                      <th scope="col">Place</th>
                                      <th scope="col">Points</th>
                                      <th scope="col">Prize</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    <tr>
                                      <td>
                                        <img src="assets/images/people/p1.png" alt=""/>
                                          Tom Bass
                                      </td>
                                      <td>
                                        01
                                      </td>
                                      <td>
                                        33528.36
                                      </td>
                                      <td>
                                        40 EUR X 30WR
                                      </td>
                                    </tr>
                                    <tr>
                                      <td>
                                        <img src="assets/images/people/p1.png" alt=""/>
                                          Tom Bass
                                      </td>
                                      <td>
                                        01
                                      </td>
                                      <td>
                                        33528.36
                                      </td>
                                      <td>
                                        40 EUR X 30WR
                                      </td>
                                    </tr>
                                    <tr>
                                      <td>
                                        <img src="assets/images/people/p1.png" alt=""/>
                                          Tom Bass
                                      </td>
                                      <td>
                                        01
                                      </td>
                                      <td>
                                        33528.36
                                      </td>
                                      <td>
                                        40 EUR X 30WR
                                      </td>
                                    </tr>
                                    <tr>
                                      <td>
                                        <img src="assets/images/people/p1.png" alt=""/>
                                          Tom Bass
                                      </td>
                                      <td>
                                        01
                                      </td>
                                      <td>
                                        33528.36
                                      </td>
                                      <td>
                                        40 EUR X 30WR
                                      </td>
                                    </tr>
                                    <tr>
                                      <td>
                                        <img src="assets/images/people/p1.png" alt=""/>
                                          Tom Bass
                                      </td>
                                      <td>
                                        01
                                      </td>
                                      <td>
                                        33528.36
                                      </td>
                                      <td>
                                        40 EUR X 30WR
                                      </td>
                                    </tr>
                                    <tr>
                                      <td>
                                        <img src="assets/images/people/p1.png" alt=""/>
                                          Tom Bass
                                      </td>
                                      <td>
                                        01
                                      </td>
                                      <td>
                                        33528.36
                                      </td>
                                      <td>
                                        40 EUR X 30WR
                                      </td>
                                    </tr>
                                    <tr>
                                      <td>
                                        <img src="assets/images/people/p1.png" alt=""/>
                                          Tom Bass
                                      </td>
                                      <td>
                                        01
                                      </td>
                                      <td>
                                        33528.36
                                      </td>
                                      <td>
                                        40 EUR X 30WR
                                      </td>
                                    </tr>
                                    <tr>
                                      <td>
                                        <img src="assets/images/people/p1.png" alt=""/>
                                          Tom Bass
                                      </td>
                                      <td>
                                        01
                                      </td>
                                      <td>
                                        33528.36
                                      </td>
                                      <td>
                                        40 EUR X 30WR
                                      </td>
                                    </tr>
                                    <tr>
                                      <td>
                                        <img src="assets/images/people/p1.png" alt=""/>
                                          Tom Bass
                                      </td>
                                      <td>
                                        01
                                      </td>
                                      <td>
                                        33528.36
                                      </td>
                                      <td>
                                        40 EUR X 30WR
                                      </td>
                                    </tr>
                                    <tr>
                                      <td>
                                        <img src="assets/images/people/p1.png" alt=""/>
                                          Tom Bass
                                      </td>
                                      <td>
                                        01
                                      </td>
                                      <td>
                                        33528.36
                                      </td>
                                      <td>
                                        40 EUR X 30WR
                                      </td>
                                    </tr>
                                  </tbody>
                                </table>
                              </div>
                            </div>
                          </div>
                          <div className="tab-pane fade" id="more-info" role="tabpanel" aria-labelledby="more-info-tab">
                            <div className="info-content">
                              <div className="info-box">
                                <h4 className="title">
                                  Tournament Duration
                                </h4>
                                <p className="text">
                                  7 Days (Monday 00:01 UTC - Sunday 23:59 UTC)
                                </p>
                              </div>
                              <div className="info-box two">
                                <h4 className="title">
                                  Applicable Games
                                </h4>
                                <p className="text">
                                  All Games Under 'Slots' Category
                                </p>
                              </div>
                              <div className="info-box three">
                                <h4 className="title">
                                  Free Spin Reward Games

                                </h4>
                                <p className="text">
                                  Book Of Pyramids, Brave Viking, Desert Treasure, Hawaii
                                  Cocktails, Lucky Blue, Lucky Lady Clover, Lucky Sweets,
                                  Princess Of Sky, Princess Royal, Scroll Of Adventure,
                                  Slotomon Go, West Town Any Softswiss Slots Game | Wager x 40
                                  times
                                </p>
                              </div>
                              <a href="#" className="mybtn1">Terms and Conditions</a>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="tab-pane fade" id="vip-only" role="tabpanel" aria-labelledby="vip-only-tab">
                      <div className="inner-table-content">
                        <div className="header-area">
                          <ul className="nav nav-lend mb-3" role="tablist">
                            <li className="nav-item" role="presentation">
                              <button className="nav-link active" id="leaderboard-2nd-tab" data-bs-toggle="tab" data-bs-target="#leaderboard-2nd" type="button"
                                role="tab" aria-controls="leaderboard-2nd" aria-selected="true">leaderboard</button>
                            </li>
                            <li className="nav-item" role="presentation">
                              <button className="nav-link" id="more-info-2nd-tab" data-bs-toggle="tab" data-bs-target="#more-info-2nd" type="button"
                                role="tab" aria-controls="more-info-2nd" aria-selected="false">More Info</button>
                            </li>
                          </ul>
                        </div>
                        <div className="tab-content">
                          <div className="tab-pane fade show active" id="leaderboard-2nd" role="tabpanel" aria-labelledby="leaderboard-2nd-tab">
                            <div className="inner-table">
                              <div className="responsive-table">
                                <table className="table">
                                  <thead>
                                    <tr>
                                      <th scope="col">USER</th>
                                      <th scope="col">Place</th>
                                      <th scope="col">Points</th>
                                      <th scope="col">Prize</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    <tr>
                                      <td>
                                        <img src="assets/images/people/p1.png" alt=""/>
                                          Tom Bass
                                      </td>
                                      <td>
                                        01
                                      </td>
                                      <td>
                                        33528.36
                                      </td>
                                      <td>
                                        40 EUR X 30WR
                                      </td>
                                    </tr>
                                    <tr>
                                      <td>
                                        <img src="assets/images/people/p1.png" alt=""/>
                                          Tom Bass
                                      </td>
                                      <td>
                                        01
                                      </td>
                                      <td>
                                        33528.36
                                      </td>
                                      <td>
                                        40 EUR X 30WR
                                      </td>
                                    </tr>
                                    <tr>
                                      <td>
                                        <img src="assets/images/people/p1.png" alt=""/>
                                          Tom Bass
                                      </td>
                                      <td>
                                        01
                                      </td>
                                      <td>
                                        33528.36
                                      </td>
                                      <td>
                                        40 EUR X 30WR
                                      </td>
                                    </tr>
                                    <tr>
                                      <td>
                                        <img src="assets/images/people/p1.png" alt=""/>
                                          Tom Bass
                                      </td>
                                      <td>
                                        01
                                      </td>
                                      <td>
                                        33528.36
                                      </td>
                                      <td>
                                        40 EUR X 30WR
                                      </td>
                                    </tr>
                                    <tr>
                                      <td>
                                        <img src="assets/images/people/p1.png" alt=""/>
                                          Tom Bass
                                      </td>
                                      <td>
                                        01
                                      </td>
                                      <td>
                                        33528.36
                                      </td>
                                      <td>
                                        40 EUR X 30WR
                                      </td>
                                    </tr>
                                    <tr>
                                      <td>
                                        <img src="assets/images/people/p1.png" alt=""/>
                                          Tom Bass
                                      </td>
                                      <td>
                                        01
                                      </td>
                                      <td>
                                        33528.36
                                      </td>
                                      <td>
                                        40 EUR X 30WR
                                      </td>
                                    </tr>
                                    <tr>
                                      <td>
                                        <img src="assets/images/people/p1.png" alt=""/>
                                          Tom Bass
                                      </td>
                                      <td>
                                        01
                                      </td>
                                      <td>
                                        33528.36
                                      </td>
                                      <td>
                                        40 EUR X 30WR
                                      </td>
                                    </tr>
                                    <tr>
                                      <td>
                                        <img src="assets/images/people/p1.png" alt=""/>
                                          Tom Bass
                                      </td>
                                      <td>
                                        01
                                      </td>
                                      <td>
                                        33528.36
                                      </td>
                                      <td>
                                        40 EUR X 30WR
                                      </td>
                                    </tr>
                                    <tr>
                                      <td>
                                        <img src="assets/images/people/p1.png" alt=""/>
                                          Tom Bass
                                      </td>
                                      <td>
                                        01
                                      </td>
                                      <td>
                                        33528.36
                                      </td>
                                      <td>
                                        40 EUR X 30WR
                                      </td>
                                    </tr>
                                    <tr>
                                      <td>
                                        <img src="assets/images/people/p1.png" alt=""/>
                                          Tom Bass
                                      </td>
                                      <td>
                                        01
                                      </td>
                                      <td>
                                        33528.36
                                      </td>
                                      <td>
                                        40 EUR X 30WR
                                      </td>
                                    </tr>
                                  </tbody>
                                </table>
                              </div>
                            </div>
                          </div>
                          <div className="tab-pane fade" id="more-info-2nd" role="tabpanel" aria-labelledby="more-info-2nd-tab">
                            <div className="info-content">
                              <div className="info-box">
                                <h4 className="title">
                                  Tournament Duration
                                </h4>
                                <p className="text">
                                  7 Days (Monday 00:01 UTC - Sunday 23:59 UTC)
                                </p>
                              </div>
                              <div className="info-box two">
                                <h4 className="title">
                                  Applicable Games
                                </h4>
                                <p className="text">
                                  All Games Under 'Slots' Category
                                </p>
                              </div>
                              <div className="info-box three">
                                <h4 className="title">
                                  Free Spin Reward Games

                                </h4>
                                <p className="text">
                                  Book Of Pyramids, Brave Viking, Desert Treasure, Hawaii
                                  Cocktails, Lucky Blue, Lucky Lady Clover, Lucky Sweets,
                                  Princess Of Sky, Princess Royal, Scroll Of Adventure,
                                  Slotomon Go, West Town Any Softswiss Slots Game | Wager x 40
                                  times
                                </p>
                              </div>
                              <a href="#" className="mybtn1">Terms and Conditions</a>
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
        </div>
      </section>
      <Footer />

    </>
  )
}

export default History
