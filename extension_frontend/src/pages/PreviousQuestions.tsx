import { useState } from "react";
import PrevQuesTile from "../components/PrevQuesTile.tsx";
import { AccordianDataType } from "../utils/types.ts";
import { useNavigate } from "react-router-dom";

const PreviousQuestions:React.FC = () => {
  const [openId , setOpenId] = useState<number|null>(null);
  const navigate = useNavigate();
  function OpenthisAccordion(x:number|null){
    if(x!=openId){
      setOpenId(x);
    }
    else if(x===openId){
      setOpenId(null)
    }
  }
  console.log("open to ho rha hai")
  const accordionData: AccordianDataType[] = [
    {
      id: 1,
      question: "What is React?",
      answer: "React is a JavaScript library for building user interfaces, particularly single-page applications where you need a fast, interactive user experience."
    },
    {
      id: 2,
      question: "How does TypeScript differ from JavaScript?",
      answer: "TypeScript is a superset of JavaScript that adds static typing and other features to help catch errors early and improve code quality.ddhcsdhvldhhdblashdvbshvbhjdvbhsdvbdvbahdvbdhvbhjvbhsdbvhdvbhdbhjdvbhadbvhdbvhj"
    },
    {
      id: 3,
      question: "What are React Hooks?",
      answer: "React Hooks are functions that let you use state and other React features in functional components without writing a class."
    },
    {
      id: 4,
      question: "What are React Hooks?",
      answer: "React Hooks are functions that let you use state and other React features in functional components without writing a class."
    },
    {
      id: 5,
      question: "What are React Hooks?",
      answer: "React Hooks are functions that let you use state and other React features in functional components without writing a class."
    },
    {
      id: 6,
      question: "What are React Hooks?",
      answer: "React Hooks are functions that let you use state and other React features in functional components without writing a class."
    },
    {
      id: 7,
      question: "What are React Hooks?",
      answer: "React Hooks are functions that let you use state and other React features in functional components without writing a class."
    }
  ];

  return (<>
        <div className="prevQuesHeadingDiv">
        <h1 className="previousQuestionsHeading">Previous Questions</h1>
        <svg onClick={()=>{
          navigate('/');
        }} className="home_pic" xmlns="http://www.w3.org/2000/svg"  viewBox="0,0,256,256" width="48px" height="48px" fill-rule="nonzero"><g fill="#8a2be2" fill-rule="nonzero" stroke="none" stroke-width="1" stroke-linecap="butt" stroke-linejoin="miter" stroke-miterlimit="10" stroke-dasharray="" stroke-dashoffset="0" font-family="none" font-weight="none" font-size="none" text-anchor="none" ><g transform="scale(5.33333,5.33333)"><path d="M39.5,43h-9c-1.381,0 -2.5,-1.119 -2.5,-2.5v-9c0,-1.105 -0.895,-2 -2,-2h-4c-1.105,0 -2,0.895 -2,2v9c0,1.381 -1.119,2.5 -2.5,2.5h-9c-1.381,0 -2.5,-1.119 -2.5,-2.5v-19.087c0,-2.299 1.054,-4.471 2.859,-5.893l14.212,-11.199c0.545,-0.428 1.313,-0.428 1.857,0l14.214,11.199c1.805,1.422 2.858,3.593 2.858,5.891v19.089c0,1.381 -1.119,2.5 -2.5,2.5z"></path></g></g></svg>
        </div>
        <div className="scrollWindow">  
        {accordionData.map((item)=>{
          return(<PrevQuesTile openAccordianFunction = {OpenthisAccordion} x={openId} id={item.id} question={item.question} answer={item.answer}/>);
        })}
        </div>
        
    </>);
}

export default PreviousQuestions