import React, { useRef, useState } from 'react'
import Webcam from 'react-webcam'
import { Button } from './ui/button'
import { Camera, X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

const CameraCapture = ({ isOpen, onClose, onCapture }) => {
  const webcamRef = useRef(null)
  const [hasError, setHasError] = useState(false)

  const capture = () => {
    const imageSrc = webcamRef.current?.getScreenshot()
    if (imageSrc) {
      onCapture(imageSrc)
      onClose()
    }
  }

  const handleError = (error) => {
    console.error('Camera error:', error)
    setHasError(true)
  }

  if (!isOpen) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-6"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="relative bg-background rounded-3xl shadow-2xl max-w-3xl w-full overflow-hidden border-2 border-primary/20"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-border">
            <h2 className="text-2xl font-bold">Capture Photo</h2>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="rounded-full"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>

          {/* Camera View */}
          <div className="p-6">
            {hasError ? (
              <div className="aspect-video flex items-center justify-center bg-muted rounded-2xl">
                <div className="text-center space-y-4">
                  <Camera className="w-16 h-16 mx-auto text-muted-foreground" />
                  <p className="text-lg text-muted-foreground">
                    Unable to access camera. Please check permissions.
                  </p>
                </div>
              </div>
            ) : (
              <Webcam
                ref={webcamRef}
                audio={false}
                screenshotFormat="image/jpeg"
                className="w-full aspect-video rounded-2xl"
                videoConstraints={{
                  facingMode: 'user'
                }}
                onUserMediaError={handleError}
              />
            )}
          </div>

          {/* Actions */}
          <div className="flex gap-4 p-6 pt-0">
            <Button
              variant="outline"
              size="lg"
              className="flex-1 h-14"
              onClick={onClose}
            >
              Cancel
            </Button>
            <Button
              size="lg"
              className="flex-1 h-14 gap-2 bg-white"
              onClick={capture}
              disabled={hasError}
            >
              <Camera className="w-5 h-5" />
              Capture Photo
            </Button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

export default CameraCapture
