import React, { createContext, useState, useContext, ReactNode } from 'react';
import { AccordianDataType } from '../utils/types';

interface QuestionsContextType {
  Questions: AccordianDataType[]|null;
  updateQuestions: (questions:AccordianDataType[]) => void;
}

const QuestionsContext = createContext<QuestionsContextType | undefined>(undefined);

export const useQuestionsContext = (): QuestionsContextType => {
  const context = useContext(QuestionsContext);
  if (context === undefined) {
    throw new Error('useQuestionsContext must be used within a QuestionsProvider');
  }
  return context;
};

interface QuestionsProviderProps {
  children: ReactNode;
}

export const TestProvider: React.FC<QuestionsProviderProps> = ({ children }) => {
  const [Questions, setQuestions] = useState<AccordianDataType[]|null>(null);

  const updateQuestions = (questions: AccordianDataType[]) => {
    setQuestions(questions);
  };

  const value: QuestionsContextType = {
    Questions,
    updateQuestions,
  };

  return (
    <QuestionsContext.Provider value={value}>
      {children}
    </QuestionsContext.Provider>
  );
};

export default TestProvider;