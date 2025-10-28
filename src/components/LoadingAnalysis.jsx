import React, { useState, useEffect } from 'react'
import Lottie from 'lottie-react'
import MortyAnimation from './lottie-animations/Morty.json'

const LoadingAnalysis = () => {
  const [textIndex, setTextIndex] = useState(0)
  
  const loadingTexts = [
    "Analyzing photo...",
    "Processing features...",
    "Calculating results...",
    "Almost there..."
  ]

  useEffect(() => {
    const interval = setInterval(() => {
      setTextIndex((prev) => (prev + 1) % loadingTexts.length)
    }, 2000) // Change text every 2 seconds

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="w-full min-h-screen flex items-center justify-center bg-linear-to-br from-background via-background to-muted/20 p-6 py-12">
      <div className="max-w-4xl w-full flex flex-col items-center justify-center space-y-8 text-center">
        {/* Lottie Animation */}
        <div className="w-80 h-80">
          <Lottie 
            animationData={MortyAnimation} 
            loop={true}
          />
        </div>

        {/* Loading Text */}
        <div className="space-y-4">
          <h2 className="text-4xl font-bold bg-linear-to-r from-foreground to-foreground/70 bg-clip-text text-transparent pb-2">
            {loadingTexts[textIndex]}
          </h2>
          <p className='text-sm text-gray-500'>Please wait while we analyze your photo</p>
        </div>

        {/* Progress Bar */}
        <div className="w-full max-w-md">
          <div className="h-2 bg-muted rounded-full overflow-hidden">
            <div className="h-full bg-primary rounded-full animate-progress" style={{
              animation: 'progress 8s linear forwards'
            }}></div>
          </div>
        </div>

        <style jsx>{`
          @keyframes progress {
            from {
              width: 0%;
            }
            to {
              width: 100%;
            }
          }
        `}</style>
      </div>
    </div>
  )
}

export default LoadingAnalysis
