import React from 'react'
import { MemoryRouter, Routes,Route } from 'react-router-dom'
import LandingPage from './pages/LandingPage';
import PreviousQuestions from './pages/PreviousQuestions';
import { useTestStartContext } from './context/testContext';
import QuestionsPage from './pages/Questions';

const App:React.FC = () =>{
  const {testStart} = useTestStartContext();

  return(
    <div className='App'>
      <header className='App-header'>
        <MemoryRouter>
        <Routes>
            <Route element={<LandingPage />} path='/' /> 
            <Route element={<PreviousQuestions />} path='/prevQ'/>
            <Route element={testStart === true ? <QuestionsPage /> : <LandingPage />} path='/questions'/>
        </Routes>
        </MemoryRouter>
      </header>
    </div>
  )
}

export default App;