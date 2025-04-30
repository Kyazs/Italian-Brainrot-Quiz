import React from "react";
import { Link, useLocation } from "react-router-dom";
import "../assets/styles/Quiz.scss";
import ASCIIText from "./ascii";

function Results() {
  const location = useLocation();
  const { score, total, difficulty } = location.state || {
    score: 0,
    total: 0,
    difficulty: "medium",
  };

  const percentage = Math.round((score / total) * 100);

  return (
    <div className="results-page-container">
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
            {percentage > 80
              ? "Excellent! You're an Italian Brainrot expert!"
              : percentage > 50
              ? "Good job! You know quite a bit!"
              : "Keep studying those made-up Italian names!"}
          </p>
        </div>

        <div className="action-buttons">
          <Link to="/quiz" state={{ difficulty }}>
            <button className="retry-button">Try Again</button>
          </Link>
          <Link to="/">
            <button className="home-button">Back to Home</button>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Results;
