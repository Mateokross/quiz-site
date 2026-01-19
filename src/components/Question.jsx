import { useMemo } from 'react'

// Fisher-Yates shuffle algorithm
function shuffleArray(array) {
  const shuffled = [...array]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled
}

export default function Question({ 
  question, 
  selectedAnswerIndex, 
  onSelectAnswer,
  accentColor = '#000000',
  backgroundColor = '#FFFFFF',
  selectedButtonColor = '#000000'
}) {
  // Shuffle answers once per question, maintaining original index mapping
  const shuffledAnswers = useMemo(() => {
    if (!question.answers) return []
    
    // Create array with original indices
    const answersWithIndex = question.answers.map((answer, originalIndex) => ({
      ...answer,
      originalIndex
    }))
    
    // Shuffle the array
    return shuffleArray(answersWithIndex)
  }, [question.id]) // Re-shuffle only when question changes

  const handleClick = (shuffledIndex) => {
    if (selectedAnswerIndex === shuffledIndex) return // Already selected
    
    // Get the original index from the shuffled answer
    const originalIndex = shuffledAnswers[shuffledIndex].originalIndex
    onSelectAnswer(question.id, originalIndex)
  }

  return (
    <div 
      id={`question-${question.id}`}
      className="min-h-screen flex flex-col justify-center p-4 py-16"
      style={{ backgroundColor }}
    >
      <div className="max-w-2xl mx-auto w-full">
        <h2 className="text-2xl md:text-3xl font-bold mb-8 text-center" style={{ color: accentColor }}>
          {question.text}
        </h2>
        
        <div className="space-y-4">
          {shuffledAnswers.map((answer, shuffledIndex) => {
            // Check if this shuffled answer corresponds to the selected original index
            const isSelected = selectedAnswerIndex === answer.originalIndex
            return (
              <button
                key={shuffledIndex}
                onClick={() => handleClick(shuffledIndex)}
                className={`
                  w-full p-4 md:p-6 text-left rounded-lg border-2 transition-all
                  focus:outline-none
                  min-h-[60px] md:min-h-[72px] flex items-center
                  ${isSelected 
                    ? 'font-semibold shadow-md transform scale-[1.02]' 
                    : 'hover:border-opacity-60 hover:shadow-sm'
                  }
                `}
                style={{
                  backgroundColor: isSelected ? selectedButtonColor : backgroundColor,
                  color: isSelected ? backgroundColor : accentColor,
                  borderColor: accentColor,
                  borderOpacity: isSelected ? 1 : 0.3,
                }}
                aria-pressed={isSelected}
                aria-label={`Select answer: ${answer.text}`}
              >
                <span className="text-base md:text-lg">{answer.text}</span>
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
