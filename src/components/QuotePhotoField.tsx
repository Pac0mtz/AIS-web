import { useId } from 'react'
import { QUOTE_PHOTO_HINT, acceptQuotePhotos } from '../lib/quote-photos'

export type QuotePhoto = {
  id: string
  file: File
  previewUrl: string
}

function PhotoThumb({ photo, onRemove }: { photo: QuotePhoto; onRemove: () => void }) {
  return (
    <li className="photo-thumb">
      <img
        src={photo.previewUrl}
        alt={photo.file.name}
        onError={event => {
          event.currentTarget.hidden = true
          const fallback = event.currentTarget.nextElementSibling
          if (fallback instanceof HTMLElement) fallback.hidden = false
        }}
      />
      <span className="photo-thumb-fallback" hidden>{photo.file.name}</span>
      <span className="photo-thumb-name">{photo.file.name}</span>
      <button type="button" className="photo-remove" onClick={onRemove} aria-label={`Remove ${photo.file.name}`}>
        Remove
      </button>
    </li>
  )
}

export function QuotePhotoField({
  photos,
  error,
  onChange,
}: {
  photos: QuotePhoto[]
  error: string
  onChange: (photos: QuotePhoto[], error: string) => void
}) {
  const inputId = useId()
  const hintId = useId()
  const errorId = useId()

  function commit(nextFiles: File[], nextError: string) {
    const next = nextFiles.map(file => {
      const existing = photos.find(photo => photo.file === file)
      if (existing) return existing
      return {
        id: crypto.randomUUID(),
        file,
        previewUrl: URL.createObjectURL(file),
      }
    })
    const kept = new Set(next.map(photo => photo.id))
    for (const photo of photos) {
      if (!kept.has(photo.id)) URL.revokeObjectURL(photo.previewUrl)
    }
    onChange(next, nextError)
  }

  return (
    <div className="photo-field">
      <label htmlFor={inputId}>
        Photos
        <span id={hintId} className="photo-hint">{QUOTE_PHOTO_HINT}</span>
        <input
          id={inputId}
          name="photos"
          type="file"
          accept="image/*"
          multiple
          aria-describedby={error ? `${hintId} ${errorId}` : hintId}
          aria-invalid={error ? true : undefined}
          onChange={event => {
            const selected = Array.from(event.target.files || [])
            event.target.value = ''
            if (!selected.length) return
            const result = acceptQuotePhotos(photos.map(photo => photo.file), selected)
            commit(result.files, result.error)
          }}
        />
      </label>
      {error ? <p id={errorId} className="photo-error" role="alert">{error}</p> : null}
      {photos.length > 0 && (
        <ul className="photo-thumbs">
          {photos.map(photo => (
            <PhotoThumb
              key={photo.id}
              photo={photo}
              onRemove={() => commit(photos.filter(item => item.id !== photo.id).map(item => item.file), '')}
            />
          ))}
        </ul>
      )}
    </div>
  )
}
