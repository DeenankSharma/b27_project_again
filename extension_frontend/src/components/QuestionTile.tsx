import React, { useEffect, useState } from "react";
import "../styles/QuestionTile.css";
import { FaRegBookmark } from "react-icons/fa6";
import { FaBookmark } from "react-icons/fa6";
import "../styles/LanguageDropdown.css"
import translate from "../api/translate";

interface QuestionTileProps {
  question: string;
  answers: string[];
  selectedAnswer: string | null;
  correctAnswer: string;
  explanation: string;
  onAnswerSelect: (answer: string) => void;
  showBack: boolean;
  onReveal: () => void;
  resetTimer: boolean; 
  bookmarked: boolean;
  addToBookmarks: (question: string, answer: string) => void;
  removeFromBookmarks: (question:string) => void;
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
  resetTimer,
  bookmarked,
  addToBookmarks,
  removeFromBookmarks,
}) => {
  const [timeLeft, setTimeLeft] = useState(60);
  const [selectedLanguage, setSelectedLanguage] = useState<string>('en');
  const [explanationTranslated,setExplanationTranslated]=useState<string>(explanation);

  useEffect(() => {
      setTimeLeft(60)
  }, [resetTimer]);

  useEffect(() => {
    if (timeLeft > 0 && !showBack) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    }
    else if (timeLeft === 0) {
      onReveal();
    }
  }, [timeLeft, showBack, onReveal]);

  const timerWidth = `${(timeLeft / 60) * 100}%`;
  const handleBookmarkClick = () => {
    if (bookmarked) {
      removeFromBookmarks(question);
    } else {
      addToBookmarks(question,correctAnswer);
    }
  };

  const handleLanguageChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedLanguage(event.target.value);
  };

  const translateExplanation = async () => {
    if(selectedLanguage==='en'){
      setExplanationTranslated(explanation)
      console.log(explanationTranslated)
    }else{
      const tranlatedResponse=await translate(explanation,selectedLanguage);
      setExplanationTranslated(tranlatedResponse?tranlatedResponse:explanationTranslated)
      console.log(`Translating to ${selectedLanguage}`);
    }

};
  return (
    <div className="question-tile-container">
      <div 
        className={`flip-card ${showBack ? "flipped" : ""}`}
      >
        {!showBack && (
          <div className="z-10 timer-bar" style={{ width: timerWidth }}></div>
        )}
        

        {/* Front Side */}
        <div className="flip-card-inner">
          <div className="flip-card-front">
          
          <div className="flex items-center justify-between mb-3">
            <p className="text-xl font-bold text-gray-800 flex-grow">{question}</p>

          </div>


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
  className="mt-6 bg-[blueviolet] text-lg text-white font-medium py-2 px-6 rounded-lg shadow-md hover:bg-white hover:text-[blueviolet] hover:border-[blueviolet] hover:border-3 transition duration-200 border-transparent border"
  onClick={onReveal}
>
  Reveal Answer
</button>

          </div>
    
          {/* Back Side */}
          <div className="flip-card-back">
          {bookmarked ? (
              <FaBookmark 
                onClick={handleBookmarkClick}
                className="text-2xl cursor-pointer transition-transform transform hover:scale-110"  
              />
            ) : (
              <FaRegBookmark 
                onClick={handleBookmarkClick}
                className="text-2xl cursor-pointer transition-transform transform hover:scale-110"  
              />
            )}
         
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
            <p className="text-gray-700 text-lg italic">{explanationTranslated}</p>
            <div className="flex space-between mt-1 items-center">
                            <button
                                className=" bg-[blueviolet] text-lg text-white font-medium py-2 px-6 rounded-lg shadow-md hover:bg-white hover:text-[blueviolet] hover:border-[blueviolet] hover:border-3 transition duration-200 border-transparent border"
                                onClick={translateExplanation}
                            >
                                Translate
                            </button>
                            <div className="dropdown-container">
                                <select className="dropdown-select" onChange={handleLanguageChange} value={selectedLanguage}>
                                    <option value="en">English (en)</option>
                                    <option value="ja">Japanese (ja)</option>
                                    <option value="es">Spanish (es)</option>
                                </select>
                            </div>
                            </div>         
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuestionTile;