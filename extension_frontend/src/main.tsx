import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import TestProvider from './context/testContext.tsx'

createRoot(document.getElementById('root')!).render(
        <TestProvider>
         <App/>
        </TestProvider>
)
