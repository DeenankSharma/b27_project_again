import { GoogleGenerativeAI } from "@google/generative-ai";
import  { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import SubjectiveQuestionTile from "../components/SubjectiveQuestionTile";
import "../styles/Questions.css";
import Loading from "../components/Loading";
import getSubjectiveQuestions from "../api/getSubjectiveQuestions";
// import dotenv from 'dotenv';
// dotenv.config();
let correctAns="";
let isCorrect=true;
let no_correct=0;
let correctAnswers:string[]=[]
let wasCorrect:boolean[]=[]
// type Question = {
//   id: number;
//   question: string;
// answer: string;
//   correctAnswer: string;
//   explanation: string;
// };

type SubjectiveQuestion={
  id:number;
  question:string;
}

// type ApiResponse = {
//   title: string;
//   questions: Question[];
// };

const genAI=new GoogleGenerativeAI(import.meta.env.VITE_GEMINIAPI)
const model= genAI.getGenerativeModel({ model: "gemini-1.5-flash" })

// Mock data with quiz title
// const apiResponse: ApiResponse = {
//   title: "Subjective Interview Questions",
//   questions: [
//     {
//       id: 1,
//       question: "Explain the concept of closures in JavaScript.",
//       //answer: "",
//       correctAnswer: "",
//       explanation: "Closures are functions that refer to independent (free) variables. In other words, the function defined in the closure 'remembers' the environment in which it was created."
//     },
//     {
//       id: 2,
//       question: "What is the difference between SQL and NoSQL databases?",
//       //answer: "",
//       correctAnswer: "",
//       explanation: "SQL databases are relational and use structured query language for defining and manipulating data, while NoSQL databases are non-relational and provide a mechanism for storage and retrieval of data that is modeled in means other than the tabular relations used in SQL."
//     },
//     // Add more subjective questions here
//   ]
// };

const SubjectiveQuestionsPage = () => {
    const navigate = useNavigate();
    const [loading,setLoading]=useState(false);
    const [checkLoading,setCheckLoading]=useState(false);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [selectedAnswers, setSelectedAnswers] = useState<string[]>([]);
    const [currentAnswer, setCurrentAnswer] = useState<string>("");
    const [showBack, setShowBack] = useState(false);
    const [quizCompleted, setQuizCompleted] = useState(false);
    const [bookmarked, setBookmarked] = useState(false);
    const [submittedAns,setSubmittedAns]=useState<string[]>([]);
    const [questions,setQuestions]=useState<SubjectiveQuestion[]|null>(null);
    // const [currentQuestion,setCurrentQuestion]=useState<Question|null>(null);
    const [scrapedData,setScrapedData]=useState<{[heading:string]:string}|null>(null);
    const [heading,setHeading]=useState<string|null>(null);
  // const questions = apiResponse.questions;

  const getGeneratedQuestions=async (text:string)=>{
    const questionsText= await getSubjectiveQuestions(text);
    console.log("trying to get questions")
    
    const parseQuestion = (text: string,delimiters:string[]): string => {
      for (const delimiter of delimiters) {
        if (text?.includes(delimiter)) {
          return text?.split(delimiter)[1]?.split("?")[0] + "?";
        }
      }
      return "Question not found.";
    };
    const question1: SubjectiveQuestion = {
      id: 1,
      question: parseQuestion(questionsText?questionsText:``,["1.", "1:"]),
    };
    console.log("Question 1: ",question1);
    const question2: SubjectiveQuestion = {
      id: 2,
      question: parseQuestion(questionsText?questionsText:``,["2.", "2:"]),
    };
    console.log("Question 1: ",question2);
    return [question1,question2,];
  }
  useEffect(()=>{
    chrome.tabs.query({active:true,currentWindow:true},(tabs)=>{
      if(tabs[0]){
        chrome.tabs.sendMessage(
          tabs[0].id?tabs[0].id:0,
          {type:"BLUR",data:!showBack}
        )
      }
    })
  },[showBack])

  useEffect(()=>{
    const fetchQuestions=async ()=>{
      console.log("This is the scraped Data: ",scrapedData)
      let questionsGenerated:SubjectiveQuestion[]|null=null;
      if(scrapedData){
        console.log("getting Questions")
        for (const heading of Object.keys(scrapedData)){
          setHeading(heading);
          console.log("This is the heading of my array",heading)
          const content = scrapedData[heading];
          console.log("This is my content",content)
            if (questionsGenerated) {
              if(questionsGenerated.length<6){
                const newQuestions = await getGeneratedQuestions(content);
                console.log("This is the question generated in this iteration",newQuestions)
                questionsGenerated.push(...newQuestions);
                console.log("These are the questions generated till now",questionsGenerated)
              }         
            }else{
              console.log("This is my first element",content)
              questionsGenerated = await getGeneratedQuestions(content);
              console.log("These are the questions generated till now",questionsGenerated)
          }
        }

      }
        console.log('Questions generated are',questionsGenerated)
        setQuestions(questionsGenerated)
        console.log("Questions: ",questions)
    }
    fetchQuestions()
  },[scrapedData])


  useEffect(()=>{
    if(questions){
      setLoading(false)
      console.log("Loading: ",loading)
    }else{
      setLoading(true)
    }
  },[questions])

  useEffect(()=>{
    chrome.runtime.sendMessage({type:"GET_DATA"},(response)=>{
      console.log(response)
      setScrapedData(response.data)
    });
  },[])
  
  // useEffect(()=>{
  //   setCurrentQuestion(questions?questions[currentQuestionIndex]:null);
  //   console.log("currentQuestion",currentQuestion)
  // },[loading,questions,currentQuestionIndex])

  const handleAnswerChange = (answer: string) => {
    setCurrentAnswer(answer);
  };

  const handleReveal =async (question:string,submittedAns:string) => {
    if(currentQuestionIndex==0){
       no_correct=0;
       correctAnswers=[]
       wasCorrect=[]

    }
    const prompt=`For the question: ${question} I have been provided with the answer: ${submittedAns}.
    Do not use Unescaped Control Characters or raw control characters Ensure that the response is in a proper json format.
    Do not send code blocks or other such things which I cant directly print.
    Tell me whether the answer is correct or not and give me the best possible answer using the following JSON schema:
    Correct:{boolean}
    CorrectAnswer:{string} `;
    setCheckLoading(true);
    const result=await model.generateContent(prompt);
    setCheckLoading(false);
    const mod=result.response.text().substring(7, result.response.text().length - 4);
    console.log(mod);
    correctAns=JSON.parse(mod).CorrectAnswer;
    isCorrect=JSON.parse(mod).Correct;
    if(isCorrect)no_correct++;
    correctAnswers.push(correctAns);
    wasCorrect.push(isCorrect);
    console.log(result.response.text());
    const updatedAnswers = [...selectedAnswers];
    updatedAnswers[currentQuestionIndex] = currentAnswer;
    setSelectedAnswers(updatedAnswers);

    console.log("trying to send scroll message")
    chrome.tabs.query({active:true,currentWindow:true},(tabs)=>{
      if(tabs[0]){
        chrome.tabs.sendMessage(
          tabs[0].id?tabs[0].id:0,
          {type:"SCROLL",data:heading},
          (response)=>{
            console.log("Response from scroll message",response)
            if(response){
              setShowBack(true);
            }
          }
        )
      }
    })  };

  const handleNext = () => {
     // Save the current answer to the selected answers array
     const updatedAnswers = [...selectedAnswers];
     updatedAnswers[currentQuestionIndex] = currentAnswer;
     setSelectedAnswers(updatedAnswers);
 
     // Reset states for the next question
     setShowBack(false);
     setBookmarked(false);
     setCurrentAnswer(""); // Reset current answer
 
     if(questions){
      if (currentQuestionIndex < questions.length - 1) {
          setCurrentQuestionIndex(currentQuestionIndex + 1);
        } else {
          setQuizCompleted(true);
        }
      }
  };

  const calculateScore = () => {
    // return selectedAnswers.filter((answer, index) => 
    //   answer === questions[index].correctAnswer
    // ).length;
    return no_correct;
    // return selectedAnswers.filter((answer, index) => 
    //   answer === questions[index].correctAnswer
    // ).length;
    return no_correct;
  };
  const addToBookmarks = (question:string,answer:string) => {

    chrome.storage.local.get(["saved_questions"]).then((result)=>{
    const current_saved:{[key:string]:string|number}[]=result["saved_questions"]||[];
    if(!Array.isArray(current_saved)){
      console.error("why");
      return;
    }
    current_saved.push({
      'id':current_saved.length+1,
      'question':question,
      'answer':answer});
    chrome.storage.local.set({"saved_questions":current_saved}).then(()=>{
      console.log("saved it my maan");
    })
    
  })
  setBookmarked(true);
  console.log("Add to Bookmarks");
}
  
const removeFromBookmarks = (question: string) => {
  chrome.storage.local.get(["saved_questions"]).then((result) => {
    const current_saved: {[key:string]:string|number}[] = result["saved_questions"] || [];
    
    if (!Array.isArray(current_saved)) {
      console.error("Saved questions is not an array");
      return;
    }
    
    // Filter out the item with the matching question
    const updated_saved = current_saved.filter(item => item['question'] !== question);
    
    // Reindex the remaining items to ensure consecutive IDs
    const reindexed_saved = updated_saved.map((item, index) => ({
      ...item,
      'id': index + 1
    }));
    
    // Save the updated and reindexed array back to storage
    chrome.storage.local.set({"saved_questions": reindexed_saved}).then(() => {
      console.log(`Question removed successfully`);
      setBookmarked(false);
    }).catch((error) => {
      console.error("Error saving updated bookmarks:", error);
    });
  }).catch((error) => {
    console.error("Error retrieving bookmarks:", error);
  });
}
if(checkLoading){
  return <Loading
  loadingText="Please wait while we check your response"
  />

}else{
}else{
  if (quizCompleted) {
    const score = calculateScore();
    const totalQuestions = questions?.length;
    const percentageScore = (score&&totalQuestions)?((score / totalQuestions) * 100).toFixed(2):0;

    return (
      (loading)?<Loading loadingText={"Please wait while we prepare the questions..."}/>:
      <div className="flex flex-col items-center h-screen bg-gray-100 p-4">
        <div className="bg-white shadow-lg rounded-lg p-8 text-center max-w-md w-full">
          <h1 className="text-3xl font-bold mb-4 text-blue-600">Quiz Completed!</h1>
          <div className="mb-6">
            <p className="text-xl mb-2">Your Score:</p>
            <div className="text-4xl font-bold text-green-600">
              {score} / {totalQuestions}
            </div>
            <p className="text-lg mt-2 text-gray-700">
              {percentageScore}%
            </p>
          </div>
          <div className="space-y-4">
            {(questions)?(questions.map((question, index) => (
              <div 
                key={question.id} 
                className={`p-3 rounded-lg ${
                  wasCorrect[index]
                  wasCorrect[index]
                    ? 'bg-green-100' 
                    : 'bg-red-100'
                }`}
              >
                <p className="font-semibold mb-1">{question.question}</p>
                <p className="text-sm">
                  Your Answer: <span className={
                    wasCorrect[index]
                    wasCorrect[index]
                      ? 'text-green-600' 
                      : 'text-red-600'
                  }>
                    {selectedAnswers[index] || 'No answer'}
                  </span>
                </p>
                <p className="text-sm text-gray-600">
                  Correct Answer: {correctAnswers[index]}
                  Correct Answer: {correctAnswers[index]}
                </p>
              </div>
            ))):<></>
            }
          </div>
          <button 
            onClick={() => navigate('/')}
            className="mt-4 bg-[blueviolet] text-lg text-white font-medium py-2 px-6 rounded-lg shadow-md hover:bg-white hover:text-[blueviolet] hover:border-[blueviolet] hover:border-3 transition duration-200 border-transparent border my-0"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }


  return (
    (loading)?<Loading loadingText={"Please wait while we prepare the questions..."}/>:(questions&&scrapedData)?
    <div className="flex flex-col h-auto w-auto px-4 py-4 bg-gray-100">
      <div className="QuesHeadingDiv">
        <h1 className="QuestionsHeading">Subjective Interview Questions</h1>
        <svg onClick={()=>{
          navigate('/');
        }} className="home_pic" xmlns="http://www.w3.org/2000/svg"  viewBox="0,0,256,256" width="48px" height="48px" fill-rule="nonzero"><g fill="#8a2be2" fill-rule="nonzero" stroke="none" stroke-width="1" stroke-linecap="butt" stroke-linejoin="miter" stroke-miterlimit="10" stroke-dasharray="" stroke-dashoffset="0" font-family="none" font-weight="none" font-size="none" text-anchor="none" ><g transform="scale(5.33333,5.33333)"><path d="M39.5,43h-9c-1.381,0 -2.5,-1.119 -2.5,-2.5v-9c0,-1.105 -0.895,-2 -2,-2h-4c-1.105,0 -2,0.895 -2,2v9c0,1.381 -1.119,2.5 -2.5,2.5h-9c-1.381,0 -2.5,-1.119 -2.5,-2.5v-19.087c0,-2.299 1.054,-4.471 2.859,-5.893l14.212,-11.199c0.545,-0.428 1.313,-0.428 1.857,0l14.214,11.199c1.805,1.422 2.858,3.593 2.858,5.891v19.089c0,1.381 -1.119,2.5 -2.5,2.5z"></path></g></g></svg>
      </div>
      <SubjectiveQuestionTile
        isCorrect={isCorrect}
        isCorrect={isCorrect}
        question={questions[currentQuestionIndex].question}
        onAnswerChange={handleAnswerChange}
        explanation={correctAns}
        explanation={correctAns}
        showBack={showBack}
        onReveal={handleReveal}
        bookmarked={bookmarked}
        addToBookmarks={addToBookmarks}
        removeFromBookmarks={removeFromBookmarks}
        submitAns={(s:string)=>{
          const current=[...submittedAns];
          current.push(s);
          setSubmittedAns(current);
        }}

        currentAnswer={currentAnswer}
         // Pass current answer to reset textarea
        submitAns={(s:string)=>{
          const current=[...submittedAns];
          current.push(s);
          setSubmittedAns(current);
        }}

        currentAnswer={currentAnswer}
         // Pass current answer to reset textarea
      />
      {showBack && (
        <button
          className="mt-0 bg-[blueviolet] text-lg text-white font-medium py-2 px-6 rounded-lg shadow-md hover:bg-white hover:text-[blueviolet] hover:border-[blueviolet] hover:border-3 transition duration-200 border-transparent border my-0"
          className="mt-0 bg-[blueviolet] text-lg text-white font-medium py-2 px-6 rounded-lg shadow-md hover:bg-white hover:text-[blueviolet] hover:border-[blueviolet] hover:border-3 transition duration-200 border-transparent border my-0"
          onClick={handleNext}
        >
          {currentQuestionIndex < questions.length - 1 ? "Next" : "Finish"}
        </button>
      )}
    </div>:<>No questions fetched.....</>
  );
};
}
}

export default SubjectiveQuestionsPage;