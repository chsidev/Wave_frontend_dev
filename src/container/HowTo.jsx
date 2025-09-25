import React from 'react';
import TopBar from '../components/TopBar.jsx';
import Footer from '../components/Footer.jsx';

function HowTo() {
  return (
    <>
      <TopBar />
      <div className="hero-area pool">
        <div className="container">
          <div className="row">
            <div className="col-lg-5 d-flex align-self-center">
              <div className="left-content">
                <div className="content">
                  <h1 className="title">
                    Learn How to Play & Win Big
                  </h1>
                  <p className="text">
                    Discover how to join our community-driven prize pools and win rewards securely through a provably fair system powered by Chainlink VRF.
                  </p>
                </div>
              </div>
            </div>
            <div className="col-lg-7">
              <div className="hero-img2 d-block d-md-none">
                <img src="/assets/images/play-big.png" alt="" />
              </div>
              <div className="hero-img d-none d-md-block">
                <img className="shape man" src="/assets/images/play-big.png" alt="" />
              </div>
            </div>
          </div>
          <img className="howto" src="/assets/images/how-to-get-started.svg" alt="" />
          <img className="howto-mobile" src="/assets/images/how-to-get-started-mobile.svg" alt="" />
        </div>
      </div>

      {/* Prize Distribution Section */}
      <section className="prize-distribution">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-12 text-center">
              <h2 className="distribution-title">Prize Distribution Breakdown</h2>
            </div>
          </div>

          {/* Fixed row with proper column structure */}
          <div className="row justify-content-center gap-y">
            {/* Daily Draw Box */}
            <div className="col-lg-6">
              <div className="distribution-box">
                <div className="box-header">
                  <img src="/assets/images/daily-draw.png" alt="Daily Draw" className="box-icon" />
                  <div className="box-title-container">
                    <div className="box-title">DAILY DRAW</div>
                    <div className="box-details">
                      <div className="detail-item">
                        <img src="/assets/images/money.svg" alt="Money" className="detail-icon" />
                        <span>5 $Wave</span>
                      </div>
                      <div className="detail-item">
                        <img src="/assets/images/hourglass.svg" alt="Hourglass" className="detail-icon" />
                        <span>Daily</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="prize-split">
                  <div className="split-label">Prize Split:</div>
                  <div className="split-details">
                    • 70% to Winner<br />
                    • 15% to Monthly MegaWave<br />
                    • 5% Burned<br />
                    • 10% to DAO Treasury
                  </div>
                </div>
              </div>
            </div>

            {/* Mega Wave Box */}
            <div className="col-lg-6">
              <div className="distribution-box">
                <div className="box-header">
                  <img src="/assets/images/mega-wave.png" alt="Mega Wave" className="box-icon" />
                  <div className="box-title-container">
                    <div className="box-title">MEGA WAVE</div>
                    <div className="box-details">
                      <div className="detail-item">
                        <img src="/assets/images/money.svg" alt="Money" className="detail-icon" />
                        <span>5 $Wave</span>
                      </div>
                      <div className="detail-item">
                        <img src="/assets/images/hourglass.svg" alt="Hourglass" className="detail-icon" />
                        <span>Monthly</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="prize-split">
                  <div className="split-label">Prize Split:</div>
                  <div className="split-details">
                    • 75% to Winner<br />
                    • 20% carried to next Megawave<br />
                    • 5% Burned
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Alternative Entry Section - Fixed two-column layout */}
          <div className="row justify-content-center">
            <div className="col-lg-12">
              <div className="alternative-entry">
                <img src="/assets/images/alternative-entry.png" alt="Alternative Entry" width={120} className="entry-icon" />
                <div className="entry-content">
                  <div className="box-title">Alternative Entry (No Purchase Required)</div>
                  <br />
                  <div className="entry-text">
                    Don't want to buy $WAVE? You can still participate!<br />
                    Submit your entry through our official Free Entry Web Form (AMOE) to join both the Daily and Monthly draws.<br />
                    <br />
                    • Equal odds<br />
                    • No purchase necessary<br />
                    • Fair and transparent for all participants
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Disclaimers & Transparency */}
          <div className="row justify-content-center" style={{ marginTop: "64px", marginBottom: "-32px" }}>
            <div className="col-lg-12 text-center">
              <h2 className="distribution-title">Disclaimers & Transparency</h2>
            </div>
          </div>

          <div className="row justify-content-center">
            <div className="col-lg-12">
              <div className="transparency-box">
                <img src="/assets/images/fair.png" alt="Provably Fair" width={64} className="transparency-icon" />
                <div className="transparency-content">
                  <div className="box-title">Provably Fair</div>
                  <div className="transparency-text">
                    All draws are powered by Chainlink VRF (Verifiable Random Function), ensuring randomness and fairness. Results are recorded and verifiable on-chain.
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Risks and Eligibility Boxes */}
          <div className="row justify-content-center gap-y">
            {/* Risks Box */}
            <div className="col-lg-6">
              <div className="disclaimer-box">
                <img src="/assets/images/risks.png" alt="Risks" width={64} className="disclaimer-icon" />
                <div className="disclaimer-content">
                  <div className="box-title">Risks</div>
                  <div className="disclaimer-text">
                    • No Guarantee of Winning: This is a sweepstakes-style game.<br />
                    • Crypto Volatility: $WAVE value can fluctuate.<br />
                    • Not an Investment: There is no expectation of profit.
                  </div>
                </div>
              </div>
            </div>

            {/* Eligibility Box */}
            <div className="col-lg-6">
              <div className="disclaimer-box">
                <img src="/assets/images/eligibility.png" alt="Eligibility" width={64} className="disclaimer-icon" />
                <div className="disclaimer-content">
                  <div className="box-title">Eligibility</div>
                  <div className="disclaimer-text">
                    • Only available in jurisdictions that allow crypto-based sweepstakes.<br />
                    • KYC is required for claiming prizes over $1,000 (as per local compliance laws).
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Compliance Notice */}
          <div className="row justify-content-center" style={{ marginTop: "24px"}}>
            <div className="col-lg-12">
              <div className="compliance-box">
                <img src="/assets/images/compliance.png" alt="Compliance" width={64} className="compliance-icon" />
                <div className="compliance-content">
                  <div className="box-title">Compliance Notice</div>
                  <div className="compliance-text">
                    Wave Global Inc. operates under a Panama-based sweepstakes model.<br />
                    Future plans include licensing upgrades like Curaçao eGaming, depending on user volume.
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Why Trust Wave Wealth? */}
          {/* Why Trust Wave Wealth? */}
          <div className="row justify-content-center">
            <div className="col-lg-12 text-center">
              <h2 className="distribution-title" style={{ marginTop: '60px' }}>Why Trust Wave Wealth?</h2>
            </div>
          </div>

          <div className="row justify-content-center gap-y">
            {/* Card 1 */}
            <div className="col-lg-4 col-md-6">
              <div className="trust-card">
                <img src="/assets/images/why1.png" alt="100% On-Chain" className="trust-icon" />
                <div className="trust-title">100% On-Chain</div>
              </div>
            </div>

            {/* Card 2 */}
            <div className="col-lg-4 col-md-6">
              <div className="trust-card">
                <img src="/assets/images/why2.png" alt="Transparent Tokenomics" className="trust-icon" />
                <div className="trust-title">Transparent Tokenomics</div>
              </div>
            </div>

            {/* Card 3 */}
            <div className="col-lg-4 col-md-6">
              <div className="trust-card">
                <img src="/assets/images/why3.png" alt="Chainlink-Verified Draws" className="trust-icon" />
                <div className="trust-title">Chainlink-Verified Draws</div>
              </div>
            </div>

            {/* Card 4 */}
            <div className="col-lg-4 col-md-6">
              <div className="trust-card">
                <img src="/assets/images/why4.png" alt="Regulatory Progress Ongoing" className="trust-icon" />
                <div className="trust-title">Regulatory Progress Ongoing</div>
              </div>
            </div>

            {/* Card 5 */}
            <div className="col-lg-4 col-md-6">
              <div className="trust-card">
                <img src="/assets/images/why5.png" alt="DAO Governance Coming Soon" className="trust-icon" />
                <div className="trust-title">DAO Governance Coming Soon</div>
              </div>
            </div>

            {/* Card 6 */}
            <div className="col-lg-4 col-md-6">
              <div className="trust-card">
                <img src="/assets/images/why6.png" alt="Legally Structured Platform" className="trust-icon" />
                <div className="trust-title">Legally Structured Platform</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </>
  )
}

export default HowTo;