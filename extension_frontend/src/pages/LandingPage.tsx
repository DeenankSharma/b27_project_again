import {useNavigate } from "react-router-dom";
import { useTestStartContext } from "../context/testContext";

const LandingPage:React.FC = () =>{
  const {testStart, updateTestStart} = useTestStartContext();
  const navigate = useNavigate();
  function prevQues(){
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