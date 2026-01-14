export default function LoadingSpinner({ primaryColor = '#000000' }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] p-8">
      <div 
        className="w-16 h-16 border-4 border-gray-200 border-t-current rounded-full animate-spin"
        style={{ borderTopColor: primaryColor }}
        role="status"
        aria-label="Calculating your result"
      />
      <p className="mt-6 text-lg font-medium" style={{ color: primaryColor }}>
        Calculating your result...
      </p>
      <p className="mt-2 text-sm text-gray-600">
        This may take a moment
      </p>
    </div>
  )
}
