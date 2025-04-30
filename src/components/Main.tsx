import React, { useState } from "react";
import { Link } from "react-router-dom";
import "../assets/styles/Main.scss";
import SplashCursor from "./splashCursor";
import ASCIIText from "./ascii";

function Main() {
  const [showInfo, setShowInfo] = useState<boolean>(false);
  const [showDifficultyModal, setShowDifficultyModal] = useState<boolean>(false);

  return (
    <div className="chumbli-container">
      <SplashCursor />

      <div className="chumbli-background">
        <div className="chumbli-content">
          <div className="logo-container">
            <h1 className="quiz-logo">
              Italian Brainrot Quiz
              <ASCIIText
                text="Have Fun!"
                enableWaves={true}
                asciiFontSize={2}
              />
            </h1>
          </div>
          <div className="button-container">
            <button
              className="watch-trailer-btn"
              onClick={() => setShowInfo(!showInfo)}
            >
              HOW TO PLAY
            </button>

            <button 
              className="start-quiz-btn"
              onClick={() => setShowDifficultyModal(true)}
            >
              Start Quiz
            </button>
          </div>

          {showInfo && (
            <div className="quiz-info-modal">
              <div className="quiz-info-content">
                <h3>How To Play</h3>
                <ul>
                  <li>Select your quiz difficulty and start the challenge!</li>
                  <li>
                    Answer interesting multiple-choice questions about our funny Italian-inspired names.
                  </li>
                  <li>Different difficulty levels have different numbers of questions:
                    <ul>
                      <li>Easy: 5 questions</li>
                      <li>Medium: 10 questions</li>
                      <li>Hard: 15 questions</li>
                    </ul>
                  </li>
                </ul>
                <button
                  className="close-modal-btn"
                  onClick={() => setShowInfo(false)}
                >
                  Close
                </button>
              </div>
            </div>
          )}

          {showDifficultyModal && (
            <div className="difficulty-modal">
              <div className="difficulty-content">
                <h3>Select Difficulty</h3>
                <div className="difficulty-buttons">
                  <Link 
                    to="/quiz" 
                    state={{ difficulty: "easy" }}
                  >
                    <button className="difficulty-btn easy">Easy (5 Questions)</button>
                  </Link>
                  <Link 
                    to="/quiz" 
                    state={{ difficulty: "medium" }}
                  >
                    <button className="difficulty-btn medium">Medium (10 Questions)</button>
                  </Link>
                  <Link 
                    to="/quiz" 
                    state={{ difficulty: "hard" }}
                  >
                    <button className="difficulty-btn hard">Hard (15 Questions)</button>
                  </Link>
                </div>
                <button
                  className="close-modal-btn"
                  onClick={() => setShowDifficultyModal(false)}
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Main;