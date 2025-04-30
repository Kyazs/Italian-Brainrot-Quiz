import jsonData from "./dataset.json";

// Types for your data
interface QuizImage {
  id: number;
  path: string;
  correctAnswer: string;
}

// Quiz difficulty settings
interface DifficultyLevel {
  name: string;
  questionCount: number;
}

// Question structure
interface Question {
  imageId: number;
  imagePath: string;
  options: string[];
  correctAnswerIndex: number;
}

// Function to parse JSON data
const parseJson = (data: any[]): QuizImage[] => {
  return data.map((item) => ({
    id: item.ID,
    // Use require to ensure the image is imported correctly
    // Path is relative to this file
    path: `/static/media/${item.ID}.png`, // This will be adjusted in the component
    correctAnswer: item.NAME, // The name is the correct answer
  }));
};

const quizData: QuizImage[] = parseJson(jsonData);
export { quizData };
export type { Question, QuizImage, DifficultyLevel };
