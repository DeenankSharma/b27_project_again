import {useNavigate } from "react-router-dom";
import { useTestStartContext } from "../context/testContext";
import axios from "axios";
import { AccordianDataType } from "../utils/types";
import { useState } from "react";

const LandingPage:React.FC = () =>{
  const {testStart, updateTestStart} = useTestStartContext();
  const [questions,setQuestions] = useState<AccordianDataType[]|null>(null)
  const navigate = useNavigate();
  async function prevQues(){
    const response = await axios.get<[]>('')
    setQuestions(response.data) 
    navigate('/prevQ')
  }

  function startInterview(){
    console.log(testStart);
    updateTestStart(true);
    navigate('/questions')
  }

  return (<>
  <div className="MainLandingDiv">
  <h1 className="landingPageHeading">
      InterViewer
    </h1>
    <h3 className="landingPageSubHeading">
      Mock Interviews On The Go
    </h3>
    <button onClick={startInterview} className="start_interview_button">
      Start Interview
    </button>
    <h5 className="previous_bookmarks" onClick={prevQues}>
      Previous Bookmarks
    </h5>
  </div>
  </>);
}

export default LandingPage;