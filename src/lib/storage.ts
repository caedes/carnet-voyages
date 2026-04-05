import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'
import { getFirebaseStorage } from './firebase'
import { compressImage, generateThumbnail, captureVideoPoster, isVideoFile } from './media-utils'

type UploadResult = {
  filename: string
  type: 'photo' | 'video'
  originalUrl: string
  thumbnailUrl: string
  size: number
}

export async function uploadMedia(
  memoryId: string,
  file: File,
): Promise<UploadResult> {
  const storage = getFirebaseStorage()
  const isVideo = isVideoFile(file)
  const type = isVideo ? 'video' : 'photo'

  const processedFile = isVideo ? file : await compressImage(file)
  const thumbnailBlob = isVideo
    ? await captureVideoPoster(file)
    : await generateThumbnail(file)

  const originalRef = ref(storage, `memories/${memoryId}/original/${file.name}`)
  await uploadBytes(originalRef, processedFile)
  const originalUrl = await getDownloadURL(originalRef)

  const thumbName = file.name.replace(/\.[^.]+$/, '.jpg')
  const thumbnailRef = ref(storage, `memories/${memoryId}/thumbnail/${thumbName}`)
  await uploadBytes(thumbnailRef, thumbnailBlob, { contentType: 'image/jpeg' })
  const thumbnailUrl = await getDownloadURL(thumbnailRef)

  return { filename: file.name, type, originalUrl, thumbnailUrl, size: processedFile.size }
}
