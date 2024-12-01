import React, { createContext, useState, useContext, ReactNode } from 'react';

interface TestStartContextType {
  testStart: boolean;
  updateTestStart: (index:boolean) => void;
}

const TestStartContext = createContext<TestStartContextType | undefined>(undefined);

export const useTestStartContext = (): TestStartContextType => {
  const context = useContext(TestStartContext);
  if (context === undefined) {
    throw new Error('useTestStartContext must be used within a TestStartProvider');
  }
  return context;
};

interface TestStartProviderProps {
  children: ReactNode;
}

export const TestProvider: React.FC<TestStartProviderProps> = ({ children }) => {
  const [testStart, setTestStart] = useState<boolean>(false);

  const updateTestStart = (index: boolean) => {
    setTestStart(index);
  };

  const value: TestStartContextType = {
    testStart,
    updateTestStart,
  };

  return (
    <TestStartContext.Provider value={value}>
      {children}
    </TestStartContext.Provider>
  );
};

export default TestProvider;