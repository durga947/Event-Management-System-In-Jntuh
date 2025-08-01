import React from "react";
import "./header.css";

const JntuhHeader = () => {
  return (
    <div className="jntuh-header">
      <div className="jntuh-topline"></div>

      <div className="jntuh-topbar">
        <div className="jntuh-left">
          <img
            src="https://play-lh.googleusercontent.com/s_Y7UxcJtjCoR1EiaxgI4yCayQZ6Ivo_RnSf5oBiPD7a91V0EEs0txOyhWxv8cgkrek=w600-h300-pc0xffffff-pd"
            alt="JNTUH Logo"
             className="jntuh-logo"
          />
        </div>
        

        <div className="jntuh-center">
          <h1>Jawaharlal Nehru Technological University Hyderabad</h1>
          <p>Kukatpally, Hyderabad - 500 085, Telangana, India</p>
          <p className="naac">ACCREDITED BY NAAC WITH 'A+' GRADE</p>
        </div>


      </div>
<div className="jntuh-underline"></div>

    </div>
  );
};

export default JntuhHeader;
