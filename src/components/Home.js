import React, { useEffect } from "react";
import Slider from "react-slick";
import "./home.css";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import JntuhHeader from "./JntuhHeader";

const Home = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const settings = {
    autoplay: true,
    autoplaySpeed: 2000,
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
  };

  return (
    <div className="home-container">
       <JntuhHeader />
      <header className="header">
        <nav>
          <a href="/login">Login</a>
          <a href="/register">Register</a>
        </nav>
      </header>

      <div className="main-content">
        <div className="logo">
          <img
            src="https://play-lh.googleusercontent.com/s_Y7UxcJtjCoR1EiaxgI4yCayQZ6Ivo_RnSf5oBiPD7a91V0EEs0txOyhWxv8cgkrek=w600-h300-pc0xffffff-pd"
            alt="JNTUH Logo"
          />
          <h1 className="welcome-message">
            EVENT MANAGEMENT SYSTEM FOR JAWAHARLAL NEHRU TECHNOLOGICAL UNIVERSITY HYDERABAD
          </h1>
        </div>

        <div className="slider">
          <Slider {...settings}>
            <div>
              <img src="https://assets.thehansindia.com/h-upload/2020/08/15/991580-jntuh.webp" alt="Event 1" />
            </div>
            <div>
              <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQJINVbJWie3744A7XHp2fzxEev_UZ1Lj0D6KeW5q7if6B6U4oGzrQakGYqJk7l-mbDMSU&usqp=CAU" alt="Event 2" />
            </div>
                        <div>
              <img src="https://media.telanganatoday.com/wp-content/uploads/2023/03/JNTU-Hyderabad.jpg" alt="Event 3" />
            </div>

            
          </Slider>
        </div>

        <div className="introduction">
          <p>Welcome to the JNTUH Event Management website!</p>
          <p>
            This platform provides students and staff members of Jawaharlal Nehru Technological
            University Hyderabad (JNTUH) with a centralized system for managing events, workshops,
            and activities.
          </p>
          <p>
            Whether you're a student or staff member, this site gives access to tailored event
            functionalities.
          </p>
        </div>

<div className="contact-us">
  <h3>Contact Us</h3>
  <p>+91 1234567890</p>
  <p>+91 0987654321</p>
</div>
  
      </div>
    </div>
  );
};

export default Home;
