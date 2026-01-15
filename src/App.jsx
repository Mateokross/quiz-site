import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Quiz from './components/Quiz'
import SharedResult from './components/SharedResult'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/quiz/:quizId" element={<Quiz />} />
        <Route path="/share/:quizId/:resultCategory" element={<SharedResult />} />
        <Route path="/" element={<div className="min-h-screen flex items-center justify-center p-4">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Quiz Site</h1>
            <p className="text-gray-600">Visit /quiz/personality-quiz to start</p>
          </div>
        </div>} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
