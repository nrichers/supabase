import { MDXRemote } from 'next-mdx-remote/rsc'
import Link from 'next/link'
import type { AnchorHTMLAttributes, HTMLAttributes } from 'react'
import rehypeSlug from 'rehype-slug'
import remarkGfm from 'remark-gfm'
import { Badge, Button, cn } from 'ui'

const MdxLink = ({ href = '', children, ...props }: AnchorHTMLAttributes<HTMLAnchorElement>) => {
  if (href.startsWith('http')) {
    return (
      <a href={href} rel="noreferrer" target="_blank" {...props}>
        {children}
      </a>
    )
  }

  return <Link href={href}>{children}</Link>
}

const Pre = ({ className, ...props }: HTMLAttributes<HTMLPreElement>) => {
  return (
    <pre
      className={cn('overflow-x-auto rounded-lg border bg-surface-100 p-4', className)}
      {...props}
    />
  )
}

const components = {
  a: MdxLink,
  Badge,
  Button,
  pre: Pre,
}

const MdxContent = ({ source }: { source: string }) => {
  return (
    <MDXRemote
      source={source}
      components={components}
      options={{
        mdxOptions: {
          remarkPlugins: [remarkGfm],
          rehypePlugins: [rehypeSlug as never],
        },
      }}
    />
  )
}

export { MdxContent }
