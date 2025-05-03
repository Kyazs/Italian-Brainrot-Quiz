import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "../assets/styles/Quiz.scss";
import { quizData, Question, QuizImage } from "../assets/datasets/data";


function Quiz() {
  const navigate = useNavigate();
  const location = useLocation();
  const difficulty = location.state?.difficulty || "medium";
  const customDifficulty = location.state?.customDifficulty || "15";

  // Define difficulty levels
  const difficultyLevels = {
    easy: { name: "Easy", questionCount: 5 },
    medium: { name: "Medium", questionCount: 10 },
    hard: { name: "Hard", questionCount: 15 },
    custom: { name: "Custom", questionCount: parseInt(customDifficulty) || 15 }
  };

  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [imageError, setImageError] = useState(false);
  
  // New states for animation
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [fadeOut, setFadeOut] = useState(false);
  // Add a separate state to track when to disable hover effects
  const [disableOptions, setDisableOptions] = useState(false);

  useEffect(() => {
    // Generate quiz questions when component mounts
    generateQuizQuestions(difficulty);
  }, [difficulty]);

  const generateQuizQuestions = (difficultyLevel: string) => {
    setIsLoading(true);

    // 1. Determine how many questions based on difficulty
    const questionCount =
      difficultyLevels[difficultyLevel as keyof typeof difficultyLevels]
        .questionCount;

    // Make sure we don't try to generate more questions than we have available
    const actualQuestionCount = Math.min(questionCount, quizData.length);

    // 2. Randomly select images for the quiz
    const selectedIndices = getRandomIndices(quizData.length, actualQuestionCount);
    const selectedImages = selectedIndices.map((index) => quizData[index]);

    // 3. Generate questions with multiple choice options
    const generatedQuestions = selectedImages.map((image) => {
      // Get 3 random wrong answers (options that aren't the correct answer)
      const wrongOptions = getRandomWrongOptions(
        quizData,
        image.correctAnswer,
        3
      );

      // Combine correct and wrong options
      const allOptions = [...wrongOptions, image.correctAnswer];

      // Shuffle options
      const shuffledOptions = shuffleArray(allOptions);

      // Find index of correct answer in shuffled array
      const correctIndex = shuffledOptions.indexOf(image.correctAnswer);

      return {
        imageId: image.id,
        imagePath: `../assets/datasets/${image.id}.png`,
        options: shuffledOptions,
        correctAnswerIndex: correctIndex,
      };
    });

    setQuestions(generatedQuestions);
    setIsLoading(false);
  };

  // Get array of random indices without duplicates
  const getRandomIndices = (max: number, count: number): number[] => {
    const indices: number[] = [];
    while (indices.length < count) {
      const randomIndex = Math.floor(Math.random() * max);
      if (!indices.includes(randomIndex)) {
        indices.push(randomIndex);
      }
    }
    return indices;
  };

  // Get random wrong options that aren't the correct answer
  const getRandomWrongOptions = (
    allData: QuizImage[],
    correctAnswer: string,
    count: number
  ): string[] => {
    // Filter out the correct answer
    const wrongAnswers = allData
      .map((item) => item.correctAnswer)
      .filter((answer) => answer !== correctAnswer);

    // Shuffle and take only what we need
    return shuffleArray(wrongAnswers).slice(0, count);
  };

  // Fisher-Yates shuffle algorithm
  const shuffleArray = <T,>(array: T[]): T[] => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  const handleAnswerClick = (selectedAnswerIndex: number) => {
    if (isAnimating) return; // Prevent multiple clicks during animation
    
    // Set the selected answer and animation states
    setSelectedAnswer(selectedAnswerIndex);
    const correct = selectedAnswerIndex === questions[currentQuestionIndex].correctAnswerIndex;
    setIsCorrect(correct);
    setIsAnimating(true);
    
    // Calculate new score
    const newScore = correct ? score + 1 : score;
    
    // Delay the transition to next question
    setTimeout(() => {
      // Only disable hover effects when starting the fade out animation
      setDisableOptions(true);
      // Start fade out animation
      setFadeOut(true);
      
      // After fade out completes, move to next question or results
      setTimeout(() => {
        // Check if this is the last question
        if (currentQuestionIndex < questions.length - 1) {
          // Not the last question, update score and move to next question
          setScore(newScore);
          setCurrentQuestionIndex(currentQuestionIndex + 1);
          setImageError(false); // Reset image error for the next question
          
          // Reset animation states
          setSelectedAnswer(null);
          setIsCorrect(null);
          setIsAnimating(false);
          setFadeOut(false);
          setDisableOptions(false); // Re-enable hover effects
        } else {
          // This is the last question, navigate to results with updated score
          navigate("/results", {
            state: {
              score: newScore, // Use the newly calculated score
              total: questions.length,
              difficulty,
              customQuestionCount: difficulty === "custom" ? customDifficulty : null
            },
          });
        }
      }, 300); // Time for fade out animation
    }, 2000); // 1 second delay before transitioning
  };

  if (isLoading) {
    return <div className="loading-container">Loading quiz questions...</div>;
  }

  const currentQuestion = questions[currentQuestionIndex];

  return (
    <div className="quiz-page-container">
      <div className={`quiz-content ${fadeOut ? 'fade-out' : ''}`}>
        <div className="quiz-header">
          <h2>
            Question {currentQuestionIndex + 1} of {questions.length}
          </h2>
          <div className="difficulty-badge">
            {difficulty === "custom" 
              ? `Custom (${customDifficulty} Questions)`
              : difficultyLevels[difficulty as keyof typeof difficultyLevels].name}
          </div>
        </div>

        <div className="question-card">
          <div className="image-container">
            {!imageError ? (
              <img
                src={require(`../assets/datasets/${currentQuestion.imageId}.png`)}
                alt="Quiz question"
                onError={() => {
                  setImageError(true);
                  console.error(
                    `Failed to load image: ${currentQuestion.imageId}.png`
                  );
                }}
              />
            ) : (
              <div className="image-error">Image not available</div>
            )}
          </div>

          <h3>Who is this?</h3>

          <div className="options-container">
            {currentQuestion.options.map((option, index) => (
              <button
                key={index}
                className={`option-button ${selectedAnswer === index ? 
                  (index === currentQuestion.correctAnswerIndex ? 'correct' : 'incorrect') : ''} 
                  ${selectedAnswer !== null && index === currentQuestion.correctAnswerIndex ? 'show-correct' : ''}
                  ${disableOptions && selectedAnswer !== index ? 'disabled' : ''}`}
                onClick={() => handleAnswerClick(index)}
                disabled={isAnimating}
              >
                {String.fromCharCode(65 + index)}. {option}
              </button>
            ))}
          </div>
        </div>

        <div className="quiz-progress-bar">
          <div
            className="quiz-progress-fill"
            style={{
              width: `${
                ((currentQuestionIndex + 1) / questions.length) * 100
              }%`,
            }}
          ></div>
        </div>
      </div>
    </div>
  );
}

export default Quiz;
