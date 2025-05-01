import React, { useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import "../assets/styles/Quiz.scss";
import ASCIIText from "./ascii";

function Results() {
  const location = useLocation();
  const { score, total, difficulty, customQuestionCount } = location.state || {
    score: 0,
    total: 0,
    difficulty: "medium",
    customQuestionCount: null,
  };

  const percentage = Math.round((score / total) * 100);
  
  // Get the difficulty text for display
  const getDifficultyText = () => {
    return difficulty === 'custom' 
      ? `Custom (${customQuestionCount} questions)` 
      : difficulty.charAt(0).toUpperCase() + difficulty.slice(1);
  };
  
  // Initialize Facebook SDK on component mount
  useEffect(() => {
    // Load the Facebook SDK script
    (function(d, s, id) {
      var js = d.createElement(s) as HTMLScriptElement;
      var fjs = d.getElementsByTagName(s)[0];
      if (d.getElementById(id)) return;
      js.id = id;
      js.src = "https://connect.facebook.net/en_US/sdk.js#xfbml=1&version=v3.0";
      if (fjs && fjs.parentNode) {
        fjs.parentNode.insertBefore(js, fjs);
      }
    }(document, 'script', 'facebook-jssdk'));
  }, []);
  
  return (
    <div className="results-page-container">
      {/* Facebook SDK root div */}
      <div id="fb-root"></div>
      
      <p className="ads">
        <ASCIIText
          text={`${percentage}%`}
          enableWaves={true}
          asciiFontSize={2}
        />
      </p>
      <div className="results-content">
        <h1 className="results-title">Quiz Results</h1>
        <div className="score-card">
          <h2>
            You scored {score} out of {total}
          </h2>
          <p className="message">
            { 
            // percentage == 100 ? "Magnifico! You have been Infected"
             percentage > 80
              ? "Excellent! You're an Italian Brainrot expert!"
              : percentage > 50
              ? "Good job! You know quite a bit!"
              : "Keep studying those made-up Italian names!"}
          </p>
          
          {/* Facebook Share Button */}
          <div className="social-share-container">
            <div 
              className="fb-share-button" 
              data-href={window.location.href} 
              data-layout="button"
              data-size="large">
            </div>
            <p className="share-text">Share your results on Facebook!</p>
          </div>
        </div>

        <div className="action-buttons">
          <Link to="/quiz" state={{ difficulty, customDifficulty: customQuestionCount }}>
            <button className="retry-button">Try Again</button>
          </Link>
          <Link to="/italian-brainrot-quiz">
            <button className="home-button">Back to Home</button>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Results;
