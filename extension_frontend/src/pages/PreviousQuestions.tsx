import { useEffect, useState } from "react";
import PrevQuesTile from "../components/PrevQuesTile.tsx";
import { AccordianDataType } from "../utils/types.ts";
import { useNavigate } from "react-router-dom";
const PreviousQuestions:React.FC = () => {
  const [openId , setOpenId] = useState<number|null>(null);
  const navigate = useNavigate();
  const [accordionData,setAccordionData]=useState<AccordianDataType[]>([]);

  useEffect(()=>{
    chrome.storage.local.get(["saved_questions"]).then((result)=>{
       let current_saved=result.saved_questions as AccordianDataType[];
       console.log("called")
       console.log(`result hai ${result.saved_questions}`)
       setAccordionData(current_saved);
    })},[]);


    const updateAccordianData = (updatedQuestions:AccordianDataType[]) =>{
      setAccordionData(updatedQuestions);
    }
    
  function OpenthisAccordion(x:number|null){
    if(x!=openId){
      setOpenId(x);
    }
    else if(x===openId){
      setOpenId(null)
    }
  }

  return (<>
        <div className="prevQuesHeadingDiv">
        <h1 className="previousQuestionsHeading">Previous Questions</h1>
        <svg onClick={()=>{
          navigate('/');
        }} className="home_pic" xmlns="http://www.w3.org/2000/svg"  viewBox="0,0,256,256" width="48px" height="48px" fill-rule="nonzero"><g fill="#8a2be2" fill-rule="nonzero" stroke="none" stroke-width="1" stroke-linecap="butt" stroke-linejoin="miter" stroke-miterlimit="10" stroke-dasharray="" stroke-dashoffset="0" font-family="none" font-weight="none" font-size="none" text-anchor="none" ><g transform="scale(5.33333,5.33333)"><path d="M39.5,43h-9c-1.381,0 -2.5,-1.119 -2.5,-2.5v-9c0,-1.105 -0.895,-2 -2,-2h-4c-1.105,0 -2,0.895 -2,2v9c0,1.381 -1.119,2.5 -2.5,2.5h-9c-1.381,0 -2.5,-1.119 -2.5,-2.5v-19.087c0,-2.299 1.054,-4.471 2.859,-5.893l14.212,-11.199c0.545,-0.428 1.313,-0.428 1.857,0l14.214,11.199c1.805,1.422 2.858,3.593 2.858,5.891v19.089c0,1.381 -1.119,2.5 -2.5,2.5z"></path></g></g></svg>
        </div>
        <div className="scrollWindow">  
        {accordionData.map((item)=>{
          console.log(item)
          return(<PrevQuesTile updateAccordianData={updateAccordianData} openAccordianFunction = {OpenthisAccordion} x={openId} id={item.id} question={item.question} answer={item.answer}/>);
        })}
        </div>
        
    </>);
}

export default PreviousQuestions