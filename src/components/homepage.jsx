import React, { useRef } from 'react'
import { Button } from './ui/button'
import { Upload, Camera, Radar } from 'lucide-react'
import { validateImageFile } from '../lib/cloudinary'

const Homepage = ({ onUploadPhoto, onUseCamera }) => {
  const fileInputRef = useRef(null)

  const handleUploadClick = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = (e) => {
    const file = e.target.files?.[0]
    if (file) {
      // Validate the file
      const validation = validateImageFile(file)
      
      if (!validation.success) {
        // Show error to user
        alert(validation.error)
        // Clear the input
        if (fileInputRef.current) {
          fileInputRef.current.value = ''
        }
        return
      }
      
      // File is valid, proceed with upload
      if (onUploadPhoto) {
        onUploadPhoto(file)
      }
    }
  }

  return (
    <div className="w-full h-screen flex items-center justify-center bg-linear-to-br from-background via-background to-muted/20 p-6">
      <div className="max-w-4xl w-full">
        <div className="flex flex-col items-center justify-center space-y-8 text-center">
          <div className="space-y-4">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/10 mb-4">
              <Radar className="w-10 h-10 text-primary" />
            </div>
            <h1 className="text-5xl font-bold bg-linear-to-r from-foreground to-foreground/70 bg-clip-text text-transparent pb-2">
              Welcome to Gaydar
            </h1>
            <p className="text-xl text-muted-foreground max-w-md mx-auto">
              An app that determines if you are gay or not
            </p>
          </div>
          
          <div className="w-full max-w-2xl pt-8">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/jpeg,image/jpg,image/png,image/gif,image/webp,image/svg+xml,image/bmp,image/tiff,image/*"
              className="hidden"
            />
            <div className="grid grid-cols-2 gap-4">
              <Button
                variant="outline"
                size="lg"
                className="h-32 gap-3 flex-col hover:bg-primary/5 hover:border-primary/50 transition-all duration-300 border-2"
                onClick={handleUploadClick}
              >
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <Upload className="w-6 h-6 text-primary" />
                </div>
                <span className="text-base font-medium">Upload Photo</span>
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="h-32 gap-3 flex-col hover:bg-primary/5 hover:border-primary/50 transition-all duration-300 border-2"
                onClick={onUseCamera}
              >
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <Camera className="w-6 h-6 text-primary" />
                </div>
                <span className="text-base font-medium">Use Camera</span>
              </Button>
            </div>
            <p className="text-sm text-muted-foreground/70 mt-4 text-center italic">
              Upload a photo or use your camera to get started
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Homepage