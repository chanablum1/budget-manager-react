import React from 'react';
import { Link } from 'react-router-dom';

function About() {
  return (
    <div className="about-page">
      <div className="hero-section text-center">
        <h1 className="hero-title">ברוכים הבאים למערכת ניהול התקציב האישי</h1>
        <p className="hero-description">
          קבלו שליטה על התקציב שלכם. עקבו אחר הכנסות והוצאות, חיסכו יותר, והגשימו את המטרות הכלכליות שלכם.
        </p>
        <Link to="/login" className="btn btn-primary btn-lg hero-btn">
          התחבר עכשיו לניהול התקציב שלך
        </Link>
      </div>
      <div className="features-section container">
        <h2 className="text-center mb-4">למה כדאי להשתמש במערכת שלנו?</h2>
        <div className="row text-center">
          <div className="col-md-4">
            <div className="feature-box">
              <i className="fas fa-chart-line feature-icon"></i>
              <h3 className="feature-title">מעקב פיננסי</h3>
              <p>עקבו בקלות אחר ההכנסות וההוצאות שלכם והבינו היכן הכסף שלכם מתרכז.</p>
            </div>
          </div>
          <div className="col-md-4">
            <div className="feature-box">
              <i className="fas fa-wallet feature-icon"></i>
              <h3 className="feature-title">חיסכון חכם</h3>
              <p>זהו תחומים לחיסכון ושפרו את המצב הכלכלי שלכם באופן משמעותי.</p>
            </div>
          </div>
          <div className="col-md-4">
            <div className="feature-box">
              <i className="fas fa-bullseye feature-icon"></i>
              <h3 className="feature-title">השגת מטרות</h3>
              <p>תכננו והגשימו מטרות כלכליות בקלות עם תמונה ברורה של התקציב שלכם.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default About;
