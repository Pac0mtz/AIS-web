import photos from './areaMedia.json'

export type AreaPhoto = {
  src: string
  alt: string
  caption: string
  width: number
  height: number
  author: string
  license: string
  licenseUrl: string
  sourceUrl: string
}

export const areaMedia: Record<string, AreaPhoto> = photos
