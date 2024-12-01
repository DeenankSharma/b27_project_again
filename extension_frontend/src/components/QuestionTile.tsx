import React from "react";
import "../styles/QuestionTile.css";

interface QuestionTileProps {
  question: string;
  answers: string[];
  selectedAnswer: string | null;
  correctAnswer: string;
  explanation: string;
  onAnswerSelect: (answer: string) => void;
  showBack: boolean;
  onReveal: () => void;
}

const QuestionTile: React.FC<QuestionTileProps> = ({
  question,
  answers,
  selectedAnswer,
  correctAnswer,
  explanation,
  onAnswerSelect,
  showBack,
  onReveal,
}) => {
  return (
    <div className="question-tile-container">
      <div 
        className={`flip-card ${showBack ? "flipped" : ""}`}
      >
        {/* Front Side */}
        <div className="flip-card-inner">
          <div className="flip-card-front">
            <p className="text-xl font-bold mb-6 text-gray-800">{question}</p>
            <div className="space-y-4">
              {answers.map((answer, index) => (
                <label
                  key={index}
                  className={`block text-lg px-4 py-2 rounded-lg cursor-pointer text-gray-700 hover:bg-blue-100 transition ${
                    selectedAnswer === answer
                      ? "bg-blue-200 text-blue-700 font-semibold"
                      : ""
                  }`}
                >
                  <input
                    type="radio"
                    name="question"
                    value={answer}
                    checked={selectedAnswer === answer}
                    onChange={() => onAnswerSelect(answer)}
                    className="hidden"
                  />
                  {answer}
                </label>
              ))}
            </div>
            <button
              className="mt-6 bg-blue-600 text-lg text-white font-medium py-2 px-6 rounded-lg shadow-md hover:bg-blue-700 transition duration-200"
              onClick={onReveal}
            >
              Reveal Answer
            </button>
          </div>
    
          {/* Back Side */}
          <div className="flip-card-back">
            <p className="mb-4">
              <strong className="text-lg">Your Answer:</strong>{" "}
              <span
                className={`text-lg font-bold ${
                  selectedAnswer === correctAnswer ? "text-green-500" : "text-red-500"
                }`}
              >
                {selectedAnswer || "No answer selected"}
              </span>
            </p>
            <p className="mb-4">
              <strong className="text-lg">Correct Answer:</strong>{" "}
              <span className="text-green-600 text-lg font-bold">{correctAnswer}</span>
            </p>
            <p className="text-gray-700 text-lg italic">{explanation}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuestionTile;