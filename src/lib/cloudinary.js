/**
 * Cloudinary Image Upload Configuration
 * 
 * This module handles direct browser uploads to Cloudinary using unsigned upload presets.
 * No backend server required - uploads happen directly from the client.
 * 
 * Setup Instructions:
 * 1. Create a Cloudinary account at https://cloudinary.com
 * 2. Go to Settings > Upload > Upload presets
 * 3. Create an unsigned upload preset (or use the default 'ml_default')
 * 4. Add your credentials to .env file
 */

// Supported image MIME types
const SUPPORTED_IMAGE_TYPES = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/gif',
  'image/webp',
  'image/svg+xml',
  'image/bmp',
  'image/tiff',
]

// Maximum file size (10MB)
const MAX_FILE_SIZE = 10 * 1024 * 1024

/**
 * Validates if a file or base64 string is a valid image
 * @param {File|string} input - File object or base64 string
 * @returns {Object} Validation result with success status and error message
 */
export const validateImageFile = (input) => {
  try {
    // If it's a File object
    if (input instanceof File) {
      // Check file type
      if (!SUPPORTED_IMAGE_TYPES.includes(input.type)) {
        return {
          success: false,
          error: `Unsupported file type: ${input.type}. Please upload a valid image file (JPEG, PNG, GIF, WebP, etc.)`,
        }
      }

      // Check file size
      if (input.size > MAX_FILE_SIZE) {
        return {
          success: false,
          error: `File size too large (${(input.size / 1024 / 1024).toFixed(2)}MB). Maximum size is 10MB.`,
        }
      }

      return { success: true }
    }

    // If it's a base64 string
    if (typeof input === 'string') {
      // Check if it starts with a valid image data URL
      const hasValidPrefix = SUPPORTED_IMAGE_TYPES.some((type) =>
        input.startsWith(`data:${type}`)
      )

      if (!hasValidPrefix) {
        return {
          success: false,
          error: 'Invalid image format. Please upload a valid image file.',
        }
      }

      // Estimate base64 size (approximate)
      const base64Length = input.split(',')[1]?.length || 0
      const estimatedSize = (base64Length * 3) / 4

      if (estimatedSize > MAX_FILE_SIZE) {
        return {
          success: false,
          error: `Image size too large. Maximum size is 10MB.`,
        }
      }

      return { success: true }
    }

    return {
      success: false,
      error: 'Invalid input type. Expected File or base64 string.',
    }
  } catch (error) {
    return {
      success: false,
      error: `Validation error: ${error.message}`,
    }
  }
}

/**
 * Uploads an image to Cloudinary using unsigned upload preset
 * @param {string} imageBase64 - Base64 encoded image string (with data:image/jpeg;base64, prefix)
 * @returns {Promise<Object>} Upload response containing secure_url, public_id, etc.
 */
export const uploadToCloudinary = async (imageBase64) => {
  try {
    // Validate image first
    const validation = validateImageFile(imageBase64)
    if (!validation.success) {
      throw new Error(validation.error)
    }

    const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME
    const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET

    // Validate environment variables
    if (!cloudName || !uploadPreset) {
      throw new Error(
        'Missing Cloudinary configuration. Please check your .env file.'
      )
    }

    // Prepare form data
    const formData = new FormData()
    formData.append('file', imageBase64)
    formData.append('upload_preset', uploadPreset)
    
    // Optional: Add folder organization
    formData.append('folder', 'gaydar-uploads')
    
    // Optional: Add timestamp for unique identification
    formData.append('timestamp', Date.now())

    // Upload to Cloudinary
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
      {
        method: 'POST',
        body: formData,
      }
    )

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error?.message || 'Upload failed')
    }

    const data = await response.json()

    // Return relevant upload information
    return {
      success: true,
      url: data.secure_url, // HTTPS URL to access the image
      publicId: data.public_id, // Cloudinary public ID
      format: data.format, // Image format (jpg, png, etc.)
      width: data.width,
      height: data.height,
      bytes: data.bytes,
      createdAt: data.created_at,
    }
  } catch (error) {
    console.error('Cloudinary upload error:', error)
    return {
      success: false,
      error: error.message,
    }
  }
}

/**
 * Converts a File object to base64 string
 * Useful if you need to convert uploaded files before sending to Cloudinary
 * @param {File} file - File object from input[type="file"]
 * @returns {Promise<string>} Base64 encoded string
 */
export const fileToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onloadend = () => resolve(reader.result)
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}
