import '../styles/main.css'

import type { Metadata, Viewport } from 'next'

import { CommunityDocsSearchProvider } from '@/components/CommunityDocsSearchProvider.client'
import { TopNav } from '@/components/TopNav'

const metadata: Metadata = {
  applicationName: 'Supabase Community Docs',
  title: {
    default: 'Supabase Community Docs',
    template: '%s | Supabase Community Docs',
  },
  description: 'Community-built integrations, examples, and getting-started guides.',
  metadataBase: new URL('https://supabase.com'),
  robots: {
    index: false,
    follow: false,
  },
}

const viewport: Viewport = {
  themeColor: '#1E1E1E',
}

const RootLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <html lang="en" className="dark" data-theme="dark">
      <body>
        <CommunityDocsSearchProvider>
          <TopNav />
          {children}
        </CommunityDocsSearchProvider>
      </body>
    </html>
  )
}

export { metadata, viewport }
export default RootLayout
