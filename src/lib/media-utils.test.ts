import { describe, it, expect } from 'vitest'
import { isVideoFile, isImageFile } from './media-utils'

function fakeFile(type: string): File {
  return new File([''], 'test', { type })
}

describe('isVideoFile', () => {
  it('returns true for video/mp4', () => {
    expect(isVideoFile(fakeFile('video/mp4'))).toBe(true)
  })

  it('returns true for video/quicktime', () => {
    expect(isVideoFile(fakeFile('video/quicktime'))).toBe(true)
  })

  it('returns false for image/jpeg', () => {
    expect(isVideoFile(fakeFile('image/jpeg'))).toBe(false)
  })

  it('returns false for application/pdf', () => {
    expect(isVideoFile(fakeFile('application/pdf'))).toBe(false)
  })
})

describe('isImageFile', () => {
  it('returns true for image/png', () => {
    expect(isImageFile(fakeFile('image/png'))).toBe(true)
  })

  it('returns true for image/jpeg', () => {
    expect(isImageFile(fakeFile('image/jpeg'))).toBe(true)
  })

  it('returns false for video/mp4', () => {
    expect(isImageFile(fakeFile('video/mp4'))).toBe(false)
  })

  it('returns false for text/plain', () => {
    expect(isImageFile(fakeFile('text/plain'))).toBe(false)
  })
})
