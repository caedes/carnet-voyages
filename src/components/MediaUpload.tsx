import { useRef } from 'react'
import {
  PlusOutlined,
  DeleteOutlined,
  PlayCircleOutlined,
} from '@ant-design/icons'
import { isVideoFile } from '#/lib/media-utils'

type MediaUploadProps = {
  files: File[]
  onChange: (files: File[]) => void
}

export default function MediaUpload({ files, onChange }: MediaUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null)

  const handleFilesSelected = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      onChange([...files, ...Array.from(e.target.files)])
    }
    e.target.value = ''
  }

  const handleRemove = (index: number) => {
    const removed = files[index]
    const url = previewUrls.current.get(removed)
    if (url) {
      URL.revokeObjectURL(url)
      previewUrls.current.delete(removed)
    }
    onChange(files.filter((_, i) => i !== index))
  }

  const previewUrls = useRef(new Map<File, string>())

  const getPreviewUrl = (file: File): string => {
    if (!previewUrls.current.has(file)) {
      previewUrls.current.set(file, URL.createObjectURL(file))
    }
    return previewUrls.current.get(file)!
  }

  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
      <input
        ref={inputRef}
        type="file"
        accept="image/*,video/*"
        multiple
        style={{ display: 'none' }}
        onChange={handleFilesSelected}
      />

      {files.map((file, index) => (
        <div
          key={`${file.name}-${index}`}
          style={{
            width: 90,
            height: 90,
            borderRadius: 10,
            overflow: 'hidden',
            position: 'relative',
            background: '#334155',
          }}
        >
          {isVideoFile(file) ? (
            <div
              style={{
                width: '100%',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 4,
              }}
            >
              <PlayCircleOutlined style={{ color: '#94a3b8', fontSize: 24 }} />
              <span
                style={{
                  color: '#94a3b8',
                  fontSize: 10,
                  maxWidth: 70,
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                  textAlign: 'center',
                }}
              >
                {file.name}
              </span>
            </div>
          ) : (
            <img
              src={getPreviewUrl(file)}
              alt=""
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          )}

          <button
            onClick={() => handleRemove(index)}
            style={{
              position: 'absolute',
              top: 4,
              right: 4,
              width: 22,
              height: 22,
              borderRadius: '50%',
              border: 'none',
              background: 'rgba(0,0,0,0.6)',
              color: '#fff',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: 0,
            }}
          >
            <DeleteOutlined style={{ fontSize: 11 }} />
          </button>
        </div>
      ))}

      <button
        onClick={() => inputRef.current?.click()}
        style={{
          width: 90,
          height: 90,
          borderRadius: 10,
          border: '2px dashed #475569',
          background: 'transparent',
          color: '#94a3b8',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <PlusOutlined style={{ fontSize: 24 }} />
      </button>
    </div>
  )
}
