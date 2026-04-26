'use client'

import Link from 'next/link'
import { useMemo } from 'react'
import { Badge, Card, CardContent, CardDescription, CardHeader, CardTitle, cn } from 'ui'

import { useCommunityDocsSearch } from '@/components/CommunityDocsSearchProvider.client'
import { SupabaseMark } from '@/components/TopNav'
import type { CommunityDocSection, CommunityDocSummary } from '@/lib/content'

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
  const popularPages = filteredPages.slice(0, 6)
  const resultCount = filteredSections.reduce((count, section) => count + section.pages.length, 0)

  return (
    <div className="space-y-12">
      <div className="max-w-2xl space-y-4">
        <div className="space-y-4">
          <h1 className="flex items-center gap-3 text-3xl font-medium tracking-[-0.04em] text-foreground md:text-4xl">
            <SupabaseMark className="h-8 w-8 text-foreground-lighter md:h-9 md:w-9" />
            <span>Supabase Community Docs</span>
          </h1>
          <p className="text-xl text-foreground-light">
            Community-built integrations, examples, and getting-started guides
          </p>
        </div>
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
        <div className="space-y-12">
          {popularPages.length > 0 && (
            <section className="rounded-xl border bg-surface-75 p-4 shadow-sm md:p-6">
              <div className="mb-5">
                <h2 className="text-xl font-medium tracking-[-0.03em] text-foreground">Popular</h2>
                <p className="text-sm text-foreground-lighter">
                  Start with a few highlighted community projects.
                </p>
              </div>

              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {popularPages.map((page) => (
                  <CommunityDocCard key={page.slug} page={page} />
                ))}
              </div>
            </section>
          )}

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
