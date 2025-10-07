export type ParagraphItem = {
  type: 'paragraph'
  text: string
}

export type ImageItem = {
  type: 'image'
  src: string
  alt: string
}

export type VideoItem = {
  type: 'video'
  title: string
  url: string
}

export type ListItem = {
  type: 'list'
  items: string[]
}

export type ContentItem = ParagraphItem | ImageItem | VideoItem | ListItem

export type ContentSection = {
  title?: string
  items: ContentItem[]
}

export type BJJContent = {
  introduction?: ContentItem[]
  sections?: ContentSection[]
}

export type BJJNode = {
  id: string
  title: string
  level: number
  content?: BJJContent
  children?: BJJNode[]
} 