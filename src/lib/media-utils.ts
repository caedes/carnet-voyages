import imageCompression from 'browser-image-compression'

export async function compressImage(file: File): Promise<File> {
  return imageCompression(file, {
    maxSizeMB: 2,
    maxWidthOrHeight: 2048,
    useWebWorker: true,
  })
}

export async function generateThumbnail(file: File): Promise<Blob> {
  const compressed = await imageCompression(file, {
    maxSizeMB: 0.08,
    maxWidthOrHeight: 200,
    useWebWorker: true,
  })
  return compressed
}

export function captureVideoPoster(file: File): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const video = document.createElement('video')
    const canvas = document.createElement('canvas')
    const url = URL.createObjectURL(file)

    video.preload = 'metadata'
    video.muted = true
    video.src = url

    video.onloadeddata = () => {
      video.currentTime = 0.5
    }

    video.onseeked = () => {
      canvas.width = Math.min(video.videoWidth, 200)
      canvas.height = Math.round(canvas.width * (video.videoHeight / video.videoWidth))
      const ctx = canvas.getContext('2d')!
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height)
      canvas.toBlob(
        (blob) => {
          URL.revokeObjectURL(url)
          if (blob) resolve(blob)
          else reject(new Error('Failed to capture video poster'))
        },
        'image/jpeg',
        0.7,
      )
    }

    video.onerror = () => {
      URL.revokeObjectURL(url)
      reject(new Error('Failed to load video'))
    }
  })
}

export function isVideoFile(file: File): boolean {
  return file.type.startsWith('video/')
}

export function isImageFile(file: File): boolean {
  return file.type.startsWith('image/')
}
