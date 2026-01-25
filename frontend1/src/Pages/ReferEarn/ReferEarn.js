import React from "react";
import "./referAndEarn.css";
import pic from "../../images/pic/refer.png";

const ReferAndEarn = () => {
  return (
    <div className="refer-page">
      <div className="container">
        {/* HEADER */}
        <div className="refer-header text-center">
          <h2>Refer & Earn 🎂</h2>
          <p>
            Invite your friends and earn sweet rewards on every successful
            order!
          </p>
        </div>

        {/* MAIN CARD */}
        <div className="refer-card row align-items-center">
          {/* LEFT */}
          <div className="col-lg-6 mb-4 mb-lg-0">
            <img
              src={pic}
              alt="Refer"
              className="img-fluid refer-img"
            />
          </div>

          {/* RIGHT */}
          <div className="col-lg-6">
            <h4>How it works</h4>

            <ul className="refer-steps">
              <li>
                <span>1</span> Share your referral code with friends
              </li>
              <li>
                <span>2</span> Your friend places their first cake order
              </li>
              <li>
                <span>3</span> You earn ₹100 wallet cashback 🎉
              </li>
            </ul>

            {/* REFERRAL CODE */}
            <div className="referral-box">
              <p>Your Referral Code</p>
              <div className="code-box">
                <span>CAKE100</span>
                <button>Copy</button>
              </div>
            </div>

            {/* SHARE BUTTONS */}
            <div className="share-buttons">
              <button className="btn btn-success">
                Share on WhatsApp
              </button>
              <button className="btn btn-primary">
                Share on Facebook
              </button>
            </div>
          </div>
        </div>

        {/* TERMS */}
        <div className="refer-terms">
          <h6>Terms & Conditions</h6>
          <ul>
            <li>Referral reward is credited after successful delivery.</li>
            <li>Applicable only on first order of referred user.</li>
            <li>Wallet amount can be used on cake orders only.</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ReferAndEarn;
