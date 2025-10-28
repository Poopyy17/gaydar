import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Homepage from './homepage'
import LoadingAnalysis from './LoadingAnalysis'
import ResultPage from './ResultPage'
import CameraCapture from './CameraCapture'
import ImagePreview from './ImagePreview'
import Lottie from 'lottie-react'
import ChasquidoQikAnimation from './lottie-animations/ChasquidoQik.json'
import { uploadToCloudinary } from '../lib/cloudinary'

const GaydarFlow = () => {
  const [stage, setStage] = useState('home') // 'home' | 'loading' | 'confirmation' | 'result'
  const [uploadedImage, setUploadedImage] = useState(null)
  const [cloudinaryUrl, setCloudinaryUrl] = useState(null) // Store cloud URL separately
  const [analysisResult, setAnalysisResult] = useState(null)
  const [showCamera, setShowCamera] = useState(false)
  const [showPreview, setShowPreview] = useState(false)
  const [previewImage, setPreviewImage] = useState(null)

  // Animation variants for reveal effect
  const pageVariants = {
    initial: {
      clipPath: 'circle(0% at 50% 0%)',
      opacity: 0
    },
    animate: {
      clipPath: 'circle(150% at 50% 0%)',
      opacity: 1,
      transition: {
        duration: 0.8,
        ease: [0.43, 0.13, 0.23, 0.96] // Custom easing for smooth motion
      }
    },
    exit: {
      clipPath: 'circle(0% at 50% 100%)',
      opacity: 0,
      transition: {
        duration: 0.6,
        ease: [0.43, 0.13, 0.23, 0.96]
      }
    }
  }

  // Handle photo upload
  const handleUploadPhoto = (file) => {
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreviewImage(reader.result)
        setShowPreview(true)
      }
      reader.readAsDataURL(file)
    }
  }

  // Handle camera capture
  const handleUseCamera = () => {
    setShowCamera(true)
  }

  // Handle camera photo captured
  const handleCameraCapture = (imageSrc) => {
    setPreviewImage(imageSrc)
    setShowPreview(true)
    setShowCamera(false)
  }

  // Handle preview confirmation
  const handlePreviewConfirm = () => {
    setUploadedImage(previewImage)
    setShowPreview(false)
    startAnalysis()
  }

  // Handle preview cancel
  const handlePreviewCancel = () => {
    setShowPreview(false)
    setPreviewImage(null)
  }

  // Handle retake (go back to home)
  const handleRetake = () => {
    setShowPreview(false)
    setPreviewImage(null)
  }

  // Start analysis process
  const startAnalysis = async () => {
    setStage('loading')
    
    // Upload image to Cloudinary in background (don't block UI)
    uploadToCloudinary(previewImage)
      .then((result) => {
        if (result.success) {
          console.log('Image uploaded to Cloudinary:', result.url)
          setCloudinaryUrl(result.url)
        } else {
          console.error('Failed to upload image:', result.error)
          // Don't block the flow if upload fails - local image still works
        }
      })
      .catch((error) => {
        console.error('Upload error:', error)
        // Continue with local image if upload fails
      })
    
    // After 8 seconds, show confirmation animation
    setTimeout(() => {
      setStage('confirmation')
      
      // After confirmation animation (5 seconds), show results
      setTimeout(() => {
        // Generate mock result
        const mockResult = {
          percentage: Math.floor(Math.random() * 100),
          confidence: 'High'
        }
        setAnalysisResult(mockResult)
        setStage('result')
      }, 3000)
    }, 8000)
  }

  // Reset to homepage
  const handleTryAgain = () => {
    setStage('home')
    setUploadedImage(null)
    setCloudinaryUrl(null)
    setAnalysisResult(null)
  }

  return (
    <div className="relative w-full min-h-screen">
      <AnimatePresence mode="wait">
        {stage === 'home' && (
          <motion.div
            key="home"
            variants={pageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="w-full min-h-screen"
          >
            <Homepage 
              onUploadPhoto={handleUploadPhoto}
              onUseCamera={handleUseCamera}
            />
          </motion.div>
        )}

        {stage === 'loading' && (
          <motion.div
            key="loading"
            variants={pageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="w-full min-h-screen"
          >
            <LoadingAnalysis />
          </motion.div>
        )}

        {stage === 'confirmation' && (
          <motion.div
            key="confirmation"
            variants={pageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="w-full min-h-screen"
          >
            <div className="w-full min-h-screen flex items-center justify-center bg-linear-to-br from-background via-background to-muted/20 p-6 py-12">
              <div className="max-w-4xl w-full flex flex-col items-center justify-center space-y-6 text-center">
                <div className="w-96 h-96">
                  <Lottie 
                    animationData={ChasquidoQikAnimation} 
                    loop={false}
                  />
                </div>
                <h2 className="text-4xl font-bold bg-linear-to-r from-foreground to-foreground/70 bg-clip-text text-transparent pb-2">
                  Analysis Complete!
                </h2>
              </div>
            </div>
          </motion.div>
        )}

        {stage === 'result' && (
          <motion.div
            key="result"
            variants={pageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="w-full min-h-screen"
          >
            <ResultPage 
              result={analysisResult}
              uploadedImage={uploadedImage}
              cloudinaryUrl={cloudinaryUrl}
              onTryAgain={handleTryAgain}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Camera Modal */}
      <CameraCapture
        isOpen={showCamera}
        onClose={() => setShowCamera(false)}
        onCapture={handleCameraCapture}
      />

      {/* Image Preview Modal */}
      <ImagePreview
        isOpen={showPreview}
        image={previewImage}
        onConfirm={handlePreviewConfirm}
        onCancel={handlePreviewCancel}
        onRetake={handleRetake}
      />
    </div>
  )
}

export default GaydarFlow
