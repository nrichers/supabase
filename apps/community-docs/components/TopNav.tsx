import Link from 'next/link'
import { cn } from 'ui'

const SupabaseMark = () => (
  <svg
    aria-hidden="true"
    className="h-5 w-5 text-brand"
    fill="none"
    viewBox="0 0 109 113"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M63.7076 110.284C60.8481 113.886 55.0502 111.914 54.969 107.314L53.9625 50.4099H92.2166C99.1487 50.4099 103.016 58.415 98.7068 63.847L63.7076 110.284Z"
      fill="currentColor"
    />
    <path
      d="M63.7076 110.284C60.8481 113.886 55.0502 111.914 54.969 107.314L53.9625 50.4099H92.2166C99.1487 50.4099 103.016 58.415 98.7068 63.847L63.7076 110.284Z"
      fill="currentColor"
      fillOpacity="0.2"
    />
    <path
      d="M45.317 2.07103C48.1765 -1.53037 53.9745 0.441967 54.0556 5.04167L54.4967 61.946H16.8079C9.87582 61.946 6.00853 53.9409 10.3172 48.5089L45.317 2.07103Z"
      fill="currentColor"
    />
  </svg>
)

const TopNav = ({ className }: { className?: string }) => {
  return (
    <header
      className={cn(
        'sticky top-0 z-40 h-[var(--header-height)] border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80',
        className
      )}
    >
      <nav className="mx-auto flex h-full max-w-6xl items-center justify-between px-6">
        <Link href="/" className="flex items-center gap-3 text-sm font-medium">
          <SupabaseMark />
          <span className="text-foreground">Supabase</span>
          <span className="h-4 w-px bg-border" />
          <span className="text-foreground-light">Community Docs</span>
        </Link>
        <a
          className="text-sm text-foreground-light transition-colors hover:text-foreground"
          href="https://github.com/supabase-community"
          rel="noreferrer"
          target="_blank"
        >
          GitHub
        </a>
      </nav>
    </header>
  )
}

export { TopNav }
