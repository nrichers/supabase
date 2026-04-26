'use client'

import Link from 'next/link'
import { useMemo, useState } from 'react'
import {
  Badge,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  cn,
  Input_Shadcn_ as Input,
} from 'ui'

import type { CommunityDocSection } from '@/lib/content'

const CommunityDocsHome = ({ sections }: { sections: CommunityDocSection[] }) => {
  const [query, setQuery] = useState('')

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

  const resultCount = filteredSections.reduce((count, section) => count + section.pages.length, 0)

  return (
    <div className="space-y-12">
      <div className="max-w-2xl space-y-6">
        <div className="space-y-4">
          <h1 className="text-4xl font-medium tracking-[-0.04em] text-foreground md:text-5xl">
            Supabase Community Docs
          </h1>
          <p className="text-xl text-foreground-light">
            Community-built integrations, examples, and getting-started guides
          </p>
        </div>
        <div className="max-w-xl">
          <Input
            aria-label="Search community docs"
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search by title or tag"
            value={query}
          />
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
                  <Link key={page.slug} className="group block h-full" href={`/${page.slug}`}>
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
