'use client'

import Link from 'next/link'
import { useMemo } from 'react'
import { Badge, Card, CardContent, CardDescription, CardHeader, CardTitle, cn } from 'ui'

import { useCommunityDocsSearch } from '@/components/CommunityDocsSearchProvider.client'
import { SupabaseMark } from '@/components/TopNav'
import type { CommunityDocSection, CommunityDocSummary } from '@/lib/content'

const languageColorByName: Record<string, string> = {
  JavaScript: 'bg-yellow-500',
  TypeScript: 'bg-blue-500',
  Rust: 'bg-orange-700',
  Go: 'bg-cyan-500',
  Swift: 'bg-orange-500',
  Kotlin: 'bg-purple-500',
  Python: 'bg-blue-400',
  PHP: 'bg-indigo-400',
  Ruby: 'bg-red-500',
  Vue: 'bg-emerald-500',
  Svelte: 'bg-orange-600',
}

function formatCount(value: number) {
  if (value >= 1000) {
    return `${Number.parseFloat((value / 1000).toFixed(1))}k`
  }

  return value.toString()
}

const CommunityDocCard = ({ page }: { page: CommunityDocSummary }) => (
  <Link className="group block h-full" href={`/${page.slug}`}>
    <Card className="h-full transition-colors group-hover:border-overlay-hover">
      <CardHeader>
        <CardTitle className="text-sm normal-case tracking-normal">
          {page.frontmatter.title}
        </CardTitle>
        <CardDescription>{page.frontmatter.description}</CardDescription>
      </CardHeader>
      {page.frontmatter.tags.length > 0 && (
        <CardContent className="flex flex-wrap gap-2 border-none">
          {page.frontmatter.tags.map((tag) => (
            <Badge key={tag} className={cn('normal-case tracking-normal')}>
              {tag}
            </Badge>
          ))}
        </CardContent>
      )}
    </Card>
  </Link>
)

const PopularCard = ({ pages }: { pages: CommunityDocSummary[] }) => {
  if (pages.length === 0) return null

  return (
    <aside className="rounded-xl border bg-surface-75 p-4 shadow-sm md:p-5 lg:-translate-y-8">
      <div className="mb-4">
        <h2 className="text-xl font-medium tracking-[-0.03em] text-foreground">Popular</h2>
        <p className="text-sm text-foreground-lighter">
          Start with highlighted community projects.
        </p>
      </div>

      <div className="grid gap-3">
        {pages.map((page) => (
          <Link
            key={page.slug}
            className="block rounded-lg border bg-surface-100 p-4 transition-colors hover:border-overlay-hover"
            href={`/${page.slug}`}
          >
            <div className="flex items-start justify-between gap-3">
              <h3 className="text-sm font-medium text-brand">{page.frontmatter.repo}</h3>
              <span className="shrink-0 rounded-full border px-2 py-0.5 text-xs text-foreground-light">
                {page.frontmatter.isTemplate ? 'Public template' : 'Public'}
              </span>
            </div>
            <p className="mt-1 line-clamp-2 text-sm text-foreground-lighter">
              {page.frontmatter.description}
            </p>
            <div className="mt-4 flex flex-wrap items-center gap-4 text-xs text-foreground-lighter">
              {page.frontmatter.language && (
                <span className="inline-flex items-center gap-1.5">
                  <span
                    className={cn(
                      'h-3 w-3 rounded-full',
                      languageColorByName[page.frontmatter.language] ?? 'bg-foreground-muted'
                    )}
                  />
                  {page.frontmatter.language}
                </span>
              )}
              <span>☆ {formatCount(page.frontmatter.stars)}</span>
              <span>⑂ {formatCount(page.frontmatter.forks)}</span>
            </div>
          </Link>
        ))}
      </div>
    </aside>
  )
}

const CommunityDocsHome = ({ sections }: { sections: CommunityDocSection[] }) => {
  const { query } = useCommunityDocsSearch()

  const filteredSections = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase()

    if (!normalizedQuery) return sections

    return sections
      .map((section) => ({
        ...section,
        pages: section.pages.filter((page) => {
          const { tags, title } = page.frontmatter

          return (
            title.toLowerCase().includes(normalizedQuery) ||
            tags.some((tag) => tag.toLowerCase().includes(normalizedQuery))
          )
        }),
      }))
      .filter((section) => section.pages.length > 0)
  }, [query, sections])

  const filteredPages = filteredSections.flatMap((section) => section.pages)
  const popularPages = [...filteredPages]
    .sort(
      (a, b) =>
        b.frontmatter.stars - a.frontmatter.stars ||
        b.frontmatter.forks - a.frontmatter.forks ||
        a.frontmatter.repo.localeCompare(b.frontmatter.repo)
    )
    .slice(0, 6)
  const resultCount = filteredSections.reduce((count, section) => count + section.pages.length, 0)

  return (
    <div>
      <div className="grid gap-8 pb-12 lg:grid-cols-[minmax(0,1fr)_400px] lg:pb-0">
        <div className="max-w-2xl space-y-4 lg:pb-20">
          <h1 className="flex items-center gap-3 text-3xl font-medium tracking-[-0.04em] text-foreground md:text-4xl">
            <SupabaseMark className="h-8 w-8 text-foreground-lighter md:h-9 md:w-9" />
            <span>Supabase Community Docs</span>
          </h1>
          <p className="text-xl text-foreground-light">
            Community-built integrations, examples, and getting-started guides
          </p>
        </div>
        <PopularCard pages={popularPages} />
      </div>

      {filteredSections.length === 0 ? (
        <Card>
          <CardContent className="border-none py-8">
            <p className="text-sm text-foreground-light">
              {sections.length === 0
                ? 'No community docs have been generated yet. Run the content pipeline to create MDX files.'
                : `No community docs match "${query}".`}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-12 pt-6 lg:pt-0">
          {filteredSections.map((section) => (
            <section key={section.category} className="space-y-4">
              <div className="flex items-end justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-medium tracking-[-0.03em] text-foreground">
                    {section.category}
                  </h2>
                  <p className="text-sm text-foreground-lighter">
                    {section.pages.length} {section.pages.length === 1 ? 'guide' : 'guides'}
                  </p>
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {section.pages.map((page) => (
                  <CommunityDocCard key={page.slug} page={page} />
                ))}
              </div>
            </section>
          ))}
        </div>
      )}

      {sections.length > 0 && (
        <p className="text-sm text-foreground-lighter">
          Showing {resultCount} of{' '}
          {sections.reduce((count, section) => count + section.pages.length, 0)} guides
        </p>
      )}
    </div>
  )
}

export { CommunityDocsHome }
