import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Quiz from './components/Quiz'
import SharedResult from './components/SharedResult'
import LandingPage from './components/LandingPage'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/quiz/:quizId" element={<Quiz />} />
        <Route path="/share/:quizId/:resultCategory" element={<SharedResult />} />
        <Route path="/" element={<LandingPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
