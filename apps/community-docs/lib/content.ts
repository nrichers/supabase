import 'server-only'

import { existsSync } from 'node:fs'
import { readdir, readFile } from 'node:fs/promises'
import { basename, extname, join } from 'node:path'
import matter from 'gray-matter'

const CONTENT_DIRECTORY = join(process.cwd(), 'content')

type CommunityDocFrontmatter = {
  title: string
  description: string
  repo: string
  repoUrl: string
  stars: number
  forks: number
  language?: string
  isTemplate: boolean
  tags: string[]
  category: string
}

type CommunityDocPage = {
  slug: string
  content: string
  frontmatter: CommunityDocFrontmatter
}

type CommunityDocSummary = Omit<CommunityDocPage, 'content'>

type CommunityDocSection = {
  category: string
  pages: CommunityDocSummary[]
}

const categoryOrder = ['Database', 'Auth', 'Storage', 'Realtime', 'Edge Functions', 'Other']

const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/

function assertString(value: unknown, field: string): string {
  if (typeof value !== 'string' || value.trim().length === 0) {
    throw new Error(`Invalid community docs frontmatter: ${field} must be a non-empty string.`)
  }

  return value.trim()
}

function normalizeTags(value: unknown): string[] {
  if (Array.isArray(value)) {
    return value
      .filter((tag): tag is string => typeof tag === 'string')
      .map((tag) => tag.trim())
      .filter(Boolean)
  }

  if (typeof value === 'string') {
    return value
      .split(',')
      .map((tag) => tag.trim())
      .filter(Boolean)
  }

  return []
}

function normalizeNumber(value: unknown): number {
  return typeof value === 'number' && Number.isFinite(value) ? value : 0
}

function getCategoryIndex(category: string) {
  const index = categoryOrder.indexOf(category)

  return index === -1 ? categoryOrder.length : index
}

function parseFrontmatter(value: object): CommunityDocFrontmatter {
  return {
    title: assertString('title' in value ? value.title : undefined, 'title'),
    description: assertString(
      'description' in value ? value.description : undefined,
      'description'
    ),
    repo: assertString('repo' in value ? value.repo : undefined, 'repo'),
    repoUrl: assertString('repoUrl' in value ? value.repoUrl : undefined, 'repoUrl'),
    stars: normalizeNumber('stars' in value ? value.stars : undefined),
    forks: normalizeNumber('forks' in value ? value.forks : undefined),
    language:
      'language' in value && typeof value.language === 'string' ? value.language.trim() : undefined,
    isTemplate:
      'isTemplate' in value && typeof value.isTemplate === 'boolean' ? value.isTemplate : false,
    tags: normalizeTags('tags' in value ? value.tags : undefined),
    category: assertString('category' in value ? value.category : undefined, 'category'),
  }
}

function sortPages(a: CommunityDocSummary, b: CommunityDocSummary) {
  const categoryDelta =
    getCategoryIndex(a.frontmatter.category) - getCategoryIndex(b.frontmatter.category)

  if (categoryDelta !== 0) return categoryDelta

  return a.frontmatter.title.localeCompare(b.frontmatter.title)
}

async function readCommunityDoc(filename: string): Promise<CommunityDocPage> {
  const slug = basename(filename, extname(filename))

  if (!slugPattern.test(slug)) {
    throw new Error(`Invalid community docs filename: ${filename}`)
  }

  const fullPath = join(CONTENT_DIRECTORY, filename)

  if (!fullPath.startsWith(CONTENT_DIRECTORY)) {
    throw new Error('Accessing forbidden route. Content must be within the content directory.')
  }

  const mdx = await readFile(fullPath, 'utf-8')
  const { data, content } = matter(mdx)

  return {
    slug,
    content,
    frontmatter: parseFrontmatter(data),
  }
}

async function getAllCommunityDocPages(): Promise<CommunityDocPage[]> {
  if (!existsSync(CONTENT_DIRECTORY)) return []

  const files = (await readdir(CONTENT_DIRECTORY)).filter(
    (file) => extname(file) === '.mdx' && !basename(file).startsWith('_')
  )

  const pages = await Promise.all(files.map(readCommunityDoc))

  return pages.sort(sortPages)
}

async function getCommunityDocBySlug(slug: string): Promise<CommunityDocPage | undefined> {
  if (!slugPattern.test(slug)) return undefined

  const pages = await getAllCommunityDocPages()

  return pages.find((page) => page.slug === slug)
}

async function getCommunityDocSections(): Promise<CommunityDocSection[]> {
  const pages = await getAllCommunityDocPages()
  const sections = new Map<string, CommunityDocSummary[]>()

  for (const page of pages) {
    const summary = {
      slug: page.slug,
      frontmatter: page.frontmatter,
    }
    const existing = sections.get(page.frontmatter.category) ?? []
    sections.set(page.frontmatter.category, [...existing, summary])
  }

  return [...sections.entries()]
    .map(([category, sectionPages]) => ({
      category,
      pages: sectionPages.sort(sortPages),
    }))
    .sort((a, b) => {
      const aIndex = getCategoryIndex(a.category)
      const bIndex = getCategoryIndex(b.category)

      if (aIndex !== bIndex) return aIndex - bIndex

      return a.category.localeCompare(b.category)
    })
}

async function getCommunityDocNavigation(slug: string) {
  const pages = await getAllCommunityDocPages()
  const currentIndex = pages.findIndex((page) => page.slug === slug)

  return {
    previous: currentIndex > 0 ? pages[currentIndex - 1] : undefined,
    next:
      currentIndex >= 0 && currentIndex < pages.length - 1 ? pages[currentIndex + 1] : undefined,
  }
}

export {
  getAllCommunityDocPages,
  getCommunityDocBySlug,
  getCommunityDocNavigation,
  getCommunityDocSections,
}
export type { CommunityDocFrontmatter, CommunityDocPage, CommunityDocSection, CommunityDocSummary }
