import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "../assets/styles/Quiz.scss";
import { quizData, Question, QuizImage } from "../assets/datasets/data";

// Define difficulty levels
const difficultyLevels = {
  easy: { name: "Easy", questionCount: 5 },
  medium: { name: "Medium", questionCount: 10 },
  hard: { name: "Hard", questionCount: 15 },
};

function Quiz() {
  const navigate = useNavigate();
  const location = useLocation();
  const difficulty = location.state?.difficulty || "medium";

  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [imageError, setImageError] = useState(false);

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

    // 2. Randomly select images for the quiz
    const selectedIndices = getRandomIndices(quizData.length, questionCount);
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
    // Calculate new score
    const newScore = selectedAnswerIndex === questions[currentQuestionIndex].correctAnswerIndex 
      ? score + 1 
      : score;
    
    // Check if this is the last question
    if (currentQuestionIndex < questions.length - 1) {
      // Not the last question, update score and move to next question
      setScore(newScore);
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setImageError(false); // Reset image error for the next question
    } else {
      // This is the last question, navigate to results with updated score
      navigate("/results", {
        state: {
          score: newScore, // Use the newly calculated score
          total: questions.length,
          difficulty,
        },
      });
    }
  };

  if (isLoading) {
    return <div className="loading-container">Loading quiz questions...</div>;
  }

  const currentQuestion = questions[currentQuestionIndex];

  // Simple, direct path to the images in the assets/datasets folder
  const imagePath = `${process.env.PUBLIC_URL}/static/media/${currentQuestion.imageId}.png`;

  return (
    <div className="quiz-page-container">
      <div className="quiz-content">
        <div className="quiz-header">
          <h2>
            Question {currentQuestionIndex + 1} of {questions.length}
          </h2>
          <div className="difficulty-badge">
            {difficultyLevels[difficulty as keyof typeof difficultyLevels].name}
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

          <h3>What is this?</h3>

          <div className="options-container">
            {currentQuestion.options.map((option, index) => (
              <button
                key={index}
                className="option-button"
                onClick={() => handleAnswerClick(index)}
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
