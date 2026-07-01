export type ImageAlign = 'left' | 'center' | 'right'

export type BlogImageAttributes = {
  src: string | null
  alt: string | null
  title: string | null
  width: string
  align: ImageAlign
  caption: string | null
}

export type SetBlogImageOptions = {
  src: string
  alt?: string
  title?: string
  width?: string
  align?: ImageAlign
  caption?: string
}
