import Link from 'next/link'
import type { AnchorHTMLAttributes, ComponentProps, HTMLAttributes } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { cn } from 'ui'

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

const Code = ({ className, ...props }: HTMLAttributes<HTMLElement>) => {
  return <code className={cn('rounded bg-surface-200 px-1 py-0.5', className)} {...props} />
}

const components = {
  a: MdxLink,
  code: Code,
  pre: Pre,
} satisfies ComponentProps<typeof ReactMarkdown>['components']

const MdxContent = ({ source }: { source: string }) => {
  const markdown = source.replace(/^\{\/\* Source: .* \*\/\}\s*$/gm, '')

  return (
    <ReactMarkdown components={components} remarkPlugins={[remarkGfm]}>
      {markdown}
    </ReactMarkdown>
  )
}

export { MdxContent }
