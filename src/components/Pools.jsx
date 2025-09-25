import React from 'react'
import BigCountdown from '../components/BigCountdown.jsx'

const Pools = ({LimitTime, PoolData}) => {
    return (
        <div className="container mb-4">
            <div className="row justify-content-center">
                <div className="col-lg-8 col-md-10">
                    <div className="section-heading">
                        <h5 className="subtitle">
                            Try to check out our
                        </h5>
                        <h2 className="title">
                            Prize Pools of the Week
                        </h2>
                        <p className="text">
                            Check out our latest featured game! To meet today's challenges & earn cryptocurrency. Top 10
                            players receive prizes every hour!
                        </p>
                    </div>
                </div>
            </div>
            <div className="row pools-row">
                <div className='col-lg-12'>
                    <div className='row' style={{ alignItems: 'end' }}>
                        <div className="col-lg-6">
                            <div className="pool-feature three">
                                <div className="pool-icon three">
                                    <img src="assets/images/pools/pool3.gif" alt="" className='pool-icon-inner' />
                                </div>
                                <div className="content">
                                    <h5 className='title'>COIN FLIP</h5>
                                    <h4 className="text">
                                        FAST 50/50 CRYPTO CHALLENGE!
                                    </h4>
                                    {/* <div className='winner'><span className='winner-text'>JOHN98 WON 50 WAVE TODAY</span></div> */}
                                    <a href="/coinflip" className="link bottom-aligned">Flip Now<i
                                        className="fas fa-arrow-right"></i></a>
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-6">
                            <div className="pool-feature three">
                                <div className="pool-icon three">
                                    <img src="assets/images/pools/pool2.gif" alt="" className='pool-icon-inner' />
                                </div>
                                <div className="content">
                                    <h4 className="title">
                                        PLAY WIN EARN CRYPTO
                                    </h4>
                                    <p className="text">
                                      <span className='play-win-text'></span>
                                        Enter the Daily or MegaWave pool. Compete for crypto rewards with provable fairness powered by Chainlink VRF.
                                    </p>
                                    <div className='play-win-list'>
                                        <ul className='play-win-list-text'>
                                            <li>• 2 games in progress</li>
                                            <li>• 50 waves stacked</li>
                                            <li>• <span className='play-win-list-text-special'>3 winers today</span></li>
                                        </ul>
                                        <a href="/prize" className="play-now-btn">Play Now <i
                                            className="fas fa-arrow-right"></i></a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
            <div className='row timer-row'>
                <div className='col-lg-12'>
                    <div className='col-lg-9' style={{ margin: 'auto' }}>
                        <div className='timer-box'>
                            <div className='content'>
                                <span>Next Wave starts in</span>
                                <a href="/prize" className="link join-game">RIDE THE WAVE <i
                                    className="fas fa-arrow-right"></i></a>
                            </div>
                            <div className='timer-inner next-wave'>
                                <BigCountdown futureDate={Number(LimitTime)} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Pools
