import React from 'react'
import { Button } from './ui/button'
import { Check, X, RotateCcw } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

const ImagePreview = ({ isOpen, image, onConfirm, onCancel, onRetake }) => {
  if (!isOpen || !image) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-6"
        onClick={onCancel}
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
            <h2 className="text-2xl font-bold">Preview Image</h2>
            <Button
              variant="ghost"
              size="icon"
              onClick={onCancel}
              className="rounded-full"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>

          {/* Image Preview */}
          <div className="p-6">
            <div className="relative rounded-2xl overflow-hidden bg-muted">
              <img
                src={image}
                alt="Preview"
                className="w-full h-auto max-h-[60vh] object-contain"
              />
            </div>
            <p className="text-sm text-muted-foreground text-center mt-4">
              Review your image before submitting for analysis
            </p>
          </div>

          {/* Actions */}
          <div className="flex gap-4 p-6 pt-0">
            <Button
              variant="outline"
              size="lg"
              className="flex-1 h-14 gap-2"
              onClick={onRetake}
            >
              <RotateCcw className="w-5 h-5" />
              Retake
            </Button>
            <Button
              size="lg"
              className="flex-1 h-14 gap-2 bg-white"
              onClick={onConfirm}
            >
              <Check className="w-5 h-5" />
              Analyze Image
            </Button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

export default ImagePreview
