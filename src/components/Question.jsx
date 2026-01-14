export default function Question({ 
  question, 
  selectedAnswerIndex, 
  onSelectAnswer,
  primaryColor = '#000000',
  backgroundColor = '#FFFFFF'
}) {
  const handleClick = (answerIndex) => {
    if (selectedAnswerIndex === answerIndex) return // Already selected
    onSelectAnswer(question.id, answerIndex)
  }

  return (
    <div 
      id={`question-${question.id}`}
      className="min-h-screen flex flex-col justify-center p-4 py-16"
      style={{ backgroundColor }}
    >
      <div className="max-w-2xl mx-auto w-full">
        <h2 className="text-2xl md:text-3xl font-bold mb-8 text-center" style={{ color: primaryColor }}>
          {question.text}
        </h2>
        
        <div className="space-y-4">
          {question.answers.map((answer, index) => {
            const isSelected = selectedAnswerIndex === index
            return (
              <button
                key={index}
                onClick={() => handleClick(index)}
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
                  backgroundColor: isSelected ? primaryColor : backgroundColor,
                  color: isSelected ? backgroundColor : primaryColor,
                  borderColor: primaryColor,
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
